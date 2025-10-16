"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Download, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        text: data.reply || "Saya tidak mengerti maksud Anda",
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
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.sender === "user"
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                
                {/* Project Cards */}
                {message.projects && message.projects.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {message.projects.map((project) => (
                      <div
                        key={project.id}
                        className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                      >
                        {/* Project Image */}
                        {project.image_url && (
                          <div className="relative w-full h-32">
                            <Image
                              src={project.image_url}
                              alt={project.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 400px"
                            />
                          </div>
                        )}
                        
                        {/* Project Info */}
                        <div className="p-3">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1">
                            {project.title}
                          </h4>
                          {project.description && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                              {project.description}
                            </p>
                          )}
                          
                          {/* Tags */}
                          {project.language && project.language.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {project.language.slice(0, 3).map((lang, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded"
                                >
                                  {lang}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-2">
                            <a
                              href={project.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-slate-900 dark:text-slate-100 hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Lihat Project
                            </a>
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              {project.download_count}
                            </span>
                          </div>
                        </div>
                      </div>
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
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
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