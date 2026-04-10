#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;

namespace CRE.Bridge.Editor
{
    public class CreBridgeSimulatorWindow : EditorWindow
    {
        private string themeMode = "light";
        private string primary = "#8A0538";
        private string text = "#000000";
        private string modulesCsv = "cameraParallax";
        private string spawnId = "cre.button";

        [MenuItem("CRE/Bridge Simulator")]
        public static void Open()
        {
            GetWindow<CreBridgeSimulatorWindow>("CRE Bridge Simulator");
        }

        private void OnGUI()
        {
            var manager = FindObjectOfType<CreBridgeManager>();
            EditorGUILayout.HelpBox(manager == null ? "CreBridgeManager not found in scene." : "Connected to CreBridgeManager in scene.", MessageType.Info);

            using (new EditorGUI.DisabledScope(manager == null))
            {
                EditorGUILayout.Space();
                EditorGUILayout.LabelField("Theme", EditorStyles.boldLabel);
                themeMode = EditorGUILayout.TextField("Mode (light/dark)", themeMode);
                primary = EditorGUILayout.TextField("Primary", primary);
                text = EditorGUILayout.TextField("Text", text);

                if (GUILayout.Button("Send setTheme"))
                {
                    var payload = $"{{\"mode\":\"{themeMode}\",\"primary\":\"{primary}\",\"text\":\"{text}\"}}";
                    var env = $"{{\"type\":\"setTheme\",\"payload\":{Escape(payload)} }}";
                    manager.Receive(env);
                }

                EditorGUILayout.Space();
                EditorGUILayout.LabelField("Interactions", EditorStyles.boldLabel);
                modulesCsv = EditorGUILayout.TextField("Modules CSV", modulesCsv);

                if (GUILayout.Button("Send setInteractionModules"))
                {
                    var parts = modulesCsv.Split(',');
                    var arr = "[" + string.Join(",", System.Array.ConvertAll(parts, p => "\"" + p.Trim() + "\"")) + "]";
                    var payload = $"{{\"modules\":{arr}}}";
                    var env = $"{{\"type\":\"setInteractionModules\",\"payload\":{Escape(payload)} }}";
                    manager.Receive(env);
                }

                EditorGUILayout.Space();
                EditorGUILayout.LabelField("Spawning", EditorStyles.boldLabel);
                spawnId = EditorGUILayout.TextField("Catalog id", spawnId);

                if (GUILayout.Button("Send spawn"))
                {
                    var payload = $"{{\"id\":\"{spawnId}\"}}";
                    var env = $"{{\"type\":\"spawn\",\"payload\":{Escape(payload)} }}";
                    manager.Receive(env);
                }
            }
        }

        private static string Escape(string json)
        {
            return "\"" + json.Replace("\\", "\\\\").Replace("\"", "\\\"") + "\"";
        }
    }
}
#endif
