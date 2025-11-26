# Client Intake System

The Client Intake System is a structured workflow for onboarding new clients and gathering all necessary information to successfully deliver web development projects.

---

## Purpose

When a new client signs a contract, you need to collect:

- **Business Information** - What they do, who they serve, goals
- **Brand Guidelines** - Logo, colors, fonts, style preferences
- **Content Requirements** - Copy, images, videos needed
- **Technical Requirements** - Integrations, functionality, hosting
- **Timeline & Budget** - Deadlines, milestones, payment schedule
- **Access & Credentials** - Existing accounts, domains, hosting (encrypted storage)

The Intake System ensures nothing is missed and provides a smooth handoff to your design and development team.

---

## Workflow Overview

```
New Client Signed
       │
       ▼
┌─────────────────┐
│ Create Intake   │
│   Workflow      │
└─────────────────┘
       │
       ▼
┌─────────────────┐
│ Discovery       │ ← Meeting notes, questionnaire
│   Meeting       │
└─────────────────┘
       │
       ▼
┌─────────────────┐
│ Questionnaire   │ ← Client fills out form
│   Sent          │
└─────────────────┘
       │
       ▼
┌─────────────────┐
│ Asset           │ ← Logo, images, content
│   Collection    │
└─────────────────┘
       │
       ▼
┌─────────────────┐
│ Technical       │ ← Credentials, integrations
│   Discovery     │
└─────────────────┘
       │
       ▼
┌─────────────────┐
│ Intake          │ ← All info collected
│   Complete      │
└─────────────────┘
       │
       ▼
┌─────────────────┐
│ Create Project  │ ← Automatically create project + tasks
│ Handoff to Team │
└─────────────────┘
```

---

## Intake Dashboard (`/admin/intake`)

**Displays**:

- **Active Intakes** - Currently in progress
- **Completed This Month** - Successfully handed off
- **Needs Attention** - Missing information, overdue responses
- **Templates** - Questionnaire and form templates

**Card View**:

```
┌────────────────────────────────────────────────┐
│  Acme Corp Website Redesign                    │
│  Started: Oct 15, 2024  │  Status: 60% Complete│
├────────────────────────────────────────────────┤
│  ✓ Discovery Meeting                           │
│  ✓ Questionnaire Completed                     │
│  ⏳ Assets Collection (3/8 items)              │
│  ○ Technical Discovery                         │
│  ○ Handoff Complete                            │
├────────────────────────────────────────────────┤
│  Next: Request missing logo files from client  │
│  Assigned to: Sarah (PM)                       │
└────────────────────────────────────────────────┘
```

---

## Intake Workflow Components

### 1. Discovery Meeting

**Purpose**: Initial kickoff meeting with client (Zoom or in-person)

**Meeting Template Structure**:

```markdown
# Discovery Meeting - [Client Name]

Date: [Date]
Attendees: [Names]
Duration: 90 minutes

## Business Overview

- What does your business do?
- Who are your customers?
- What makes you different from competitors?
- What are your business goals for the next 1-3 years?

## Website Goals

- What's the primary purpose of this website?
  - Generate leads
  - Sell products
  - Provide information
  - Build brand awareness
- Who is your target audience?
- What actions do you want visitors to take?

## Current Situation

- Do you have an existing website? (URL)
- What works well? What doesn't?
- Do you have analytics data we can review?
- What are you keeping vs. replacing?

## Content & Assets

- Do you have professional photos?
- Is website copy written?
- Do you have brand guidelines (logo, colors, fonts)?
- Do you have any videos or other media?

## Functionality Requirements

- Contact forms
- E-commerce (if yes → product count, payment processor)
- Blog/news section
- Customer accounts/login
- Booking/scheduling
- Integrations (CRM, email marketing, etc.)

## Design Preferences

- Sites you like (competitors or other industries)
- Sites you dislike (what to avoid)
- Brand personality (professional, playful, modern, classic)
- Must-have design elements

## Technical Requirements

- Do you own your domain? (registrar)
- Current hosting provider
- Email hosting
- Any integrations needed?
- Accessibility requirements (ADA compliance)

## Timeline & Budget

- Ideal launch date
- Hard deadline (if any)
- Budget constraints
- Payment schedule

## Next Steps

- Send questionnaire for detailed requirements
- Request asset list
- Schedule follow-up meeting
```

**Features**:

- Pre-populated template
- Save as draft during meeting
- Convert responses → tasks automatically
- Attach to client record
- Share with team

### 2. Client Questionnaire

**Purpose**: Detailed form for client to provide comprehensive information

**Question Categories**:

#### A. Business Information

```yaml
1. Business Legal Name:
2. Doing Business As (DBA) if different:
3. Business Address:
4. Phone Number:
5. Primary Contact Name:
6. Primary Contact Email:
7. Industry/Business Type:
8. Year Established:
9. Number of Employees:
10. Business Description (1-2 paragraphs):
```

