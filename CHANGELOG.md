# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2025-11-19

### Added - API

#### Site Configuration Module

- Created comprehensive `site-config` module for managing tenant-level configuration
- **DTOs Created:**
  - `HeaderConfigDto` - Header layout, navigation, actions, and behavior
  - `FooterConfigDto` - Footer columns, social links, copyright, and contact info
  - `MenusConfigDto` - Multi-level menu structure with featured items
  - `LogosConfigDto` - Logo library (SVG, image, and text logos)
  - `SiteConfigDto` - Combined configuration for all site elements

- **Endpoints:**

  ```
  GET/PUT  /api/tenants/:tenantId/config         # Full config
  GET/PUT  /api/tenants/:tenantId/config/header  # Header only
  GET/PUT  /api/tenants/:tenantId/config/footer  # Footer only
  GET/PUT  /api/tenants/:tenantId/config/menus   # Menus only
  GET/PUT  /api/tenants/:tenantId/config/logos   # Logos only
  ```

- **Features:**
  - Full type validation using class-validator
  - Nested validation for complex structures
  - CRUD operations for each config section
  - Integrated with existing Tenant JSONB columns

#### Block Validation System

- Extended Pages module with comprehensive block DTOs
- **Content Block DTOs:**
  - `HeadingBlockDto` - Text headings (h1-h6) with size, alignment, weight
  - `TextBlockDto` - Paragraph text with formatting options
  - `ButtonBlockDto` - CTA buttons with variants and sizes
  - `ImageBlockDto` - Images with captions, lazy loading, object-fit
  - `LogoBlockDto` - Logo references from logo library
  - `RichTextBlockDto` - Rich text content (TipTap/HTML)

- **Container Block DTOs:**
  - `GridBlockDto` - CSS Grid with responsive columns
  - `FlexBlockDto` - Flexbox with direction, wrap, gap controls
  - `StackBlockDto` - Simplified vertical stacking

- **Section & Validation:**
  - `SectionDto` - Top-level layout wrapper with background, spacing, width
  - `MaxNestingDepth` validator - Enforces 4-level max nesting
  - `UniqueBlockKeys` validator - Ensures unique keys across all blocks

- **Page Structure Update:**
  - Changed from flat `blocks[]` to structured `sections[]`
  - Each section contains blocks with proper nesting validation
  - Updated `CreatePageDto` and `UpdatePageDto`
  - Updated `PagesService` to handle section-based content

### Changed - API

- Registered `SiteConfigModule` in `app.module.ts`
- Updated Pages service to use `sections` instead of flat `blocks`
- Enhanced content validation with custom validators

### Technical Details

#### Database Schema

- Leverages existing Prisma JSONB columns on Tenant model:
  - `headerConfig` → stores header configuration
  - `footerConfig` → stores footer configuration
  - `menusConfig` → stores menu structures
  - `logosConfig` → stores logo library

#### Validation Strategy

- Discriminated union validation for block types
- Recursive validation for nested container blocks
- Type-safe DTOs with class-validator decorators
- Custom validators for business rules (nesting, uniqueness)

#### Architecture Compliance

- Follows NestJS best practices
- Modular design with clear separation of concerns
- Comprehensive type safety throughout
- Ready for Builder integration

## Status Summary

### ✅ Completed

- API module cleanup (e-commerce/CRM modules already removed)
- Site configuration CRUD module with full validation
- Block validation system with 9+ block types
- Section-based page structure
- Custom validators (nesting depth, unique keys)
- API compiles and builds successfully

### 📦 Ready for Next Phase

- Builder application setup
- TanStack Query integration
- Block editor UI development
- Real-time preview system

### 🎯 Next Steps

1. Initialize Builder with Next.js 15 + TypeScript
2. Set up TanStack Query for API communication
3. Build basic UI (login, tenants list, pages list)
4. Create block editor with form-based editing
5. Implement site config management UI

---

**Built with enterprise standards by Claude Code**
