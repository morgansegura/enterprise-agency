import type { MetadataRoute } from 'next'

// Block AI training crawlers; search/answer bots are covered by the default allow.
const TRAINING_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'CCBot',
  'Bytespider',
  'Meta-ExternalAgent',
  'Amazonbot',
  'Applebot-Extended',
  'FacebookBot',
  'Diffbot',
  'Omgilibot',
]

export default function robots(): MetadataRoute.Robots {
  if (process.env.NODE_ENV !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/builder'] },
      { userAgent: TRAINING_BOTS, disallow: '/' },
    ],
  }
}
