# BrowserSync Interactive Synchronization Project

A project demonstrating BrowserSync with synchronized interactive components: checkbox and slider.

## Features

- Interactive checkbox with custom styling
- **Synchronized slider** - slider position updates across all browsers in real-time
- **Real-time cross-browser synchronization** - all interactions update across all browsers instantly
- Real-time status updates
- Toggle counter synchronized across all browsers
- Responsive design
- Keyboard support (Spacebar to toggle checkbox)
- BrowserSync for live reloading during development
- Visual sync status indicator
- Debounced slider updates for smooth performance

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server with BrowserSync:
   ```bash
   npm start
   ```

3. Your browser will automatically open to `http://localhost:3000`
4. Open the same URL in multiple browsers or devices to see real-time synchronization!

## Cross-Browser Synchronization

This project demonstrates advanced BrowserSync features for real-time synchronization:

- **Checkbox state**: When you click the checkbox in one browser, it instantly updates in all other connected browsers
- **Slider position**: Move the slider in any browser and watch it update everywhere in real-time
- **Toggle counter**: The counter stays synchronized across all browsers
- **Multi-device support**: Works across different browsers, tabs, and even devices on the same network
- **Fallback support**: Uses localStorage for synchronization when BrowserSync is not available
- **Performance optimized**: Slider updates are debounced to prevent excessive network traffic

### Testing Synchronization

1. Open `http://localhost:3000` in multiple browser tabs/windows
2. Open the same URL on your phone/tablet using the external URL: `http://[your-ip]:3000`
3. Click the checkbox in any browser - watch it update everywhere instantly!
4. Move the slider in any browser - see it move in real-time across all browsers!
5. The sync status indicator shows whether cross-browser sync is active

## Usage

- Click the checkbox to toggle it
- Press the spacebar to toggle the checkbox (when the page is focused)
- Watch the status and counter update in real-time
- Make changes to HTML, CSS, or JS files and see them update automatically

## Available Scripts

- `npm start` - Starts BrowserSync server with cross-browser sync on default port
- `npm run dev` - Starts BrowserSync server with cross-browser sync on port 3000
- `npm run simple` - Starts basic BrowserSync server without advanced sync features

## Project Structure

```
├── index.html      # Main HTML file with checkbox
├── styles.css      # CSS styling and animations
├── script.js       # JavaScript for interactivity
├── package.json    # Project configuration
└── README.md       # This file
```

## BrowserSync Features Demonstrated

- Live reloading when files change
- Synchronized scrolling across devices
- Real-time CSS injection
- Browser synchronization for testing
# test_browsersync2
