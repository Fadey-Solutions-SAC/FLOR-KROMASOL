import fs from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function writeDataUrl(dest: string, dataUrl: string) {
  const match = dataUrl.match(/^data:image\/[\w+.-]+;base64,(.+)$/)
  if (!match) {
    throw new Error('Imagen inválida')
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, Buffer.from(match[1], 'base64'))
}

export function catalogSyncPlugin(): Plugin {
  return {
    name: 'catalog-sync',
    configureServer(server) {
      const root = server.config.root
      const uploadsDir = path.join(root, 'public', 'images', 'uploads')
      const catalogPath = path.join(root, 'public', 'catalog.json')

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/__catalog/')) {
          next()
          return
        }

        if (req.method !== 'POST') {
          sendJson(res, 405, { error: 'Método no permitido' })
          return
        }

        try {
          const raw = await readBody(req)
          const payload = JSON.parse(raw.toString('utf8')) as {
            productId?: number
            kind?: string
            dataUrl?: string
            products?: unknown
          }

          if (req.url === '/__catalog/image') {
            const productId = Number(payload.productId)
            const dataUrl = payload.dataUrl
            if (!Number.isFinite(productId) || typeof dataUrl !== 'string') {
              sendJson(res, 400, { error: 'Datos de imagen incompletos' })
              return
            }
            const kind = (payload.kind || 'cover').replace(/[^a-z0-9-]/gi, '')
            const fileName = `${productId}-${kind}-${Date.now()}.jpg`
            writeDataUrl(path.join(uploadsDir, fileName), dataUrl)
            sendJson(res, 200, { url: `/images/uploads/${fileName}` })
            return
          }

          if (req.url === '/__catalog/save') {
            if (!Array.isArray(payload.products)) {
              sendJson(res, 400, { error: 'Catálogo inválido' })
              return
            }
            fs.writeFileSync(
              catalogPath,
              `${JSON.stringify({ products: payload.products }, null, 2)}\n`,
              'utf8',
            )
            sendJson(res, 200, { ok: true })
            return
          }

          sendJson(res, 404, { error: 'No encontrado' })
        } catch (error) {
          sendJson(res, 500, {
            error: error instanceof Error ? error.message : 'No se pudo guardar',
          })
        }
      })
    },
  }
}
