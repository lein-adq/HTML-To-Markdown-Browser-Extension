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
      ];
      return semanticTags.includes(element.tagName);
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

    getTextContent(element) {
      return element.textContent.trim().replace(/\s+/g, " ");
    }
  }

  // Make available globally
  window.MarkdownExtractor = MarkdownExtractor;
})();
