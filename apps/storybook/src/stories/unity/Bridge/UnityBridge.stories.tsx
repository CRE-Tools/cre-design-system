import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useMemo, useRef } from 'react';
import type { UnityBridgeApi } from '@cre/unity-bridge';
import { UnityCanvas } from '@cre/unity-bridge';

const meta: Meta = {
  title: 'Unity/Bridge/UnityBridge',
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;

type Story = StoryObj;

export const Playground: Story = {
  render: (_args, context) => {
    const mode = context.globals.themeMode === 'dark' ? 'dark' : 'light';

    const bridgeRef = useRef<UnityBridgeApi | null>(null);

    const theme = useMemo(() => {
      return mode === 'dark'
        ? { mode: 'dark' as const, primary: '#591DB9', text: '#FFFFFF', background: '#0A0A0A' }
        : { mode: 'light' as const, primary: '#8A0538', text: '#000000', background: '#FFFFFF' };
    }, [mode]);

    useEffect(() => {
      const t = window.setTimeout(() => {
        console.log('[cre-unity-bridge] apply:spawn (delayed)', { id: 'cre.button' });
        bridgeRef.current?.spawn('cre.button');
      }, 5000);

      return () => window.clearTimeout(t);
    }, []);

    return (
      <div style={{ padding: 16 }}>
        <div style={{ marginBottom: 12, fontWeight: 700 }}>Unity WebGL (expected at /unity/build/)</div>
        <div style={{ marginBottom: 12, opacity: 0.8 }}>
          Place your Unity WebGL build under <code>apps/storybook/public/unity/</code>.
        </div>
        <UnityCanvas
          ref={bridgeRef}
          buildRoot="/unity/build"
          loaderFileName="Build.loader.js"
          dataFileName="Build.data.br"
          frameworkFileName="Build.framework.js.br"
          codeFileName="Build.wasm.br"
          bootDelayMs={5000}
          theme={theme}
          interactionModules={['cameraParallax']}
          debugLog={(message: string, data?: unknown) => console.log(`[cre-unity-bridge] ${message}`, data)}
          style={{ borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)' }}
        />
      </div>
    );
  }
};
