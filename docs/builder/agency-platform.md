# Agency Platform Features

The Agency Platform (`/admin`) is the core operational hub for running your web development agency. It provides comprehensive tools for client relationship management, project execution, team collaboration, and business operations.

---

## Overview

The agency platform is exclusively for your team (not clients) and provides:

- **Client Relationship Management (CRM)** - Track clients, projects, and communications
- **Project Management** - Asana-style task management and collaboration
- **Client Intake** - Structured onboarding and discovery workflows
- **Team Management** - Role-based access and workload tracking
- **Billing & Revenue** - Invoicing, payments, and financial reporting
- **Site Builder Access** - Build and manage client websites

---

## 1. CRM & Project Management (`/admin/crm`)

### Dashboard (`/admin/crm/dashboard`)

**Purpose**: High-level overview of agency operations

**Displays**:

- **Active Projects** - Projects in progress with status indicators
- **Upcoming Deadlines** - Critical dates and milestones
- **Team Workload** - Who's working on what, capacity indicators
- **Recent Client Activity** - Latest communications, meetings, deliverables
- **Pipeline Overview** - Leads, proposals, signed contracts

**Metrics**:

```
┌─────────────────────┬─────────────────────┬─────────────────────┐
│  Active Projects    │   This Month Rev    │    Team Capacity    │
│        12           │      $24,500        │        78%          │
└─────────────────────┴─────────────────────┴─────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Pipeline: 5 Leads → 3 Proposals → 2 Closing → 12 Active        │
└─────────────────────────────────────────────────────────────────┘
```

### Projects (`/admin/crm/projects`)

**Purpose**: Central hub for all client projects

**Features**:

#### Project List View

- Filterable by status, client, team member, deadline
- Sortable by priority, due date, created date
- Quick status updates (drag & drop between columns)
- Bulk actions (assign, update status, archive)

#### Project Detail (`/admin/crm/projects/[id]`)

**Project Stages**:

1. **Discovery** - Information gathering, requirements
2. **Design** - Mockups, brand guidelines, feedback
3. **Development** - Site building, functionality implementation
4. **Review** - Client feedback, revisions
5. **Launch** - Final deployment, handoff

**Project Components**:

```typescript
interface Project {
  // Metadata
  id: string;
  clientId: string;
  name: string;
  type: "website" | "redesign" | "maintenance" | "campaign";
  status:
    | "discovery"
    | "design"
    | "development"
    | "review"
    | "launch"
    | "complete";
  priority: "low" | "medium" | "high" | "urgent";

  // Timeline
  startDate: Date;
  dueDate: Date;
  launchDate: Date | null;

  // Team
  projectManager: UserId;
  designer: UserId | null;
  developer: UserId | null;
  assignedTeam: UserId[];

  // Budget
  estimatedHours: number;
  actualHours: number;
  budget: number;
  currentCost: number;

  // Deliverables
  tasks: Task[];
  milestones: Milestone[];
  deliverables: Deliverable[];

  // Communication
  notes: Note[];
  meetings: Meeting[];
  attachments: File[];
}
```

#### Task Management (Asana-style)

**Task Structure**:

```typescript
interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: UserId;
  status: "todo" | "in_progress" | "blocked" | "review" | "done";
  priority: "low" | "medium" | "high";

  // Dependencies
  blockedBy: TaskId[];
  blocking: TaskId[];

  // Timeline
  dueDate: Date;
  estimatedHours: number;
  actualHours: number;

  // Collaboration
  comments: Comment[];
  attachments: File[];
  watchers: UserId[];

  // Subtasks
  subtasks: Subtask[];
  checklistItems: ChecklistItem[];
}
```

**Task Views**:

- **Board View** - Kanban-style (Todo → In Progress → Review → Done)
- **List View** - Sortable table with filters
- **Calendar View** - Tasks plotted on timeline
- **Gantt Chart** - Project timeline with dependencies (Phase 2)

**Task Features**:

- Drag & drop status updates
- In-line task creation
- @ mentions for team members
- File attachments
- Time tracking
- Dependencies (blocks/blocked by)
- Recurring tasks

### Pipeline (`/admin/crm/pipeline`)

**Purpose**: Sales funnel from lead to client

**Stages**:

