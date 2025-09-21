# 🤖 AI Learning Tool

A Duolingo-inspired web development learning platform powered by AI. Master HTML, CSS, and JavaScript through interactive lessons, gamification, and personalized AI-generated content.

## ✨ Features

### 🎯 **Core Learning Tracks**
- **HTML Track**: Learn semantic markup, accessibility, and modern HTML5 features
- **CSS Track**: Master layouts, animations, responsive design, and CSS Grid/Flexbox
- **JavaScript Track**: Build interactive websites with functions, DOM manipulation, and ES6+

### 🤖 **AI-Powered Features**
- **AI Custom Track**: Generate personalized quizzes on any coding topic
- **Smart Question Generation**: AI creates questions based on your chosen topic and difficulty
- **Intelligent Code Analysis**: Get AI feedback on your code with improvement suggestions

### 🎮 **Gamification**
- **XP System**: Earn experience points for correct answers
- **Level Progression**: Advance through coding levels with achievements
- **Daily Streaks**: Maintain learning streaks with daily goals
- **Progress Tracking**: Visual progress bars and completion statistics

### 🎨 **Beautiful UI/UX**
- **Duolingo-Inspired Design**: Familiar, engaging interface
- **Smooth Animations**: Polished transitions and micro-interactions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Track-Specific Themes**: Color-coded learning experiences

## 🚀 **Getting Started**

### Prerequisites
- Node.js 16+ 
- npm or yarn
- OpenAI API Key (optional, for real AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CydVilla/ai-learning-tool.git
   cd ai-learning-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser** to `http://localhost:3000`

## 🔧 **Available Scripts**

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run deploy` - Deploy to GitHub Pages
- `npm run lint` - Check code quality
- `npm run type-check` - Run TypeScript checks

## 🌐 **Deployment**

### GitHub Pages
```bash
npm run deploy
```

### Heroku
1. Create a Heroku app
2. Connect your GitHub repository
3. Enable automatic deploys from main branch

### Other Platforms
The build output in `/build` can be deployed to any static hosting service.

## 🛠 **Tech Stack**

- **Frontend**: React 18, TypeScript, Styled Components
- **Routing**: React Router DOM
- **State Management**: React Context + useReducer
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Styling**: CSS-in-JS with styled-components
- **Testing**: Jest, React Testing Library
- **Build Tool**: Create React App

## 📚 **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── AI/             # AI-powered components
│   ├── Common/         # Shared components
│   ├── Gamification/   # XP, streaks, achievements
│   ├── LearningTrack/  # Track-specific components
│   └── Questions/      # Question and exercise components
├── context/            # React Context providers
├── data/               # Static question banks
├── hooks/              # Custom React hooks
├── pages/              # Route components
├── services/           # Business logic and API calls
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## 🎯 **How to Use**

1. **Choose a Learning Track**: Start with HTML, CSS, JavaScript, or create a custom AI quiz
2. **Select Difficulty**: Pick beginner, intermediate, or advanced level
3. **Answer Questions**: Interactive multiple-choice and code exercises
4. **Track Progress**: Earn XP, maintain streaks, and level up
5. **Get AI Feedback**: Use the AI Custom Track for personalized learning

## 🤖 **AI Features**

### AI Custom Track
- Choose any programming topic (e.g., "React hooks", "CSS animations", "JavaScript promises")
- Select question count (3-20 questions)
- Get personalized quiz with explanations
- Track progress and earn XP

### AI Code Analysis
- Paste your HTML, CSS, or JavaScript code
- Get scores for readability, efficiency, and correctness
- Receive specific improvement suggestions
- Learn best practices through AI feedback

## 🔐 **Environment Variables**

Create a `.env` file in the root directory:

```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: For production deployment, set environment variables in your hosting platform's dashboard.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- Inspired by Duolingo's gamified learning approach
- Powered by OpenAI's GPT models
- Built with modern React and TypeScript best practices

## 🐛 **Known Issues**

- OpenAI API calls from browser require CORS proxy for production
- Some advanced AI features use mock responses in demo mode
- Mobile responsiveness optimized for modern devices

## 📞 **Support**

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/CydVilla/ai-learning-tool/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

---

**Happy Learning! 🚀**