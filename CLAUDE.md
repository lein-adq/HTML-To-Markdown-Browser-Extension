# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome browser extension that converts webpage content to Markdown format. The extension provides a popup interface for extracting and copying clean Markdown from any webpage.

## Architecture

The extension follows the standard Chrome Extension Manifest V3 structure:

- **manifest.json**: Extension configuration with permissions for `activeTab`, `clipboardWrite`, and `scripting`
- **popup.html/popup.js**: Main UI for user interaction, handles extraction triggers and clipboard operations
- **content.js**: Advanced content extraction script with a class-based approach (`MarkdownExtractor`)

## Key Components

### Content Extraction Strategy
The codebase implements two extraction approaches:
1. **popup.js**: Contains inline `extractContent()` function with basic DOM parsing and statistical counting
2. **content.js**: Advanced `MarkdownExtractor` class that intelligently identifies main content areas using semantic selectors

### Markdown Conversion Features
- Handles headings (H1-H6), paragraphs, lists, blockquotes, and code blocks
- Processes inline formatting (bold, italic, code, links)
- Filters out navigation, sidebar, and advertisement content
- Provides extraction statistics (headings, paragraphs, code blocks)

## Development Commands

Since this is a browser extension without build tools:

- **Load extension**: Use Chrome's "Load unpacked" in developer mode
- **Test changes**: Reload extension in Chrome and test on various web pages
- **Debug**: Use Chrome DevTools for popup debugging and browser console for content script issues

## Extension Structure

The extension uses a popup-based interaction model where users click the extension icon to access conversion tools. The main workflow is:
1. User clicks "Extract Content" button
2. Extension injects content script into active tab
3. Content script processes DOM and returns Markdown + statistics
4. Popup displays preview and enables clipboard copy functionality