1. **Lead** - Initial contact, inquiry
2. **Qualified** - Determined to be good fit
3. **Proposal Sent** - Quote/proposal delivered
4. **Negotiation** - Discussing terms, pricing
5. **Won** - Contract signed → Convert to Client + Project
6. **Lost** - Not moving forward (track reason)

**Pipeline Card**:

```
┌─────────────────────────────────────┐
│  Acme Corp Website Redesign         │
│  Contact: John Smith                │
│  Est. Value: $15,000                │
│  Probability: 75%                   │
│  Next Action: Follow up on proposal │
│  Due: In 2 days                     │
└─────────────────────────────────────┘
```

**Features**:

- Drag & drop between stages
- Probability weighting
- Expected revenue forecasting
- Next action reminders
- Lost reason tracking (pricing, timing, competition)

### Calendar (`/admin/crm/calendar`)

**Purpose**: Team schedule and deadlines

**Displays**:

- Client meetings (Zoom, in-person)
- Project milestones
- Task deadlines
- Team PTO / availability
- Recurring check-ins

**Views**:

- Day / Week / Month
- Team member filter
- Project filter
- Event type filter

---

## 2. Client Directory (`/admin/clients`)

### Client List (`/admin/clients`)

**Purpose**: Complete directory of all agency clients

**Display Columns**:

- Business Name
- Primary Contact
- Status (Active, Trial, Suspended, Inactive)
- Active Projects
- Sites Managed
- MRR (Monthly Recurring Revenue)
- Last Contact Date
- Health Score

**Filters**:

- Status
- Has Active Project
- Revenue tier
- Date added
- Industry/Type

**Bulk Actions**:

- Export to CSV
- Send bulk email
- Update status
- Assign to PM

### Client Profile (`/admin/clients/[id]`)

**Tabs**:

#### 1. Overview

- Business information
- Contact details
- Health score & indicators
- Quick stats (projects, revenue, sites)

#### 2. Projects

- All projects for this client
- Current + historical
- Quick create new project

#### 3. Sites

- All sites managed for this client
- Quick access to site builder
- Site health metrics

#### 4. Communication

- Meeting notes
- Email log (if integrated)
- Phone call notes
- Document sharing

#### 5. Billing

- Invoices (past & current)
- Payment history
- Outstanding balance
- MRR tracking

#### 6. Documents

- Contracts
- Brand assets
- Credentials (encrypted)
- Deliverables

**Client Health Score**:

```typescript
interface HealthScore {
  overall: number; // 0-100
  factors: {
    projectOnTime: boolean;
    paymentsOnTime: boolean;
    responsiveness: "high" | "medium" | "low";
    satisfaction: number; // 1-5 from surveys
    riskLevel: "low" | "medium" | "high";
  };
  alerts: Alert[]; // Payment overdue, unresponsive, etc.
}
```

---

## 3. Client Intake (`/admin/intake`)

Detailed documentation: [Client Intake System](./intake.md)

**Overview**:
Structured workflow for onboarding new clients and gathering all requirements.

**Key Features**:

- Discovery questionnaires
- Meeting note templates
- Requirements checklist
- Asset collection
- Project kickoff automation

---

## 4. Team Management (`/admin/team`)

### Team Members (`/admin/team/members`)

**Purpose**: Agency staff directory and management

**Features**:

- Add/edit team members
- Assign roles
- Set permissions
- Track capacity/workload
- PTO management

**Team Member Profile**:

```typescript
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: AgencyRole;

  // Capacity
  hoursPerWeek: number;
  currentWorkload: number; // hours assigned this week
  availability: "available" | "at_capacity" | "overbooked";

  // Assignment
  assignedProjects: ProjectId[];
  assignedTasks: TaskId[];

  // Skills
  skills: string[]; // 'design', 'react', 'wordpress', etc.

  // Performance
  tasksCompleted: number;
  averageTaskTime: number;
  clientSatisfaction: number;
}
```

### Roles & Permissions (`/admin/team/roles`)

**Agency Roles**:

| Role                | Permissions                                                   |
| ------------------- | ------------------------------------------------------------- |
| **Owner**           | Full access to everything                                     |
| **Project Manager** | Manage projects, clients, assign tasks, view billing          |
| **Designer**        | View assigned projects, upload designs, comment               |
| **Developer**       | Site builder access, assigned tasks, technical implementation |
| **Content Editor**  | Edit content on client sites (no structural changes)          |

**Permission Matrix**:

