"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface DownloadNotificationContextType {
  hasNewDownload: boolean;
  setHasNewDownload: (value: boolean) => void;
  clearNotification: () => void;
}

const DownloadNotificationContext = createContext<
  DownloadNotificationContextType | undefined
>(undefined);

export function DownloadNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasNewDownload, setHasNewDownload] = useState(false);
  const { data: session } = useSession();

  // Load notification state from localStorage on mount
  useEffect(() => {
    if (session?.user?.email) {
      const stored = localStorage.getItem(
        `download_notification_${session.user.email}`
      );
      if (stored === "true") {
        setHasNewDownload(true);
      }
    }
  }, [session]);

  // Save notification state to localStorage
  useEffect(() => {
    if (session?.user?.email) {
      localStorage.setItem(
        `download_notification_${session.user.email}`,
        hasNewDownload.toString()
      );
    }
  }, [hasNewDownload, session]);

  const clearNotification = () => {
    setHasNewDownload(false);
    if (session?.user?.email) {
      localStorage.removeItem(`download_notification_${session.user.email}`);
    }
  };

  return (
    <DownloadNotificationContext.Provider
      value={{ hasNewDownload, setHasNewDownload, clearNotification }}
    >
      {children}
    </DownloadNotificationContext.Provider>
  );
}

export function useDownloadNotification() {
  const context = useContext(DownloadNotificationContext);
  if (context === undefined) {
    throw new Error(
      "useDownloadNotification must be used within a DownloadNotificationProvider"
    );
  }
  return context;
}