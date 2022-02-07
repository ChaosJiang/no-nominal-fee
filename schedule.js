// parse schedule
function parseSchedule(stylistId) {
    console.log("start parse schedule");
    // Parse data of the current tab
    let openElements = document.querySelectorAll('.openCell > .icnOpen');
    console.log('type of openElements: ', typeof openElements);
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
    chrome.storage.local.set({ schedule: schedule });
}
parseSchedule(stylistId);