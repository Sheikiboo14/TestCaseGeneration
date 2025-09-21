const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ExcelJS = require("exceljs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let testCases = []; // Store test cases temporarily
let currentSheetName = "Sheet1"; // Default sheet name

// Save test cases from frontend
app.post("/api/saveTestCases", (req, res) => {
  const { testCases: receivedTestCases, sheetName } = req.body;

  if (!sheetName || !receivedTestCases) {
    return res.status(400).json({ message: "Sheet Name and test cases are required" });
  }

  // Remove sheetName from test cases before storing
  testCases = receivedTestCases.map(({ sheetName, ...rest }) => rest);
  currentSheetName = sheetName;

  res.json({ message: "Test cases saved successfully" });
});

// Export Excel file
app.get("/api/exportExcel", async (req, res) => {
  try {
    if (!testCases || testCases.length === 0) {
      return res.status(400).json({ message: "No test cases to export" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(currentSheetName);

    // Add headers dynamically from first test case
    const headers = Object.keys(testCases[0]);
    worksheet.columns = headers.map((header) => ({ header, key: header, width: 25 }));

    // Add rows
    testCases.forEach((tc) => worksheet.addRow(tc));

    // Write to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Send as download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${currentSheetName}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);

    // Clear after export
    testCases = [];
    currentSheetName = "Sheet1";
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to export Excel" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
