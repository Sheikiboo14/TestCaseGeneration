import { useState, useEffect } from "react";

function EditModal({ isOpen, onClose, testCase, onSave, existingTestCases = [] }) {
  const [formData, setFormData] = useState(testCase);

  useEffect(() => {
    setFormData(testCase);
  }, [testCase]);

  useEffect(() => {
    if (!formData.module) {
      setFormData((prev) => ({ ...prev, testId: "" }));
      return;
    }

    const moduleTests = existingTestCases.filter(
      (t) =>
        t.module.toLowerCase() === formData.module.toLowerCase() &&
        t.testId !== testCase.testId
    );

    let maxNumber = 0;
    moduleTests.forEach((t) => {
      const match = t.testId.match(/_TC_(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) maxNumber = num;
      }
    });

    const nextNumber = maxNumber + 1;
    const cleanModule = formData.module.replace(/\s+/g, "");
    const newTestId = `${cleanModule}_TC_${String(nextNumber).padStart(2, "0")}`;

    if (formData.testId !== newTestId) {
      setFormData((prev) => ({ ...prev, testId: newTestId }));
    }
  }, [formData.module, existingTestCases, testCase.testId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const renderInputWithClear = (label, name, placeholder, type = "text") => (
    <div className="form-group relative">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        placeholder={placeholder}
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
          }}
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
        value={formData[name] || ""}
        onChange={handleChange}
        placeholder={placeholder}
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
          }}
        >
          ✖️
        </span>
      )}
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Test Case</h3>
        <form onSubmit={handleSubmit} className="testcase-form">
          {renderInputWithClear("Module", "module", "Enter Module Name")}
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

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              ❌ Cancel
            </button>
            <button type="submit" className="save-btn">
              💾 Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
