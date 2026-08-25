const SPREADSHEET_ID = "14v9kmeFBi6a4LKppgzqsfd3EPAXZWUHG2J923fQiIKk";
const EVENT_SHEET = "Event_Log";
const PARTICIPANT_SHEET = "Participants";

function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ok:true, service:"shopping-study-collector"}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (!data.join_id || !data.event_type) throw new Error("Missing join_id/event_type");
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const ev = ss.getSheetByName(EVENT_SHEET);
    const ps = ss.getSheetByName(PARTICIPANT_SHEET);
    const now = new Date();
    ev.appendRow([
      now, data.client_time || "", data.event_id || "", data.join_id || "", data.session_id || "",
      data.assignment_id || "", data.worker_id || "", data.hit_id || "", data.event_type || "",
      data.product_id || "", data.page || "", data.selected_count || 0, data.selected_items || "",
      data.selection_order || "", data.elapsed_ms || 0, data.study_version || "", data.user_agent || "",
      data.referrer || "", data.extra_json || ""
    ]);
    upsertParticipant_(ps, data, now);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function upsertParticipant_(sheet, d, now) {
  let row = 0;
  const last = sheet.getLastRow();
  if (last >= 2) {
    const found = sheet.getRange(2,1,last-1,1).createTextFinder(String(d.join_id)).matchEntireCell(true).findNext();
    if (found) row = found.getRow();
  }
  if (!row) {
    row = Math.max(2,last+1);
    sheet.getRange(row,1,1,17).setValues([[
      d.join_id||"", d.assignment_id||"", d.worker_id||"", d.hit_id||"", d.session_id||"", now, now,
      "OPENED", "", "", "", "", "", "", d.study_version||"", "", ""
    ]]);
  } else {
    sheet.getRange(row,7).setValue(now);
  }
  const type = String(d.event_type||"");
  if (type === "CONTINUE") {
    sheet.getRange(row,8,1,5).setValues([["SHOPPING_SUBMITTED", now, d.selected_items||"", d.selection_order||"", d.elapsed_ms||0]]);
  } else if (type === "SURVEY_COMPLETE") {
    sheet.getRange(row,8).setValue("SURVEY_COMPLETED");
    if (d.survey_response_id) sheet.getRange(row,13).setValue(d.survey_response_id);
    sheet.getRange(row,14).setValue(now);
  }
}
