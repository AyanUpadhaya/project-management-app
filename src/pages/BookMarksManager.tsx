import { 
  useEffect, 
  useMemo, 
  //useRef, 
  useState 
} from "react";
import {
  Bookmark as BookmarkIcon,
  Plus,
  // Upload,
  Download,
  Search,
  Star,
  StarOff,
  Layers,
  Clock,
  Sparkles,
  // TrendingUp,
  Heart,
  Github,
  FileText,
  Youtube,
  BookOpen,
  Wrench,
  Code2,
  Globe,
  HelpCircle,
  ExternalLink,
  Pencil,
  Trash2,
  Copy,
  MoreHorizontal,
  Eye,
  Calendar,
  Tag as TagIcon,
  // Sun,
  // Moon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import {
  CATEGORIES,
  MOCK_BOOKMARKS,
  RESOURCE_TYPES,
  domainOf,
  faviconOf,
  formatDate,
  type Bookmark,
  type Category,
  type ResourceType,
} from "@/lib/bookmarks-data";
import { cn } from "@/lib/utils";


type SortOption = "newest" | "oldest" | "most-visited" | "alphabetical";

const TYPE_ICON: Record<ResourceType, React.ComponentType<{ className?: string }>> = {
  "GitHub Repository": Github,
  Documentation: BookOpen,
  Article: FileText,
  "YouTube Video": Youtube,
  "Stack Overflow": HelpCircle,
  Course: Sparkles,
  Tool: Wrench,
  "API Reference": Code2,
  Other: Globe,
};

