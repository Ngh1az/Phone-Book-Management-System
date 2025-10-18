# Requirement Analysis Form

1. Project Name:

    Phone Book Management System

2. Objective / Purpose:

    Provide a modern, secure, and user-friendly contact management application that allows authenticated users to create, organize, search, and manage personal and business contacts. The system supports groups and tags for organization, avatar uploads, favorites, soft deletes with recovery, and policy-based access control. The app is built to be performant, responsive, and production-ready for individual users or small teams.

3. Stakeholders / Users:
    - End users (people who store and manage contacts in their private phonebook)
    - Administrators / system operators (manage deployments, backups, database)
    - Developers / maintainers (extend, fix, and deploy the application)
    - QA / Testers (validate functionality and security)

4. Functional Requirements:
    - User authentication: registration, login, logout.
    - Account security: email verification, password reset, two-factor authentication (2FA).
    - User isolation: each user sees and manages only their own contacts, groups, and tags.
    - Contact management: full CRUD (Create, Read, Update, Delete) for contacts.
    - Rich contact fields: first name, last name, phone number, email, company, job title, birthday, address, notes.
    - Avatar upload and preview for contacts; persistent storage via Laravel storage (public storage link).
    - Soft deletes for contacts, groups, and tags with the ability to recover deleted records.
    - Groups: CRUD operations, color and description metadata, list contacts by group.
    - Tags: CRUD operations, color metadata, many-to-many association between contacts and tags.
    - Favorites: mark/unmark contacts as favorites and list/filter favorites.
    - Search and filter: case-insensitive search across names, phone numbers, emails, company; filters by group, tag, and favorites; smart pagination preserving filters.
    - Policy-based authorization for resource access and actions (ContactPolicy, GroupPolicy, TagPolicy).
    - Web routes and authenticated dashboard: standard web UI served via Inertia + React.
    - Soft, fast UI behaviors: toast notifications, loading states, dark/light mode support.

5. Non-Functional Requirements:
    - Performance: optimized queries, eager loading of relationships where appropriate, and 20+ strategic DB indexes; target fast response times for common queries.
    - Scalability: design supports growth of contacts and concurrent users; backend built on Laravel with standard scaling patterns.
    - Security: enforce authentication and verification, 2FA support, authorization policies, hashed passwords, secure file uploads, and per-user isolation of data.
    - Reliability & Availability: database migrations and seeders for reproducible environments; CI-friendly scripts and automated tests.
    - Maintainability: clean code organization (Laravel MVC), model scopes and factories for tests; documented scripts in composer and package.json.
    - Usability & Accessibility: responsive UI for mobile/tablet/desktop, clear validation and error messages, language support (Vietnamese UI available), consistent UX patterns.
    - Testability: automated tests included (model, feature, unit); aim for passing test suite before releases.
    - Build & Deploy: Vite-based frontend build; reasonable build times (~5s reported in README); support for development hot-reload and production build.

6. Constraints:
    - Platform & runtime:
        - PHP 8.4+ (composer and Laravel 11+ / composer.json indicates Laravel 12 in some metadata but README notes Laravel 11 — target PHP 8.4+ and Laravel 11/12 compatibility).
        - Node.js 22+ for frontend build (React + TypeScript + Vite).
        - MySQL 8.0+ or SQLite 3 supported (project provides SQLite database for local testing).
    - Required tools: Composer, npm (or yarn), and CLI access to run artisan commands.
    - Storage: must run `php artisan storage:link` for avatar uploads to work (public storage needed).
    - Environment: .env configuration required (app key, database credentials). Default example and setup scripts provided in composer.json and README.
    - Licensing: MIT (open source) — impacts distribution and usage.
    - Localisation: primary UI includes Vietnamese translations; additional languages require work.

---

Notes:

- Source: repository README, route definitions, model definitions (Contact, Group, Tag, User), and composer.json.
- If you want a shorter executive-summary version or a printable PDF, tell me and I will generate it.
