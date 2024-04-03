document.getElementById("save").addEventListener("click", () => {
  let groupName = document.getElementById("groupName").value;
  chrome.storage.sync.set({ groupName }, function () {
    console.log("Group name saved:", groupName);
  });
});

// Load the current name on opening the settings page
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["groupName"], function (result) {
    document.getElementById("groupName").value = result.groupName || "";
  });
});