export default function BookMarksManager() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(MOCK_BOOKMARKS);
  const [loading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | Category>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | ResourceType>("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("newest");

  const [editing, setEditing] = useState<Bookmark | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = bookmarks.length;
    const favorites = bookmarks.filter((b) => b.is_favorite).length;
    const categories = new Set(bookmarks.map((b) => b.category)).size;
    const lastWeek = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = bookmarks.filter((b) => new Date(b.created_at).getTime() > lastWeek).length;
    return { total, favorites, categories, recent };
  }, [bookmarks]);

  const filtered = useMemo(() => {
    let list = bookmarks.slice();
    if (activeCategory !== "all") list = list.filter((b) => b.category === activeCategory);
    if (typeFilter !== "all") list = list.filter((b) => b.resource_type === typeFilter);
    if (favoritesOnly) list = list.filter((b) => b.is_favorite);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.url.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    list.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return +new Date(a.created_at) - +new Date(b.created_at);
        case "most-visited":
          return b.visit_count - a.visit_count;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "newest":
        default:
          return +new Date(b.created_at) - +new Date(a.created_at);
      }
    });
    return list;
  }, [bookmarks, activeCategory, typeFilter, favoritesOnly, search, sort]);

  const details = detailsId ? bookmarks.find((b) => b.id === detailsId) ?? null : null;

  const toggleFavorite = (id: string) =>
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, is_favorite: !b.is_favorite } : b)),
    );
  const deleteBookmark = (id: string) =>
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  const copyUrl = (url: string) => {
    if (typeof navigator !== "undefined") navigator.clipboard?.writeText(url).catch(() => {});
  };

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (b: Bookmark) => {
    setEditing(b);
    setModalOpen(true);
  };

  const saveBookmark = (data: BookmarkFormValues) => {
    if (editing) {
      setBookmarks((prev) =>
        prev.map((b) =>
          b.id === editing.id
            ? { ...b, ...data, tags: data.tags, updated_at: new Date().toISOString() }
            : b,
        ),
      );
    } else {
      const now = new Date().toISOString();
      const next: Bookmark = {
        id: crypto.randomUUID(),
        ...data,
        visit_count: 0,
        created_at: now,
        updated_at: now,
      };
      setBookmarks((prev) => [next, ...prev]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  // const fileInputRef = useRef<HTMLInputElement>(null);

  const exportCsv = () => {
    const csv = bookmarksToCsv(bookmarks);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `devnexus-bookmarks-${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // const importCsv = async (file: File) => {
  //   try {
  //     const text = await file.text();
  //     const imported = csvToBookmarks(text);
  //     if (imported.length === 0) {
  //       alert("No valid bookmarks found in CSV.");
  //       return;
  //     }
  //     setBookmarks((prev) => {
  //       const existingUrls = new Set(prev.map((b) => b.url));
  //       const fresh = imported.filter((b) => !existingUrls.has(b.url));
  //       return [...fresh, ...prev];
  //     });
  //     alert(`Imported ${imported.length} bookmark(s).`);
  //   } catch (err) {
  //     alert(`Failed to import CSV: ${(err as Error).message}`);
  //   }
  // };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen w-full">
        {/* Main */}
          <main className="min-w-0 flex-1">
            <div className="space-y-8 px-4 py-8 md:px-8">
              <Header
                onAdd={openAdd}
                onExport={exportCsv}
                // onImport={() => fileInputRef.current?.click()}
              />
              {/* <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) importCsv(f);
                  e.target.value = "";
                }}
              /> */}


              <StatsRow loading={loading} stats={stats} />

              {/* <QuickActions
                onAdd={openAdd}
                onFavorites={() => setFavoritesOnly(true)}
                onRecent={() => setSort("newest")}
                onMostVisited={() => setSort("most-visited")}
              /> */}

              <FilterBar
                search={search}
                setSearch={setSearch}
                category={activeCategory}
                setCategory={setActiveCategory}
                type={typeFilter}
                setType={setTypeFilter}
                favoritesOnly={favoritesOnly}
                setFavoritesOnly={setFavoritesOnly}
                sort={sort}
                setSort={setSort}
              />

              {loading ? (
                <SkeletonGrid />
              ) : filtered.length === 0 ? (
                <EmptyState onAdd={openAdd} />
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((b) => (
                    <BookmarkCard
                      key={b.id}
                      bookmark={b}
                      onOpenDetails={() => setDetailsId(b.id)}
                      onToggleFavorite={() => toggleFavorite(b.id)}
                      onEdit={() => openEdit(b)}
                      onDelete={() => deleteBookmark(b.id)}
                      onCopy={() => copyUrl(b.url)}
                    />
                  ))}
                </div>
              )}
            </div>
          </main>

        <BookmarkFormDialog
          open={modalOpen}
          onOpenChange={setModalOpen}
          initial={editing}
          onSubmit={saveBookmark}
        />

        <BookmarkDetailsSheet
          bookmark={details}
          onOpenChange={(open) => !open && setDetailsId(null)}
          onEdit={(b) => {
            setDetailsId(null);
            openEdit(b);
          }}
          onDelete={(id) => {
            deleteBookmark(id);
            setDetailsId(null);
          }}
        />
      </div>
    </TooltipProvider>
  );
}

// function useThemeToggle() {
//   const [isDark, setIsDark] = useState(false);

//   useEffect(() => {
//     setIsDark(document.documentElement.classList.contains("dark"));
//   }, []);

//   const toggle = () => {
//     const next = !isDark;
//     setIsDark(next);
//     document.documentElement.classList.toggle("dark", next);
//     localStorage.setItem("theme", next ? "dark" : "light");
//   };

//   return { isDark, toggle };
// }

/* ---------- Header ---------- */

function Header({
  onAdd,
  // onImport,
  onExport,
}: {
  onAdd: () => void;
  // onImport: () => void;
  onExport: () => void;
}) {
  // const theme = useThemeToggle();
  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          DevNexus
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Developer Bookmark Manager
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Save, organize, and quickly access your favorite development resources — repos, docs,
          tutorials, articles, and AI tools.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {/* <Button
          variant="outline"
          size="icon"
          onClick={theme.toggle}
          title={theme.isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme.isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button> */}
        {/* <Button variant="outline" size="sm" onClick={onImport}>
          <Upload className="size-4" /> Import
        </Button> */}
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="size-4" /> Export
        </Button>
        <Button size="sm" onClick={onAdd}>
          <Plus className="size-4" /> Add Bookmark
        </Button>
      </div>
    </header>
  );
}

/* ---------- Stats ---------- */

function StatsRow({
  stats,
  loading,
}: {
  stats: { total: number; favorites: number; categories: number; recent: number };
  loading: boolean;
}) {
  const items = [
    { label: "Total Bookmarks", value: stats.total, icon: BookmarkIcon, accent: "primary" as const },
    { label: "Favorites", value: stats.favorites, icon: Heart, accent: "warning" as const },
    { label: "Categories", value: stats.categories, icon: Layers, accent: "info" as const },
    { label: "Recently Added", value: stats.recent, icon: Clock, accent: "success" as const },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((s) => (
        <Card key={s.label} className="card-hover overflow-hidden">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
              <div className="mt-2 text-3xl font-semibold tracking-tight">{s.value}</div>
            </div>
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-lg",
                s.accent === "primary" && "bg-primary/15 text-primary",
                s.accent === "warning" && "bg-warning/15 text-warning",
                s.accent === "info" && "bg-info/15 text-info",
                s.accent === "success" && "bg-success/15 text-success",
              )}
            >
              <s.icon className="size-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ---------- Quick Actions ---------- */

// function QuickActions({
//   onAdd,
//   onFavorites,
//   onRecent,
//   onMostVisited,
// }: {
//   onAdd: () => void;
//   onFavorites: () => void;
//   onRecent: () => void;
//   onMostVisited: () => void;
// }) {
//   const items = [
//     { label: "Add New Bookmark", icon: Plus, onClick: onAdd, hint: "Save a resource" },
//     { label: "View Favorites", icon: Star, onClick: onFavorites, hint: "Your starred items" },
//     { label: "Recently Added", icon: Clock, onClick: onRecent, hint: "Newest first" },
//     { label: "Most Visited", icon: TrendingUp, onClick: onMostVisited, hint: "Top by visits" },
//     {
//       label: "AI Recommendations",
//       icon: Sparkles,
//       onClick: () => {},
//       hint: "Coming soon",
//       disabled: true,
//     },
//   ];
//   return (
//     <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
//       {items.map((it) => (
//         <button
//           key={it.label}
//           onClick={it.onClick}
//           disabled={it.disabled}
//           className={cn(
//             "card-hover group flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left",
//             it.disabled && "cursor-not-allowed opacity-60 hover:translate-y-0 hover:shadow-none",
//           )}
//         >
//           <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
//             <it.icon className="size-4" />
//           </span>
//           <div className="min-w-0">
//             <div className="truncate text-sm font-medium">{it.label}</div>
//             <div className="truncate text-xs text-muted-foreground">{it.hint}</div>
//           </div>
//         </button>
//       ))}
//     </div>
//   );
// }

/* ---------- Filter Bar ---------- */

function FilterBar(props: {
  search: string;
  setSearch: (s: string) => void;
  category: "all" | Category;
  setCategory: (c: "all" | Category) => void;
  type: "all" | ResourceType;
  setType: (t: "all" | ResourceType) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (v: boolean) => void;
  sort: SortOption;
  setSort: (s: SortOption) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={props.search}
            onChange={(e) => props.setSearch(e.target.value)}
            placeholder="Search bookmarks by title, tag, URL…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={props.category}
            onValueChange={(v) => props.setCategory(v as "all" | Category)}
          >
            <SelectTrigger className="w-42.5">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={props.type}
            onValueChange={(v) => props.setType(v as "all" | ResourceType)}
          >
            <SelectTrigger className="w-42.5">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {RESOURCE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={props.sort} onValueChange={(v) => props.setSort(v as SortOption)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="most-visited">Most Visited</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5">
            <Star
              className={cn(
                "size-4",
                props.favoritesOnly ? "fill-warning text-warning" : "text-muted-foreground",
              )}
            />
            <Label htmlFor="fav-only" className="text-sm">
              Favorites
            </Label>
            <Switch
              id="fav-only"
              checked={props.favoritesOnly}
              onCheckedChange={props.setFavoritesOnly}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Sidebar ---------- */

{/* function CategoriesSidebar({
  counts,
  active,
  onSelect,
  collapsed,
  onToggle,
}: {
  counts: Record<string, number>;
  active: "all" | Category;
  onSelect: (c: "all" | Category) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const items: Array<{ key: "all" | Category; label: string }> = [
    { key: "all", label: "All Bookmarks" },
    ...CATEGORIES.map((c) => ({ key: c, label: c })),
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/20 text-primary">
              <BookmarkIcon className="size-4" />
            </div>
            <div className="text-sm font-semibold tracking-tight">DevNexus</div>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2 py-3">
        {!collapsed && (
          <div className="px-2 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Categories
          </div>
        )}
        <nav className="space-y-1">
          {items.map((it) => {
            const isActive = active === it.key;
            const count = counts[it.key as string] ?? 0;
            return (
              <button
                key={it.key}
                onClick={() => onSelect(it.key)}
                className={cn(
                  "group flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                )}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      isActive ? "bg-primary" : "bg-muted-foreground/40",
                    )}
                  />
                  {!collapsed && <span className="truncate">{it.label}</span>}
                </span>
                {!collapsed && (
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-xs tabular-nums",
                      isActive
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {!collapsed && (
        <div className="border-t border-sidebar-border p-3">
          <div className="rounded-lg bg-linear-to-br from-primary/15 to-info/10 p-3">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Sparkles className="size-3.5 text-primary" /> Pro tip
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Use tags to cross-link resources across categories.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} */}

/* ---------- Card ---------- */

function BookmarkCard({
  bookmark,
  onOpenDetails,
  onToggleFavorite,
  onEdit,
  onDelete,
  onCopy,
}: {
  bookmark: Bookmark;
  onOpenDetails: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
}) {
  const TypeIcon = TYPE_ICON[bookmark.resource_type];

  return (
    <Card
      className="card-hover group relative flex h-full cursor-pointer flex-col overflow-hidden"
      onClick={onOpenDetails}
    >
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={faviconOf(bookmark.url)}
                alt=""
                className="size-5"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-base">{bookmark.title}</CardTitle>
              <div className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                {domainOf(bookmark.url)}
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-warning"
            aria-label="Toggle favorite"
          >
            {bookmark.is_favorite ? (
              <Star className="size-4 fill-warning text-warning" />
            ) : (
              <StarOff className="size-4" />
            )}
          </button>
        </div>

        <CardDescription className="line-clamp-2 text-sm">
          {bookmark.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto space-y-3 pt-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="gap-1">
            <TypeIcon className="size-3" />
            {bookmark.resource_type}
          </Badge>
          <Badge variant="outline" className="border-primary/40 text-primary">
            {bookmark.category}
          </Badge>
          {bookmark.tags.slice(0, 2).map((t) => (
            <Badge key={t} variant="outline" className="font-mono text-[10px]">
              #{t}
            </Badge>
          ))}
          {bookmark.tags.length > 2 && (
            <span className="text-xs text-muted-foreground">+{bookmark.tags.length - 2}</span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3" />
            {formatDate(bookmark.created_at)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="size-3" />
            {bookmark.visit_count} visits
          </span>
        </div>

        <div className="pointer-events-none flex items-center gap-1 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="h-8 flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  if (typeof window !== "undefined")
                    window.open(bookmark.url, "_blank", "noopener,noreferrer");
                }}
              >
                <ExternalLink className="size-3.5" /> Open
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open link</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy();
                }}
              >
                <Copy className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy URL</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="size-3.5" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleFavorite}>
                <Star className="size-3.5" />
                {bookmark.is_favorite ? "Unfavorite" : "Favorite"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="size-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------- Empty & Skeleton ---------- */

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <BookmarkIcon className="size-7" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">Your bookmark library is empty</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Start collecting the docs, repos, and articles you want to keep close at hand.
      </p>
      <Button className="mt-6" onClick={onAdd}>
        <Plus className="size-4" /> Add Your First Bookmark
      </Button>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
          <Skeleton className="mt-4 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-5/6" />
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ---------- Form Dialog ---------- */

interface BookmarkFormValues {
  title: string;
  description: string;
  url: string;
  category: Category;
  resource_type: ResourceType;
  tags: string[];
  is_favorite: boolean;
  notes?: string;
}

function BookmarkFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Bookmark | null;
  onSubmit: (v: BookmarkFormValues) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<Category>("Frontend");
  const [type, setType] = useState<ResourceType>("Documentation");
  const [tagsStr, setTagsStr] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});

  // Reset on open/initial change
  useMemoReset(open, initial, {
    setTitle,
    setDescription,
    setUrl,
    setCategory,
    setType,
    setTagsStr,
    setFavorite,
    setNotes,
    setErrors,
  });

  const submit = () => {
    const e: typeof errors = {};
    if (!title.trim()) e.title = "Title is required";
    if (!url.trim()) e.url = "URL is required";
    else {
      try {
        new URL(url);
      } catch {
        e.url = "Enter a valid URL (https://…)";
      }
    }
    setErrors(e);
    if (Object.keys(e).length) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      url: url.trim(),
      category,
      resource_type: type,
      tags: tagsStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      is_favorite: favorite,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit bookmark" : "Add a new bookmark"}</DialogTitle>
          <DialogDescription>
            Capture a resource you want to revisit. Tags and notes help you find it later.
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-4 no-scrollbar max-h-[60dvh] overflow-y-auto px-4 grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="bm-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="bm-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="React Official Documentation"
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bm-url">
              URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="bm-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://react.dev"
              className="font-mono"
            />
            {errors.url && <p className="text-xs text-destructive">{errors.url}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bm-desc">Description</Label>
            <Textarea
              id="bm-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this resource about?"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Resource Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as ResourceType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bm-tags">Tags</Label>
            <Input
              id="bm-tags"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="react, hooks, ssr (comma separated)"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bm-notes">Notes</Label>
            <Textarea
              id="bm-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional personal notes"
            />
          </div>

          <div className="flex items-center justify-between rounded-md border border-input bg-muted/30 px-3 py-2">
            <div className="flex items-center gap-2">
              <Star className="size-4 text-warning" />
              <Label htmlFor="bm-fav" className="cursor-pointer text-sm">
                Mark as favorite
              </Label>
            </div>
            <Switch id="bm-fav" checked={favorite} onCheckedChange={setFavorite} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>{initial ? "Save changes" : "Add bookmark"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper to reset form when dialog opens
function useMemoReset(
  open: boolean,
  initial: Bookmark | null,
  setters: {
    setTitle: (v: string) => void;
    setDescription: (v: string) => void;
    setUrl: (v: string) => void;
    setCategory: (v: Category) => void;
    setType: (v: ResourceType) => void;
    setTagsStr: (v: string) => void;
    setFavorite: (v: boolean) => void;
    setNotes: (v: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    setErrors: (v: {}) => void;
  },
) {
  // intentionally re-run when open or initial changes
  useEffect(() => {
    if (!open) return;
    setters.setTitle(initial?.title ?? "");
    setters.setDescription(initial?.description ?? "");
    setters.setUrl(initial?.url ?? "");
    setters.setCategory((initial?.category as Category) ?? "Frontend");
    setters.setType((initial?.resource_type as ResourceType) ?? "Documentation");
    setters.setTagsStr(initial?.tags.join(", ") ?? "");
    setters.setFavorite(initial?.is_favorite ?? false);
    setters.setNotes(initial?.notes ?? "");
    setters.setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initial]);
}

/* ---------- Details Sheet ---------- */

function BookmarkDetailsSheet({
  bookmark,
  onOpenChange,
  onEdit,
  onDelete,
}: {
  bookmark: Bookmark | null;
  onOpenChange: (v: boolean) => void;
  onEdit: (b: Bookmark) => void;
  onDelete: (id: string) => void;
}) {
  const open = !!bookmark;
  const TypeIcon = bookmark ? TYPE_ICON[bookmark.resource_type] : Globe;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {bookmark && (
          <>
            <SheetHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
                  <img
                    src={faviconOf(bookmark.url)}
                    alt=""
                    className="size-6"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <SheetTitle className="truncate text-left text-lg">{bookmark.title}</SheetTitle>
                  <SheetDescription className="truncate text-left font-mono text-xs">
                    {domainOf(bookmark.url)}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6 px-3.5">
              <div className="aspect-video w-full overflow-hidden rounded-lg border border-border bg-linear-to-br from-primary/10 via-info/5 to-card">
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <TypeIcon className="size-10" />
                  <div className="text-xs font-medium uppercase tracking-wider">
                    {bookmark.resource_type}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  About
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                  {bookmark.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  URL
                </h4>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block break-all rounded-md border border-input bg-muted/40 px-3 py-2 font-mono text-xs text-primary hover:bg-muted/70"
                >
                  {bookmark.url}
                </a>
              </div>

              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Tags
                </h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {bookmark.tags.length === 0 && (
                    <span className="text-xs text-muted-foreground">No tags</span>
                  )}
                  {bookmark.tags.map((t) => (
                    <Badge key={t} variant="outline" className="font-mono text-[10px]">
                      <TagIcon className="size-2.5" />
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-3 gap-3">
                <StatBox label="Visits" value={bookmark.visit_count.toString()} icon={Eye} />
                <StatBox label="Added" value={formatDate(bookmark.created_at)} icon={Calendar} />
                <StatBox
                  label="Last visit"
                  value={formatDate(bookmark.last_visited_at)}
                  icon={Clock}
                />
              </div>

              <div>
                <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Notes
                </h4>
                <div className="mt-2 rounded-md border border-input bg-muted/30 p-3 text-sm text-foreground/90">
                  {bookmark.notes || (
                    <span className="text-muted-foreground">No notes yet.</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 pb-6 sm:flex-row">
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (typeof window !== "undefined")
                      window.open(bookmark.url, "_blank", "noopener,noreferrer");
                  }}
                >
                  <ExternalLink className="size-4" /> Open Resource
                </Button>
                <Button variant="outline" onClick={() => onEdit(bookmark)}>
                  <Pencil className="size-4" /> Edit
                </Button>
                <Button
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onDelete(bookmark.id)}
                >
                  <Trash2 className="size-4" /> Delete
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function StatBox({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3" />
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-semibold">{value}</div>
    </div>
  );
}

/* ---------- CSV helpers ---------- */

const CSV_COLUMNS = [
  "title",
  "url",
  "description",
  "category",
  "resource_type",
  "tags",
  "is_favorite",
  "visit_count",
  "notes",
  "created_at",
  "updated_at",
  "last_visited_at",
] as const;

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function bookmarksToCsv(items: Bookmark[]): string {
  const header = CSV_COLUMNS.join(",");
  const rows = items.map((b) =>
    CSV_COLUMNS.map((col) => {
      if (col === "tags") return csvEscape(b.tags.join("|"));
      if (col === "is_favorite") return b.is_favorite ? "true" : "false";
      return csvEscape((b as unknown as Record<string, unknown>)[col]);
    }).join(","),
  );
  return [header, ...rows].join("\n");
}

{/* function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") {
        row.push(field);
        field = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += ch;
      }
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ""));
} */}

{/* function csvToBookmarks(text: string): Bookmark[] {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim());
  const now = new Date().toISOString();
  const out: Bookmark[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rec: Record<string, string> = {};
    header.forEach((h, idx) => (rec[h] = row[idx] ?? ""));
    if (!rec.url || !rec.title) continue;
    out.push({
      id: crypto.randomUUID(),
      title: rec.title,
      url: rec.url,
      description: rec.description ?? "",
      category: (rec.category as Category) || "Frontend",
      resource_type: (rec.resource_type as ResourceType) || "Other",
      tags: rec.tags ? rec.tags.split("|").map((t) => t.trim()).filter(Boolean) : [],
      is_favorite: /^(true|1|yes)$/i.test(rec.is_favorite ?? ""),
      visit_count: Number.parseInt(rec.visit_count ?? "0", 10) || 0,
      notes: rec.notes || undefined,
      created_at: rec.created_at || now,
      updated_at: rec.updated_at || now,
      last_visited_at: rec.last_visited_at || undefined,
    });
  }
  return out;
} */}
