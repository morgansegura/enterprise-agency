# Marketing & Analytics Platform

**Premium features that justify $2,000/month per client**

This document outlines the marketing, analytics, and optimization features that transform the agency platform into a full-service digital marketing solution.

---

## Value Proposition

**Why $2,000/month is justified:**

| Traditional Agency            | Our Platform                   |
| ----------------------------- | ------------------------------ |
| $500/mo hosting + maintenance | Included                       |
| $300/mo basic SEO             | Advanced SEO + AEO + GEO       |
| $200/mo analytics setup       | Real-time dashboard + insights |
| $400/mo content updates       | Self-service + agency support  |
| $300/mo social management     | Integrated social tools        |
| $500/mo ad management         | SEM integration + tracking     |
| **$2,200/mo minimum**         | **$2,000/mo all-in-one**       |

Plus: Clients get a cutting-edge web app, not a template site.

---

## Feature Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    MARKETING PLATFORM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   SEO/AEO    │  │  Analytics   │  │   Social     │          │
│  │    Suite     │  │  Dashboard   │  │   Tools      │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │     SEM      │  │     GEO      │  │   Content    │          │
│  │ Integration  │  │ Optimization │  │  Marketing   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Foundation (Week 1-2)

### 1.1 Analytics Infrastructure

**Database Schema Additions:**

```prisma
// Analytics event tracking
model AnalyticsEvent {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])

  // Event details
  eventType   String   // page_view, click, conversion, scroll, etc.
  eventName   String?  // Custom event name
  pageUrl     String
  pageTitle   String?

  // User/session
  sessionId   String
  visitorId   String   // Anonymous visitor ID (cookie)
  userId      String?  // If logged in

  // Attribution
  referrer    String?
  utmSource   String?
  utmMedium   String?
  utmCampaign String?
  utmTerm     String?
  utmContent  String?

  // Device/geo
  device      String?  // desktop, tablet, mobile
  browser     String?
  os          String?
  country     String?
  region      String?
  city        String?

  // Custom data
  metadata    Json?

  // Timestamps
  timestamp   DateTime @default(now())

  @@index([tenantId, timestamp])
  @@index([tenantId, eventType])
  @@index([sessionId])
  @@index([visitorId])
}

// Conversion goals
model ConversionGoal {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])

  name        String
  type        String   // page_view, event, duration, scroll_depth
  config      Json     // Goal-specific configuration
  value       Float?   // Monetary value per conversion

  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  conversions Conversion[]

  @@unique([tenantId, name])
}

model Conversion {
  id          String   @id @default(cuid())
  tenantId    String
  goalId      String
  goal        ConversionGoal @relation(fields: [goalId], references: [id])

  sessionId   String
  visitorId   String
  userId      String?

  value       Float?
  metadata    Json?

  timestamp   DateTime @default(now())

  @@index([tenantId, timestamp])
  @@index([goalId])
}

// SEO audits
model SEOAudit {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])

  pageUrl     String
  score       Int      // 0-100

  // Individual scores
  metaScore       Int
  contentScore    Int
  technicalScore  Int
  performanceScore Int
  accessibilityScore Int

  // Issues found
  issues      Json     // Array of { severity, category, message, suggestion }

  // Raw data
  rawData     Json?

  createdAt   DateTime @default(now())

  @@index([tenantId, createdAt])
  @@index([tenantId, pageUrl])
}

// Keyword tracking
model TrackedKeyword {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])

  keyword     String
  targetUrl   String?

  // Current rankings
  currentRank Int?
  previousRank Int?
  bestRank    Int?

  // Search data
  searchVolume Int?
  difficulty   Int?     // 0-100

  lastChecked DateTime?
  createdAt   DateTime @default(now())

  rankings    KeywordRanking[]

  @@unique([tenantId, keyword])
}

model KeywordRanking {
  id          String   @id @default(cuid())
  keywordId   String
  keyword     TrackedKeyword @relation(fields: [keywordId], references: [id])

  rank        Int?
  url         String?

  checkedAt   DateTime @default(now())

  @@index([keywordId, checkedAt])
}
```

