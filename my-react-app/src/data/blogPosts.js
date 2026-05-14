export const BLOG_POSTS = [
  {
    id: 1,
    title: "Beyond RPA: The Rise of Agentic AI in Modern Banking",
    date: "May 14, 2024",
    readTime: "6 min read",
    category: "AI & Automation",
    excerpt: "Why traditional RPA is reaching its limits and how autonomous AI agents are transforming financial operations from the ground up.",
    content: `
Traditional Robotic Process Automation (RPA) has been the backbone of banking automation for a decade. However, it suffers from one fatal flaw: it is fragile. A single change in a UI element or a slight variation in a document format can break a traditional bot.

Enter **Agentic AI**. Unlike RPA, which follows rigid 'if-this-then-that' rules, Agentic AI uses Large Language Models (LLMs) and specialized tools to reason through tasks. 

### Why Banks are Switching:
1. **Dynamic Decision Making**: Agentic AI can handle exceptions that would stop an RPA bot cold.
2. **Natural Language Interface**: Instead of complex workflows, agents understand intent.
3. **Tool Use**: Agents can navigate legacy banking software, read PDFs, and call APIs autonomously.

For banks in Nepal and beyond, switching from traditional RPA to Agentic workflows means lower maintenance costs and the ability to automate complex 'middle-office' tasks that were previously impossible to touch.
    `
  },
  {
    id: 2,
    title: "The Nepal Banking Dilemma: Why Modern Tech Adoption Lags",
    date: "May 10, 2024",
    readTime: "5 min read",
    category: "Fintech",
    excerpt: "An analysis of the structural and cultural challenges preventing Nepalese financial institutions from embracing cutting-edge technology.",
    content: `
Nepal's banking sector is at a crossroads. While the rest of the world moves toward decentralized finance and AI-driven banking, many local institutions are still tied to legacy systems. 

### The Challenges:
*   **Legacy Infrastructure**: Migrating from decades-old Core Banking Systems (CBS) is high-risk and expensive.
*   **Regulatory Caution**: Strict NRB regulations often prioritize stability over innovation, which is necessary but sometimes slows down the adoption of cloud-native solutions.
*   **Talent Brain Drain**: Many of Nepal's top tech talents move abroad, leaving a gap in local high-end engineering expertise.

To overcome this, banks need to adopt a 'Modular' approach—keeping the core stable while building modern microservices on the periphery to handle AI, mobile UX, and real-time analytics.
    `
  },
  {
    id: 3,
    title: "Zero-Trust Banking: Security Architectures for 2025",
    date: "May 05, 2024",
    readTime: "7 min read",
    category: "Security",
    excerpt: "Exploring the security frameworks necessary to protect modern financial data in an era of increasing cyber threats.",
    content: `
Security in banking is no longer about building a 'bigger wall.' In 2025, the industry is moving toward a **Zero-Trust Architecture**. 

### Key Pillars:
1. **Never Trust, Always Verify**: Every request, whether internal or external, must be authenticated and authorized.
2. **Micro-segmentation**: If one part of the network is breached, the rest remains safe.
3. **End-to-End Encryption**: Data must be encrypted at rest, in transit, and even during processing (Confidential Computing).

For developers building banking solutions, security must be 'Shift-Left'—integrated into the very first line of code, not added as a layer at the end.
    `
  },
  {
    id: 4,
    title: "Speed as a Feature: Optimizing Web Apps for Performance",
    date: "April 28, 2024",
    readTime: "4 min read",
    category: "Engineering",
    excerpt: "How I achieved sub-second load times using Vite, React, and advanced caching strategies.",
    content: `
In modern web development, performance isn't just a metric; it's a feature. A 100ms delay can lead to a significant drop in user engagement, especially in data-heavy applications like financial dashboards.

### My Optimization Stack:
*   **Vite**: Leveraging native ESM for lightning-fast HMR and optimized builds.
*   **Component Splitting**: Loading only what the user needs, when they need it.
*   **Web Workers**: Moving heavy logic (like the AI assistant on this site) off the main thread to keep the UI fluid.

By focusing on Core Web Vitals and minimizing the 'JavaScript bloat', we can build experiences that feel instantaneous, even on slower network connections common in many parts of the world.
    `
  }
];
