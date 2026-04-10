import type { UnityBridgeEvent } from './types';

type UnityInstance = {
  SendMessage: (gameObjectName: string, methodName: string, value?: string) => void;
  Quit: () => Promise<void>;
};

declare global {
  interface Window {
    createUnityInstance?: (canvas: HTMLCanvasElement, config: any, onProgress?: (p: number) => void) => Promise<UnityInstance>;
    CRE_UNITY_BRIDGE?: {
      onMessage?: (json: string) => void;
    };
  }
}

export type UnityWebGLBuildPaths = {
  loaderUrl: string;
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
};

export type CreateUnityOptions = {
  canvas: HTMLCanvasElement;
  build: UnityWebGLBuildPaths;
  streamingAssetsUrl?: string;
  companyName?: string;
  productName?: string;
  productVersion?: string;
  onEvent?: (event: UnityBridgeEvent) => void;
  onProgress?: (p: number) => void;
  debugLog?: (message: string, data?: unknown) => void;
  gameObjectName?: string;
  receiveMethodName?: string;
};

export async function createUnityInstanceWithBridge(opts: CreateUnityOptions) {
  const {
    canvas,
    build,
    streamingAssetsUrl,
    companyName,
    productName,
    productVersion,
    onEvent,
    onProgress
  } = opts;

  const gameObjectName = opts.gameObjectName ?? 'CreBridge';
  const receiveMethodName = opts.receiveMethodName ?? 'Receive';
  const debugLog = opts.debugLog;

  const script = document.createElement('script');
  script.src = build.loaderUrl;
  script.async = true;

  const instancePromise = new Promise<UnityInstance>((resolve, reject) => {
    script.onload = async () => {
      try {
        if (!window.createUnityInstance) {
          reject(new Error('createUnityInstance was not found on window'));
          return;
        }

        window.CRE_UNITY_BRIDGE = window.CRE_UNITY_BRIDGE ?? {};
        window.CRE_UNITY_BRIDGE.onMessage = (json: string) => {
          try {
            const evt = JSON.parse(json) as UnityBridgeEvent;
            onEvent?.(evt);
          } catch {
            onEvent?.({ type: 'error', payload: { message: 'Invalid JSON from Unity bridge' } });
          }
        };

        const config = {
          dataUrl: build.dataUrl,
          frameworkUrl: build.frameworkUrl,
          codeUrl: build.codeUrl,
          streamingAssetsUrl,
          companyName,
          productName,
          productVersion
        };

        const unityInstance = await window.createUnityInstance(canvas, config, onProgress);
        resolve(unityInstance);
      } catch (e) {
        reject(e);
      }
    };

    script.onerror = () => reject(new Error(`Failed to load Unity loader: ${build.loaderUrl}`));
  });

  document.body.appendChild(script);

  const unityInstance = await instancePromise;

  const sendJson = (json: string) => {
    debugLog?.('send', { gameObjectName, receiveMethodName, json });
    unityInstance.SendMessage(gameObjectName, receiveMethodName, json);
  };

  return {
    unityInstance,
    sendJson,
    destroyLoaderScript: () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    }
  };
}
