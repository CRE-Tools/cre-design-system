import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { UnityBridgeApi, UnityBridgeEvent, UnityThemePayload } from './types';

export type UnityBridgeController = {
  apiRef: React.MutableRefObject<UnityBridgeApi | null>;
  ready: boolean;
  lastEvent: UnityBridgeEvent | null;
  onEvent: (evt: UnityBridgeEvent) => void;

  setTheme: (theme: UnityThemePayload) => void;
  setInteractionModules: (modules: string[]) => void;
  spawn: (id: string) => void;
};

export function useUnityBridge(): UnityBridgeController {
  const apiRef = useRef<UnityBridgeApi | null>(null);
  const [ready, setReady] = useState(false);
  const [lastEvent, setLastEvent] = useState<UnityBridgeEvent | null>(null);

  const onEvent = useCallback((evt: UnityBridgeEvent) => {
    setLastEvent(evt);
    if (evt.type === 'ready') setReady(true);
  }, []);

  const setTheme = useCallback((theme: UnityThemePayload) => {
    apiRef.current?.setTheme(theme);
  }, []);

  const setInteractionModules = useCallback((modules: string[]) => {
    apiRef.current?.setInteractionModules(modules);
  }, []);

  const spawn = useCallback((id: string) => {
    apiRef.current?.spawn(id);
  }, []);

  return useMemo(
    () => ({
      apiRef,
      ready,
      lastEvent,
      setTheme,
      setInteractionModules,
      spawn,
      onEvent
    }),
    [lastEvent, onEvent, ready, setInteractionModules, setTheme, spawn]
  );
}
