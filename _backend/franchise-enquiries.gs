/**
 * YuGO Rides – franchise enquiry receiver
 * Standalone Apps Script project in sales.yugorides@gmail.com, writing to the sheet below.
 * Run setup() once, then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
 * Every website enquiry is added as a row to this sheet and emailed to NOTIFY_EMAIL.
 */
var NOTIFY_EMAIL = 'sales.yugorides@gmail.com';
// Sheet: "YuGO Rides Franchise Enquiries" in sales.yugorides@gmail.com
var SHEET_ID = '1SLyq0WXyMN-fqmM-06F52IZMX1Qavujfn9xyGCZwO2k';
function book() { return SpreadsheetApp.openById(SHEET_ID); }
var FIELDS = ['name', 'phone', 'email', 'city', 'area', 'model', 'investment', 'space', 'message', 'page'];
var HEADERS = ['Received at', 'Name', 'Mobile', 'Email', 'City', 'Area', 'Model', 'Investment', 'Hub space', 'Business / experience', 'Page'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents || '{}');
    if (!data.name || !data.phone) return reply({ ok: false, error: 'missing fields' });

    var sheet = book().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }
    var when = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a');
    var row = [when].concat(FIELDS.map(function (k) { return String(data[k] || '').slice(0, 2000); }));
    // Stop spreadsheet formula injection
    row = row.map(function (v) { return /^[=+\-@]/.test(v) ? "'" + v : v; });
    sheet.appendRow(row);

    var lines = HEADERS.map(function (h, i) { return h + ': ' + row[i]; }).join('\n');
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: data.email || NOTIFY_EMAIL,
      subject: 'New franchise enquiry: ' + data.name + ' (' + (data.city || 'city not given') + ')',
      body: 'A new franchise enquiry came in from yugorides.in\n\n' + lines +
            '\n\nAll enquiries: ' + book().getUrl()
    });
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return reply({ ok: true, service: 'YuGO Rides franchise enquiries' });
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Run once from the editor to authorise and set up the header row.
function setup() {
  var sheet = book().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  MailApp.getRemainingDailyQuota();
}
