export type UnityThemeMode = 'light' | 'dark';

export type UnityThemePayload = {
  mode: UnityThemeMode;
  primary?: string;
  background?: string;
  text?: string;
};

export type UnityBridgeCommand =
  | { type: 'setTheme'; payload: UnityThemePayload }
  | { type: 'setInteractionModules'; payload: { modules: string[] } }
  | { type: 'spawn'; payload: { id: string } }
  | {
      type: 'updateButton';
      payload: {
        id: string;
        text?: string;
        background?: string;
        textColor?: string;
        disabled?: boolean;
      };
    };

export type UnityBridgeEvent =
  | { type: 'ready'; payload?: Record<string, never> }
  | { type: 'ack'; payload?: unknown }
  | { type: 'error'; payload?: { message: string } };

export type UnityBridgeApi = {
  isReady: () => boolean;
  destroy: () => void;

  setTheme: (theme: UnityThemePayload) => void;
  setInteractionModules: (modules: string[]) => void;
  spawn: (id: string) => void;
  updateButton: (args: UnityBridgeCommand & { type: 'updateButton' }) => void;
};
