"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { SearchModal } from "./SearchModal";
import { ALGORITHMS } from "@/lib/algorithms";
import { AlgorithmCategory } from "@/lib/types";
import {
  Code2,
  BarChart2,
  Search,
  Network,
  Layers,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Swords,
  GitFork,
  Compass,
  Link2,
  Calculator,
  Crown,
  CaseSensitive,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

interface NavCategory {
  id: AlgorithmCategory;
  label: string;
  icon: typeof BarChart2;
}

const CATEGORIES_DATA: NavCategory[] = [
  { id: "sorting", label: "Sorting", icon: BarChart2 },
  { id: "searching", label: "Searching", icon: Search },
  { id: "graph", label: "Graph", icon: Network },
  { id: "tree", label: "Tree", icon: GitFork },
  { id: "string", label: "Chuỗi & Trie", icon: CaseSensitive },
  { id: "array", label: "Array", icon: Layers },
  { id: "linked-list", label: "Linked List", icon: Link2 },
  { id: "stack-queue", label: "Stack & Queue", icon: Layers },
  { id: "pathfinding", label: "Pathfinding", icon: Compass },
  { id: "dp", label: "Quy hoạch động", icon: Calculator },
  { id: "backtracking", label: "Quay lui", icon: Crown },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownCoords, setDropdownCoords] = useState<{ left: number; top: number } | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Identify active category based on current visualizer page route
  const activeCategoryFromRoute = (() => {
    if (pathname.startsWith("/visualizer/")) {
      const algId = pathname.replace("/visualizer/", "");
      const alg = ALGORITHMS.find((a) => a.id === algId);
      return alg ? alg.category : null;
    }
    return null;
  })();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Global Ctrl+K / ⌘K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setActiveDropdown(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close floating dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (activeDropdown) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeDropdown]);

  const handleCategoryClick = (categoryId: AlgorithmCategory | "all") => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);

    if (pathname === "/") {
      window.dispatchEvent(new CustomEvent("select-category", { detail: categoryId }));
      const el = document.getElementById("algorithms");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      if (categoryId !== "all") {
        window.history.pushState(null, "", `/#${categoryId}`);
      } else {
        window.history.pushState(null, "", "/");
      }
    } else {
      router.push(categoryId === "all" ? "/#algorithms" : `/#${categoryId}`);
    }
  };

  const handleMouseEnter = (catId: string, event: React.MouseEvent<HTMLElement>) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    const rect = event.currentTarget.getBoundingClientRect();
    const dropdownWidth = 280;
    let left = rect.left;
    if (typeof window !== "undefined" && left + dropdownWidth > window.innerWidth - 16) {
      left = window.innerWidth - dropdownWidth - 16;
    }
    setDropdownCoords({ left: Math.max(12, left), top: rect.bottom + 4 });
    setActiveDropdown(catId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 160);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-colors shadow-xs">
        {/* ================= TIER 1: MAIN HEADER ================= */}
        <div className="border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Brand Logo */}
              <Link href="/" className="flex items-center gap-3 group shrink-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                    <span>DSA</span>
                    <span className="text-emerald-500 dark:text-emerald-400">Visualizer</span>
                    <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 whitespace-nowrap">
                      Next.js 15
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block whitespace-nowrap">
                    Interactive Algorithm Learning
                  </p>
                </div>
              </Link>

              {/* Right Global Actions */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Quick Search Spotlight Button */}
                <button
                  onClick={() => setSearchModalOpen(true)}
                  className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 hover:bg-slate-200/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-medium w-44 lg:w-56 shadow-2xs group cursor-pointer"
                  title="Tìm kiếm thuật toán (Ctrl + K / ⌘K)"
                >
                  <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors shrink-0" />
                  <span className="truncate">Tìm kiếm thuật toán...</span>
                  <kbd className="ml-auto px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400 dark:text-slate-500 shadow-2xs shrink-0">
                    ⌘K
                  </kbd>
                </button>

                {/* Mobile Search Icon Button */}
                <button
                  onClick={() => setSearchModalOpen(true)}
                  className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Tìm kiếm thuật toán"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Compare / Race Mode Link */}
                <Link
                  href="/compare"
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0",
                    pathname === "/compare"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25"
                      : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/70 hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:border-amber-300 dark:hover:border-amber-700"
                  )}
                >
                  <Swords className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="hidden sm:inline">So sánh</span>
                  <span className="sm:hidden">Race</span>
                  <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-amber-200/90 dark:bg-amber-900/90 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shrink-0">
                    4-Way
                  </span>
                </Link>

                {/* Live Code Playground Link */}
                <Link
                  href="/playground"
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0",
                    pathname === "/playground"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25"
                      : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:border-emerald-300 dark:hover:border-emerald-700"
                  )}
                >
                  <Terminal className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="hidden sm:inline">Playground</span>
                  <span className="sm:hidden">Code</span>
                  <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-emerald-200/90 dark:bg-emerald-900/90 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 shrink-0">
                    Live
                  </span>
                </Link>

                <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

                {/* GitHub Repository Link */}
                <Link
                  href="https://github.com/vuloc080611/DSA-Visualizer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  title="Mã nguồn GitHub"
                >
                  <GithubIcon className="w-5 h-5" />
                </Link>

                {/* Dark/Light Theme Toggle */}
                <ThemeToggle />

                {/* Mobile Menu Hamburger */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= TIER 2: CATEGORY RIBBON / SUB-NAV ================= */}
        <div className="bg-slate-50/70 dark:bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-11 overflow-x-auto no-scrollbar scroll-smooth gap-1 sm:gap-1.5 py-1">
              {/* "Tất cả" Filter Button */}
              <button
                onClick={() => handleCategoryClick("all")}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer",
                  pathname === "/" && !activeCategoryFromRoute
                    ? "text-emerald-600 dark:text-emerald-400 font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/60 dark:hover:bg-slate-800/60"
                )}
              >
                {pathname === "/" && !activeCategoryFromRoute && (
                  <motion.div
                    layoutId="navbar-ribbon-active"
                    className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-emerald-500/30 -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 32 }}
                  />
                )}
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Tất cả</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {ALGORITHMS.length}
                </span>
              </button>

              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 shrink-0 mx-0.5" />

              {/* Categories */}
              {CATEGORIES_DATA.map((cat) => {
                const Icon = cat.icon;
                const algs = ALGORITHMS.filter((a) => a.category === cat.id);
                const isOpen = activeDropdown === cat.id;
                const isActive = activeCategoryFromRoute === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    onMouseEnter={(e) => handleMouseEnter(cat.id, e)}
                    onMouseLeave={handleMouseLeave}
                    className={cn(
                      "relative group flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer",
                      isActive || isOpen
                        ? "text-emerald-600 dark:text-emerald-400 font-bold"
                        : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/60 dark:hover:bg-slate-800/60"
                    )}
                  >
                    {(isActive || isOpen) && (
                      <motion.div
                        layoutId="navbar-ribbon-active"
                        className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-emerald-500/30 -z-10"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <Icon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{cat.label}</span>
                    <span
                      className={cn(
                        "text-[10px] font-mono px-1.5 py-0.2 rounded-full transition-colors",
                        isActive || isOpen
                          ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300"
                          : "bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-950/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-300"
                      )}
                    >
                      {algs.length}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0",
                        isOpen ? "rotate-180 text-emerald-500" : "group-hover:text-slate-600 dark:group-hover:text-slate-300"
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Quick Search in Drawer */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 text-sm"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-emerald-500" />
                <span>Tìm kiếm thuật toán...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border text-xs font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Race Mode Link in Drawer */}
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800"
            >
              <div className="flex items-center gap-2.5">
                <Swords className="w-4 h-4 text-amber-500" />
                <span>So sánh 4 làn (Grand Prix Race)</span>
              </div>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                4-Way
              </span>
            </Link>

            {/* Live Code Playground in Drawer */}
            <Link
              href="/playground"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800"
            >
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <span>Trình gõ code trực tiếp (Playground)</span>
              </div>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                Live
              </span>
            </Link>

            {/* Categories & Algorithms List */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
                Danh mục thuật toán ({ALGORITHMS.length})
              </p>

              {CATEGORIES_DATA.map((cat) => {
                const Icon = cat.icon;
                const algs = ALGORITHMS.filter((a) => a.category === cat.id);

                return (
                  <div key={cat.id} className="rounded-xl border border-slate-100 dark:border-slate-800/80 p-2 space-y-1">
                    <button
                      onClick={() => handleCategoryClick(cat.id)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-emerald-500" />
                        <span>{cat.label}</span>
                      </div>
                      <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500">
                        {algs.length}
                      </span>
                    </button>

                    <div className="pl-6 pr-1 space-y-0.5 border-l-2 border-slate-200 dark:border-slate-800 ml-2">
                      {algs.map((alg) => (
                        <Link
                          key={alg.id}
                          href={`/visualizer/${alg.id}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between py-1.5 px-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-500 rounded-md"
                        >
                          <span>{alg.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {alg.complexity.average}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* ================= FLOATING DROPDOWN MENU ================= */}
      {activeDropdown && dropdownCoords && (
        <div
          style={{ position: "fixed", top: dropdownCoords.top, left: dropdownCoords.left }}
          className="w-72 z-50 animate-in fade-in zoom-in-95 duration-150"
          onMouseEnter={() => {
            if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
        >
          {(() => {
            const cat = CATEGORIES_DATA.find((c) => c.id === activeDropdown);
            if (!cat) return null;
            const algs = ALGORITHMS.filter((a) => a.category === cat.id);

            return (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 space-y-1">
                <div className="px-3 py-1.5 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <cat.icon className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{cat.label}</span>
                  </span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono font-bold text-slate-600 dark:text-slate-300">
                    {algs.length} thuật toán
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-0.5 pt-1">
                  {algs.map((alg) => (
                    <Link
                      key={alg.id}
                      href={`/visualizer/${alg.id}`}
                      onClick={() => setActiveDropdown(null)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors group",
                        pathname === `/visualizer/${alg.id}`
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                          : "text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400"
                      )}
                    >
                      <span className="truncate pr-2">{alg.name}</span>
                      <span className="font-mono text-[10px] text-slate-400 group-hover:text-emerald-500 shrink-0">
                        {alg.complexity.average}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <span>Xem tất cả {cat.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Global Quick Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
