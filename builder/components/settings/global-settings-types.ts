/**
 * Global Settings Types
 *
 * Comprehensive type definitions for all global settings across the platform.
 * Organized by service/feature area.
 */

// ============================================================================
// 1. BRAND & IDENTITY
// ============================================================================

export interface BrandSettings {
  // Already implemented in other panels:
  // - Colors (ColorSettingsData)
  // - Typography (TypographySettingsData)
  // - Animations (AnimationSettingsData)
  // - Components (ComponentSettingsData)

  // Site Identity
  siteName: string;
  tagline: string;
  logo: {
    light: string; // URL
    dark: string;
    favicon: string;
    appleTouchIcon: string;
  };
  socialProfiles: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
    pinterest?: string;
    github?: string;
  };
}

// ============================================================================
// 2. SEO / AEO / GEO / SEM
// ============================================================================

export interface SEOSettings {
  // Meta Defaults
  meta: {
    titleTemplate: string; // e.g., "%s | Site Name"
    titleSeparator: string;
    defaultTitle: string;
    defaultDescription: string;
    defaultKeywords: string[];
    defaultOgImage: string;
    twitterCard: "summary" | "summary_large_image" | "app" | "player";
    twitterSite: string; // @username
  };

  // Schema.org / Structured Data
  schema: {
    organizationType:
      | "Organization"
      | "LocalBusiness"
      | "Corporation"
      | "ProfessionalService";
    organizationName: string;
    organizationLogo: string;
    contactPoint: {
      telephone: string;
      email: string;
      contactType: string;
    };
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    geo: {
      latitude: string;
      longitude: string;
    };
    sameAs: string[]; // Social profile URLs
  };

  // Indexing
  indexing: {
    robotsTxt: string;
    sitemapEnabled: boolean;
    sitemapChangeFreq:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never";
    sitemapPriority: number;
    canonicalUrl: string;
    noIndexPatterns: string[]; // URL patterns to noindex
  };

  // Local SEO (GEO)
  local: {
    enabled: boolean;
    serviceAreas: Array<{
      name: string;
      radius: number;
      unit: "km" | "mi";
    }>;
    businessHours: Array<{
      day: string;
      open: string;
      close: string;
      closed: boolean;
    }>;
  };

  // Redirects
  redirects: Array<{
    from: string;
    to: string;
    type: 301 | 302 | 307 | 308;
    enabled: boolean;
  }>;
}

// ============================================================================
// 3. ANALYTICS & TRACKING
// ============================================================================

export interface AnalyticsSettings {
  // Providers
  providers: {
    googleAnalytics: {
      enabled: boolean;
      measurementId: string; // G-XXXXXXXXXX
      anonymizeIp: boolean;
      enhancedMeasurement: boolean;
    };
    googleTagManager: {
      enabled: boolean;
      containerId: string; // GTM-XXXXXXX
    };
    facebookPixel: {
      enabled: boolean;
      pixelId: string;
      advancedMatching: boolean;
    };
    linkedinInsight: {
      enabled: boolean;
      partnerId: string;
    };
    hotjar: {
      enabled: boolean;
      siteId: string;
    };
    clarity: {
      enabled: boolean;
      projectId: string;
    };
    plausible: {
      enabled: boolean;
      domain: string;
    };
    customScripts: Array<{
      name: string;
      position: "head" | "body-start" | "body-end";
      script: string;
      enabled: boolean;
    }>;
  };

  // Goals & Conversions
  goals: Array<{
    id: string;
    name: string;
    type: "pageview" | "event" | "duration" | "scroll";
    value?: number;
    conditions: Record<string, string>;
  }>;

  // Dashboard
  dashboard: {
    defaultDateRange: "7d" | "30d" | "90d" | "12m" | "custom";
    primaryMetrics: string[];
    refreshInterval: number; // minutes
  };

  // Data Retention
  dataRetention: {
    analyticsMonths: number;
    eventLogDays: number;
    sessionDataDays: number;
  };

  // Privacy
  privacy: {
    cookieConsentRequired: boolean;
    cookieConsentProvider: "built-in" | "cookiebot" | "onetrust" | "custom";
    doNotTrack: boolean;
    anonymizeData: boolean;
  };
}

