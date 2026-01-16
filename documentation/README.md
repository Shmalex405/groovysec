# Whiteout AI Documentation Site

This is the documentation site for Whiteout AI, deployed at `docs.groovysec.com`.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for development and bundling
- **Tailwind CSS** for styling
- **React Router** for client-side routing
- **React Markdown** with syntax highlighting

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
docs-site/
├── public/
│   ├── content/           # Markdown documentation files
│   │   ├── integrations/  # Data integration guides
│   │   └── sso-providers/ # SSO provider guides
│   └── favicon.svg
├── src/
│   ├── components/        # React components
│   │   ├── Layout.tsx
│   │   └── Sidebar.tsx
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx
│   │   └── DocPage.tsx
│   ├── lib/               # Utilities and config
│   │   ├── navigation.ts
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

## Adding New Documentation

1. Create a new `.md` file in `public/content/` (or appropriate subdirectory)
2. Add an entry to `src/lib/navigation.ts`
3. The page will be automatically available at the configured route

## Deployment

The site can be deployed to any static hosting:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect to Git repository
- **GitHub Pages**: Build and deploy `dist/` folder

For the subdomain `docs.groovysec.com`:
1. Deploy to your hosting provider
2. Configure DNS CNAME record to point to hosting
3. Enable HTTPS
