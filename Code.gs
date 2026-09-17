/**
 * Smartmind — Enquiry backend for Google Sheets
 * -----------------------------------------------
 * Paste this whole file into Extensions > Apps Script (Code.gs) of the
 * Google Sheet you want enquiries saved to, then deploy as a Web App.
 * Full steps are in README.md.
 */

// Change this to the email that should receive a notification for every new enquiry.
// Leave as "" to skip email notifications entirely.
const NOTIFY_EMAIL = "smartmindblr@gmail.com";

const SHEET_NAME = "Enquiries";
const HEADERS = ["Timestamp", "Name", "Phone", "Email", "Class", "Board", "Subject", "Mode", "Message", "Page"];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No data received");
    }
    const data = JSON.parse(e.postData.contents);

    // Reject anything that came through the honeypot filled in (extra safety net)
    if (data.website) {
      return jsonOut_({ result: "success" }); // pretend success, drop silently
    }

    const sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.phone || "",
      data.email || "",
      data.grade || "",
      data.board || "",
      data.subject || "",
      data.mode || "",
      data.message || "",
      data.page || ""
    ]);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "New Smartmind enquiry — " + (data.name || "Unknown"),
        body:
          "New enquiry received:\n\n" +
          "Name: " + (data.name || "-") + "\n" +
          "Phone: " + (data.phone || "-") + "\n" +
          "Email: " + (data.email || "-") + "\n" +
          "Class: " + (data.grade || "-") + "\n" +
          "Board: " + (data.board || "-") + "\n" +
          "Subject: " + (data.subject || "-") + "\n" +
          "Mode: " + (data.mode || "-") + "\n" +
          "Message: " + (data.message || "-") + "\n"
      });
    }

    return jsonOut_({ result: "success" });
  } catch (err) {
    return jsonOut_({ result: "error", error: err.message });
  }
}

function doGet(e) {
  return jsonOut_({ status: "Smartmind enquiry endpoint is live" });
}

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
