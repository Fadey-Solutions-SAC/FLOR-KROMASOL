import fs from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

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

function safePublicImagePath(root: string, urlPath: string): string | null {
  const clean = urlPath.split('?')[0].replace(/\\/g, '/')
  if (!clean.startsWith('/images/') || clean.includes('..')) {
    return null
  }
  return path.join(root, 'public', clean.slice(1))
}

function catalogHandler(root: string) {
  const uploadsDir = path.join(root, 'public', 'images', 'uploads')
  const publicCatalogPath = path.join(root, 'public', 'catalog.json')

  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url?.split('?')[0] ?? ''
    if (!url.startsWith('/__catalog/')) {
      next()
      return
    }

    if (req.method !== 'POST') {
      sendJson(res, 405, { error: 'Método no permitido' })
      return
    }

    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer | string) => chunks.push(Buffer.from(chunk)))
    req.on('error', () => sendJson(res, 400, { error: 'No se pudo leer la imagen' }))
    req.on('end', () => {
      try {
        const payload = JSON.parse(Buffer.concat(chunks).toString('utf8')) as {
          productId?: number
          kind?: string
          dataUrl?: string
          originalPath?: string
          products?: unknown
        }

        if (url === '/__catalog/image') {
          const productId = Number(payload.productId)
          const dataUrl = payload.dataUrl
          if (!Number.isFinite(productId) || typeof dataUrl !== 'string') {
            sendJson(res, 400, { error: 'Datos de imagen incompletos' })
            return
          }

          const kind = (payload.kind || 'cover').replace(/[^a-z0-9-]/gi, '') || 'cover'
          const stamp = Date.now()
          const uploadName = `${productId}-${kind}-${stamp}.jpg`
          writeDataUrl(path.join(uploadsDir, uploadName), dataUrl)

          const originalPath =
            kind === 'cover' && typeof payload.originalPath === 'string'
              ? payload.originalPath.split('?')[0]
              : ''
          const originalDest = originalPath ? safePublicImagePath(root, originalPath) : null
          if (originalDest && fs.existsSync(path.dirname(originalDest))) {
            writeDataUrl(originalDest, dataUrl)
            sendJson(res, 200, { url: `${originalPath}?v=${stamp}` })
            return
          }

          sendJson(res, 200, { url: `/images/uploads/${uploadName}` })
          return
        }

        if (url === '/__catalog/save') {
          if (!Array.isArray(payload.products)) {
            sendJson(res, 400, { error: 'Catálogo inválido' })
            return
          }
          const json = `${JSON.stringify({ products: payload.products }, null, 2)}\n`
          fs.writeFileSync(publicCatalogPath, json, 'utf8')
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
  }
}

function mountCatalogSync(server: { config: { root: string }; middlewares: { use: (fn: ReturnType<typeof catalogHandler>) => void } }) {
  server.middlewares.use(catalogHandler(server.config.root))
}

export function catalogSyncPlugin(): Plugin {
  return {
    name: 'catalog-sync',
    configureServer: mountCatalogSync,
    configurePreviewServer: mountCatalogSync,
  }
}
