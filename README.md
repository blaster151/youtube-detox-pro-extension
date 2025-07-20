# 🔥 YouTube Detox Pro

A Chrome extension that removes distractions from YouTube, including Shorts, ads, suggested rows, and disguised Shorts. Features a floating toast for real-time statistics!

## ✨ Features

- **Ad Removal**: Automatically removes sponsored ads and ad slots
- **Shorts Filtering**: Removes Shorts shelves and disguised Shorts from search results
- **Suggestion Cleanup**: Removes "People also watched" and "Previously watched" sections
- **Real-time Stats**: Floating toast showing removal statistics
- **Configurable**: Toggle individual features on/off
- **Statistics Tracking**: Track how many elements have been removed
- **Modern UI**: Clean popup interface for settings and stats

## 🚀 Installation

### Development Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd youtube-detox-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from this project

### Production Installation

1. Download the latest release from the releases page
2. Extract the ZIP file
3. Follow steps 4-6 from the development installation

## 🛠️ Development

### Project Structure

```
youtube-detox-pro/
├── src/
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── services/        # Core business logic
│   ├── __tests__/       # Unit tests
│   ├── background.ts    # Background service worker
│   ├── content.ts       # Content script
│   └── popup.ts         # Popup script
├── dist/                # Built extension files
├── manifest.json        # Extension manifest
├── popup.html           # Popup UI
└── package.json         # Dependencies and scripts
```

### Available Scripts

- `npm run build` - Build the extension for production
- `npm run dev` - Build and watch for changes
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking

### Testing

The project includes comprehensive unit tests for all core functionality:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Building

```bash
# Production build
npm run build

# Development build with watch mode
npm run dev
```

## 🧪 Testing Strategy

This extension follows the testing principles outlined in the Chrome Extension Testing Guide:

### Unit Testing
- **Isolated Logic**: Core business logic is separated from Chrome APIs
- **Mocked APIs**: Chrome APIs are mocked using Jest
- **Type Safety**: Full TypeScript support with typed mocks
- **Coverage**: Comprehensive test coverage for all services

### Test Structure
- `DetoxService`: Tests for content filtering logic
- `StorageManager`: Tests for configuration and statistics storage
- `ExtensionMessenger`: Tests for inter-script communication

### Testing Tools
- **Jest**: Test runner with JSDOM environment
- **TypeScript**: Full type safety in tests
- **Mocked Chrome APIs**: Realistic Chrome API simulation

## 🔧 Configuration

The extension can be configured through the popup interface:

- **Enable Detox**: Toggle the entire extension on/off
- **Show Toast**: Display/hide the floating statistics toast
- **Remove Ads**: Toggle ad removal
- **Remove Suggestions**: Toggle suggestion removal
- **Remove Shorts**: Toggle Shorts shelf removal
- **Remove Disguised Shorts**: Toggle disguised Shorts removal

## 📊 Statistics

The extension tracks removal statistics:
- Ads removed
- Suggestions removed
- Shorts shelves removed
- Disguised Shorts removed

Statistics are persisted across browser sessions and can be reset via the popup.

## 🏗️ Architecture

### Manifest V3
This extension uses Chrome's Manifest V3, featuring:
- **Service Worker**: Background script runs as a service worker
- **Content Scripts**: Injected into YouTube pages
- **Popup UI**: User interface for configuration
- **Storage**: Sync and local storage for settings and stats

### Type Safety
- **Shared Types**: Common interfaces across all components
- **Message Contracts**: Typed communication between scripts
- **Configuration**: Strongly typed settings and statistics

### Modular Design
- **Services**: Core business logic in dedicated services
- **Utilities**: Reusable helper functions
- **Types**: Shared type definitions
- **Tests**: Comprehensive test coverage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write unit tests for new features
- Maintain test coverage above 80%
- Use ESLint for code quality
- Follow the existing code structure

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original Tampermonkey script inspiration
- Chrome Extension development community
- YouTube for providing the platform to improve

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
  - Ad removal
  - Shorts filtering
  - Suggestion cleanup
  - Statistics tracking
  - Configurable settings

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/youtube-detox-pro/issues) page
2. Create a new issue with detailed information
3. Include browser version and extension version

---

**Made with ❤️ for a distraction-free YouTube experience** 