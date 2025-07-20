console.log("✅ background.js загружен");

chrome.runtime.onInstalled.addListener(() => {
  console.log("🔧 Расширение установлено или обновлено");
});

function saveInitData(initData) {
  chrome.storage.local.set({
    lastInitData: initData,
    lastUpdateTime: Date.now()
  });
}

function clearInitData() {
  chrome.storage.local.remove(["lastInitData", "lastUpdateTime"], () => {
    console.log("🧹 lastInitData очищен из-за отсутствия запроса");
  });
}

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const { _, method, requestBody } = details;
    if (method !== "POST") return;

    try {
      const raw = requestBody?.raw?.[0]?.bytes;
      if (!raw) return;

      const decoder = new TextDecoder("utf-8");
      const bodyText = decoder.decode(raw);


      const json = JSON.parse(bodyText);
      const initData = json?.initData;

      if (initData) {
        chrome.storage.local.set({ lastInitData: initData });
      }
    } catch (err) {
      console.warn("Ошибка обработки запроса:", err);
    }
  },
  { urls: ["*://api.voxelplay.app/voxel/user"] },
  ["requestBody"]
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "forceRefresh") {
    clearInitData()
    return true;
  }
});