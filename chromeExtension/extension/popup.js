document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const domain = new URL(tab.url).hostname;
  document.getElementById("current-site").innerText = domain;

  // Simulate data
  const dummyData = {
    totalTime: "45m",
    sites: [
      { name: "leetcode.com", time: "15m", type: "Productive" },
      { name: "youtube.com", time: "20m", type: "Unproductive" },
      { name: "stackoverflow.com", time: "10m", type: "Productive" },
    ]
  };

  document.getElementById("total-time").innerText = dummyData.totalTime;

  const list = document.getElementById("site-list");
  dummyData.sites.forEach(site => {
    const item = document.createElement("li");
    item.innerHTML = `<span class="font-semibold">${site.name}</span> – 
      ${site.time} 
      <span class="text-xs ml-2 px-2 py-0.5 rounded-full ${site.type === 'Productive' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}">${site.type}</span>`;
    list.appendChild(item);
  });
});
