"use client";

import { useState } from "react";
import { MessageCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Chatbox from "@/components/chatbox";
import Help from "@/components/help";

export default function FloatingButtons() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      {/* Floating Buttons Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Help Button */}
        <Button
          onClick={() => setIsHelpOpen(true)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 transition-all hover:scale-110"
        >
          <HelpCircle className="h-6 w-6 text-white dark:text-slate-900" />
        </Button>

        {/* Chat Button */}
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

      {/* Help Dialog */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
          <Help />
        </DialogContent>
      </Dialog>
    </>
  );
}