"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
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
  { id: "array", label: "Array & Window", icon: Layers },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Global Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCategoryClick = (categoryId: AlgorithmCategory) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);

    if (pathname === "/") {
      // Trigger category selection event on homepage
      window.dispatchEvent(new CustomEvent("select-category", { detail: categoryId }));
      const el = document.getElementById("algorithms");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
      window.history.pushState(null, "", `/#${categoryId}`);
    } else {
      router.push(`/#${categoryId}`);
    }
  };

  const handleMouseEnter = (catId: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(catId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  <span>DSA</span>
                  <span className="text-emerald-500 dark:text-emerald-400">Visualizer</span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Next.js 15
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Interactive Algorithm Learning
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links with Dropdowns */}
            <nav className="hidden md:flex items-center gap-1">
              {CATEGORIES_DATA.map((cat) => {
                const Icon = cat.icon;
                const algs = ALGORITHMS.filter((a) => a.category === cat.id);
                const isOpen = activeDropdown === cat.id;

                return (
                  <div
                    key={cat.id}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(cat.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => handleCategoryClick(cat.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all",
                        isOpen
                          ? "bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400"
                          : "text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      )}
                    >
                      <Icon className="w-4 h-4 text-emerald-500" />
                      <span>{cat.label}</span>
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 text-slate-400 transition-transform duration-200",
                          isOpen ? "rotate-180 text-emerald-500" : ""
                        )}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div className="absolute top-full left-0 w-72 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 space-y-1">
                          <div className="px-3 py-1.5 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80">
                            <span>Danh sách thuật toán</span>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                              {algs.length}
                            </span>
                          </div>

                          <div className="max-h-64 overflow-y-auto space-y-0.5 pt-1">
                            {algs.map((alg) => (
                              <Link
                                key={alg.id}
                                href={`/visualizer/${alg.id}`}
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
                              >
                                <span>{alg.name}</span>
                                <span className="font-mono text-[10px] text-slate-400 group-hover:text-emerald-500">
                                  {alg.complexity.average}
                                </span>
                              </Link>
                            ))}
                          </div>

                          <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                            <button
                              onClick={() => handleCategoryClick(cat.id)}
                              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              <span>Xem tất cả {cat.label}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Controls: Search + GitHub + Theme */}
            <div className="flex items-center gap-2">
              {/* Quick Search Button */}
              <button
                onClick={() => setSearchModalOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 transition-colors text-xs font-medium"
                title="Tìm kiếm thuật toán (Ctrl + K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Tìm nhanh...</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => setSearchModalOpen(true)}
                className="sm:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="https://github.com/vuloc080611/DSA-Visualizer"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:border-slate-700"
                title="GitHub Repository"
              >
                <GithubIcon className="w-5 h-5" />
              </Link>

              <ThemeToggle />

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-5 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Tìm kiếm thuật toán...</span>
              </div>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border text-xs">
                Ctrl+K
              </kbd>
            </button>

            <div className="space-y-1 pt-1">
              {CATEGORIES_DATA.map((cat) => {
                const Icon = cat.icon;
                const algs = ALGORITHMS.filter((a) => a.category === cat.id);

                return (
                  <div key={cat.id} className="space-y-1">
                    <button
                      onClick={() => handleCategoryClick(cat.id)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-emerald-500" />
                        <span>{cat.label}</span>
                      </div>
                      <span className="text-xs text-slate-400">({algs.length})</span>
                    </button>

                    <div className="pl-8 pr-2 space-y-0.5 border-l-2 border-slate-100 dark:border-slate-800 ml-4">
                      {algs.map((alg) => (
                        <Link
                          key={alg.id}
                          href={`/visualizer/${alg.id}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1.5 px-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-500"
                        >
                          {alg.name}
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

      {/* Global Search Dialog */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
