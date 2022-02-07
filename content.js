// Parse the current page and return the store and stylist content
function parseStylist() {
    // Get the stylist elements
    let stylistElements = document.querySelectorAll('.stylistOptionArea > .stylistOptionList > li > a');
    let store = {
        id: '',
        stylists: {}
    };
    // parse stylist data from elements
    for (let stylist of stylistElements) {
        let paramsString = stylist.href.split('?')[1];
        let searchParams = new URLSearchParams(paramsString);
    
        // save storeId and stylistId
        store["id"] = searchParams.get('storeId')
        if (searchParams.get('stylistId') === null) { 
            continue;
        }
        store["stylists"][searchParams.get('stylistId')] = stylist.innerText;
    }
    // save store data
    chrome.storage.local.set({ store: store });
}

// parse stylist schedule
function parseScheduleByStylistId(storeId, stylistId) {
    // Parse data of the current tab
    let openElements = document.querySelectorAll('.openCell > .icnOpen');
    let schedule = {};
    schedule[stylistId] = {};
    for (let open of openElements) {
        let paramsString = open.split('?')[1];
        let searchParams = new URLSearchParams(paramsString);
        // save schedule data
        let rsvDate = searchParams.get("rsvRequestDate1");
        let rsvTime = searchParams.get("rsvRequestTime1");
        schedule['date'] = rsvDate;
        schedule['time'] = rsvTime;
    }
    return schedule;
}

parseStylist();

// Send message to background.js
let stylistList = {};
chrome.storage.local.get(['store'], function (data) {
    let storeId = data.store.id;
    stylistList = data.store.stylists;
    for (const [stylistId, name] of Object.entries(stylistList)) {
        console.log(stylistId, name);
        chrome.runtime.sendMessage({ action: 'getSchedule', storeId: storeId, stylistId: stylistId });
    }
});

chrome.runtime.onMessage.addListener((request, sender) => {
    console('start parse tab')
    if (request.action === 'parseTab') {
       parseTab(request.tabId);
    }
});

async function parseTab(tabId) {
    try {
        let tabInfo = await browser.tabs.get(tabId);
        console.log(tabInfo);
    } catch(error) {
        console.log(error);
    }
}