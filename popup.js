const output = document.getElementById("output");
const refreshBtn = document.getElementById("refresh");
const copyBtn = document.getElementById("copy");
const copyStatus = document.getElementById("copyStatus");

function loadInitData() {
  chrome.storage.local.get("lastInitData", (data) => {
    if (data.lastInitData) {
      output.textContent = decodeURIComponent(data.lastInitData);
    } else {
      output.textContent = "InitData не найден.";
    }
    copyStatus.textContent = "";
  });
}

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.textContent);
    copyStatus.textContent = "Скопировано!";
    copyStatus.classList.add("show");
    setTimeout(() => {
      copyStatus.classList.remove("show");
      copyStatus.textContent = "";
    }, 2000);
  } catch (err) {
    copyStatus.textContent = "Ошибка копирования";
    copyStatus.classList.add("show");
    setTimeout(() => {
      copyStatus.classList.remove("show");
      copyStatus.textContent = "";
    }, 2000);
    console.error("Ошибка копирования:", err);
  }
});

refreshBtn.addEventListener("click", () => {
  output.textContent = "Поиск запроса...";
  copyStatus.textContent = "";

  chrome.runtime.sendMessage({ action: "forceRefresh" }, (response) => {
    if (response && response.initData) {
      output.textContent = decodeURIComponent(response.initData);
    } else {
      output.textContent = "InitData не найден.";
    }
  });
});

loadInitData();
