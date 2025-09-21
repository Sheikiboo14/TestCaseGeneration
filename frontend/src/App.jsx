import { useState, useEffect } from "react";
import TestCaseForm from "./components/TestCaseForm";
import PreviewTable from "./components/PreviewTable";
import ExportOptions from "./components/ExportOptions";
import "./App.css";

function App() {
  const [testCases, setTestCases] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Sheet Name persists via localStorage
  const [sheetName, setSheetName] = useState(
    () => localStorage.getItem("sheetName") || ""
  );

  // Persist sheetName in localStorage
  useEffect(() => {
    if (sheetName) localStorage.setItem("sheetName", sheetName);
    else localStorage.removeItem("sheetName");
  }, [sheetName]);

  // Add a new test case
  const addTestCase = (testCase) => {
    setTestCases((prev) => [...prev, { ...testCase, testId: testCase.testId }]);
  };

  // Delete a single test case
  const deleteTestCase = (index) => {
    const updated = [...testCases];
    updated.splice(index, 1);
    setTestCases(updated);
  };

  // Clear all test cases
  const clearAllTestCases = () => {
    if (window.confirm("Are you sure you want to clear all test cases?")) {
      setTestCases([]);
      setSheetName("");
    }
  };

  // Edit an existing test case
  const editTestCase = (index, updatedCase) => {
    const updated = [...testCases];
    updated[index] = updatedCase;
    setTestCases(updated);
  };

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <button
          className="collapse-btn"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? "➡" : "⬅"}
        </button>

        <div className="nav-item">
          🏠 <span className="nav-text">Test Case Manager</span>
        </div>

        <div className="sidebar-footer">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="dashboard-container">
          {/* Left Column */}
          <div className="left-column">
            <div className="form-header">
              <h2>Test Case Form</h2>
              {testCases.length > 0 && (
                <button className="clear-all-btn" onClick={clearAllTestCases}>
                  🗑️ Clear All
                </button>
              )}
            </div>

            {/* Sheet Name Input (Global) */}
            <div className="form-group">
              <label>Sheet Name</label>
              <input
                type="text"
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                placeholder="Enter Sheet Name"
              />
            </div>

            <TestCaseForm
              onAdd={addTestCase}
              testCases={testCases}
            />
          </div>

          {/* Right Column: Preview Table + Export Options */}
          <div className="right-column">
            <h2>Preview Table</h2>
            <PreviewTable
              testCases={testCases}
              onDelete={deleteTestCase}
              onClear={clearAllTestCases}
              onEdit={editTestCase}
              sheetName={sheetName}
              setSheetName={setSheetName}
              setTestCases={setTestCases}
            />

            <div className="export-section">
              <h3>Export Options</h3>
              <ExportOptions
                testCases={testCases}
                sheetName={sheetName}
                setSheetName={setSheetName}
                setTestCases={setTestCases}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
