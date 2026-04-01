using System.Runtime.InteropServices;
using UnityEngine;

namespace CRE.Bridge
{
    public static class CreBridgeWebGL
    {
#if UNITY_WEBGL && !UNITY_EDITOR
        [DllImport("__Internal")]
        private static extern void CreBridge_PostMessage(string json);
#endif

        public static void PostMessage(string json)
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            CreBridge_PostMessage(json);
#else
            Debug.Log($"[CreBridgeWebGL] {json}");
#endif
        }
    }
}