#### B. Target Audience

```yaml
11. Primary target audience:
12. Secondary target audiences:
13. Geographic focus (local, regional, national, international):
14. Customer demographics:
  - Age range
  - Gender
  - Income level
  - Other relevant factors
```

#### C. Website Goals & Requirements

```yaml
15. Primary website goal (select one):
    □ Generate leads
    □ Sell products online
    □ Provide information
    □ Build brand awareness
    □ Other: _______

16. What actions should visitors take? (check all that apply)
    □ Contact us
    □ Request a quote
    □ Purchase products
    □ Book appointment
    □ Sign up for newsletter
    □ Download resources
    □ Other: _______

17. Key pages needed:
    □ Home
    □ About Us
    □ Services/Products
    □ Contact
    □ Blog/News
    □ FAQ
    □ Portfolio/Gallery
    □ Other: _______

18. Do you need e-commerce functionality?
    □ Yes → How many products initially? _______
    □ No

19. Do you need a blog/news section?
    □ Yes
    □ No

20. Do you need customer accounts/login?
    □ Yes
    □ No
```

#### D. Brand & Design

```yaml
21. Brand colors (hex codes if known):
22. Fonts (if specific preferences):
23. Logo files available: □ Vector (.ai, .eps, .svg)
  □ High-res PNG
  □ Need logo design

24. Competitor websites (3-5 URLs):
25. Websites you like (design inspiration):
26. Websites you dislike (what to avoid):

27. Brand personality (select 3): □ Professional
  □ Friendly
  □ Modern
  □ Classic
  □ Bold
  □ Minimal
  □ Playful
  □ Luxurious
  □ Trustworthy
  □ Innovative
```

#### E. Content

```yaml
28. Is website copy written?
□ Yes, we have all content ready
□ Partially written
□ No, we need copywriting services

29. Do you have professional photos?
□ Yes, we have photos
□ No, we need photography
□ We'll use stock photos

30. Do you have video content?
□ Yes
□ No, but we want it
□ No video needed
```

#### F. Technical Requirements

```yaml
31. Domain name (URL):
32. Domain registrar (GoDaddy, Namecheap, etc.):
33. Current hosting provider (if any):
34. Email hosting (Gmail, Outlook, other):

35. Required integrations:
    □ Email marketing (which platform?)
    □ CRM system
    □ Payment processor
    □ Booking/scheduling system
    □ Analytics
    □ Social media feeds
    □ Other: _______

36. Accessibility requirements:
    □ ADA/WCAG compliance needed
    □ Standard accessibility
```

#### G. Timeline & Budget

```yaml
37. Desired launch date:
38. Hard deadline (if applicable):
39. Budget range:
    □ $5,000 - $10,000
    □ $10,000 - $20,000
    □ $20,000 - $50,000
    □ $50,000+

40. Payment preference:
    □ 50% upfront, 50% on launch
    □ Monthly installments
    □ Net 30 invoice
    □ Other: _______
```

**Questionnaire Features**:

- Conditional logic (e.g., if e-commerce yes → ask product count)
- File upload for assets
- Save progress (client can complete over multiple sessions)
- Email reminders if incomplete
- Convert answers → project requirements automatically

### 3. Asset Collection Checklist

**Purpose**: Track all files needed from client

**Asset Categories**:

#### Brand Assets

```
□ Logo (vector format preferred)
□ Alternative logo versions (white, black, icon-only)
□ Brand guidelines document
□ Color palette (hex codes)
□ Typography/fonts
□ Brand imagery examples
```

#### Content Assets

```
□ Website copy (all pages)
□ Product descriptions (if e-commerce)
□ Team bios and headshots
□ Testimonials/reviews
□ Case studies
□ Blog posts (if applicable)
```

#### Media Assets

```
□ Professional photos (high-resolution)
□ Product images (if e-commerce)
□ Videos
□ Icons
□ Infographics
□ PDFs/downloads
```

#### Technical Assets

```
□ Existing website backup (if applicable)
□ Analytics data (Google Analytics export)
□ Social media handles
□ Third-party integration credentials
□ Email templates (if migrating)
```

**Asset Tracking**:

```typescript
interface AssetItem {
  id: string;
  category: "brand" | "content" | "media" | "technical";
  name: string;
  description: string;
  required: boolean;
  status: "pending" | "requested" | "received" | "approved";
  files: File[];
  requestedDate: Date;
  receivedDate: Date | null;
  notes: string;
}
```

**Features**:

- Client upload portal (secure file sharing)
- Email request with reminder schedule
- Version tracking (if client uploads new version)
- Approval workflow

### 4. Technical Discovery

**Purpose**: Gather technical details and access

**Information Needed**:

#### Domain & Hosting

```
- Domain registrar login
- Hosting account login
- DNS settings access
- SSL certificate info
- Email hosting details
```

#### Integrations

