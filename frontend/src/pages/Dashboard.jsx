import React from "react";
import TestCaseForm from "../components/TestCaseForm";
import PreviewTable from "../components/PreviewTable";
import ExportOptions from "../components/ExportOptions";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <TestCaseForm />
      <PreviewTable />
      <ExportOptions />
    </div>
  );
}

export default Dashboard;
