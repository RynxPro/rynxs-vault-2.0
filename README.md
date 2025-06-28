# 🎓 Rynx's Vault 2.0

A modern, full-stack platform for game developers to share their creations, post updates, and build a vibrant community.  
**Developed as a graduation project for [Your School Name], [Year].**

---

## 📚 Project Overview

Rynx's Vault 2.0 is a social platform designed to empower indie game developers and enthusiasts. Users can upload games, share development updates, interact with others, and discover new projects.  
This project demonstrates advanced web development skills, including authentication, real-time content management, accessibility, and responsive design.

---

## ✨ Key Features

- **Game Sharing:** Upload and showcase your game projects with images and links.
- **Community Building:** Follow developers, like posts, and engage with comments.
- **Live Content:** Real-time updates powered by Sanity CMS.
- **Advanced Search:** Find games by title, category, or developer.
- **Secure Authentication:** GitHub OAuth via NextAuth.js.
- **Responsive & Accessible:** Mobile-friendly, keyboard navigation, and high-contrast support.
- **SEO Optimized:** Meta tags, Open Graph, and structured data for discoverability.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS 4
- **Backend/CMS:** Sanity v3
- **Authentication:** NextAuth.js v5 (GitHub OAuth)
- **Styling:** Tailwind CSS, CSS Variables
- **Icons:** Lucide React, React Icons
- **Deployment:** Vercel (recommended), supports Netlify, Railway, etc.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Sanity account
- GitHub OAuth app

### Installation

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
   ```

3. **Configure Environment Variables**

   - Copy `.env.example` to `.env.local` and fill in your credentials.

4. **Sanity Setup**

   ```bash
   npm install -g @sanity/cli
   sanity login
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
   Visit [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Project Structure

```
rynxs-vault-2.0/
├── app/           # Next.js App Router pages & API
├── components/    # React components (UI, layout)
├── lib/           # Utility functions
├── sanity/        # Sanity CMS config & schemas
├── public/        # Static assets
└── ...            # Config files, README, etc.
```

---

## 🎨 Customization

- **Styling:** Tailwind CSS with custom variables in `app/globals.css`
- **Content Types:** Edit schemas in `sanity/schemaTypes/` and run `npm run typegen`

---

## 🔒 Security & Accessibility

- All secrets in environment variables
- Secure authentication with NextAuth.js
- Input validation and sanitization
- WCAG 2.1 AA accessibility, keyboard navigation, screen reader support

---

## 🌐 Deployment

- **Vercel:** Push to GitHub, connect to Vercel, add env vars, deploy.
- **Other:** Netlify, Railway, DigitalOcean, AWS Amplify, etc.

---

## 🧑‍🎓 Educational Value

This project demonstrates:

- Full-stack TypeScript/React development
- Modern authentication and authorization
- Real-time CMS integration
- Responsive, accessible UI/UX
- Clean code, modular architecture, and best practices

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Sanity](https://sanity.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)
- [Code213](https://code213.tech/) for support and guidance

---

## 📞 Contact

For questions, feedback, or collaboration, please contact [your.email@domain.com].

---

**_Thank you for reviewing my graduation project!_**
