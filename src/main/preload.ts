import { contextBridge, ipcRenderer } from "electron/renderer";

export const API_IDENTIFIER = 'context_bridge' as const;

export const API = {
  loadUrl(url: string) {
    ipcRenderer.invoke('load-url', url);
  },
  loadShortcuts() {
    return ipcRenderer.invoke('load-shortcuts');
  },
  addShortcut(name: string, shortcut: string) {
    return ipcRenderer.invoke('add-shortcut', name, shortcut);
  },
  removeShortcut(shortcut: string) {
    return ipcRenderer.invoke('remove-shortcut', shortcut);
  },
} as const;

contextBridge.exposeInMainWorld(API_IDENTIFIER, API);