### 1.2 Analytics Tracking Script

**Client-side tracking (lightweight):**

```typescript
// client/lib/analytics/tracker.ts
interface TrackingConfig {
  tenantId: string;
  endpoint: string;
  debug?: boolean;
}

class AnalyticsTracker {
  private config: TrackingConfig;
  private sessionId: string;
  private visitorId: string;
  private queue: any[] = [];

  constructor(config: TrackingConfig) {
    this.config = config;
    this.sessionId = this.getOrCreateSessionId();
    this.visitorId = this.getOrCreateVisitorId();
    this.setupAutoTracking();
  }

  // Track page views automatically
  private setupAutoTracking() {
    // Initial page view
    this.trackPageView();

    // SPA navigation
    if (typeof window !== "undefined") {
      const originalPushState = history.pushState;
      history.pushState = (...args) => {
        originalPushState.apply(history, args);
        this.trackPageView();
      };
    }
  }

  trackPageView(customData?: Record<string, any>) {
    this.track("page_view", {
      url: window.location.href,
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      ...this.getUTMParams(),
      ...customData,
    });
  }

  trackEvent(name: string, data?: Record<string, any>) {
    this.track("event", {
      name,
      url: window.location.href,
      ...data,
    });
  }

  trackConversion(
    goalName: string,
    value?: number,
    data?: Record<string, any>,
  ) {
    this.track("conversion", {
      goal: goalName,
      value,
      url: window.location.href,
      ...data,
    });
  }

  private track(eventType: string, data: Record<string, any>) {
    const event = {
      eventType,
      tenantId: this.config.tenantId,
      sessionId: this.sessionId,
      visitorId: this.visitorId,
      timestamp: new Date().toISOString(),
      device: this.getDevice(),
      ...data,
    };

    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        `${this.config.endpoint}/track`,
        JSON.stringify(event),
      );
    } else {
      fetch(`${this.config.endpoint}/track`, {
        method: "POST",
        body: JSON.stringify(event),
        keepalive: true,
      });
    }
  }

  private getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source"),
      utmMedium: params.get("utm_medium"),
      utmCampaign: params.get("utm_campaign"),
      utmTerm: params.get("utm_term"),
      utmContent: params.get("utm_content"),
    };
  }

  private getDevice() {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return "mobile";
    if (/tablet|ipad/i.test(ua)) return "tablet";
    return "desktop";
  }

  private getOrCreateSessionId(): string {
    const key = "_ea_sid";
    let id = sessionStorage.getItem(key);
    if (!id) {
      id = this.generateId();
      sessionStorage.setItem(key, id);
    }
    return id;
  }

  private getOrCreateVisitorId(): string {
    const key = "_ea_vid";
    let id = localStorage.getItem(key);
    if (!id) {
      id = this.generateId();
      localStorage.setItem(key, id);
    }
    return id;
  }

  private generateId(): string {
    return "xxxx-xxxx-xxxx".replace(/x/g, () =>
      Math.floor(Math.random() * 16).toString(16),
    );
  }
}

export const initAnalytics = (config: TrackingConfig) => {
  if (typeof window === "undefined") return null;
  return new AnalyticsTracker(config);
};
```

---

## Phase 2: SEO Suite (Week 2-3)

### 2.1 SEO Audit System

**Audit categories:**

1. **Meta Tags** (25 points)
   - Title tag presence and length (50-60 chars)
   - Meta description presence and length (150-160 chars)
   - Canonical URL
   - Robots directives
   - Open Graph tags
   - Twitter cards

2. **Content Quality** (25 points)
   - H1 presence (one per page)
   - Heading hierarchy (H1 → H2 → H3)
   - Content length (300+ words)
   - Keyword density
   - Image alt texts
   - Internal/external links

3. **Technical SEO** (25 points)
   - Mobile responsiveness
   - HTTPS
   - Clean URLs
   - Sitemap presence
   - Robots.txt
   - Schema markup

