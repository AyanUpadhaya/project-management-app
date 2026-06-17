export type ResourceType =
  | "GitHub Repository"
  | "Documentation"
  | "Article"
  | "YouTube Video"
  | "Stack Overflow"
  | "Course"
  | "Tool"
  | "API Reference"
  | "Other";

export type Category =
  | "Frontend"
  | "Backend"
  | "DevOps"
  | "Database"
  | "AI & Machine Learning"
  | "System Design"
  | "Cyber Security"
  | "Mobile Development"
  | "Cloud Computing"
  | "Career Resources"
  | "Design Inspiration";

export interface Bookmark {
  id: string;
  title: string;
  description: string;
  url: string;
  category: Category;
  resource_type: ResourceType;
  tags: string[];
  thumbnail_url?: string;
  is_favorite: boolean;
  visit_count: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  last_visited_at?: string;
  user_id?: string;
}

export const CATEGORIES: Category[] = [
  "Frontend",
  "Backend",
  "DevOps",
  "Database",
  "AI & Machine Learning",
  "System Design",
  "Cyber Security",
  "Mobile Development",
  "Cloud Computing",
  "Career Resources",
  "Design Inspiration",
];

export const RESOURCE_TYPES: ResourceType[] = [
  "GitHub Repository",
  "Documentation",
  "Article",
  "YouTube Video",
  "Stack Overflow",
  "Course",
  "Tool",
  "API Reference",
  "Other",
];

