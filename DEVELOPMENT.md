# Development Configuration

## Environment Setup

1. **Supabase Configuration**
   - Create a new project at https://supabase.com
   - Copy your project URL and anon key
   - Update `js/config.js` with your credentials

2. **Database Setup**
   - Run the SQL schema from `README.md` in your Supabase SQL editor
   - Configure Row Level Security policies as needed
   - Set up authentication providers (email, Google OAuth)

3. **Local Development**
   ```bash
   # Start local server (choose one)
   python -m http.server 8000    # Python
   npx serve .                   # Node.js
   php -S localhost:8000         # PHP
   ```

4. **Access the App**
   - Open http://localhost:8000 in your browser
   - Test authentication and basic functionality

## Development Workflow

1. Make changes to the code
2. Refresh the browser to see changes
3. Use browser dev tools for debugging
4. Test on mobile devices for responsive design
5. Test PWA installation features

## Deployment

### Netlify (Recommended)
1. Connect your Git repository to Netlify
2. Set build command: (none)
3. Set publish directory: `/`
4. Deploy!

### Manual Deployment
1. Upload all files to your web server
2. Ensure HTTPS is enabled (required for PWA)
3. Configure proper MIME types for .json and .js files

## Testing Checklist

- [ ] Authentication (email/password, Google OAuth)
- [ ] Dashboard loading and filtering
- [ ] Circle Leader profile pages
- [ ] Communication and note creation (ACD role)
- [ ] Reports generation (ACD role)
- [ ] User profile management
- [ ] PWA installation
- [ ] Offline functionality
- [ ] Dark/light mode switching
- [ ] Mobile responsiveness

## Security Considerations

- Configure Supabase RLS policies appropriately
- Use HTTPS in production
- Validate user roles and permissions
- Sanitize user inputs (especially rich text)
- Regular security updates for dependencies

## Performance Optimization

- Minimize HTTP requests
- Optimize images and icons
- Use service worker caching effectively
- Lazy load non-critical resources
- Monitor bundle size and loading performance
