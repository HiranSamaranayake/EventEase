# Protected Route Module

## Purpose
Prevent unauthorized users from accessing protected dashboards.

## Features
- JWT token validation
- User role validation
- Customer route protection
- Organizer route protection
- Admin route protection

## Redirect Rules

No token:
→ Login Page

Wrong Role:
→ Home Page

Correct Role:
→ Dashboard