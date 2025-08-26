let extractedMarkdown = "";

document.getElementById("extractBtn").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: extractContent,
    },
    (results) => {
      if (results && results[0]) {
        const data = results[0].result;
        extractedMarkdown = data.markdown;

        document.getElementById("preview").textContent = extractedMarkdown;
        document.getElementById("copyBtn").disabled = false;
        document.getElementById("status").textContent = "✅ Content extracted successfully!";

        // Show stats
        document.getElementById("stats").style.display = "block";
        document.getElementById("headingCount").textContent = data.stats.headings;
        document.getElementById("paragraphCount").textContent = data.stats.paragraphs;
        document.getElementById("codeCount").textContent = data.stats.codeBlocks;

        setTimeout(() => {
          document.getElementById("status").textContent = "";
        }, 3000);
      }
    }
  );
});

document.getElementById("copyBtn").addEventListener("click", () => {
  navigator.clipboard.writeText(extractedMarkdown).then(() => {
    document.getElementById("status").textContent = "📋 Copied to clipboard!";
    setTimeout(() => {
      document.getElementById("status").textContent = "";
    }, 2000);
  });
});

function extractContent() {
  const stats = {
    headings: 0,
    paragraphs: 0,
    codeBlocks: 0,
  };

  // Helper function to clean text
  function cleanText(text) {
    return text.trim().replace(/\s+/g, " ");
  }

  // Helper function to escape markdown special characters
  function escapeMarkdown(text) {
    return text.replace(/([*_`~\[\]()>#+\-=|{}!\\])/g, "\\$1");
  }

  // Helper function to process inline formatting
  function processInlineFormatting(element) {
    let html = element.innerHTML;
    let text = "";

    // Create temporary container
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Process all nodes
    function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        const innerContent = Array.from(node.childNodes)
          .map((child) => processNode(child))
          .join("");

        switch (tag) {
          case "strong":
          case "b":
            return `**${innerContent}**`;
          case "em":
          case "i":
            return `*${innerContent}*`;
          case "code":
            return `\`${innerContent}\``;
          case "a":
            const href = node.getAttribute("href");
            return href ? `[${innerContent}](${href})` : innerContent;
          case "br":
            return "\n";
          default:
            return innerContent;
        }
      }
      return "";
    }

    return Array.from(temp.childNodes)
      .map((node) => processNode(node))
      .join("");
  }

  // Get all relevant elements
  const selector = "h1, h2, h3, h4, h5, h6, p, blockquote, pre, code, ul, ol, li";
  const elements = document.querySelectorAll(selector);

  // Filter and sort elements by their position in document
  const relevantElements = Array.from(elements).filter((el) => {
    // Skip if element is not visible
    if (el.offsetParent === null) return false;

    // Skip if element is inside nav, footer, or aside
    if (el.closest("nav, footer, aside, .sidebar, .menu, .advertisement"))
      return false;

    // Skip if element has very little text
    const text = cleanText(el.textContent);
    if (text.length < 3) return false;

    // Skip nested code elements (code inside pre)
    if (el.tagName === "CODE" && el.closest("pre")) return false;

    return true;
  });

  // Sort by document position
  relevantElements.sort((a, b) => {
    const position = a.compareDocumentPosition(b);
    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });

  // Convert to markdown
  let markdown = [];
  let lastElement = null;

  relevantElements.forEach((el) => {
    const tagName = el.tagName.toLowerCase();
    let content = "";

    // Skip if this element is a child of the last processed element
    if (lastElement && lastElement.contains(el)) return;

    switch (tagName) {
      case "h1":
        content = `# ${cleanText(el.textContent)}`;
        stats.headings++;
        break;
      case "h2":
        content = `## ${cleanText(el.textContent)}`;
        stats.headings++;
        break;
      case "h3":
        content = `### ${cleanText(el.textContent)}`;
        stats.headings++;
        break;
      case "h4":
        content = `#### ${cleanText(el.textContent)}`;
        stats.headings++;
        break;
      case "h5":
        content = `##### ${cleanText(el.textContent)}`;
        stats.headings++;
        break;
      case "h6":
        content = `###### ${cleanText(el.textContent)}`;
        stats.headings++;
        break;
      case "p":
        content = processInlineFormatting(el);
        stats.paragraphs++;
        break;
      case "blockquote":
        const quoteLines = cleanText(el.textContent).split("\n");
        content = quoteLines.map((line) => `> ${line}`).join("\n");
        break;
      case "pre":
        const codeElement = el.querySelector("code");
        const codeText = codeElement ? codeElement.textContent : el.textContent;
        const language = codeElement?.className.match(/language-(\w+)/)?.[1] || "";
        content = `\`\`\`${language}\n${codeText}\n\`\`\``;
        stats.codeBlocks++;
        break;
      case "ul":
        const ulItems = Array.from(el.children).filter(
          (child) => child.tagName === "LI"
        );
        content = ulItems
          .map((li) => `- ${processInlineFormatting(li)}`)
          .join("\n");
        break;
      case "ol":
        const olItems = Array.from(el.children).filter(
          (child) => child.tagName === "LI"
        );
        content = olItems
          .map((li, index) => `${index + 1}. ${processInlineFormatting(li)}`)
          .join("\n");
        break;
    }

    if (content) {
      markdown.push(content);
      lastElement = el;
    }
  });

  return {
    markdown: markdown.join("\n\n"),
    stats: stats,
  };
}
