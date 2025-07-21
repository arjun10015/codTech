let activeTab = null;
let startTime = null;

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  handleTabChange(tab);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete') {
    handleTabChange(tab);
  }
});

async function handleTabChange(tab) {
  const now = Date.now();
  if (activeTab && startTime) {
    const timeSpent = Math.floor((now - startTime) / 1000);
    await saveTimeLog(activeTab.url, timeSpent);
  }
  activeTab = tab;
  startTime = now;
}

async function saveTimeLog(url, timeSpent) {
  const domain = new URL(url).hostname;
  await fetch("http://localhost:5000/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain, timeSpent })
  });
}
