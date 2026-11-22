import Link from "next/link";
import { Heart, Sparkles, GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                DSA <span className="text-emerald-500">Visualizer</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Dự án web ứng dụng trực quan hóa 12+ thuật toán Cấu trúc dữ liệu & Giải thuật tương tác cao, phục vụ học tập, ôn tập phỏng vấn kỹ thuật và tuyển dụng.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <GraduationCap className="w-4 h-4 text-emerald-500" />
              <span>
                Thực hiện bởi: <strong>Vũ Lộc</strong> – Sinh viên năm 3 CNTT, Trường Đại học Công nghiệp TP.HCM (IUH)
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">
              Chủ đề thuật toán
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/#sorting" className="hover:text-emerald-500 transition-colors">
                  Sorting (Sắp xếp)
                </Link>
              </li>
              <li>
                <Link href="/#searching" className="hover:text-emerald-500 transition-colors">
                  Searching (Tìm kiếm)
                </Link>
              </li>
              <li>
                <Link href="/#graph" className="hover:text-emerald-500 transition-colors">
                  Graph (Đồ thị BFS/DFS)
                </Link>
              </li>
              <li>
                <Link href="/#array" className="hover:text-emerald-500 transition-colors">
                  Array & Window (Two Sum, Kadane)
                </Link>
              </li>
              <li>
                <Link href="/#tree" className="hover:text-emerald-500 transition-colors">
                  Tree (BST & AVL Tree)
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Next.js 15</span>
              <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">TypeScript</span>
              <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Tailwind CSS</span>
              <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Framer Motion</span>
              <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">next-themes</span>
              <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">Lucide React</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
          <p>© 2026 DSA Visualizer. Mọi quyền được bảo lưu.</p>
          <div className="flex items-center gap-1">
            <span>Built with passion &</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>by Vũ Lộc (IUH)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
