mergeInto(LibraryManager.library, {
  CreBridge_PostMessage: function (jsonPtr) {
    try {
      var json = UTF8ToString(jsonPtr);
      if (typeof window !== 'undefined' && window.CRE_UNITY_BRIDGE && typeof window.CRE_UNITY_BRIDGE.onMessage === 'function') {
        window.CRE_UNITY_BRIDGE.onMessage(json);
      }
    } catch (e) {
      // ignore
    }
  }
});
