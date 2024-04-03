chrome.windows.onCreated.addListener((newWindow) => {
  ensureSingleGroupInNewWindow(newWindow.id);
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId > 0) {
    // Validate it's a valid window ID
    await ensureSingleGroupInWindow(windowId);
  }
});

async function ensureSingleGroupInNewWindow(windowId) {
  const desiredGroupName = await getGroupNameFromStorage();
  chrome.tabs.query({ windowId: windowId }, (tabs) => {
    const hasDesiredGroup = tabs.some(
      (tab) => tab.groupId > -1 && tab.groupTitle === desiredGroupName
    );
    if (!hasDesiredGroup) {
      // No desired group found, creating one
      chrome.tabs.create({ windowId, active: false }, (tab) => {
        chrome.tabs.group({ tabIds: tab.id }, (groupId) => {
          chrome.tabGroups.update(groupId, { title: desiredGroupName });
        });
      });
    }
  });
}

function getGroupNameFromStorage() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["groupName"], (result) => {
      resolve(result.groupName || "Default Group");
    });
  });
}
