<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# RADIUS Web App Development Instructions

## Project Overview
RADIUS is a Progressive Web App (PWA) for Valley Creek Church staff to track Circle Leader interactions. Built with vanilla JavaScript, HTML5, Tailwind CSS, and Supabase backend.

## Key Technologies
- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript (NO frameworks like React)
- **Backend**: Supabase (database & authentication)
- **Hosting**: Netlify
- **PWA**: Service Worker, Web App Manifest

## Development Guidelines

### Code Style
- Use vanilla JavaScript ES6+ features
- No external frameworks (React, Vue, etc.)
- Use Tailwind CSS for all styling
- Follow mobile-first responsive design
- Support light and dark mode

### File Structure
- `/js/` - Core JavaScript modules
- `/pages/` - Page-specific modules (ES6 modules)
- `/icons/` - PWA icons
- `index.html` - Main HTML entry point
- `manifest.json` - PWA manifest
- `sw.js` - Service worker

### Authentication & Permissions
- **ACD Role**: Full read/write access, can access reports
- **Viewer Role**: Read-only access, no reports
- Use Supabase Auth with email/password and Google OAuth

### Database Schema (Supabase)
Key tables:
- `users` - User profiles and roles
- `circle_leaders` - Circle leader information
- `communications` - Communication tracking
- `notes` - Freeform notes and follow-ups

### UI/UX Requirements
- Mobile-first design
- Dark/light mode support
- Accessible markup (ARIA labels, semantic HTML)
- Rich text editing (contenteditable)
- Progressive Web App features

### Business Logic
- Only 1 connection counted per Circle Leader per month
- Communication types: One-on-one, Circle Visit, Circle Leader Equipping, Text, Phone Call, In Passing
- Follow-up system with date tracking
- Export functionality to Excel

## Important Rules
1. **Never use React, Vue, or other frameworks** - Pure vanilla JavaScript only
2. **Always use Tailwind CSS** - No custom CSS files
3. **Follow the PRD specifications exactly** - Don't deviate from requirements
4. **Mobile-first approach** - Design for mobile screens first
5. **Maintain PWA compliance** - Service worker, manifest, offline support

## Module Pattern
Each page is an ES6 module with:
- `render()` method returning HTML string
- `init()` method for setup and event listeners
- `cleanup()` method for teardown
- Class-based structure

## Common Patterns
- Use `window.router.navigate()` for navigation
- Use `window.authManager` for authentication
- Use `window.utils` for utility functions
- Use `supabase` client for database operations
- Use Tailwind responsive classes (sm:, md:, lg:, xl:)
- Use dark mode classes (dark:)

When making changes:
1. Consider mobile responsiveness
2. Test in both light and dark modes
3. Ensure proper error handling
4. Follow the existing code patterns
5. Update documentation if needed
