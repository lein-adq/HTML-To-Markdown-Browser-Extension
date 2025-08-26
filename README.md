# HTML to Markdown Converter Chrome Extension

A powerful Chrome browser extension that converts webpage content to clean Markdown format with intelligent content extraction and filtering capabilities.

## 🚀 Features

- **Smart Content Extraction**: Intelligently identifies main content areas using semantic selectors
- **Clean Markdown Output**: Converts HTML to properly formatted Markdown with preserved structure
- **Noise Filtering**: Automatically removes navigation, sidebars, and advertisements
- **Format Preservation**: Maintains bold, italic, links, and code formatting
- **Clipboard Integration**: One-click copy to clipboard functionality
- **Statistics Display**: Shows extraction metrics (headings, paragraphs, code blocks)

## 📦 Installation Instructions

### Option 1: Clone from GitHub (Recommended)

1. **Clone this repository**:
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable "Developer mode"** (toggle in top right)
4. **Click "Load unpacked"** and select the cloned folder
5. **Test the extension** on any webpage!

### Option 2: Download ZIP

1. **Download** the repository as a ZIP file from GitHub
2. **Extract** the ZIP file to your desired location
3. **Open Chrome** and go to `chrome://extensions/`
4. **Enable "Developer mode"** (toggle in top right)
5. **Click "Load unpacked"** and select the extracted folder
6. **Test the extension** on any webpage!

> [!NOTE]
> 
> The extension includes placeholder icons. You can replace `icon16.png`, `icon48.png`, and `icon128.png` with your own custom icons if desired.

## 🎯 How It Works

The extension uses a robust extraction algorithm that:

- **Intelligently identifies content**: Finds the main content area using common selectors (main, article, etc.)
- **Handles messy HTML**: Traverses through nested divs and sections to find semantic elements
- **Preserves formatting**: Maintains bold, italic, links, and code formatting
- **Filters noise**: Skips hidden elements, navigation, sidebars, and advertisements
- **Maintains hierarchy**: Preserves the document structure and heading levels

## 🛠️ Usage

1. Navigate to any webpage you want to convert
2. Click the extension icon in your browser toolbar
3. Click "Extract Content" to process the page
4. Review the generated Markdown preview
5. Click "Copy to Clipboard" to use the converted content

## 🎨 Customization Options

You can enhance the extension by:

- Adding support for tables (convert HTML tables to Markdown tables)
- Including image extraction with alt text
- Adding keyboard shortcuts for quick extraction
- Implementing custom CSS selectors for specific websites
- Adding options to choose which elements to include/exclude
- Supporting custom markdown flavors (GitHub, CommonMark, etc.)

## 🧪 Testing Recommendations

Test your extension on various websites to ensure robustness:

- **Blog posts** (Medium, Dev.to, personal blogs)
- **Documentation sites** (MDN, official docs)
- **News articles** (BBC, CNN, TechCrunch)
- **Wikipedia pages**
- **GitHub README files**

## 🏗️ Architecture

The extension follows Chrome Extension Manifest V3 structure:

- **`manifest.json`**: Extension configuration with permissions for `activeTab`, `clipboardWrite`, and `scripting`
- **`popup.html/popup.js`**: Main UI for user interaction, handles extraction triggers and clipboard operations
- **`content.js`**: Advanced content extraction script with class-based approach (`MarkdownExtractor`)

## 📋 Supported Content Types

The extension handles:

- ✅ Headings (H1-H6)
- ✅ Paragraphs and text content
- ✅ Ordered and unordered lists
- ✅ Blockquotes
- ✅ Code blocks and inline code
- ✅ Links with proper formatting
- ✅ Bold and italic text
- ✅ Nested content structures

## 🔧 Development

Since this is a browser extension without build tools:

- **Load extension**: Use Chrome's "Load unpacked" in developer mode
- **Test changes**: Reload extension in Chrome and test on various web pages
- **Debug**: Use Chrome DevTools for popup debugging and browser console for content script issues

## 📝 Workflow

The extension uses a popup-based interaction model:

1. User clicks "Extract Content" button
2. Extension injects content script into active tab
3. Content script processes DOM and returns Markdown + statistics
4. Popup displays preview and enables clipboard copy functionality

## 🤝 Contributing

Feel free to contribute by:

- Reporting bugs and issues
- Suggesting new features
- Improving the extraction algorithm
- Adding support for more content types
- Enhancing the user interface

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Markdown converting! 📝✨**