export const MOCK_BOOKMARKS: Bookmark[] = [
  {
    id: "1",
    title: "React Official Documentation",
    description: "The complete reference for the React library, including hooks, server components, and concurrent rendering patterns.",
    url: "https://react.dev",
    category: "Frontend",
    resource_type: "Documentation",
    tags: ["react", "hooks", "ssr"],
    is_favorite: true,
    visit_count: 42,
    notes: "Bookmarked the hooks API section.",
    created_at: "2025-11-20T10:00:00Z",
    updated_at: "2025-12-01T10:00:00Z",
    last_visited_at: "2026-06-10T08:30:00Z",
  },
  {
    id: "2",
    title: "vercel/next.js",
    description: "The React Framework for the Web. Full-stack hybrid framework with SSR, SSG, and edge runtime support.",
    url: "https://github.com/vercel/next.js",
    category: "Frontend",
    resource_type: "GitHub Repository",
    tags: ["nextjs", "react", "framework"],
    is_favorite: true,
    visit_count: 28,
    created_at: "2025-10-12T10:00:00Z",
    updated_at: "2025-10-12T10:00:00Z",
    last_visited_at: "2026-06-09T11:00:00Z",
  },
  {
    id: "3",
    title: "PostgreSQL: Indexes Deep Dive",
    description: "Comprehensive guide on how to design and tune indexes in PostgreSQL for high-performance queries.",
    url: "https://www.postgresql.org/docs/current/indexes.html",
    category: "Database",
    resource_type: "Documentation",
    tags: ["postgres", "performance", "sql"],
    is_favorite: false,
    visit_count: 14,
    created_at: "2026-01-05T10:00:00Z",
    updated_at: "2026-01-05T10:00:00Z",
  },
  {
    id: "4",
    title: "Designing Data-Intensive Applications — Talk",
    description: "Martin Kleppmann discusses trade-offs of scalable systems: replication, consistency, and partitioning.",
    url: "https://www.youtube.com/watch?v=example",
    category: "System Design",
    resource_type: "YouTube Video",
    tags: ["distributed", "scaling", "ddia"],
    is_favorite: true,
    visit_count: 9,
    created_at: "2026-02-15T10:00:00Z",
    updated_at: "2026-02-15T10:00:00Z",
  },
  {
    id: "5",
    title: "Kubernetes the Hard Way",
    description: "Bootstrap a Kubernetes cluster from scratch — the canonical learning path by Kelsey Hightower.",
    url: "https://github.com/kelseyhightower/kubernetes-the-hard-way",
    category: "DevOps",
    resource_type: "GitHub Repository",
    tags: ["k8s", "devops", "infra"],
    is_favorite: false,
    visit_count: 21,
    created_at: "2025-09-01T10:00:00Z",
    updated_at: "2025-09-01T10:00:00Z",
  },
  {
    id: "6",
    title: "Attention Is All You Need",
    description: "The seminal Transformer paper that introduced self-attention and reshaped modern ML architectures.",
    url: "https://arxiv.org/abs/1706.03762",
    category: "AI & Machine Learning",
    resource_type: "Article",
    tags: ["transformers", "nlp", "paper"],
    is_favorite: true,
    visit_count: 33,
    created_at: "2025-08-20T10:00:00Z",
    updated_at: "2025-08-20T10:00:00Z",
  },
  {
    id: "7",
    title: "OWASP Top 10",
    description: "The standard awareness document for developers about the most critical security risks to web applications.",
    url: "https://owasp.org/Top10/",
    category: "Cyber Security",
    resource_type: "Documentation",
    tags: ["security", "owasp", "web"],
    is_favorite: false,
    visit_count: 7,
    created_at: "2026-03-10T10:00:00Z",
    updated_at: "2026-03-10T10:00:00Z",
  },
  {
    id: "8",
    title: "tailwindlabs/tailwindcss",
    description: "A utility-first CSS framework packed with classes to build any design directly in your markup.",
    url: "https://github.com/tailwindlabs/tailwindcss",
    category: "Frontend",
    resource_type: "GitHub Repository",
    tags: ["css", "tailwind", "design"],
    is_favorite: false,
    visit_count: 19,
    created_at: "2026-04-02T10:00:00Z",
    updated_at: "2026-04-02T10:00:00Z",
  },
  {
    id: "9",
    title: "AWS Well-Architected Framework",
    description: "Best practices for designing reliable, secure, efficient, and cost-effective workloads on AWS.",
    url: "https://aws.amazon.com/architecture/well-architected/",
    category: "Cloud Computing",
    resource_type: "Documentation",
    tags: ["aws", "cloud", "architecture"],
    is_favorite: false,
    visit_count: 5,
    created_at: "2026-05-01T10:00:00Z",
    updated_at: "2026-05-01T10:00:00Z",
  },
  {
    id: "10",
    title: "Refactoring UI",
    description: "Practical visual design tips for developers — color, spacing, hierarchy, and typography fundamentals.",
    url: "https://refactoringui.com",
    category: "Design Inspiration",
    resource_type: "Course",
    tags: ["design", "ui", "ux"],
    is_favorite: true,
    visit_count: 12,
    created_at: "2026-05-18T10:00:00Z",
    updated_at: "2026-05-18T10:00:00Z",
  },
  {
    id: "11",
    title: "Stack Overflow: Why is processing a sorted array faster?",
    description: "Classic Stack Overflow answer explaining branch prediction with a beautifully illustrated example.",
    url: "https://stackoverflow.com/questions/11227809",
    category: "System Design",
    resource_type: "Stack Overflow",
    tags: ["performance", "cpu", "branching"],
    is_favorite: false,
    visit_count: 3,
    created_at: "2026-06-01T10:00:00Z",
    updated_at: "2026-06-01T10:00:00Z",
  },
  {
    id: "12",
    title: "React Native Documentation",
    description: "Build native mobile apps using React. Covers components, navigation, native modules, and platform APIs.",
    url: "https://reactnative.dev",
    category: "Mobile Development",
    resource_type: "Documentation",
    tags: ["react-native", "ios", "android"],
    is_favorite: false,
    visit_count: 11,
    created_at: "2026-06-08T10:00:00Z",
    updated_at: "2026-06-08T10:00:00Z",
  },
];

export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function faviconOf(url: string): string {
  try {
    const u = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${u.hostname}&sz=64`;
  } catch {
    return "";
  }
}

export function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
