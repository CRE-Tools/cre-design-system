import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { UnityBridgeApi, UnityBridgeEvent, UnityThemePayload } from './types';
import { createUnityInstanceWithBridge } from './unityLoader';

export type UnityCanvasProps = {
  buildRoot: string;
  loaderFileName: string;
  dataFileName: string;
  frameworkFileName: string;
  codeFileName: string;

  canvasId?: string;

  bootDelayMs?: number;

  gameObjectName?: string;
  receiveMethodName?: string;

  theme?: UnityThemePayload;
  interactionModules?: string[];

  onEvent?: (evt: UnityBridgeEvent) => void;
  debugLog?: (message: string, data?: unknown) => void;
  style?: React.CSSProperties;
};

function join(root: string, file: string) {
  return `${root.replace(/\/$/, '')}/${file.replace(/^\//, '')}`;
}

export const UnityCanvas = forwardRef<UnityBridgeApi, UnityCanvasProps>(function UnityCanvas(
  {
    buildRoot,
    loaderFileName,
    dataFileName,
    frameworkFileName,
    codeFileName,
    canvasId = 'cre-unity-canvas',
    bootDelayMs = 0,
    gameObjectName,
    receiveMethodName,
    theme,
    interactionModules,
    onEvent,
    debugLog,
    style
  },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);
  const [unityCreated, setUnityCreated] = useState(false);

  const build = useMemo(
    () => ({
      loaderUrl: join(buildRoot, loaderFileName),
      dataUrl: join(buildRoot, dataFileName),
      frameworkUrl: join(buildRoot, frameworkFileName),
      codeUrl: join(buildRoot, codeFileName)
    }),
    [buildRoot, codeFileName, dataFileName, frameworkFileName, loaderFileName]
  );

  const stateRef = useRef<{
    unity?: Awaited<ReturnType<typeof createUnityInstanceWithBridge>>;
    destroyed?: boolean;
  }>({});

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!canvasRef.current) return;

      const unity = await createUnityInstanceWithBridge({
        canvas: canvasRef.current,
        build,
        debugLog,
        onEvent: (evt) => {
          if (evt.type === 'ready') setReady(true);
          onEvent?.(evt);
        },
        onProgress: undefined,
        gameObjectName,
        receiveMethodName
      });

      if (!mounted) {
        await unity.unityInstance.Quit();
        unity.destroyLoaderScript();
        return;
      }

      stateRef.current.unity = unity;
      setUnityCreated(true);
    })();

    return () => {
      mounted = false;
      stateRef.current.destroyed = true;
      const u = stateRef.current.unity;
      if (u) {
        u.unityInstance.Quit().finally(() => {
          u.destroyLoaderScript();
        });
      }
    };
  }, [build, gameObjectName, receiveMethodName]);

  const api = useMemo<UnityBridgeApi>(() => {
    return {
      isReady: () => ready,
      destroy: () => {
        const u = stateRef.current.unity;
        if (u) {
          u.unityInstance.Quit().finally(() => u.destroyLoaderScript());
        }
      },
      setTheme: (t) => {
        const u = stateRef.current.unity;
        if (!u) return;
        u.sendJson(JSON.stringify({ type: 'setTheme', payload: t }));
      },
      setInteractionModules: (modules) => {
        const u = stateRef.current.unity;
        if (!u) return;
        u.sendJson(JSON.stringify({ type: 'setInteractionModules', payload: { modules } }));
      },
      spawn: (id) => {
        const u = stateRef.current.unity;
        if (!u) return;
        u.sendJson(JSON.stringify({ type: 'spawn', payload: { id } }));
      },
      updateButton: (cmd) => {
        const u = stateRef.current.unity;
        if (!u) return;
        u.sendJson(JSON.stringify(cmd));
      }
    };
  }, [ready]);

  useImperativeHandle(ref, () => api, [api]);

  useEffect(() => {
    if (!unityCreated) return;
    if (!theme && !interactionModules) return;

    const t = window.setTimeout(() => {
      if (theme) {
        debugLog?.('apply:setTheme (delayed)', theme);
        api.setTheme(theme);
      }
      if (interactionModules) {
        debugLog?.('apply:setInteractionModules (delayed)', interactionModules);
        api.setInteractionModules(interactionModules);
      }
    }, bootDelayMs);

    return () => window.clearTimeout(t);
  }, [api, bootDelayMs, debugLog, interactionModules, theme, unityCreated]);

  return (
    <canvas
      id={canvasId}
      ref={canvasRef}
      style={{ width: '100%', height: 480, display: 'block', ...style }}
    />
  );
});
