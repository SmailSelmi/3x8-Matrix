"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallContextType {
  isInstallable: boolean;
  isInstalled: boolean;
  promptInstall: () => Promise<void>;
  highlightHeaderIcon: boolean;
  setHighlightHeaderIcon: (value: boolean) => void;
}

const InstallContext = createContext<InstallContextType>({
  isInstallable: false,
  isInstalled: false,
  promptInstall: async () => {},
  highlightHeaderIcon: false,
  setHighlightHeaderIcon: () => {},
});

export function InstallProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [highlightHeaderIcon, setHighlightHeaderIcon] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <InstallContext.Provider
      value={{
        isInstallable,
        isInstalled,
        promptInstall,
        highlightHeaderIcon,
        setHighlightHeaderIcon,
      }}
    >
      {children}
    </InstallContext.Provider>
  );
}

export function useInstallContext() {
  return useContext(InstallContext);
}