4. **Performance** (15 points)
   - Core Web Vitals (LCP, FID, CLS)
   - Page load time
   - Image optimization
   - Render-blocking resources

5. **Accessibility** (10 points)
   - Color contrast
   - Focus indicators
   - ARIA labels
   - Keyboard navigation

**Builder UI: SEO Dashboard**

```typescript
// builder/components/seo/seo-dashboard.tsx
interface SEODashboardProps {
  tenantId: string;
}

export function SEODashboard({ tenantId }: SEODashboardProps) {
  const { data: audits } = useSEOAudits(tenantId);
  const { data: keywords } = useTrackedKeywords(tenantId);

  return (
    <div className="seo-dashboard">
      {/* Overall Score */}
      <div className="seo-score-card">
        <ScoreGauge score={audits?.overallScore ?? 0} />
        <div className="score-breakdown">
          <ScoreBar label="Meta" score={audits?.metaScore} />
          <ScoreBar label="Content" score={audits?.contentScore} />
          <ScoreBar label="Technical" score={audits?.technicalScore} />
          <ScoreBar label="Performance" score={audits?.performanceScore} />
          <ScoreBar label="Accessibility" score={audits?.accessibilityScore} />
        </div>
      </div>

      {/* Issues List */}
      <div className="seo-issues">
        <h3>Issues to Fix</h3>
        <IssuesList issues={audits?.issues} />
      </div>

      {/* Keyword Rankings */}
      <div className="keyword-rankings">
        <h3>Keyword Rankings</h3>
        <KeywordTable keywords={keywords} />
      </div>

      {/* Quick Actions */}
      <div className="seo-actions">
        <Button onClick={() => runAudit()}>Run Full Audit</Button>
        <Button onClick={() => generateSitemap()}>Update Sitemap</Button>
        <Button onClick={() => openSchemaEditor()}>Edit Schema</Button>
      </div>
    </div>
  );
}
```

### 2.2 AEO (Answer Engine Optimization)

**Features for AI search visibility:**

1. **FAQ Schema Generator**
   - Auto-detect Q&A content
   - Generate FAQPage schema
   - Preview in search results

2. **Question-Based Content**
   - Suggest question-format headings
   - "People Also Ask" optimization
   - Direct answer formatting

3. **Featured Snippet Optimization**
   - Content structure analysis
   - List/table formatting suggestions
   - Definition block formatting

**Implementation:**

```typescript
// builder/components/seo/aeo-optimizer.tsx
export function AEOOptimizer({ pageContent }: { pageContent: Block[] }) {
  const analysis = useAEOAnalysis(pageContent);

  return (
    <div className="aeo-optimizer">
      <h3>AI Search Optimization</h3>

      {/* FAQ Detection */}
      <section>
        <h4>FAQ Opportunities</h4>
        {analysis.faqOpportunities.map(faq => (
          <div key={faq.id} className="faq-suggestion">
            <p className="question">{faq.suggestedQuestion}</p>
            <p className="answer-preview">{faq.contentPreview}</p>
            <Button onClick={() => convertToFAQ(faq)}>
              Add FAQ Schema
            </Button>
          </div>
        ))}
      </section>

      {/* Featured Snippet Opportunities */}
      <section>
        <h4>Featured Snippet Targets</h4>
        {analysis.snippetOpportunities.map(snippet => (
          <div key={snippet.id} className="snippet-suggestion">
            <Badge>{snippet.type}</Badge> {/* definition, list, table */}
            <p>{snippet.suggestion}</p>
            <Button onClick={() => optimizeForSnippet(snippet)}>
              Optimize
            </Button>
          </div>
        ))}
      </section>

      {/* Direct Answer Formatting */}
      <section>
        <h4>Direct Answer Score</h4>
        <ScoreGauge score={analysis.directAnswerScore} />
        <ul className="improvements">
          {analysis.directAnswerSuggestions.map(s => (
            <li key={s.id}>{s.message}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
```

