# Hub Dashboard Tasks

## Phase 1: Database & Email Infrastructure
- [x] Add `VerificationToken` model to `schema.prisma` for email invitations.
- [x] Run `npx prisma generate`.
- [x] Create `src/lib/email/mailer.ts` and configure `nodemailer` using Titan Email env vars.
- [x] Create an HTML email template function for the invitation.

## Phase 2: Global Hub Protection & Layout
- [x] Create `src/app/hub/layout.tsx` with a superadmin role check (redirect to `/login` if not authorized).
- [x] Build a basic navigation sidebar for the Hub (Tenants, Settings, Analytics).

## Phase 3: Tenant Data View
- [x] Create `src/app/hub/page.tsx`.
- [x] Implement Prisma query to fetch all tenants.
- [x] Build a data table to display tenants (Name, Subdomain, Status, Created).

## Phase 4: Tenant Creation & Form Actions
- [x] Create `src/app/hub/tenants/create/page.tsx` and `src/components/hub/TenantForm.tsx`.
- [x] Implement `react-hook-form` with `zod` for subdomain validation (alphanumeric, no spaces).
- [x] Include Feature Flag toggles (CRM, Ecommerce, Blog) in the form UI.
- [x] Create `src/actions/tenant.ts` with the `createTenant` Server Action.
- [x] Connect the action to Prisma to create the Tenant and User simultaneously.
- [x] Integrate `mailer.ts` into the action to send the welcome email upon successful creation.

## Phase 5: Verification & Testing
- [ ] Manually test tenant creation flow.
- [ ] Verify email arrives in the inbox.
- [ ] Confirm feature flags are properly nested in the `config` JSONB column.
