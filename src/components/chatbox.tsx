"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MessageCircle, Send, Download, FileText } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface ProjectData {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  file_url: string;
  language: string[];
  tags: string[];
  download_count: number;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  projects?: ProjectData[];
}

// Helper function untuk warna language
const languageColor = (lang?: string): string => {
  const normalized = lang?.toLowerCase().trim();
  switch (normalized) {
    case "next.js":
    case "nextjs":
      return "bg-slate-500";
    case "golang":
    case "go":
      return "bg-cyan-400";
    case "typescript":
    case "ts":
      return "bg-blue-500";
    case "javascript":
    case "js":
      return "bg-yellow-400";
    case "java":
      return "bg-orange-500";
    case "dart":
      return "bg-teal-500";
    case "blade":
      return "bg-red-500";
    case "html":
      return "bg-orange-600";
    case "css":
      return "bg-blue-400";
    case "python":
    case "py":
      return "bg-blue-600";
    case "php":
      return "bg-indigo-500";
    case "ruby":
      return "bg-red-600";
    case "rust":
      return "bg-orange-700";
    case "c++":
    case "cpp":
      return "bg-pink-500";
    case "c#":
    case "csharp":
      return "bg-purple-600";
    default:
      return "bg-gray-500";
  }
};

export default function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Halo! Ada yang bisa saya bantu?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePopoverOpen, setImagePopoverOpen] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState<Record<string, number>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleProjectClick = (projectId: string) => {
    const currentCount = clickCount[projectId] || 0;

    if (currentCount === 0) {
      setImagePopoverOpen(projectId);
      setClickCount({ ...clickCount, [projectId]: 1 });
      setTimeout(() => {
        setClickCount((prev) => ({ ...prev, [projectId]: 0 }));
      }, 500);
    } else if (currentCount === 1) {
      window.open(`/projects/${projectId}`, "_blank");
      setClickCount({ ...clickCount, [projectId]: 0 });
      setImagePopoverOpen(null);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue }),
      });

      const data = await res.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "Saya tidak mengerti maksud Anda 😅",
        sender: "bot",
        timestamp: new Date(),
        projects: data.projects || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 2).toString(),
        text: "Terjadi kesalahan saat menghubungi server.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white dark:text-slate-900" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Chat Support
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Online - Biasanya membalas dalam beberapa menit
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>

                {/* Project Cards */}
                {message.projects && message.projects.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.projects.map((project) => (
                      <Card
                        key={project.id}
                        className="flex flex-col border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 transition-colors bg-white dark:bg-slate-900"
                      >
                        <div className="p-3 space-y-2">
                          {/* Title with Icon */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <FileText className="h-4 w-4 text-slate-500 flex-shrink-0" />
                              {project.image_url ? (
                                <Popover
                                  open={imagePopoverOpen === project.id}
                                  onOpenChange={(open) => {
                                    if (!open) setImagePopoverOpen(null);
                                  }}
                                >
                                  <PopoverTrigger asChild>
                                    <span
                                      className="font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate cursor-pointer text-sm"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleProjectClick(project.id);
                                      }}
                                    >
                                      {project.title}
                                    </span>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-72 p-0"
                                    side="top"
                                  >
                                    <img
                                      src={project.image_url}
                                      alt={project.title}
                                      className="rounded-md object-cover w-full"
                                    />
                                  </PopoverContent>
                                </Popover>
                              ) : (
                                <a
                                  href={`/projects/${project.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline truncate cursor-pointer text-sm"
                                >
                                  {project.title}
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 min-h-[32px]">
                            {project.description || "No description available"}
                          </p>

                          {/* Footer: Language & Download */}
                          <div className="flex w-full items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {project.language &&
                                project.language.length > 0 && (
                                  <>
                                    <span
                                      className={`h-3 w-3 rounded-full flex-shrink-0 ${languageColor(
                                        project.language[0]
                                      )}`}
                                      title={project.language[0]}
                                    />
                                    <span className="truncate">
                                      {project.language[0]}
                                    </span>
                                  </>
                                )}
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div
                                className="flex items-center gap-1"
                                title="Download Count"
                              >
                                <Download className="h-4 w-4" />
                                <span>{project.download_count ?? 0}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-slate-500 hover:text-slate-700 text-xs"
                                onClick={() =>
                                  window.open(
                                    `/projects/${project.id}`,
                                    "_blank"
                                  )
                                }
                                title="Lihat Detail"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">Detail</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-slate-300 dark:text-slate-600"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pesan..."
            disabled={isLoading}
            className="flex-1 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            disabled={isLoading}
            className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 disabled:opacity-50"
          >
            <Send className="h-4 w-4 text-white dark:text-slate-900" />
          </Button>
        </div>
      </div>
    </div>
  );
}