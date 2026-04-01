using System;
using UnityEngine;

namespace CRE.Bridge
{
    public enum CreThemeMode
    {
        Light,
        Dark
    }

    [Serializable]
    public class CreBridgeTheme
    {
        public CreThemeMode Mode = CreThemeMode.Light;
        public Color Primary = new Color(0.5411765f, 0.01960784f, 0.21960784f, 1f); // #8A0538
        public Color Background = Color.white;
        public Color Text = Color.black;
    }
}
