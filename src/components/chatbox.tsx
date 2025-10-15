"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Halo! Ada yang bisa saya bantu?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Terima kasih atas pesan Anda! Saya akan segera merespons.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[500px] md:h-[600px] w-full bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-900 dark:bg-slate-100 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-white dark:text-slate-900" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm md:text-base text-slate-900 dark:text-slate-100 truncate">
              Chat Support
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
              Online - Biasanya membalas dalam beberapa menit
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-3 md:p-4 bg-white dark:bg-slate-950">
        <div className="space-y-3 md:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-3 py-2 md:px-4 md:py-2.5 ${
                  message.sender === "user"
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-br-sm"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-bl-sm border border-slate-200 dark:border-slate-800"
                }`}
              >
                <p className="text-sm md:text-base leading-relaxed break-words">
                  {message.text}
                </p>
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
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ketik pesan..."
            className="flex-1 bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-600 text-sm md:text-base"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 flex-shrink-0 h-9 w-9 md:h-10 md:w-10"
          >
            <Send className="h-4 w-4 text-white dark:text-slate-900" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function FloatingButtons() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        <Button
          onClick={() => setIsChatOpen(true)}
          size="icon"
          className="h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 transition-all hover:scale-110"
        >
          <MessageCircle className="h-5 w-5 md:h-6 md:w-6 text-white dark:text-slate-900" />
        </Button>
      </div>

      {/* Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] md:max-w-md p-0 gap-0 overflow-hidden">
          <Chatbox />
        </DialogContent>
      </Dialog>
    </>
  );
}