### 2.3 GEO (Generative Engine Optimization)

**Optimizing for AI-powered search (ChatGPT, Perplexity, Gemini):**

1. **Citation Optimization**
   - Add authoritative sources
   - Structured citations
   - Clear source attribution

2. **Content Authority**
   - Author bios with credentials
   - Publication dates
   - Update frequency tracking

3. **AI-Readable Structure**
   - Clear hierarchical content
   - Concise summaries
   - Factual, verifiable claims

```typescript
// builder/components/seo/geo-optimizer.tsx
export function GEOOptimizer({ pageContent }: { pageContent: Block[] }) {
  const geoScore = useGEOAnalysis(pageContent);

  return (
    <div className="geo-optimizer">
      <h3>AI Engine Visibility</h3>

      <div className="geo-score">
        <ScoreGauge score={geoScore.overall} label="GEO Score" />
      </div>

      <div className="geo-factors">
        {/* Citation Quality */}
        <FactorCard
          label="Citations"
          score={geoScore.citations}
          suggestions={geoScore.citationSuggestions}
        />

        {/* Content Authority */}
        <FactorCard
          label="Authority"
          score={geoScore.authority}
          suggestions={geoScore.authoritySuggestions}
        />

        {/* Structure */}
        <FactorCard
          label="Structure"
          score={geoScore.structure}
          suggestions={geoScore.structureSuggestions}
        />

        {/* Factual Claims */}
        <FactorCard
          label="Verifiability"
          score={geoScore.verifiability}
          suggestions={geoScore.verifySuggestions}
        />
      </div>
    </div>
  );
}
```

---

## Phase 3: Analytics Dashboard (Week 3-4)

### 3.1 Real-Time Dashboard

```typescript
// builder/components/analytics/analytics-dashboard.tsx
export function AnalyticsDashboard({ tenantId }: { tenantId: string }) {
  const { data: realtime } = useRealtimeAnalytics(tenantId);
  const { data: stats } = useAnalyticsStats(tenantId, dateRange);

  return (
    <div className="analytics-dashboard">
      {/* Real-time visitors */}
      <div className="realtime-card">
        <div className="realtime-count">{realtime?.activeVisitors ?? 0}</div>
        <div className="realtime-label">Active Visitors</div>
        <div className="realtime-pages">
          {realtime?.activePages.map(page => (
            <div key={page.url} className="active-page">
              <span className="count">{page.visitors}</span>
              <span className="url">{page.url}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key metrics */}
      <div className="metrics-grid">
        <MetricCard
          label="Page Views"
          value={stats?.pageViews}
          change={stats?.pageViewsChange}
        />
        <MetricCard
          label="Unique Visitors"
          value={stats?.uniqueVisitors}
          change={stats?.visitorsChange}
        />
        <MetricCard
          label="Avg. Session"
          value={formatDuration(stats?.avgSession)}
          change={stats?.sessionChange}
        />
        <MetricCard
          label="Bounce Rate"
          value={`${stats?.bounceRate}%`}
          change={stats?.bounceChange}
          invertChange
        />
      </div>

      {/* Traffic chart */}
      <div className="traffic-chart">
        <TrafficChart data={stats?.trafficData} />
      </div>

      {/* Top pages */}
      <div className="top-pages">
        <h3>Top Pages</h3>
        <PageTable pages={stats?.topPages} />
      </div>

      {/* Traffic sources */}
      <div className="traffic-sources">
        <h3>Traffic Sources</h3>
        <SourcesChart data={stats?.sources} />
      </div>

      {/* Conversions */}
      <div className="conversions">
        <h3>Conversions</h3>
        <ConversionsTable goals={stats?.goals} />
      </div>
    </div>
  );
}
```

### 3.2 Conversion Tracking

