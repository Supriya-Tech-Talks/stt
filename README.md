# SupriyaTechTalks Website

A modern, professional website for **SupriyaTechTalks** (YouTube: [@SupriyaTechTalks](https://youtube.com/@SupriyaTechTalks)) — AI & Automation solutions that scale.

## Tech Stack

- **React 18+** with **Vite**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Framer Motion** for animations

## Features

- Modern, professional design with smooth animations
- Responsive (mobile-first approach)
- Dark/light mode toggle
- Typography-based branding (no logo)
- Clean, minimalist aesthetic with gradient accents
- Smooth scroll to sections
- AI Search Assistant (webhook-integrated)
- Contact form with validation and webhook submission
- WCAG 2.1 AA accessibility compliance
- SEO-friendly meta tags

## Project Structure

```
supriya/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # Sticky navbar with smooth scroll
│   │   ├── Hero.jsx         # Hero section with CTAs
│   │   ├── ServicesGrid.jsx # 6 service cards
│   │   ├── AISearchBox.jsx  # AI assistant chat interface
│   │   ├── About.jsx        # Why Choose Us section
│   │   ├── ContactForm.jsx  # Contact form + info
│   │   ├── Footer.jsx       # Footer with links
│   │   ├── Button.jsx       # Reusable button
│   │   ├── Card.jsx         # Reusable card
│   │   └── Toast.jsx        # Toast notifications
│   ├── context/
│   │   ├── ThemeContext.jsx # Dark/light mode
│   │   └── ToastContext.jsx # Toast notifications
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Setup Instructions

1. **Clone or navigate to the project:**
   ```bash
   cd Supriya
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:5173`

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## Webhook Endpoints

- **Contact Form:** `POST https://n8n.srv954053.hstgr.cloud/webhook/supriya-form`  
  Body: `{ name, email, phone, service, message }`

- **AI Search:** `POST https://n8n.srv954053.hstgr.cloud/webhook/supriya-search-ai`  
  Body: `{ query: "user search query" }`

## Contact

- **Phone:** +91 63048 36880
- **Email:** contact@supriyatechtalks.com
- **YouTube:** [@SupriyaTechTalks](https://youtube.com/@SupriyaTechTalks)
