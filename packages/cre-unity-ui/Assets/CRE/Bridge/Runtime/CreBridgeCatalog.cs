using System;
using UnityEngine;

namespace CRE.Bridge
{
    [CreateAssetMenu(menuName = "CRE/Bridge/Catalog", fileName = "CreBridgeCatalog")]
    public class CreBridgeCatalog : ScriptableObject
    {
        [Serializable]
        public class Entry
        {
            public string id;
            public GameObject prefab;
        }

        public Entry[] entries;

        public GameObject FindPrefab(string id)
        {
            if (entries == null) return null;
            for (int i = 0; i < entries.Length; i++)
            {
                if (entries[i] != null && entries[i].id == id)
                {
                    return entries[i].prefab;
                }
            }
            return null;
        }
    }
}
