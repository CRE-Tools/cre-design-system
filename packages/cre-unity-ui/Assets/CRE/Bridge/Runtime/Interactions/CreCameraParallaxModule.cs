using UnityEngine;
using UnityEngine.InputSystem;

namespace CRE.Bridge.Interactions
{
    public class CreCameraParallaxModule : MonoBehaviour, ICreInteractionModule
    {
        [SerializeField] private string id = "cameraParallax";
        [SerializeField] private Camera targetCamera;

        [Header("Parallax")]
        [SerializeField] private float maxYawDegrees = 6f;
        [SerializeField] private float maxPitchDegrees = 4f;
        [SerializeField] private float smoothing = 8f;
        [SerializeField] private float deadZonePixels = 50f;

        private bool _enabled;
        private Quaternion _baseRotation;

        public string Id => id;

        private void Awake()
        {
            if (targetCamera == null) targetCamera = Camera.main;
            if (targetCamera != null) _baseRotation = targetCamera.transform.localRotation;
        }

        public void SetEnabled(bool enabled)
        {
            _enabled = enabled;
            if (!_enabled && targetCamera != null)
            {
                targetCamera.transform.localRotation = _baseRotation;
            }
        }

        private void Update()
        {
            if (!_enabled) return;
            if (targetCamera == null) return;

            var mouse = Mouse.current;
            if (mouse == null) return;
            var mp = mouse.position.ReadValue();
            float cx = Screen.width * 0.5f;
            float cy = Screen.height * 0.5f;

            float dx = mp.x - cx;
            float dy = mp.y - cy;

            if (Mathf.Abs(dx) < deadZonePixels) dx = 0f;
            if (Mathf.Abs(dy) < deadZonePixels) dy = 0f;

            float nx = Mathf.Clamp(dx / cx, -1f, 1f);
            float ny = Mathf.Clamp(dy / cy, -1f, 1f);

            float yaw = nx * maxYawDegrees;
            float pitch = -ny * maxPitchDegrees;

            var target = _baseRotation * Quaternion.Euler(pitch, yaw, 0f);
            targetCamera.transform.localRotation = Quaternion.Slerp(
                targetCamera.transform.localRotation,
                target,
                1f - Mathf.Exp(-smoothing * Time.deltaTime)
            );
        }
    }
}