// ============================================================================
// 4. SECURITY
// ============================================================================

export interface SecuritySettings {
  // Authentication
  authentication: {
    sessionTimeout: number; // minutes
    maxSessions: number;
    requireEmailVerification: boolean;
    allowSocialLogin: boolean;
    socialProviders: (
      | "google"
      | "facebook"
      | "apple"
      | "github"
      | "linkedin"
    )[];
  };

  // Password Policy
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    preventReuse: number; // last N passwords
    expirationDays: number; // 0 = never
  };

  // Two-Factor Authentication
  twoFactor: {
    enabled: boolean;
    required: boolean;
    methods: ("totp" | "sms" | "email")[];
    trustedDeviceDays: number;
  };

  // Rate Limiting
  rateLimiting: {
    loginAttemptsPerMinute: number;
    apiRequestsPerMinute: number;
    formSubmissionsPerMinute: number;
    lockoutDuration: number; // minutes
  };

  // Headers & Policies
  headers: {
    contentSecurityPolicy: string;
    xFrameOptions: "DENY" | "SAMEORIGIN";
    xContentTypeOptions: boolean;
    referrerPolicy: string;
    permissionsPolicy: string;
  };

  // SSL
  ssl: {
    forceHttps: boolean;
    hstsEnabled: boolean;
    hstsMaxAge: number;
    hstsIncludeSubdomains: boolean;
  };

  // IP & Access
  access: {
    allowedIPs: string[];
    blockedIPs: string[];
    blockedCountries: string[];
    maintenanceMode: boolean;
    maintenanceAllowedIPs: string[];
  };

  // Audit
  audit: {
    enabled: boolean;
    logLogins: boolean;
    logDataChanges: boolean;
    logApiCalls: boolean;
    retentionDays: number;
  };
}

// ============================================================================
// 5. BLOG / CONTENT
// ============================================================================

export interface BlogSettings {
  // General
  general: {
    enabled: boolean;
    postsPerPage: number;
    defaultCategory: string;
    showAuthor: boolean;
    showPublishDate: boolean;
    showReadingTime: boolean;
    showViewCount: boolean;
    showShareButtons: boolean;
    shareButtons: (
      | "facebook"
      | "twitter"
      | "linkedin"
      | "pinterest"
      | "email"
      | "copy"
    )[];
  };

  // Comments
  comments: {
    enabled: boolean;
    provider: "built-in" | "disqus" | "facebook" | "none";
    disqusShortname?: string;
    moderation: "none" | "all" | "first-time" | "links";
    allowAnonymous: boolean;
    requireApproval: boolean;
    nestedDepth: number;
    sortOrder: "newest" | "oldest" | "popular";
  };

  // Related Posts
  relatedPosts: {
    enabled: boolean;
    count: number;
    algorithm: "category" | "tags" | "ai" | "manual";
  };

  // RSS Feed
  rss: {
    enabled: boolean;
    fullContent: boolean;
    itemCount: number;
    customFeedUrl?: string;
  };

  // Categories & Tags
  taxonomy: {
    showCategories: boolean;
    showTags: boolean;
    maxTagsPerPost: number;
    requireCategory: boolean;
  };

  // SEO
  seo: {
    schemaType: "Article" | "BlogPosting" | "NewsArticle";
    autoGenerateExcerpt: boolean;
    excerptLength: number;
  };

  // Display
  display: {
    layout: "grid" | "list" | "masonry";
    featuredImageRatio: "16:9" | "4:3" | "1:1" | "auto";
    showExcerpt: boolean;
    excerptLength: number;
    showCategory: boolean;
    showTags: boolean;
  };
}

// ============================================================================
// 6. E-COMMERCE
// ============================================================================

export interface CommerceSettings {
  // General
  general: {
    enabled: boolean;
    currency: string;
    currencyPosition: "before" | "after";
    thousandsSeparator: string;
    decimalSeparator: string;
    decimals: number;
    priceDisplaySuffix: string;
  };

  // Tax
  tax: {
    enabled: boolean;
    pricesIncludeTax: boolean;
    calculateBasedOn: "billing" | "shipping" | "store";
    displayPrices: "including" | "excluding";
    taxClasses: Array<{
      name: string;
      rate: number;
      compound: boolean;
    }>;
  };

