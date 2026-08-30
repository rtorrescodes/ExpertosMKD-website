# Hub Dashboard & Tenant Management Implementation Plan

## 1. Technical Approach
The implementation will utilize Next.js App Router server components for data fetching and Server Actions for data mutation, ensuring high performance and strong typing with Prisma. We will use Radix UI (shadcn/ui style) for the administrative interface components. Email dispatch will be handled via `nodemailer` connecting to the configured Titan Email SMTP credentials.

## 2. Component Architecture
- **`src/app/hub/layout.tsx`**: A protected layout ensuring only Superadmins can access child routes. Contains a sidebar/header navigation specific to the global admin.
- **`src/app/hub/page.tsx`**: The main dashboard rendering the Tenant Data Table.
- **`src/app/hub/tenants/create/page.tsx`**: The Tenant Creation Form view.
- **`src/components/hub/TenantForm.tsx`**: Client component managing the form state (using `react-hook-form` and `zod` for validation).
- **`src/components/hub/FeatureToggles.tsx`**: Switch components for enabling/disabling JSON config flags.

## 3. Data Flow & Server Actions
- **`src/actions/tenant.ts`**:
  - `createTenant(data: z.infer<typeof createTenantSchema>)`: Creates the Tenant record in Prisma, provisions an initial User record (invited state), and dispatches the invitation email.
  - `updateFeatureFlags(tenantId: string, flags: any)`: Mutates the `config` JSONB field on the Tenant model.
  - `suspendTenant(tenantId: string)`: Toggles the suspension state.

## 4. Email Integration
- **`src/lib/email/mailer.ts`**: A robust wrapper around `nodemailer` configured with:
  ```typescript
  {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  }
  ```
- **Email Templates**: A function that generates the HTML for the "Welcome to Celeritas - Set your password" email containing a unique cryptographic token (stored in the User model or a temporary Token model).

## 5. Required Database Changes (Prisma)
- The current Prisma schema already has `Tenant` and `User`. We need to ensure we have a way to handle Magic Links or Password Reset tokens for the invitation flow. We will add a `VerificationToken` model to `schema.prisma`.

## 6. Verification Plan
- **Access Control Test**: Attempt to access `/hub` logged out and logged in as a normal tenant user (should reject/redirect).
- **Creation Test**: Submit a new tenant, verify it appears in Prisma Studio, and confirm the `config` JSON correctly reflects the selected Feature Flags.
- **Email Delivery Test**: Verify that the SMTP dispatcher successfully connects to Titan Email and delivers the invitation HTML to the specified address.
