# Rynx's Vault 2.0 🎮

A modern platform for game developers to share their creations, post updates, and build a community around their projects. Built with Next.js 15, Sanity CMS, and NextAuth.

## ✨ Features

- **Game Sharing**: Upload and showcase your game projects
- **Community Building**: Follow developers and engage with their content
- **Real-time Updates**: Live content updates with Sanity
- **Search & Discovery**: Find games by title, category, or developer
- **Authentication**: Secure GitHub OAuth integration
- **Responsive Design**: Optimized for all devices
- **Accessibility**: WCAG compliant with keyboard navigation
- **SEO Optimized**: Meta tags, structured data, and social sharing

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: Sanity v3
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Spline 3D
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Sanity account
- GitHub OAuth app

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rynxs-vault-2.0.git
   cd rynxs-vault-2.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Authentication
   AUTH_SECRET=your-auth-secret-here
   GITHUB_ID=your-github-oauth-app-id
   GITHUB_SECRET=your-github-oauth-app-secret

   # Sanity
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your-sanity-api-token

   # Optional
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   GOOGLE_SITE_VERIFICATION=your-google-verification-code
   ```

4. **Sanity Setup**
   ```bash
   # Install Sanity CLI globally
   npm install -g @sanity/cli

   # Login to Sanity
   sanity login

   # Deploy your schema
   sanity deploy
   ```

5. **Generate TypeScript types**
   ```bash
   npm run typegen
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
rynxs-vault-2.0/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── game/              # Game-related pages
│   ├── user/              # User profile pages
│   ├── studio/            # Sanity Studio
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── lib/                  # Utility functions
├── sanity/               # Sanity CMS configuration
│   ├── schemaTypes/      # Content schemas
│   └── lib/              # Sanity utilities
└── public/               # Static assets
```

## 🎨 Customization

### Styling
The project uses Tailwind CSS with custom CSS variables. Main colors are defined in `app/globals.css`:

```css
:root {
  --color-primary: #9ec6f3;
  --color-primary-100: #ffe8f0;
  --color-secondary: #f8efef;
  --color-third: rgb(255, 255, 255);
}
```

### Content Schema
Modify content types in `sanity/schemaTypes/` and regenerate types:
```bash
npm run typegen
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typegen` - Generate Sanity TypeScript types

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security

- Environment variables for sensitive data
- NextAuth.js for secure authentication
- Sanity CORS configuration
- Input validation and sanitization

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Reduced motion preferences

## 📱 Performance

- Next.js Image optimization
- Lazy loading for components
- Code splitting
- Static generation where possible
- CDN caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Sanity](https://sanity.io/) for the headless CMS
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Vercel](https://vercel.com/) for hosting and deployment

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](../../issues) page
2. Create a new issue with a detailed description
3. Join our community discussions

---

Made with ❤️ by the Rynx's Vault team
