import { BlockRenderer } from '@/components/block-renderer'
import { Section } from '@/components/layout/section'
import { homePageMock } from '@/data/mocks'

export default function Home() {
  // In the future, this will come from an API
  // const pageData = await fetch('/api/pages/home').then(r => r.json())
  const pageData = homePageMock

  return (
    <div className="min-h-screen">
      <Section spacing="lg" background="white" width="wide">
        <BlockRenderer blocks={pageData.blocks} />
      </Section>
    </div>
  )
}
