// Advanced content extraction for complex pages
(function () {
  "use strict";

  class MarkdownExtractor {
    constructor() {
      this.markdown = [];
      this.processedElements = new Set();
    }

    extract() {
      // Find main content area
      const contentArea = this.findMainContent();

      // Extract from main content or fall back to body
      const root = contentArea || document.body;
      this.processElement(root);

      return this.markdown.join("\n\n");
    }

    findMainContent() {
      // Try to find main content area
      const selectors = [
        "main",
        "article",
        '[role="main"]',
        "#content",
        ".content",
        "#main",
        ".main",
        ".post-content",
        ".entry-content",
      ];

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) return element;
      }

      return null;
    }

    processElement(element) {
      // Skip if already processed
      if (this.processedElements.has(element)) return;
      this.processedElements.add(element);

      // Skip hidden elements
      if (!this.isVisible(element)) return;

      // Process based on element type
      if (this.isSemanticElement(element)) {
        this.convertToMarkdown(element);
      }

      // Process children
      for (const child of element.children) {
        this.processElement(child);
      }
    }

    isVisible(element) {
      const style = window.getComputedStyle(element);
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        element.offsetParent !== null
      );
    }

    isSemanticElement(element) {
      const semanticTags = [
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "P",
        "BLOCKQUOTE",
        "PRE",
        "UL",
        "OL",
        "TABLE",
      ];

      if (!semanticTags.includes(element.tagName)) {
        return false;
      }

      // Skip lists that are likely navigation or sidebar content
      if (element.tagName === "UL" || element.tagName === "OL") {
        return !this.isNavigationList(element);
      }

      return true;
    }

    isNavigationList(element) {
      // Check if the list or its ancestors have navigation-related classes/roles
      const navIndicators = [
        'nav', 'navigation', 'menu', 'sidebar', 'header', 'footer',
        'breadcrumb', 'pagination', 'social', 'widget', 'aside'
      ];

      let current = element;
      while (current && current !== document.body) {
        // Check tag name
        if (current.tagName === 'NAV' || current.tagName === 'HEADER' || current.tagName === 'FOOTER' || current.tagName === 'ASIDE') {
          return true;
        }

        // Check classes and IDs
        const className = current.className?.toLowerCase() || '';
        const id = current.id?.toLowerCase() || '';
        const role = current.getAttribute('role')?.toLowerCase() || '';

        if (navIndicators.some(indicator => 
          className.includes(indicator) || id.includes(indicator) || role.includes(indicator)
        )) {
          return true;
        }

        current = current.parentElement;
      }

      return false;
    }

    convertToMarkdown(element) {
      const tag = element.tagName;
      let content = "";

      switch (tag) {
        case "H1":
          content = `# ${this.getTextContent(element)}`;
          break;
        case "H2":
          content = `## ${this.getTextContent(element)}`;
          break;
        case "H3":
          content = `### ${this.getTextContent(element)}`;
          break;
        case "H4":
          content = `#### ${this.getTextContent(element)}`;
          break;
        case "H5":
          content = `##### ${this.getTextContent(element)}`;
          break;
        case "H6":
          content = `###### ${this.getTextContent(element)}`;
          break;
        case "P":
          content = this.processInlineElements(element);
          break;
        case "BLOCKQUOTE":
          content = this.getTextContent(element)
            .split("\n")
            .map((line) => `> ${line}`)
            .join("\n");
          break;
        case "PRE":
          const code = element.querySelector("code");
          const text = code ? code.textContent : element.textContent;
          content = `\`\`\`\n${text}\n\`\`\``;
          break;
        case "UL":
          content = this.processList(element, "-");
          break;
        case "OL":
          content = this.processList(element, "1.");
          break;
        case "TABLE":
          content = this.processTable(element);
          break;
      }

      if (content.trim()) {
        this.markdown.push(content);
      }
    }

    processInlineElements(element) {
      let result = "";

      for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          result += node.textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const tag = node.tagName.toLowerCase();
          const text = this.getTextContent(node);

          switch (tag) {
            case "strong":
            case "b":
              result += `**${text}**`;
              break;
            case "em":
            case "i":
              result += `*${text}*`;
              break;
            case "code":
              result += `\`${text}\``;
              break;
            case "a":
              const href = node.getAttribute("href");
              result += `[${text}](${href || "#"})`;
              break;
            default:
              result += text;
          }
        }
      }

      return result.trim();
    }

    processList(element, marker) {
      const items = Array.from(element.querySelectorAll(":scope > li"));
      return items
        .map((item, index) => {
          const prefix = marker === "1." ? `${index + 1}.` : marker;
          return `${prefix} ${this.processInlineElements(item)}`;
        })
        .join("\n");
    }

    processTable(element) {
      const rows = Array.from(element.querySelectorAll('tr'));
      if (rows.length === 0) return '';

      const tableRows = rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td, th'));
        return '| ' + cells.map(cell => this.getTextContent(cell).replace(/\|/g, '\\|')).join(' | ') + ' |';
      });

      // Add header separator if first row contains th elements
      const firstRow = rows[0];
      const hasHeaders = firstRow.querySelector('th');
      
      if (hasHeaders && tableRows.length > 0) {
        const headerSeparator = '| ' + Array.from(firstRow.querySelectorAll('th, td'))
          .map(() => '---')
          .join(' | ') + ' |';
        tableRows.splice(1, 0, headerSeparator);
      }

      return tableRows.join('\n');
    }

    getTextContent(element) {
      return element.textContent.trim().replace(/\s+/g, " ");
    }
  }

  // Make available globally
  window.MarkdownExtractor = MarkdownExtractor;
})();