```typescript
// builder/components/analytics/goals-manager.tsx
export function GoalsManager({ tenantId }: { tenantId: string }) {
  const { data: goals } = useConversionGoals(tenantId);
  const createGoal = useCreateGoal();

  return (
    <div className="goals-manager">
      <div className="goals-header">
        <h2>Conversion Goals</h2>
        <Button onClick={() => setShowCreate(true)}>
          Create Goal
        </Button>
      </div>

      <div className="goals-list">
        {goals?.map(goal => (
          <GoalCard
            key={goal.id}
            goal={goal}
            conversions={goal.conversions}
            conversionRate={goal.conversionRate}
          />
        ))}
      </div>

      {/* Goal Types */}
      <CreateGoalDialog open={showCreate} onOpenChange={setShowCreate}>
        <GoalTypeSelector
          types={[
            { id: 'page_view', label: 'Page View', icon: Eye },
            { id: 'event', label: 'Custom Event', icon: Zap },
            { id: 'form_submit', label: 'Form Submission', icon: FileText },
            { id: 'button_click', label: 'Button Click', icon: MousePointer },
            { id: 'scroll_depth', label: 'Scroll Depth', icon: ArrowDown },
            { id: 'time_on_page', label: 'Time on Page', icon: Clock },
          ]}
        />
      </CreateGoalDialog>
    </div>
  );
}
```

### 3.3 Funnel Analysis

