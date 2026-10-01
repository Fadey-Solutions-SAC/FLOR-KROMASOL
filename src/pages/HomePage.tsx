import { Benefits } from '../components/Benefits'
import { Catalog } from '../components/Catalog'
import { Contact } from '../components/Contact'
import { Hero } from '../components/Hero'
import { HowToBuy } from '../components/HowToBuy'
import { Promotions } from '../components/Promotions'
import { TrustBar } from '../components/TrustBar'

export function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Catalog />
      <Promotions />
      <Benefits />
      <HowToBuy />
      <Contact />
    </>
  )
}
