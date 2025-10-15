"use client";
import Chatbox from "@/components/chatbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function FloatingButtons() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsChatOpen(true)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 transition-all hover:scale-110"
        >
          <MessageCircle className="h-6 w-6 text-white dark:text-slate-900" />
        </Button>
      </div>
      {/* Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
          <Chatbox />
        </DialogContent>
      </Dialog>
    </>
  );
}