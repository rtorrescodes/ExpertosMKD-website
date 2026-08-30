# Hub Dashboard & Tenant Management Specification

## 1. Executive Summary
This feature introduces the global `/hub` dashboard, which acts as the central command center for the Celeritas platform administrators. It provides a visual interface to manage all tenant sites (agencies, restaurants, portfolios), create new tenants, configure their core settings (feature flags), and invite users via email to manage their respective sites.

## 2. Problem Statement
Currently, Celeritas has a foundational multi-tenant data architecture and middleware, but lacks a user interface to provision and manage these tenants. Without a global administration dashboard, creating new customer instances and assigning feature modules (like CRM, E-commerce, or Blog) requires manual database manipulation, which is slow, error-prone, and unscalable for the Expertos MKD team.

## 3. Target Audience
- **Super Administrators (Expertos MKD Team)**: Users who provision new SaaS instances, manage subscriptions, enable/disable feature flags, and provide support.
- **Tenant Owners (Clients)**: The end clients who will receive an email invitation to claim and access their newly created tenant dashboard.

## 4. Success Criteria
- Super administrators can view a paginated/searchable list of all active and inactive tenants.
- Super administrators can successfully provision a new tenant through a web form, automatically generating the required subdomains and database records.
- The system successfully sends an invitation email containing a secure magic link or initial setup token to the tenant owner.
- Super administrators can toggle global feature flags (e.g., E-commerce, CRM, Reservations) on a per-tenant basis, and these flags correctly persist in the database.

## 5. User Scenarios / Use Cases
- **Scenario A: Provisioning a new client**
  As an admin, I receive payment from a new client. I log into the `/hub`, click "Create Tenant", enter the client's business name, desired subdomain, and email. I select the "CRM" and "Landing Page" feature flags. Upon saving, the system creates the tenant and sends an invite email to the client.
- **Scenario B: Disabling a module**
  As an admin, a client cancels their E-commerce add-on. I locate the client in the `/hub`, edit their feature flags, and toggle off "E-commerce". The client's site immediately hides all e-commerce functionality.
- **Scenario C: Client accepts invitation**
  As a client, I click the link in my welcome email, set my permanent password, and am redirected to my specific tenant dashboard to begin managing my site.

## 6. Functional Requirements
- **Tenant Listing**: A data table displaying `name`, `subdomain`, `status` (active/suspended), and `createdAt`.
- **Tenant Creation Form**: Input fields for `name`, `subdomain` (must be unique and alphanumeric), and `ownerEmail`.
- **Feature Flag Toggles**: A UI to visually enable/disable predefined JSON feature flags (e.g., `hasCrm`, `hasEcommerce`) tied to the tenant's configuration.
- **Email Dispatcher**: Integration with Titan Email SMTP (using `nodemailer` or similar) to send templated invitation emails to `ownerEmail`.
- **Global Protection**: The `/hub` route must be strictly protected by NextAuth, ensuring only users with the `SUPERADMIN` role can access it.

## 7. Assumptions & Out of Scope
- **Assumptions**: 
  - The SMTP server (Titan Email) is configured and allows sending transactional emails.
  - The base Next.js middleware is already correctly routing `*.celeritas.local` or standard subdomains to the tenant views.
- **Out of Scope**: 
  - Billing and automatic Stripe subscription management (handled in a future phase).
  - Advanced analytics per tenant in the hub (only basic metadata will be shown for now).