```
                    Owner  PM  Designer  Developer  Editor
CRM Access          ✓      ✓   ✓         ✓          ✗
Edit Clients        ✓      ✓   ✗         ✗          ✗
Create Projects     ✓      ✓   ✗         ✗          ✗
Assign Tasks        ✓      ✓   ✗         ✗          ✗
View Billing        ✓      ✓   ✗         ✗          ✗
Edit Invoices       ✓      ✗   ✗         ✗          ✗
Site Builder        ✓      ✓   ✓         ✓          ✗
Edit Content        ✓      ✓   ✓         ✓          ✓
Team Management     ✓      ✗   ✗         ✗          ✗
```

---

## 5. Billing & Revenue (`/admin/billing`)

### Dashboard (`/admin/billing/dashboard`)

**Key Metrics**:

- Monthly Recurring Revenue (MRR)
- Project Revenue (one-time)
- Outstanding Invoices
- Payments This Month
- Revenue Forecast

**Charts**:

- Revenue trend (line chart)
- Revenue breakdown (MRR vs project)
- Client revenue contribution (pie chart)
- Payment status (donut chart)

### Invoices (`/admin/billing/invoices`)

**Features**:

- Create invoice
- Send invoice (email)
- Track invoice status (draft, sent, paid, overdue)
- Accept online payments (Stripe integration - Phase 3)
- Generate invoice PDFs
- Recurring invoice templates

**Invoice Structure**:

```typescript
interface Invoice {
  id: string;
  clientId: string;
  invoiceNumber: string; // Auto-generated (INV-2024-001)

  // Items
  lineItems: LineItem[];

  // Pricing
  subtotal: number;
  tax: number;
  total: number;

  // Status
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";

  // Dates
  issueDate: Date;
  dueDate: Date;
  paidDate: Date | null;

  // Payment
  paymentMethod: string | null;
  paymentReference: string | null;

  // Notes
  notes: string;
  termsAndConditions: string;
}
```

### Payments (`/admin/billing/payments`)

**Track**:

- Payment received
- Payment method
- Associated invoice
- Date received
- Reference/transaction ID

### Reports (`/admin/billing/reports`)

**Available Reports**:

- Revenue by month
- Revenue by client
- Revenue by project type
- Outstanding receivables
- Profit & loss (with expense tracking)

**Export Options**:

- PDF
- CSV
- Excel

---

## 6. Site Builder Integration (`/admin/site/[clientId]`)

**Purpose**: Build and manage client websites from agency perspective

**Access**:

- Click client in directory
- "Manage Sites" → Select site → Opens builder
- Or direct URL: `/admin/site/demo-store/builder`

**Features**:

- Full access to client's site (as if you were them)
- Visual page builder
- Component library
- Template system
- Deploy controls

**Separate from client portal** - This is YOUR view to work on THEIR site.

See: [Website Builder Documentation](./site-builder.md)

---

## Navigation Structure

```
/admin
├── CRM
│   ├── Dashboard
│   ├── Projects
│   ├── Pipeline
│   └── Calendar
├── Clients
│   ├── Directory
│   └── [Client Profile]
├── Intake
│   ├── Active Workflows
│   └── Form Templates
├── Team
│   ├── Members
│   ├── Roles
│   └── Workload
├── Billing
│   ├── Dashboard
│   ├── Invoices
│   ├── Payments
│   └── Reports
└── Account
    └── Settings
```

---

## Workflows

### New Client → Launch Workflow

```
1. Lead enters Pipeline
2. Proposal sent & won
3. Create Client record
4. Start Intake workflow
5. Create Project
6. Assign team members
7. Break down into tasks
8. Execute project (design → dev → review)
9. Build site in Site Builder
10. Client review & feedback
11. Launch site
12. Mark project complete
13. Transition to maintenance/MRR
```

---

## Future Enhancements

- **Email Integration** - Sync client emails to communication log
- **Time Tracking** - Detailed time tracking per task
- **Client Portal Integration** - Client can view project progress
- **Proposal Builder** - Create proposals from templates
- **Contract Management** - E-signature integration
- **Reporting Dashboard** - Advanced analytics
- **Mobile App** - iOS/Android for on-the-go access

---

## Next Steps

- [Client Intake System Details](./intake.md)
- [CRM Implementation Guide](./crm.md)
- [Billing System Details](./billing.md)
- [Team & Permissions](../architecture/auth-permissions.md)
