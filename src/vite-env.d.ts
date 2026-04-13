/// <reference types="vite/client" />

interface Window {
  aif?: {
    track: (event: string, props?: Record<string, unknown>) => void;
  };
}
