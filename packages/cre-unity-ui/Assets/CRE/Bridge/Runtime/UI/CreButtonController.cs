using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace CRE.Bridge.UI
{
    public class CreButtonController : MonoBehaviour
    {
        [SerializeField] private string instanceId;
        [SerializeField] private Button button;
        [SerializeField] private Image background;
        [SerializeField] private TMP_Text label;

        public string InstanceId => instanceId;

        private void Awake()
        {
            if (button == null) button = GetComponentInChildren<Button>(true);
            if (background == null) background = GetComponentInChildren<Image>(true);
            if (label == null) label = GetComponentInChildren<TMP_Text>(true);
        }

        public void SetInstanceId(string id)
        {
            instanceId = id;
        }

        public void Apply(string text, Color? bg, Color? fg, bool? disabled)
        {
            if (label != null && text != null)
            {
                label.text = text;
            }

            if (background != null && bg.HasValue)
            {
                background.color = bg.Value;
            }

            if (label != null && fg.HasValue)
            {
                label.color = fg.Value;
            }

            if (button != null && disabled.HasValue)
            {
                button.interactable = !disabled.Value;
            }
        }
    }
}
