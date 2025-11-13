import type { Block } from '@/lib/editor/types'

/**
 * Mock data for the about page
 */
export const aboutPageMock = {
  id: 'page_about',
  slug: 'about',
  title: 'About Us',
  description: 'Learn about MH Bible Baptist Church',
  status: 'published' as const,
  publishedAt: '2025-01-15T00:00:00Z',

  metadata: {
    title: 'About Us | MH Bible Baptist Church',
    description: 'Learn about our mission, beliefs, and the community we serve.',
    keywords: ['about', 'church mission', 'baptist beliefs', 'church history'],
    ogImage: '/og-about.jpg'
  },

  blocks: [
    {
      _key: 'block_about_heading',
      _type: 'heading-block',
      data: {
        title: 'About MH Bible Baptist Church',
        level: 'h1' as const,
        size: '4xl' as const,
        align: 'left' as const
      }
    },
    {
      _key: 'block_mission_heading',
      _type: 'heading-block',
      data: {
        title: 'Our Mission',
        level: 'h2' as const,
        size: '2xl' as const,
        align: 'left' as const
      }
    },
    {
      _key: 'block_mission_text',
      _type: 'text-block',
      data: {
        content: 'We are a community of believers dedicated to worshiping God, studying His Word, and serving our neighbors in love.',
        size: 'base' as const,
        align: 'left' as const
      }
    },
    {
      _key: 'block_beliefs_heading',
      _type: 'heading-block',
      data: {
        title: 'What We Believe',
        level: 'h2' as const,
        size: '2xl' as const,
        align: 'left' as const
      }
    },
    {
      _key: 'block_beliefs_text',
      _type: 'text-block',
      data: {
        content: 'As a Bible Baptist church, we hold firm to the fundamental truths of Scripture and the historic Baptist faith.',
        size: 'base' as const,
        align: 'left' as const
      }
    }
  ] as Block[],

  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-15T00:00:00Z'
}
