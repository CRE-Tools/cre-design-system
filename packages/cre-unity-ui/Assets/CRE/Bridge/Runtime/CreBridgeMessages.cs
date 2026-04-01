using System;

namespace CRE.Bridge
{
    [Serializable]
    public class CreBridgeEnvelope
    {
        public string type;
        public string payload;
    }

    [Serializable]
    public class CreBridgeAck
    {
        public string requestType;
        public string instanceId;
        public string message;
    }

    [Serializable]
    public class CreBridgeError
    {
        public string message;
    }

    [Serializable]
    public class CreSetThemePayload
    {
        public string mode;
        public string primary;
        public string background;
        public string text;
    }

    [Serializable]
    public class CreSetInteractionModulesPayload
    {
        public string[] modules;
    }

    [Serializable]
    public class CreSpawnPayload
    {
        public string id;
    }

    [Serializable]
    public class CreUpdateButtonPayload
    {
        public string id;
        public string text;
        public string background;
        public string textColor;
        public bool disabled;
        public bool disabledIsSet;
    }
}
