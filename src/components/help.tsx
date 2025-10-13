"use client";

import { HelpCircle, Search, Book, MessageSquare, Mail, FileQuestion } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

const helpCategories = [
  {
    icon: Book,
    title: "Panduan Penggunaan",
    description: "Pelajari cara menggunakan semua fitur website",
    articles: ["Cara navigasi website", "Mengunduh project", "Filter dan pencarian"],
  },
  {
    icon: MessageSquare,
    title: "FAQ",
    description: "Pertanyaan yang sering ditanyakan",
    articles: ["Apa itu Syn_Taxx?", "Bagaimana cara menghubungi?", "Lisensi project"],
  },
  {
    icon: FileQuestion,
    title: "Troubleshooting",
    description: "Solusi untuk masalah umum",
    articles: ["File tidak bisa diunduh", "Error saat membuka project", "Masalah kompatibilitas"],
  },
  {
    icon: Mail,
    title: "Hubungi Kami",
    description: "Butuh bantuan lebih lanjut?",
    articles: ["Email support", "Form kontak", "Media sosial"],
  },
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = helpCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.articles.some((article) =>
        article.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="flex flex-col h-[500px] w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-white dark:text-slate-900" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
              Pusat Bantuan
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Temukan jawaban untuk pertanyaan Anda
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari bantuan..."
            className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-slate-900 dark:text-slate-100" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        {category.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {category.description}
                      </p>
                      <ul className="space-y-1">
                        {category.articles.map((article, articleIndex) => (
                          <li key={articleIndex}>
                            <a
                              href="#"
                              className="text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:underline"
                            >
                              • {article}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <FileQuestion className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">
                Tidak ada hasil yang ditemukan
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                Coba gunakan kata kunci yang berbeda
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <p className="text-sm text-center text-slate-600 dark:text-slate-400">
          Tidak menemukan yang Anda cari?{" "}
          <a
            href="#"
            className="text-slate-900 dark:text-slate-100 font-medium hover:underline"
          >
            Hubungi Support
          </a>
        </p>
      </div>
    </div>
  );
}