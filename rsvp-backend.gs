const SPREADSHEET_ID = '1-c2Q_srQOXWq1TksEXX3frMVnANi5uQGYRWbJJAOcX8';
const TAB_NAME = 'Responses';

function doPost(e) {
  try {
    const raw = e && e.postData ? e.postData.contents : '{}';
    const data = JSON.parse(raw || '{}');
    const sheet = getResponseSheet_();

    sheet.appendRow([
      new Date(),
      clean_(data.guestName),
      clean_(data.attendance),
      number_(data.adults),
      number_(data.children),
      clean_(data.dietary),
      clean_(data.message),
      clean_(data.submittedAt),
    ]);

    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: 'Yohaan RSVP' });
}

function getResponseSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(TAB_NAME);
  if (!sheet) sheet = ss.insertSheet(TAB_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Submitted',
      'Guest / Family Name',
      'Attendance',
      'Adults',
      'Children',
      'Dietary Restrictions / Allergies',
      'Message for Yohaan',
      'Client Submitted At',
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
    sheet.autoResizeColumns(1, 8);
  }

  return sheet;
}

function clean_(value) {
  return String(value == null ? '' : value).slice(0, 1000);
}

function number_(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(20, Math.round(n)));
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