  // Shipping
  shipping: {
    enabled: boolean;
    freeShippingThreshold: number;
    zones: Array<{
      name: string;
      regions: string[];
      methods: Array<{
        type: "flat" | "free" | "calculated" | "pickup";
        name: string;
        cost: number;
        minOrder?: number;
      }>;
    }>;
    dimensionUnit: "cm" | "in";
    weightUnit: "kg" | "lb" | "oz" | "g";
  };

  // Checkout
  checkout: {
    guestCheckout: boolean;
    createAccountDefault: boolean;
    termsPage: string;
    privacyPage: string;
    orderNotes: boolean;
    couponCodes: boolean;
    giftWrapping: boolean;
    giftMessage: boolean;
  };

  // Cart
  cart: {
    enableCart: boolean;
    cartPage: string;
    redirectAfterAdd: boolean;
    enableCrossSells: boolean;
    crossSellCount: number;
  };

  // Inventory
  inventory: {
    manageStock: boolean;
    lowStockThreshold: number;
    outOfStockVisibility: "show" | "hide";
    backorders: "no" | "notify" | "yes";
    stockDisplayFormat: "always" | "low" | "never";
  };

  // Products
  products: {
    defaultLayout: "grid" | "list";
    productsPerPage: number;
    defaultSortOrder:
      | "popularity"
      | "rating"
      | "date"
      | "price-asc"
      | "price-desc";
    enableReviews: boolean;
    reviewsRequirePurchase: boolean;
    enableRatings: boolean;
    showSku: boolean;
    showStock: boolean;
  };

  // Payments
  payments: {
    providers: Array<{
      id: string;
      name: string;
      enabled: boolean;
      testMode: boolean;
      config: Record<string, string>;
    }>;
    defaultProvider: string;
  };

  // Notifications
  notifications: {
    newOrder: boolean;
    lowStock: boolean;
    backorder: boolean;
    adminEmail: string;
  };
}

// ============================================================================
// 7. EMAIL & CAMPAIGNS
// ============================================================================

export interface EmailSettings {
  // Sending
  sending: {
    fromName: string;
    fromEmail: string;
    replyTo: string;
    provider: "smtp" | "sendgrid" | "mailgun" | "ses" | "postmark" | "resend";
    config: Record<string, string>;
  };

  // Templates
  templates: {
    headerLogo: string;
    footerText: string;
    socialLinks: boolean;
    unsubscribeText: string;
    primaryColor: string;
    fontFamily: string;
  };

  // Transactional
  transactional: {
    welcomeEmail: boolean;
    passwordReset: boolean;
    orderConfirmation: boolean;
    shippingNotification: boolean;
    reviewRequest: boolean;
    reviewRequestDelay: number; // days after purchase
  };

  // Marketing
  marketing: {
    doubleOptIn: boolean;
    welcomeSeries: boolean;
    welcomeSeriesDelay: number; // hours between emails
    abandonedCartEnabled: boolean;
    abandonedCartDelay: number; // hours
    winbackEnabled: boolean;
    winbackDays: number; // days since last purchase
  };

  // Compliance
  compliance: {
    includePhysicalAddress: boolean;
    physicalAddress: string;
    includeUnsubscribeLink: boolean;
    canSpamCompliant: boolean;
    gdprCompliant: boolean;
  };

  // Lists & Segments
  lists: {
    defaultList: string;
    syncWithCrm: boolean;
    autoSegmentation: boolean;
  };
}

// ============================================================================
// 8. MEDIA LIBRARY
// ============================================================================

export interface MediaSettings {
  // Storage
  storage: {
    provider: "local" | "s3" | "cloudinary" | "uploadthing" | "vercel-blob";
    config: Record<string, string>;
    maxFileSize: number; // MB
    maxTotalStorage: number; // GB
  };

  // Images
  images: {
    allowedFormats: string[];
    maxDimensions: { width: number; height: number };
    autoOptimize: boolean;
    quality: number; // 1-100
    generateWebp: boolean;
    generateAvif: boolean;
    lazyLoading: boolean;
    responsiveSizes: number[]; // widths to generate
  };

