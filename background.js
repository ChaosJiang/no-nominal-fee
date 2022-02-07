// backround.js
let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ color });
    console.log('Default background color set to %cgreen,', `color: ${color}`);
});

function onTabUrlUpdated(tabId) {
    return new Promise((resolve, reject) => {
      const onUpdated = (id, info) => id === tabId && info.url && done(true);
      const onRemoved = id => id === tabId && done(false);
      chrome.tabs.onUpdated.addListener(onUpdated);
      chrome.tabs.onRemoved.addListener(onRemoved);
      function done(ok) {
        chrome.tabs.onUpdated.removeListener(onUpdated);
        chrome.tabs.onRemoved.removeListener(onRemoved);
        (ok ? resolve : reject)();
      }
    });
  }

chrome.runtime.onMessage.addListener(async function(request, sender) {
    if (request.action == 'getSchedule') {
        const baseUrl = 'https://beauty.hotpepper.jp/CSP/bt/reserve/schedule';
        chrome.tabs.create({ url: baseUrl + '?storeId=' + request.storeId + '&stylistId=' + request.stylistId }, (tab)=> {
            // if (!tab.url) await onTabUrlUpdated(tab.id);
            console.log('start parse schedule');
            chrome.tabs.executeScript(tab.id, {
                code: `let stylistId= ${request.stylistId};`
            }, () => {
                chrome.tabs.executeScript(tab.id, { file: "schedule.js" });
            });
        });
    }
});

