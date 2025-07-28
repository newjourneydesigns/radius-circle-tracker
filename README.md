# RADIUS - Circle Leader Tracker

A Progressive Web App (PWA) for Valley Creek Church staff to track and manage interactions with Circle Leaders.

## 🌟 Features

- **Dashboard** - View all Circle Leaders with status, follow-ups, and progress tracking
- **Circle Leader Profiles** - Detailed views with communication history and notes
- **Communication Tracking** - Log various types of interactions with rich text notes
- **Follow-up System** - Schedule and track follow-ups with Circle Leaders
- **Reports** - Monthly summaries for Associate Campus Directors (ACDs)
- **Excel Import** - Upload .xlsx files to quickly add Circle Leaders (Admin only)
- **Progressive Web App** - Works offline and can be installed on mobile devices
- **Dark/Light Mode** - Automatic theme switching with manual override
- **Role-based Access** - ACD (full access) and Viewer (read-only) roles

## 🧰 Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL database + Authentication)
- **Hosting**: Netlify
- **PWA**: Service Worker, Web App Manifest
- **Authentication**: Email/Password + Google OAuth via Supabase

## 📋 Prerequisites

- Supabase account and project
- Netlify account (for deployment)
- Modern web browser with PWA support

## 🚀 Setup Instructions

### 1. Supabase Configuration

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the API settings
3. Update `/js/config.js` with your Supabase credentials:

```javascript
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY'
};
```

### 2. Database Schema

Run the following SQL in your Supabase SQL editor to create the required tables:

```sql
-- Users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'Viewer' CHECK (role IN ('Admin', 'Viewer')),
    campus TEXT,
    acpd TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Circle Leaders table
CREATE TABLE circle_leaders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Invited' CHECK (status IN ('Invited', 'In Training', 'Active', 'Paused')),
    circle_type TEXT,
    day TEXT,
    time TEXT,
    frequency TEXT,
    campus TEXT,
    acpd TEXT,
    ccb_profile_link TEXT,
    calendar_link TEXT,
    last_communication_date DATE,
    follow_up_date DATE,
    follow_up_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communications table
CREATE TABLE communications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    circle_leader_id UUID REFERENCES circle_leaders(id) ON DELETE CASCADE,
    communication_date DATE NOT NULL,
    communication_type TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table
CREATE TABLE notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    circle_leader_id UUID REFERENCES circle_leaders(id) ON DELETE CASCADE,
    note_date DATE NOT NULL,
    note TEXT,
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_leaders ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policies (adjust based on your security requirements)
CREATE POLICY "Users can read their own data" ON users FOR SELECT USING (auth.uid()::text = email);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid()::text = email);

-- Add more policies as needed for your security model
```

### 3. Authentication Setup

1. In Supabase, go to Authentication > Settings
2. Enable email/password authentication
3. For Google OAuth:
   - Go to Authentication > Settings > Auth Providers
   - Enable Google provider
   - Add your Google OAuth credentials

### 4. Local Development

1. Clone this repository
2. Open `index.html` in a web browser or use a local server
3. For development, you can use:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

### 5. Deployment to Netlify

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Connect your repository to Netlify
3. Set build settings:
   - Build command: (none needed)
   - Publish directory: `/` (root)
4. Deploy!

## 📱 PWA Installation

Users can install RADIUS as a PWA on their devices:

1. Open the app in a supported browser
2. Look for the "Install" prompt or use browser menu > "Install RADIUS"
3. The app will be available as a standalone application

## 👥 User Roles

### ACD (Associate Campus Director)
- Full read/write access to all Circle Leader records
- Can add, edit, and delete communications and notes
- Access to Reports page
- Can export data to Excel
- Can filter by campus and ACPD

### Viewer
- Read-only access to all data
- Cannot modify any records
- No access to reports or export functionality

## 🎨 Customization

### Theming
The app supports light and dark modes automatically based on system preferences. Users can manually toggle themes using the theme button in the navigation.

### Branding
- Update the app name in `manifest.json` and throughout the codebase
- Replace icons in the `/icons/` directory with your organization's branding
- Modify colors in the Tailwind configuration in `index.html`

## 🔧 Development

### File Structure
```
/
├── index.html              # Main HTML file
├── manifest.json          # PWA manifest
├── sw.js                  # Service worker
├── js/
│   ├── app.js            # Main application logic
│   ├── auth.js           # Authentication manager
│   ├── config.js         # Configuration and Supabase setup
│   └── router.js         # Client-side routing
├── pages/
│   ├── login.js          # Login page
│   ├── dashboard.js      # Dashboard page
│   ├── profile.js        # Circle Leader profile page
│   ├── reports.js        # Reports page (ACD only)
│   └── user-profile.js   # User profile page
├── icons/                # PWA icons
└── .github/
    └── copilot-instructions.md
```

### Key Features

1. **Single Page Application (SPA)** - Client-side routing with vanilla JavaScript
2. **Responsive Design** - Mobile-first approach with Tailwind CSS
3. **Offline Support** - Service worker caches essential resources
4. **Rich Text Editing** - Native contenteditable with formatting support
5. **Real-time Data** - Supabase real-time subscriptions (can be added)

## 📂 Importing Excel Data

Admins can bulk add Circle Leaders by navigating to `/import` from the menu. Upload a `.xlsx` file, map each column to the desired database field, preview the rows, and click **Import** to insert the records into Supabase.

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Issues**
   - Verify your URL and anon key in `config.js`
   - Check Supabase project status
   - Ensure RLS policies are correctly configured

2. **Authentication Problems**
   - Check email/password format requirements
   - Verify Google OAuth setup if using
   - Clear browser cache and cookies

3. **PWA Installation Issues**
   - Ensure HTTPS is enabled (required for PWA)
   - Check manifest.json syntax
   - Verify service worker registration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions about RADIUS:
- Create an issue in this repository
- Contact your organization's IT department
- Review the Supabase documentation for backend issues

---

**Built with ❤️ for Valley Creek Church**