  // Videos
  videos: {
    allowedFormats: string[];
    maxFileSize: number; // MB
    autoTranscode: boolean;
    generateThumbnail: boolean;
    thumbnailTime: number; // seconds
  };

  // Documents
  documents: {
    allowedFormats: string[];
    maxFileSize: number; // MB
    generatePreview: boolean;
  };

  // CDN
  cdn: {
    enabled: boolean;
    provider: "cloudflare" | "fastly" | "cloudfront" | "bunny" | "custom";
    customDomain?: string;
    cacheControl: string;
  };

  // Organization
  organization: {
    folderStructure: "flat" | "date" | "type" | "custom";
    autoTagging: boolean;
    duplicateDetection: boolean;
  };
}

// ============================================================================
// 9. CRM
// ============================================================================

export interface CRMSettings {
  // Pipeline
  pipeline: {
    stages: Array<{
      id: string;
      name: string;
      color: string;
      probability: number;
      order: number;
    }>;
    defaultStage: string;
    rottenAfterDays: number;
  };

  // Contacts
  contacts: {
    customFields: Array<{
      id: string;
      name: string;
      type: "text" | "number" | "date" | "select" | "multiselect" | "boolean";
      options?: string[];
      required: boolean;
    }>;
    duplicateDetection: boolean;
    autoMerge: boolean;
    leadScoring: boolean;
  };

  // Activities
  activities: {
    types: ("call" | "email" | "meeting" | "task" | "note")[];
    reminders: boolean;
    defaultReminder: number; // minutes before
    autoLog: boolean;
  };

  // Automation
  automation: {
    enabled: boolean;
    welcomeEmail: boolean;
    followUpReminders: boolean;
    stageChangeNotifications: boolean;
    inactivityAlerts: boolean;
    inactivityDays: number;
  };

  // Scoring
  scoring: {
    enabled: boolean;
    rules: Array<{
      condition: string;
      points: number;
    }>;
    hotLeadThreshold: number;
  };

  // Integration
  integration: {
    syncWithEmail: boolean;
    syncWithCalendar: boolean;
    syncWithCommerce: boolean;
  };
}

// ============================================================================
// 10. CLIENT PORTAL
// ============================================================================

export interface PortalSettings {
  // Access
  access: {
    enabled: boolean;
    requireApproval: boolean;
    selfRegistration: boolean;
    inviteOnly: boolean;
  };

  // Branding
  branding: {
    useSiteBranding: boolean;
    customLogo?: string;
    customColors?: {
      primary: string;
      secondary: string;
    };
    welcomeMessage: string;
  };

  // Features
  features: {
    viewInvoices: boolean;
    viewProjects: boolean;
    viewReports: boolean;
    viewFiles: boolean;
    messaging: boolean;
    supportTickets: boolean;
    appointments: boolean;
  };

  // Notifications
  notifications: {
    newInvoice: boolean;
    projectUpdate: boolean;
    newMessage: boolean;
    reportReady: boolean;
  };

  // Files
  files: {
    allowUploads: boolean;
    maxFileSize: number;
    allowedTypes: string[];
    requireApproval: boolean;
  };
}

// ============================================================================
// 11. REPORTING
// ============================================================================

export interface ReportingSettings {
  // General
  general: {
    timezone: string;
    dateFormat: string;
    numberFormat: string;
    currency: string;
  };

  // Scheduled Reports
  scheduled: {
    enabled: boolean;
    frequency: "daily" | "weekly" | "monthly";
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
    recipients: string[];
  };

  // Dashboard
  dashboard: {
    defaultView: "overview" | "analytics" | "sales" | "custom";
    widgets: string[];
    refreshInterval: number;
  };

  // Export
  export: {
    formats: ("pdf" | "csv" | "xlsx" | "json")[];
    includeCharts: boolean;
    branding: boolean;
  };

  // Data
  data: {
    retentionMonths: number;
    aggregationLevel: "hourly" | "daily" | "weekly";
    compareWithPrevious: boolean;
  };
}

// ============================================================================
// 12. INTEGRATIONS
// ============================================================================

export interface IntegrationsSettings {
  // API
  api: {
    enabled: boolean;
    rateLimit: number;
    allowedOrigins: string[];
    requireAuthentication: boolean;
  };

