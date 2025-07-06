# CraftlyCV - AI-Powered Resume & Cover Letter Generator

![CraftlyCV Logo](./public/logo.png)

**CraftlyCV** is an intelligent job application assistant that helps job seekers create tailored resumes and cover letters from a single professional profile. Using AI technology, it generates ATS-optimized documents that are perfectly matched to specific job requirements.

## 🚀 Features

- **Single Profile, Multiple Applications**: Build your profile once, generate unlimited tailored documents
- **AI-Powered Content Generation**: Uses Google Gemini Pro for intelligent content creation
- **ATS Optimization**: Ensures your resume passes Applicant Tracking Systems
- **Match Scoring**: Analyzes how well your profile matches job requirements
- **Professional Templates**: Modern, recruiter-approved resume designs
- **Application Tracking**: Keep track of all your job applications in one place
- **PDF Export**: Download professional PDFs ready for submission
- **Real-time Analytics**: Track your application success rates

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Functions, Hosting)
- **AI**: Google Gemini Pro API
- **PDF Generation**: Puppeteer
- **Authentication**: Firebase Auth (Google OAuth)
- **Database**: Firestore (NoSQL)
- **Hosting**: Firebase Hosting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/craftlycv.git
cd craftlycv
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - Authentication (Google provider)
   - Firestore Database
   - Cloud Functions
   - Hosting
   - Storage

3. Install Firebase CLI and login:
```bash
npm install -g firebase-tools
firebase login
```

4. Initialize Firebase in your project:
```bash
firebase init
```

### 4. Environment Variables

1. Copy the environment template:
```bash
cp .env.local.example .env.local
```

2. Update `.env.local` with your configuration:
```env
# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CraftlyCV

# Firebase Functions URL (for production)
NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL=https://us-central1-your-project.cloudfunctions.net
```

### 5. Get Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── dashboard/         # Dashboard pages
├── components/
│   ├── ui/                # Reusable UI components
│   ├── features/          # Feature-specific components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── common/            # Common components
├── contexts/              # React contexts
│   └── AuthContext.tsx   # Authentication context
├── hooks/                 # Custom React hooks
├── lib/                   # Core libraries
│   └── firebase.ts       # Firebase configuration
├── services/              # API services
├── types/                 # TypeScript definitions
│   └── index.ts          # Main type definitions
├── utils/                 # Utility functions
└── styles/               # CSS files
    └── globals.css       # Global styles
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run firebase:emulators` - Start Firebase emulators
- `npm run firebase:deploy` - Deploy to Firebase

## 🎨 Design System

### Colors

```css
--primary-navy: #1C2B39
--pen-blue: #0D4D7A
--soft-bg: #F7F9FA
--dark-text: #1C1C1C
--success-green: #27AE60
--warning-red: #E74C3C
```

### Typography

- **Headings**: Poppins (Google Fonts)
- **Body**: Inter (Google Fonts)
- **Code**: Fira Code (Google Fonts)

## 🔐 Security

- Firebase Security Rules are configured for user data protection
- Environment variables are used for sensitive configuration
- Input validation and sanitization on all forms
- Rate limiting on AI API calls
- HTTPS enforced in production

## 📊 Analytics

The application tracks the following events:

- User signup and authentication
- Profile completion percentage
- Resume and cover letter generation
- PDF downloads
- Application creation and status updates

## 🚀 Deployment

### Firebase Hosting

1. Build the project:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy
```

### Environment-Specific Deployment

- **Development**: `firebase use development && firebase deploy`
- **Staging**: `firebase use staging && firebase deploy`
- **Production**: `firebase use production && firebase deploy`

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📈 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Bundle Size**: Optimized with tree-shaking and code splitting
- **Caching**: Aggressive caching strategy for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write TypeScript with strict type checking
- Add tests for new features
- Update documentation as needed
- Follow the component structure guidelines

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [documentation](./docs/)
2. Search [existing issues](https://github.com/yourusername/craftlycv/issues)
3. Create a [new issue](https://github.com/yourusername/craftlycv/issues/new)
4. Contact support at support@craftlycv.com

## 🗺️ Roadmap

- [ ] **Phase 1**: Core functionality (Profile, AI generation, PDF export)
- [ ] **Phase 2**: Advanced templates and customization
- [ ] **Phase 3**: Application tracking and analytics
- [ ] **Phase 4**: Team collaboration features
- [ ] **Phase 5**: Mobile app development
- [ ] **Phase 6**: Integration with job boards

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Firebase](https://firebase.google.com/) for backend services
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide React](https://lucide.dev/) for icons

---

**Built with ❤️ by the CraftlyCV Team**

For more information, visit [craftlycv.com](https://craftlycv.com)