```
- Payment processor (Stripe, PayPal, Square)
- Email marketing (Mailchimp, Constant Contact)
- CRM (Salesforce, HubSpot)
- Analytics (Google Analytics, Facebook Pixel)
- Social media API keys
- Third-party services
```

#### Current Website (if applicable)

```
- CMS login (WordPress, Shopify, etc.)
- FTP/SFTP credentials
- Database access
- Backup files
- Plugin/extension list
```

**Security**:

- All credentials encrypted at rest
- Team members need permission to view
- Audit log of who accessed what
- Option to use credential manager (1Password, LastPass integration)

---

## Handoff to Project Team

Once intake is complete:

### Automatic Project Creation

```typescript
// System automatically creates:

1. Client Record (if not exists)
   - All business info from questionnaire

2. Project Record
   - Project name: "[Client] Website [Type]"
   - Status: Discovery → Design
   - Assigned PM from intake workflow

3. Tasks Generated from Requirements
   ┌─────────────────────────────────────┐
   │ Design Tasks:                       │
   │  - Create homepage mockup           │
   │  - Design interior page templates   │
   │  - Create mobile responsive views   │
   │  - Present to client                │
   └─────────────────────────────────────┘

   ┌─────────────────────────────────────┐
   │ Development Tasks:                  │
   │  - Set up hosting environment       │
   │  - Configure CMS                    │
   │  - Build homepage                   │
   │  - Build interior pages             │
   │  - Set up forms                     │
   │  - Integrate payment processor      │
   │  - Configure analytics              │
   └─────────────────────────────────────┘

   ┌─────────────────────────────────────┐
   │ Content Tasks:                      │
   │  - Input page copy                  │
   │  - Upload and optimize images       │
   │  - Create blog posts                │
   └─────────────────────────────────────┘

4. Project Timeline
   - Start date: Today
   - Estimated duration: Based on project type
   - Milestones: Design review, development complete, launch

5. Document Storage
   - All intake forms attached
   - Assets organized in project folder
   - Meeting notes linked
```

### Handoff Meeting

**Agenda**:

1. Review intake summary with team
2. Clarify any ambiguous requirements
3. Assign team members (designer, developer)
4. Review timeline and milestones
5. Identify potential challenges
6. Set first milestone (typically design mockups)

---

## Intake Templates

### Create Custom Templates (`/admin/intake/templates`)

**Template Types**:

- Basic Website
- E-commerce Site
- Booking/Reservation Site
- Blog/Content Site
- Portfolio Site
- SaaS Application

**Each template includes**:

- Pre-configured questionnaire
- Standard asset checklist
- Typical task list
- Estimated timeline

**Customization**:

- Add/remove questions
- Adjust required vs optional
- Change task templates
- Modify timeline estimates

---

## Integration Points

### 1. CRM Integration

- Intake starts from client record or pipeline conversion
- Intake completion triggers project creation
- All data flows to client profile

### 2. Project Management Integration

- Tasks auto-generated from requirements
- Team assignments from intake workflow
- Timeline based on intake responses

### 3. Document Storage

- All intake documents organized by client
- Assets uploaded go to client folder
- Easy access from project view

### 4. Communication

- Automated email notifications to client
- Reminders for incomplete sections
- Team notifications when intake complete

---

## Best Practices

### For Project Managers

1. **Schedule discovery meeting within 48 hours of contract signing**
2. **Send questionnaire immediately after meeting** (while fresh)
3. **Set clear deadlines** for questionnaire and asset submission
4. **Follow up promptly** on missing information
5. **Review intake completeness** before handoff to design
6. **Don't skip steps** - thorough discovery saves time later

### For Clients

1. **Be thorough** - more info upfront = better results
2. **Provide examples** - competitor sites, design preferences
3. **Submit high-quality assets** - logos should be vector, photos high-res
4. **Respond to follow-ups** - delays here cascade to project timeline
5. **Ask questions** - if unclear on what's needed, ask

---

## Metrics & Reporting

### Intake Performance Metrics

```
Average Time to Complete Intake:     5.2 days
Intakes Completed This Month:       8
Average Completeness Score:          92%
Most Common Delay:                   Asset submission
Client Satisfaction with Process:    4.7/5
```

### Bottleneck Identification

- Track where intakes get stuck
- Identify most frequently missing assets
- Optimize questionnaire based on confusion points
- Improve turnaround time

---

## Future Enhancements

- **Video Walkthrough** - Loom-style video explaining next steps
- **Client Portal Integration** - Client can track intake progress
- **AI-Assisted** - GPT helps refine vague requirements
- **Pre-intake Survey** - Quick assessment before discovery meeting
- **Automated Reminders** - Smart follow-ups based on typical delays

---

## Related Documentation

- [Agency Platform Overview](./agency-platform.md)
- [CRM & Project Management](./crm.md)
- [Client Management](../guides/client-management.md)