  // Webhooks
  webhooks: Array<{
    id: string;
    name: string;
    url: string;
    events: string[];
    secret: string;
    enabled: boolean;
  }>;

  // Third-Party
  thirdParty: {
    zapier: { enabled: boolean; apiKey?: string };
    slack: { enabled: boolean; webhookUrl?: string };
    googleWorkspace: { enabled: boolean; config?: Record<string, string> };
    microsoft365: { enabled: boolean; config?: Record<string, string> };
    salesforce: { enabled: boolean; config?: Record<string, string> };
    hubspot: { enabled: boolean; config?: Record<string, string> };
    mailchimp: { enabled: boolean; config?: Record<string, string> };
    stripe: { enabled: boolean; config?: Record<string, string> };
    paypal: { enabled: boolean; config?: Record<string, string> };
    twilio: { enabled: boolean; config?: Record<string, string> };
  };

  // Custom
  custom: Array<{
    name: string;
    type: "oauth" | "api-key" | "webhook";
    config: Record<string, string>;
    enabled: boolean;
  }>;
}

// ============================================================================
// 13. PROPERTY MANAGEMENT (Future)
// ============================================================================

export interface PropertySettings {
  // Listings
  listings: {
    types: ("sale" | "rent" | "lease" | "auction")[];
    propertyTypes: string[];
    requiredFields: string[];
    customFields: Array<{
      id: string;
      name: string;
      type: string;
    }>;
  };

  // Bookings
  bookings: {
    enabled: boolean;
    requireDeposit: boolean;
    depositPercent: number;
    minStay: number;
    maxStay: number;
    checkInTime: string;
    checkOutTime: string;
  };

  // Calendar
  calendar: {
    syncWithGoogle: boolean;
    syncWithOutlook: boolean;
    blockOffDays: number[];
    seasonalPricing: boolean;
  };

  // Inquiries
  inquiries: {
    autoResponse: boolean;
    autoResponseTemplate: string;
    assignToAgent: boolean;
  };
}

// ============================================================================
// 14. A/B TESTING (Future)
// ============================================================================

export interface ABTestingSettings {
  // General
  general: {
    enabled: boolean;
    defaultDuration: number; // days
    defaultTrafficSplit: number; // percent to variant
    statisticalSignificance: number; // percent (e.g., 95)
  };

  // Goals
  goals: {
    primary: "conversions" | "clicks" | "engagement" | "revenue";
    trackRevenue: boolean;
    minimumSampleSize: number;
  };

  // Traffic
  traffic: {
    excludeReturningVisitors: boolean;
    excludeBots: boolean;
    excludeInternalTraffic: boolean;
    internalIPs: string[];
  };
}

// ============================================================================
// 15. VIDEO LIBRARY (Future)
// ============================================================================

export interface VideoSettings {
  // Player
  player: {
    autoplay: boolean;
    muted: boolean;
    loop: boolean;
    controls: boolean;
    branding: boolean;
    customLogo?: string;
    color: string;
  };

  // Streaming
  streaming: {
    provider: "mux" | "cloudflare" | "bunny" | "custom";
    adaptiveBitrate: boolean;
    maxQuality: "4k" | "1080p" | "720p" | "480p";
    lowLatency: boolean;
  };

  // Captions
  captions: {
    autoGenerate: boolean;
    defaultLanguage: string;
    languages: string[];
  };

  // Analytics
  analytics: {
    trackViews: boolean;
    trackEngagement: boolean;
    heatmaps: boolean;
  };
}

// ============================================================================
// COMBINED GLOBAL SETTINGS
// ============================================================================

export interface GlobalSettings {
  brand: BrandSettings;
  seo: SEOSettings;
  analytics: AnalyticsSettings;
  security: SecuritySettings;
  blog: BlogSettings;
  commerce: CommerceSettings;
  email: EmailSettings;
  media: MediaSettings;
  crm: CRMSettings;
  portal: PortalSettings;
  reporting: ReportingSettings;
  integrations: IntegrationsSettings;
  // Future
  property?: PropertySettings;
  abTesting?: ABTestingSettings;
  video?: VideoSettings;
}
