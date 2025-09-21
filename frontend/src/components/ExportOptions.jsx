

// import { useState } from "react";
// import axios from "axios";

// function ExportOptions({ testCases, sheetName, setSheetName, setTestCases }) {
//   const [loading, setLoading] = useState(false);

//   const handleExport = async () => {
//     if (!sheetName) {
//       alert("⚠️ Please provide a Sheet Name before exporting.");
//       return;
//     }

//     if (testCases.length === 0) {
//       alert("⚠️ No test cases available to export.");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Remove sheetName from objects before sending, but keep Comments and Reference
//       const filteredTestCases = testCases.map(
//         ({ sheetName, module, testId, preCondition, description, steps, expected, actual, status, comments, reference }) => ({
//           module,
//           testId,
//           preCondition,
//           description,
//           steps,
//           expected,
//           actual,
//           status,
//           comments,
//           reference
//         })
//       );

//       // Save to backend
//       await axios.post("http://localhost:5000/api/saveTestCases", {
//         testCases: filteredTestCases,
//         sheetName,
//       });

//       // Request Excel file from backend
//       const response = await axios.get("http://localhost:5000/api/exportExcel", {
//         responseType: "blob",
//       });

//       // Download the file
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `${sheetName}.xlsx`);
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       // Clear after export
//       setSheetName("");
//       setTestCases([]);
//       localStorage.removeItem("sheetName");

//       alert("✅ Export completed successfully!");
//     } catch (error) {
//       console.error("Export failed:", error);
//       alert("❌ Export failed. Please check your backend server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button
//       onClick={handleExport}
//       disabled={loading}
//       className={`px-4 py-2 rounded-lg font-medium shadow-md transition-colors duration-200 
//         ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}
//       `}
//     >
//       {loading ? "⏳ Exporting..." : "📤 Export to Excel"}
//     </button>
//   );
// }

// export default ExportOptions;


import { useState } from "react";
import axios from "axios";

function ExportOptions({ testCases, sheetName, setSheetName, setTestCases }) {
  const [loading, setLoading] = useState(false);

  // Use environment variable or fallback
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://testcasegeneration.onrender.com";

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
      // Keep only relevant fields
      const filteredTestCases = testCases.map(
        ({
          module,
          testId,
          preCondition,
          description,
          steps,
          expected,
          actual,
          status,
          comments,
          reference,
        }) => ({
          module,
          testId,
          preCondition,
          description,
          steps,
          expected,
          actual,
          status,
          comments,
          reference,
        })
      );

      // Save to backend
      await axios.post(`${BASE_URL}/api/saveTestCases`, {
        testCases: filteredTestCases,
        sheetName,
      });

      // Request Excel file from backend
      const response = await axios.get(`${BASE_URL}/api/exportExcel`, {
        responseType: "blob",
      });

      // Download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${sheetName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clear after export
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

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-medium shadow-md transition-colors duration-200 
        ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"}
      `}
    >
      {loading ? "⏳ Exporting..." : "📤 Export to Excel"}
    </button>
  );
}

export default ExportOptions;
