"use client";

import { useEffect } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

declare global {
  interface Window {
    __deferredInstallPrompt?: BeforeInstallPromptEvent;
  }
}

export function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      window.__deferredInstallPrompt = event as BeforeInstallPromptEvent;
      window.dispatchEvent(new Event("pwa-install-available"));
    };

    const onAppInstalled = () => {
      window.__deferredInstallPrompt = undefined;
      window.dispatchEvent(new Event("pwa-install-unavailable"));
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // ignore registration failures in unsupported environments
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  return null;
}
