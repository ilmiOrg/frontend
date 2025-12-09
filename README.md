# UniversityMatch

Find your perfect university with AI-powered matching, scholarships, and expert guidance.

## 🚀 Quick Start

   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm start
   ```

The app will open at `http://localhost:3000`

## 🔑 Login

To access the dashboard:

1. Open browser console (F12)
2. Run:
```javascript
localStorage.setItem('isAuthenticated', 'true');
location.reload();
```

## ✨ Features

### Main Features
- 🏠 **Dashboard** - Track your university journey
- 🌟 **Dream University** - Set and pursue your dream school
- 🔍 **Search Universities** - Find your perfect match
- 💰 **Search Scholarships** - Discover funding opportunities

### AI & Matching
- 🎯 **AI University Matching** - Personalized recommendations
- 🎯 **Scholarship Matching** - Find scholarships for you
- 👥 **Similar Students** - Connect with peers

### Application Management
- 📅 **Application Timeline** - Track deadlines
- 📄 **My Documents** - Manage your files

### Community
- 👫 **Connect Friends** - Build your network
- 🎓 **Alumni Mentors** - Get guidance from alumni
- 📚 **Study Together** - Join study groups

### Career Development
- 💼 **Internships** - Find opportunities
- 💼 **Masters Programs** - Explore graduate schools
- 📊 **Career Analysis** - Plan your future

### Premium Services
- 📝 **Essay Reviews** - Professional feedback
- 🎤 **Mock Interviews** - Practice with experts
- 🎩 **Concierge Support** - 24/7 personalized help
- 📤 **Premium Membership** - Get exclusive access

### Learning
- 📝 **Courses** - SAT, TOEFL prep
- 🔢 **Math** - Master mathematics
- 📚 **English** - Improve language skills
- ✍️ **Essay Writing** - Write compelling essays
- 🤖 **AI Literacy** - Learn about AI

## 🏗️ Tech Stack

- **React** - UI framework
- **React Router** - Navigation
- **CSS Modules** - Scoped styling
- **Chart.js** - Data visualization
- **Voiceflow** - AI chatbot

## 📁 Project Structure

```
src/
├── logged-in/          # Authenticated app
│   ├── pages/          # All feature pages
│   ├── shared/         # Shared components
│   └── layout/         # Layout components
├── logged-out/         # Public pages
├── contexts/           # React contexts
├── styles/             # Global styles
└── App.js             # Main app & routes
```

## 🎨 Design System

All styles use CSS variables from `/src/styles/variables.css`:
- Colors: `--ownGreen`, `--ownBlue`, `--ownPurple`
- Spacing: `--spacing-xs` to `--spacing-3xl`
- Fonts: `--regularTextFont`, `--headlineFont`

## 🌐 Available Routes

### Main
- `/dashboard` - Main dashboard
- `/dream-university` - Dream university tracker
- `/search/universities` - Search universities
- `/search/scholarships` - Search scholarships
- `/study-together` - Study groups
- `/university-reels` - University videos

### Applications
- `/applications/timeline` - Application timeline
- `/applications/documents` - Document manager

### AI Matching
- `/ai/match-universities` - AI university matching
- `/ai/match-scholarships` - AI scholarship matching
- `/ai/similar-students` - Find similar students

### Community
- `/community/friends` - Connect with friends
- `/community/mentors` - Find alumni mentors

### Career
- `/career/internships` - Internship matching
- `/career/masters` - Masters program matching
- `/career/analysis` - Career path analysis

### Premium
- `/premium/essay-reviews` - Essay review service
- `/premium/mock-interviews` - Mock interview practice
- `/premium/concierge` - Concierge support
- `/contact-premium` - Get premium access

### Learning
- `/courses` - All courses
- `/courses/math` - Math courses
- `/courses/english` - English courses
- `/courses/essay-writing` - Essay writing
- `/courses/ai-literacy` - AI literacy

### Privacy
- `/privacy` - Privacy dashboard

## 🎯 Performance

- ✅ Smooth 60fps scrolling
- ✅ Optimized animations with GPU acceleration
- ✅ Responsive design (mobile-first)
- ✅ Fast page loads with code splitting

## 📝 License

Private project - All rights reserved

## 🤝 Support

For issues or questions, contact: support@universitymatch.com

---

**Made with ❤️ by the Quad Team**
