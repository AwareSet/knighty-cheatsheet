# KnightyApp Cheat Sheets 🚀

A beautiful, modern React landing page showcasing comprehensive developer cheat sheets with bilingual support (English/Arabic).

## ✨ Features

- **🎨 Beautiful Design**: Modern gradient backgrounds with glassmorphism effects
- **🔍 Smart Search**: Real-time search across all cheat sheets
- **📁 Category Filtering**: Organized by System, Development, Network, Database, DevOps, etc.
- **⭐ Featured Content**: Highlighted most popular cheat sheets
- **🌍 Bilingual Support**: All cheat sheets include Arabic translations
- **📱 Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- **⚡ Fast Performance**: Optimized React components with smooth animations

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **CSS3** - Advanced styling with custom properties
- **Inter Font** - Clean, modern typography

## 📚 Cheat Sheets Included

### 🌟 Featured
- **CLI Commands** - 50+ essential terminal commands
- **Golang** - Complete Go development workflow
- **xargs** - Parallel command execution
- **SQL** - Database queries and management
- **Networking** - Commands organized by OSI layers

### 📂 All Categories
- **System**: CLI, Bash, Find, Grep, Tar, Rsync, Cron
- **Development**: Golang, Python pip, Git
- **Network**: Networking, SSH, cURL
- **Database**: SQL
- **DevOps**: Docker, Kubernetes
- **Editor**: Vim
- **Data**: jq, AWK
- **Media**: FFmpeg, yt-dlp
- **AI**: Fabric AI, Claude CLI
- **Automation**: n8n

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Access the app**
   - Development: http://localhost:3000
   - All cheat sheets are located in `/htmls/` directory

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── LandingPage.js   # Main landing page
│   ├── Hero.js          # Hero section with terminal
│   ├── CheatSheetCard.js # Individual cheat sheet cards
│   ├── SearchBar.js     # Search functionality
│   ├── CategoryFilter.js # Category filtering
│   ├── Stats.js         # Statistics section
│   └── CheatSheetViewer.js # Individual cheat sheet viewer
├── data/
│   └── cheatsheets.js   # Cheat sheet metadata
├── App.js               # Main app component
└── index.js             # Entry point

htmls/                   # All cheat sheet HTML files
├── cli_cheat_sheet.html
├── golang_cheat_sheet.html
├── networking_cheat_sheet.html
└── ...
```

## 🎨 Design Features

- **Glassmorphism UI** - Modern frosted glass effects
- **Gradient Backgrounds** - Beautiful color transitions
- **Smooth Animations** - Hover effects and transitions
- **Interactive Terminal** - Animated terminal in hero section
- **Card-based Layout** - Clean, organized presentation
- **Advanced Search** - Search by title, description, or tags

## 📱 Responsive Design

- **Desktop**: Full-width grid layout with sidebar
- **Tablet**: Responsive grid with optimized spacing
- **Mobile**: Single column layout with touch-friendly controls

## 🌍 Bilingual Support

Every cheat sheet includes:
- **English descriptions** - Clear, concise explanations
- **Arabic translations** - RTL text support with proper styling
- **Universal commands** - Works across different locales

## 🔧 Customization

### Adding New Cheat Sheets

1. Add HTML file to `/htmls/` directory
2. Update `src/data/cheatsheets.js` with metadata:

```javascript
{
  id: 'new-cheatsheet',
  title: 'New Tool',
  description: 'Description of the tool',
  category: 'Development',
  icon: '🛠️',
  color: '#667eea',
  tags: ['tag1', 'tag2'],
  file: 'new_cheat_sheet.html',
  featured: false
}
```

### Styling

- Modify CSS custom properties in component files
- Update gradient colors in `App.css`
- Customize glassmorphism effects in individual component styles

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your hosting service
3. **Ensure HTML files** in `/htmls/` are accessible from the web server

## 📊 Performance

- **Lazy Loading** - Components load on demand
- **Optimized Images** - Efficient icon and image loading
- **Minimal Bundle** - Only necessary dependencies included
- **Fast Search** - Client-side filtering for instant results

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your cheat sheet to `/htmls/`
4. Update the metadata in `cheatsheets.js`
5. Test responsiveness and search functionality
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Inter Font** - Beautiful typography
- **React Team** - Amazing framework
- **Community** - For feedback and contributions

---

Built with ❤️ for developers who need quick, reliable command references.