using System;
using System.Collections.Generic;
using CRE.Bridge.Interactions;
using CRE.Bridge.UI;
using UnityEngine;

namespace CRE.Bridge
{
    public class CreBridgeManager : MonoBehaviour
    {
        [Header("Scene wiring")]
        [SerializeField] private Transform canvasRoot;
        [SerializeField] private CreBridgeCatalog catalog;
        [SerializeField] private MonoBehaviour[] interactionModules;

        [Header("Theme")]
        [SerializeField] private CreBridgeTheme theme = new CreBridgeTheme();

        private readonly Dictionary<string, CreButtonController> _buttonsByInstanceId = new Dictionary<string, CreButtonController>();

        private void Start()
        {
            PostReady();
        }

        public void Receive(string json)
        {
            if (string.IsNullOrEmpty(json))
            {
                PostError("Empty message");
                return;
            }

            CreBridgeEnvelope env;
            try
            {
                env = JsonUtility.FromJson<CreBridgeEnvelope>(json);
            }
            catch
            {
                PostError("Invalid JSON envelope");
                return;
            }

            if (env == null || string.IsNullOrEmpty(env.type))
            {
                PostError("Missing message type");
                return;
            }

            try
            {
                switch (env.type)
                {
                    case "setTheme":
                        HandleSetTheme(env.payload);
                        PostAck(env.type, null, "ok");
                        break;
                    case "setInteractionModules":
                        HandleSetInteractionModules(env.payload);
                        PostAck(env.type, null, "ok");
                        break;
                    case "spawn":
                        var instanceId = HandleSpawn(env.payload);
                        PostAck(env.type, instanceId, "ok");
                        break;
                    case "updateButton":
                        HandleUpdateButton(env.payload);
                        PostAck(env.type, null, "ok");
                        break;
                    default:
                        PostError($"Unknown message type: {env.type}");
                        break;
                }
            }
            catch (Exception e)
            {
                PostError(e.Message);
            }
        }

        private void HandleSetTheme(string payloadJson)
        {
            var payload = JsonUtility.FromJson<CreSetThemePayload>(payloadJson ?? "{}");
            if (payload == null) return;

            if (!string.IsNullOrEmpty(payload.mode))
            {
                theme.Mode = payload.mode == "dark" ? CreThemeMode.Dark : CreThemeMode.Light;
            }

            if (TryParseHtmlColor(payload.primary, out var primary)) theme.Primary = primary;
            if (TryParseHtmlColor(payload.background, out var bg)) theme.Background = bg;
            if (TryParseHtmlColor(payload.text, out var text)) theme.Text = text;

            foreach (var kv in _buttonsByInstanceId)
            {
                kv.Value.Apply(null, theme.Primary, theme.Text, null);
            }
        }

        private void HandleSetInteractionModules(string payloadJson)
        {
            var payload = JsonUtility.FromJson<CreSetInteractionModulesPayload>(payloadJson ?? "{}");
            var desired = new HashSet<string>(payload?.modules ?? Array.Empty<string>());

            if (interactionModules == null) return;
            for (int i = 0; i < interactionModules.Length; i++)
            {
                var mb = interactionModules[i];
                if (mb == null) continue;
                if (mb is ICreInteractionModule module)
                {
                    module.SetEnabled(desired.Contains(module.Id));
                }
            }
        }

        private string HandleSpawn(string payloadJson)
        {
            var payload = JsonUtility.FromJson<CreSpawnPayload>(payloadJson ?? "{}");
            if (payload == null || string.IsNullOrEmpty(payload.id))
            {
                throw new Exception("Missing spawn id");
            }

            if (catalog == null)
            {
                throw new Exception("Catalog not assigned");
            }

            var prefab = catalog.FindPrefab(payload.id);
            if (prefab == null)
            {
                throw new Exception($"Prefab not found in catalog: {payload.id}");
            }

            var parent = canvasRoot != null ? canvasRoot : transform;
            var go = Instantiate(prefab, parent);

            var instanceId = Guid.NewGuid().ToString("N");

            var buttonCtrl = go.GetComponentInChildren<CreButtonController>(true);
            if (buttonCtrl != null)
            {
                buttonCtrl.SetInstanceId(instanceId);
                buttonCtrl.Apply("Button", theme.Primary, theme.Text, null);
                _buttonsByInstanceId[instanceId] = buttonCtrl;
            }

            return instanceId;
        }

        private void HandleUpdateButton(string payloadJson)
        {
            var payload = JsonUtility.FromJson<CreUpdateButtonPayload>(payloadJson ?? "{}");
            if (payload == null || string.IsNullOrEmpty(payload.id))
            {
                throw new Exception("Missing button id");
            }

            if (!_buttonsByInstanceId.TryGetValue(payload.id, out var ctrl) || ctrl == null)
            {
                throw new Exception($"Button instance not found: {payload.id}");
            }

            Color? bg = null;
            Color? fg = null;
            bool? disabled = null;

            if (TryParseHtmlColor(payload.background, out var parsedBg)) bg = parsedBg;
            if (TryParseHtmlColor(payload.textColor, out var parsedFg)) fg = parsedFg;

            if (payload.disabledIsSet) disabled = payload.disabled;

            ctrl.Apply(payload.text, bg, fg, disabled);
        }

        private static bool TryParseHtmlColor(string value, out Color color)
        {
            color = default;
            if (string.IsNullOrEmpty(value)) return false;
            return ColorUtility.TryParseHtmlString(value, out color);
        }

        private void PostReady()
        {
            PostMessage(JsonUtility.ToJson(new CreBridgeEnvelope { type = "ready", payload = "{}" }));
        }

        private void PostAck(string requestType, string instanceId, string message)
        {
            var ack = new CreBridgeAck { requestType = requestType, instanceId = instanceId, message = message };
            PostMessage(JsonUtility.ToJson(new CreBridgeEnvelope { type = "ack", payload = JsonUtility.ToJson(ack) }));
        }

        private void PostError(string message)
        {
            var err = new CreBridgeError { message = message };
            PostMessage(JsonUtility.ToJson(new CreBridgeEnvelope { type = "error", payload = JsonUtility.ToJson(err) }));
        }

        private void PostMessage(string json)
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            CreBridgeWebGL.PostMessage(json);
#else
            Debug.Log($"[CreBridge] {json}");
#endif
        }
    }
}
