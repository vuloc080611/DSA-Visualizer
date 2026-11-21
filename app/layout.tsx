import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "DSA Visualizer – Trực Quan Hóa Thuật Toán Tương Tác",
  description:
    "Web application trực quan hóa 12+ thuật toán Cấu trúc dữ liệu & Giải thuật tương tác với animation 60 FPS, step-by-step, code đa ngôn ngữ (C++, Python, TypeScript) và phân tích Big-O.",
  keywords: [
    "DSA Visualizer",
    "Data Structures",
    "Algorithms",
    "Sorting Visualizer",
    "Graph Visualizer",
    "BFS",
    "DFS",
    "Next.js 15",
    "TypeScript",
    "Framer Motion",
    "Vũ Lộc",
    "IUH",
  ],
  authors: [{ name: "Vũ Lộc", url: "https://github.com" }],
  creator: "Vũ Lộc",
  openGraph: {
    title: "DSA Visualizer – Interactive Algorithm Visualization Web App",
    description: "Trực quan hóa thuật toán DSA mượt mà bằng Next.js 15 & Framer Motion",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
