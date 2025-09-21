import { useState } from "react";
import axios from "axios";
import EditModal from "./EditModal";

function PreviewTable({ testCases, onDelete, onEdit, sheetName, setSheetName, setTestCases }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = (updatedCase) => {
    onEdit(editingIndex, updatedCase);
    setEditingIndex(null);
  };

  const handleExport = async () => {
    if (!sheetName) {
      alert("⚠️ Please provide a Sheet Name before exporting.");
      return;
    }
    if (testCases.length === 0) {
      alert("⚠️ No test cases available to export.");
      return;
    }
    setLoading(true);
    try {
      const filteredTestCases = testCases.map(({ sheetName, ...rest }) => rest);
      await axios.post("http://localhost:5000/api/saveTestCases", {
        testCases: filteredTestCases,
        sheetName,
      });

      const response = await axios.get("http://localhost:5000/api/exportExcel", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${sheetName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSheetName("");
      setTestCases([]);
      localStorage.removeItem("sheetName");
      alert("✅ Export completed successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("❌ Export failed. Please check your backend server.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    if (testCases.length === 0) return;
    if (window.confirm("Are you sure you want to clear all test cases?")) {
      setTestCases([]);
      setSheetName("");
      localStorage.removeItem("sheetName");
    }
  };

  return (
    <div className="mt-6">
      {/* Header + Actions */}
      <div className="flex justify-between items-center mb-4 gap-2">
        <h2 className="text-lg font-semibold">📋 Preview Test Cases</h2>
        <div className="flex gap-2">
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md transition-colors duration-200"
          >
            🗑 Clear All
          </button>
          {/* <button
            onClick={handleExport}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium shadow-md transition-colors duration-200 
              ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}`}
          >
            {loading ? "⏳ Exporting..." : "📤 Export to Excel"}
          </button> */}
        </div>
      </div>

      {/* Static Table */}
      <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 border">Module</th>
            <th className="px-3 py-2 border">Test ID</th>
            <th className="px-3 py-2 border">Pre Condition</th>
            <th className="px-3 py-2 border">Description</th>
            <th className="px-3 py-2 border">Steps</th>
            <th className="px-3 py-2 border">Expected</th>
            <th className="px-3 py-2 border">Actual</th>
            <th className="px-3 py-2 border">Status</th>
            <th className="px-3 py-2 border">Comments</th>
            <th className="px-3 py-2 border">Reference</th>
            <th className="px-3 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {testCases.length === 0 ? (
            // Always show placeholder row if no test cases
            <tr>
              <td colSpan="11" className="text-center py-6 text-gray-500 italic">
                No test cases added yet. Fill out the form to add one ➕
              </td>
            </tr>
          ) : (
            testCases.map((tc, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-3 py-2 border">{tc.module}</td>
                <td className="px-3 py-2 border">{tc.testId}</td>
                <td className="px-3 py-2 border">{tc.preCondition}</td>
                <td className="px-3 py-2 border">{tc.description}</td>
                <td className="px-3 py-2 border">{tc.steps}</td>
                <td className="px-3 py-2 border">{tc.expected}</td>
                <td className="px-3 py-2 border">{tc.actual}</td>
                <td className="px-3 py-2 border">{tc.status}</td>
                <td className="px-3 py-2 border">{tc.comments || "-"}</td>
                <td className="px-3 py-2 border">
                  {tc.reference ? (
                    <a
                      href={tc.reference}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Link
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-3 py-2 border space-x-2">
                  <button
                    onClick={() => setEditingIndex(index)}
                    className="text-blue-600 hover:underline"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onDelete(index)}
                    className="text-red-600 hover:underline"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingIndex !== null && (
        <EditModal
          isOpen={true}
          testCase={testCases[editingIndex]}
          onSave={handleSave}
          onClose={() => setEditingIndex(null)}
          existingTestCases={testCases}
        />
      )}
    </div>
  );
}

export default PreviewTable;
