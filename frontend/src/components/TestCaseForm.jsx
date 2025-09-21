import { useState, useEffect } from "react";

function TestCaseForm({ onAdd, testCases }) {
  const initialState = {
    module: "",
    testId: "",
    preCondition: "",
    description: "",
    steps: "",
    expected: "",
    actual: "",
    status: "Not Executed",
    comments: "",
    reference: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [clearingField, setClearingField] = useState(null);

  // Auto-generate Test ID when module changes
  useEffect(() => {
    if (!formData.module) {
      setFormData((prev) => ({ ...prev, testId: "" }));
      return;
    }

    const moduleTests = testCases.filter(
      (t) => t.module.toLowerCase() === formData.module.toLowerCase()
    );

    const nextNumber = moduleTests.length + 1;
    const cleanModule = formData.module.replace(/\s+/g, "");
    const newTestId = `${cleanModule}_TC_${String(nextNumber).padStart(2, "0")}`;

    setFormData((prev) => ({ ...prev, testId: newTestId }));
  }, [formData.module, testCases]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearField = (field) => {
    setClearingField(field);
    setTimeout(() => {
      setFormData((prev) => ({ ...prev, [field]: "" }));
      setClearingField(null);
    }, 150);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.module || !formData.testId) {
      alert("Module and Test ID are required!");
      return;
    }
    onAdd(formData);
    setFormData(initialState);
  };

  const renderInputWithClear = (label, name, placeholder, type = "text") => (
    <div className="form-group relative">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          transition: "opacity 0.15s ease",
          opacity: clearingField === name ? 0 : 1,
        }}
      />
      {formData[name] && (
        <span
          onClick={() => handleClearField(name)}
          style={{
            position: "absolute",
            right: "10px",
            top: "36px",
            cursor: "pointer",
            color: "gray",
            fontWeight: "bold",
            transition: "opacity 0.15s ease",
            opacity: clearingField === name ? 0 : 1,
          }}
          title={`Clear ${label}`}
        >
          ✖️
        </span>
      )}
    </div>
  );

  const renderTextareaWithClear = (label, name, placeholder) => (
    <div className="form-group relative">
      <label>{label}</label>
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          transition: "opacity 0.15s ease",
          opacity: clearingField === name ? 0 : 1,
        }}
      />
      {formData[name] && (
        <span
          onClick={() => handleClearField(name)}
          style={{
            position: "absolute",
            right: "10px",
            top: "36px",
            cursor: "pointer",
            color: "gray",
            fontWeight: "bold",
            transition: "opacity 0.15s ease",
            opacity: clearingField === name ? 0 : 1,
          }}
          title={`Clear ${label}`}
        >
          ✖️
        </span>
      )}
    </div>
  );

  return (
    <form className="testcase-form" onSubmit={handleSubmit}>
      {renderInputWithClear("Module", "module", "e.g., Lead")}
      <div className="form-group">
        <label>Test ID</label>
        <input type="text" name="testId" value={formData.testId} readOnly />
      </div>
      {renderTextareaWithClear("Pre Condition", "preCondition", "Any setup before test")}
      {renderTextareaWithClear("Description", "description", "What are we testing?")}
      {renderTextareaWithClear("Steps", "steps", "Step 1, Step 2...")}
      {renderTextareaWithClear("Expected", "expected", "Expected outcome")}
      {renderTextareaWithClear("Actual", "actual", "Leave empty if not executed")}

      <div className="form-group">
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option>Not Executed</option>
          <option>Pass</option>
          <option>Fail</option>
          <option>Blocked</option>
        </select>
      </div>

      {renderTextareaWithClear("Comments", "comments", "Additional notes")}
      {renderInputWithClear("Reference", "reference", "Add reference link (https://...)", "url")}

      <button type="submit" className="export-btn">
        ➕ Add Test Case
      </button>
    </form>
  );
}

export default TestCaseForm;