```typescript
// builder/components/analytics/funnel-builder.tsx
export function FunnelBuilder({ tenantId }: { tenantId: string }) {
  const [steps, setSteps] = useState<FunnelStep[]>([]);
  const { data: funnelData } = useFunnelAnalysis(tenantId, steps);

  return (
    <div className="funnel-builder">
      {/* Step builder */}
      <div className="funnel-steps">
        {steps.map((step, index) => (
          <FunnelStepCard
            key={step.id}
            step={step}
            index={index}
            onUpdate={(s) => updateStep(index, s)}
            onRemove={() => removeStep(index)}
          />
        ))}
        <Button onClick={addStep}>Add Step</Button>
      </div>

      {/* Funnel visualization */}
      {funnelData && (
        <div className="funnel-visualization">
          <FunnelChart
            steps={funnelData.steps}
            conversionRates={funnelData.rates}
          />

          <div className="funnel-summary">
            <div className="total-conversion">
              <span className="rate">{funnelData.overallRate}%</span>
              <span className="label">Overall Conversion</span>
            </div>
            <div className="biggest-drop">
              <span className="step">{funnelData.biggestDrop.step}</span>
              <span className="drop">-{funnelData.biggestDrop.percent}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Phase 4: SEM Integration (Week 4-5)

### 4.1 UTM Builder & Tracking

```typescript
// builder/components/marketing/utm-builder.tsx
export function UTMBuilder() {
  const [params, setParams] = useState({
    url: '',
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: '',
  });

  const generatedUrl = useMemo(() => {
    const base = new URL(params.url);
    if (params.source) base.searchParams.set('utm_source', params.source);
    if (params.medium) base.searchParams.set('utm_medium', params.medium);
    if (params.campaign) base.searchParams.set('utm_campaign', params.campaign);
    if (params.term) base.searchParams.set('utm_term', params.term);
    if (params.content) base.searchParams.set('utm_content', params.content);
    return base.toString();
  }, [params]);

  return (
    <div className="utm-builder">
      <h3>Campaign URL Builder</h3>

      <div className="utm-form">
        <Input
          label="Website URL"
          value={params.url}
          onChange={(e) => setParams({ ...params, url: e.target.value })}
          placeholder="https://yoursite.com/landing-page"
        />

        <div className="utm-grid">
          <Input
            label="Source"
            value={params.source}
            onChange={(e) => setParams({ ...params, source: e.target.value })}
            placeholder="google, facebook, newsletter"
          />
          <Input
            label="Medium"
            value={params.medium}
            onChange={(e) => setParams({ ...params, medium: e.target.value })}
            placeholder="cpc, social, email"
          />
          <Input
            label="Campaign"
            value={params.campaign}
            onChange={(e) => setParams({ ...params, campaign: e.target.value })}
            placeholder="spring_sale, product_launch"
          />
        </div>

        <div className="utm-grid">
          <Input
            label="Term (optional)"
            value={params.term}
            onChange={(e) => setParams({ ...params, term: e.target.value })}
            placeholder="running+shoes"
          />
          <Input
            label="Content (optional)"
            value={params.content}
            onChange={(e) => setParams({ ...params, content: e.target.value })}
            placeholder="header_banner, sidebar_ad"
          />
        </div>
      </div>

      <div className="generated-url">
        <Label>Generated URL</Label>
        <div className="url-display">
          <code>{generatedUrl}</code>
          <Button onClick={() => copyToClipboard(generatedUrl)}>
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 4.2 Campaign Performance

```typescript
// builder/components/marketing/campaign-dashboard.tsx
export function CampaignDashboard({ tenantId }: { tenantId: string }) {
  const { data: campaigns } = useCampaignPerformance(tenantId);

  return (
    <div className="campaign-dashboard">
      <h2>Campaign Performance</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Visitors</TableHead>
            <TableHead>Conversions</TableHead>
            <TableHead>Conv. Rate</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>ROI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns?.map(campaign => (
            <TableRow key={campaign.id}>
              <TableCell>{campaign.name}</TableCell>
              <TableCell>{campaign.source}/{campaign.medium}</TableCell>
              <TableCell>{campaign.visitors.toLocaleString()}</TableCell>
              <TableCell>{campaign.conversions}</TableCell>
              <TableCell>{campaign.conversionRate}%</TableCell>
              <TableCell>${campaign.revenue.toLocaleString()}</TableCell>
              <TableCell className={campaign.roi > 0 ? 'positive' : 'negative'}>
                {campaign.roi > 0 ? '+' : ''}{campaign.roi}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

---

## Phase 5: Social Media Tools (Week 5-6)

### 5.1 Social Preview

```typescript
// builder/components/social/social-preview.tsx
export function SocialPreview({ page }: { page: Page }) {
  const [platform, setPlatform] = useState<'facebook' | 'twitter' | 'linkedin'>('facebook');

  const seo = page.seo;
  const ogImage = seo?.openGraph?.images?.[0]?.url || seo?.image;
  const ogTitle = seo?.openGraph?.title || seo?.title || page.title;
  const ogDescription = seo?.openGraph?.description || seo?.description;

  return (
    <div className="social-preview">
      <div className="platform-tabs">
        <Button
          variant={platform === 'facebook' ? 'default' : 'ghost'}
          onClick={() => setPlatform('facebook')}
        >
          <Facebook className="w-4 h-4 mr-2" /> Facebook
        </Button>
        <Button
          variant={platform === 'twitter' ? 'default' : 'ghost'}
          onClick={() => setPlatform('twitter')}
        >
          <Twitter className="w-4 h-4 mr-2" /> Twitter
        </Button>
        <Button
          variant={platform === 'linkedin' ? 'default' : 'ghost'}
          onClick={() => setPlatform('linkedin')}
        >
          <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
        </Button>
      </div>

      <div className="preview-container">
        {platform === 'facebook' && (
          <FacebookPreview
            image={ogImage}
            title={ogTitle}
            description={ogDescription}
            url={page.url}
          />
        )}
        {platform === 'twitter' && (
          <TwitterPreview
            image={ogImage}
            title={ogTitle}
            description={ogDescription}
            cardType={seo?.twitter?.card || 'summary_large_image'}
          />
        )}
        {platform === 'linkedin' && (
          <LinkedInPreview
            image={ogImage}
            title={ogTitle}
            description={ogDescription}
          />
        )}
      </div>

      <div className="preview-issues">
        {!ogImage && (
          <Alert variant="warning">
            No social image set. Add an Open Graph image for better engagement.
          </Alert>
        )}
        {ogTitle && ogTitle.length > 60 && (
          <Alert variant="warning">
            Title may be truncated ({ogTitle.length}/60 characters)
          </Alert>
        )}
      </div>
    </div>
  );
}
```

### 5.2 Social Sharing Analytics

```typescript
// Track social shares
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const trackShare = useTrackShare();

  const share = (platform: string) => {
    trackShare.mutate({ platform, url });

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="share-buttons">
      <Button onClick={() => share('facebook')}>
        <Facebook /> Share
      </Button>
      <Button onClick={() => share('twitter')}>
        <Twitter /> Tweet
      </Button>
      <Button onClick={() => share('linkedin')}>
        <Linkedin /> Share
      </Button>
    </div>
  );
}
```

---

## Feature Flag Integration

Add to existing feature flags system:

```typescript
interface TenantFeatures {
  // ... existing features

  // Marketing Suite
  marketing: {
    seo: boolean; // Basic SEO tools
    seoAdvanced: boolean; // Audit, keywords, AEO, GEO
    analytics: boolean; // Basic analytics
    analyticsAdvanced: boolean; // Funnels, goals, real-time
    campaigns: boolean; // UTM tracking, campaign management
    social: boolean; // Social previews, sharing analytics
  };
}
```

---

## API Endpoints

### Analytics API

```
POST /api/v1/analytics/track           # Track event (public, rate limited)
GET  /api/v1/analytics/realtime        # Real-time stats
GET  /api/v1/analytics/stats           # Aggregated stats
GET  /api/v1/analytics/pages           # Page performance
GET  /api/v1/analytics/sources         # Traffic sources
GET  /api/v1/analytics/devices         # Device breakdown
GET  /api/v1/analytics/campaigns       # Campaign performance

# Goals
GET  /api/v1/analytics/goals           # List goals
POST /api/v1/analytics/goals           # Create goal
GET  /api/v1/analytics/goals/:id       # Goal details
PUT  /api/v1/analytics/goals/:id       # Update goal
DELETE /api/v1/analytics/goals/:id     # Delete goal

# Funnels
POST /api/v1/analytics/funnels/analyze # Analyze funnel
```

### SEO API

```
POST /api/v1/seo/audit                 # Run SEO audit
GET  /api/v1/seo/audits                # List audits
GET  /api/v1/seo/audits/:id            # Audit details
GET  /api/v1/seo/score                 # Overall SEO score

# Keywords
GET  /api/v1/seo/keywords              # List tracked keywords
POST /api/v1/seo/keywords              # Add keyword
DELETE /api/v1/seo/keywords/:id        # Remove keyword
POST /api/v1/seo/keywords/check        # Check rankings

# Suggestions
GET  /api/v1/seo/suggestions           # Get improvement suggestions
GET  /api/v1/seo/aeo/analyze           # AEO analysis
GET  /api/v1/seo/geo/analyze           # GEO analysis
```

---

## Implementation Priority

### Week 1-2: Analytics Foundation

1. Database schema additions
2. Tracking script implementation
3. Basic analytics API endpoints
4. Simple dashboard UI

### Week 2-3: SEO Suite

1. SEO audit engine
2. Keyword tracking
3. SEO dashboard
4. AEO/GEO analyzers

### Week 3-4: Advanced Analytics

1. Goal/conversion tracking
2. Funnel builder
3. Real-time dashboard
4. Campaign tracking

### Week 4-5: SEM & Social

1. UTM builder
2. Campaign performance
3. Social previews
4. Share tracking

### Week 5-6: Polish & Integration

1. Global settings integration
2. Feature flags
3. Documentation
4. Testing

---

## Success Metrics

**For Clients:**

- SEO score improvement (target: +20 points in 90 days)
- Organic traffic increase (target: +30% in 6 months)
- Conversion rate improvement (target: +15%)
- Page load time (target: <2s)

**For Agency:**

- Client retention rate (target: 95%+)
- Upsell rate (target: 40% upgrade to higher tier)
- Support ticket reduction (target: -50% with self-service tools)
- Revenue per client (target: $2,000/month average)

---

**Last Updated:** 2025-12-30
**Status:** Planning
