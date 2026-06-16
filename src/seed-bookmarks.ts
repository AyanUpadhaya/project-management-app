import { supabase } from "@/supabase/supabaseClient";

// Optional: attach seeds to a specific user. Leave null for shared/demo data.
const DEMO_USER_ID: string | null = "xxxxx";

type SeedBookmark = {
  title: string;
  url: string;
  description: string;
  category: string;
  resource_type: "github" | "docs" | "youtube" | "blog" | "stackoverflow" | "other";
  tags: string[];
  is_favorite?: boolean;
  notes?: string;
};

const bookmarks: SeedBookmark[] = [
  {
    title: "React Documentation",
    url: "https://react.dev",
    description: "Official React docs with the new hooks-first guide.",
    category: "Frontend",
    resource_type: "docs",
    tags: ["react", "frontend", "hooks"],
    is_favorite: true,
  },
  {
    title: "shadcn/ui",
    url: "https://github.com/shadcn-ui/ui",
    description: "Beautifully designed components built with Radix UI and Tailwind.",
    category: "Frontend",
    resource_type: "github",
    tags: ["ui", "tailwind", "components"],
    is_favorite: true,
  },
  {
    title: "Supabase Docs",
    url: "https://supabase.com/docs",
    description: "Postgres, Auth, Storage, Realtime, and Edge Functions.",
    category: "Backend",
    resource_type: "docs",
    tags: ["supabase", "postgres", "backend"],
  },
  {
    title: "TanStack Query",
    url: "https://tanstack.com/query/latest",
    description: "Powerful asynchronous state management for TS/JS.",
    category: "Frontend",
    resource_type: "docs",
    tags: ["react", "data-fetching"],
  },
  {
    title: "Theo - t3.gg (YouTube)",
    url: "https://www.youtube.com/@t3dotgg",
    description: "Web dev takes, TypeScript, and full-stack patterns.",
    category: "Learning",
    resource_type: "youtube",
    tags: ["typescript", "fullstack"],
  },
  {
    title: "Build LLM apps with Vercel AI SDK",
    url: "https://sdk.vercel.ai/docs",
    description: "Streaming UIs and tool-calling with multiple model providers.",
    category: "AI",
    resource_type: "docs",
    tags: ["ai", "llm", "vercel"],
    is_favorite: true,
  },
  {
    title: "How does JWT actually work?",
    url: "https://stackoverflow.com/questions/27301557",
    description: "Top-voted explanation of JSON Web Token internals.",
    category: "Backend",
    resource_type: "stackoverflow",
    tags: ["auth", "jwt", "security"],
  },
  {
    title: "Josh Comeau — CSS for JS Developers",
    url: "https://www.joshwcomeau.com/css/",
    description: "Deep, illustrated CSS articles for app developers.",
    category: "Frontend",
    resource_type: "blog",
    tags: ["css", "design"],
  },
];

async function seed() {
  console.log(`Seeding ${bookmarks.length} bookmarks…`);

  const rows = bookmarks.map((b) => ({
    ...b,
    user_id: DEMO_USER_ID,
    visit_count: 0,
  }));

  // Insert in a single batch. Use upsert if you want re-runs to be idempotent.
  const { data, error } = await supabase
    .from("bookmarks")
    .insert(rows)
    .select("id, title");

  if (error) {
    console.error("❌ Seed failed:", error.message);
  }

  console.log(`✅ Inserted ${data?.length ?? 0} bookmarks`);
}

seed();