import { ErrorMessage } from "formik";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { isError } from "../../../Utils";
import { useState } from "react";

function FloatingInputLabel({
  fieldName,
  formikFrom,
  labelText,
  fieldType = "text",
  inputType = "input",
  options = [],
}) {
  const [showPassword, setShowPassword] = useState(false);

  // Define maxLength based on field name
  const getMaxLength = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('mobile') || lowerName.includes('phone')) return 10;
    if (lowerName.includes('password')) return 24;
    if (lowerName.includes('email') || lowerName.includes('fullname') || lowerName.includes('companyname') || lowerName === 'fullname' || lowerName === 'companyname') return 50;
    return undefined;
  };

  // Handle input change with validation for different field types
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const lowerName = name.toLowerCase();

    // For phone/mobile fields, only allow digits
    if (lowerName.includes('mobile') || lowerName.includes('phone')) {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 10) {
        formikFrom.setFieldValue(name, numericValue);
      }
      return;
    }

    // For fullName field, only allow letters and spaces (no numbers, no special characters)
    if (lowerName === 'fullname') {
      const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
      formikFrom.setFieldValue(name, filteredValue);
      return;
    }

    // For companyName field, allow letters, numbers and spaces (no special characters)
    if (lowerName === 'companyname') {
      const filteredValue = value.replace(/[^a-zA-Z0-9\s]/g, '');
      formikFrom.setFieldValue(name, filteredValue);
      return;
    }

    // For email field, only allow valid email characters (letters, numbers, @, ., _, -)
    if (lowerName.includes('email')) {
      const filteredValue = value.replace(/[^a-zA-Z0-9@._\-]/g, '');
      formikFrom.setFieldValue(name, filteredValue);
      return;
    }

    formikFrom.handleChange(e);
  };

  return (
    <Form.Floating className="mb-3 position-relative">
      {inputType === "select" ? (
        <Form.Select
          id={fieldName}
          name={fieldName}
          value={formikFrom.values[fieldName]}
          onChange={formikFrom.handleChange}
          onBlur={formikFrom.handleBlur}
          className={
            isError(formikFrom, fieldName) ? "is-invalid py-1" : "py-1"
          }
        >
          <option value="">Select Category {labelText}</option>
          {options.map((opt, index) => (
            <option key={index} value={opt}>
              {opt}
            </option>
          ))}
        </Form.Select>
      ) : (
        <Form.Control
          id={fieldName}
          as={inputType}
          rows={5}
          type={fieldType === "password" && showPassword ? "text" : fieldType}
          name={fieldName}
          placeholder=""
          maxLength={getMaxLength(fieldName)}
          autoComplete="off"
          className={
            isError(formikFrom, fieldName) ? "is-invalid py-1" : "py-1"
          }
          value={formikFrom.values[fieldName]}
          onChange={handleInputChange}
          onBlur={formikFrom.handleBlur}
          onKeyPress={(e) => {
            const lowerName = fieldName.toLowerCase();
            if ((lowerName.includes('mobile') || lowerName.includes('phone')) && !/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
      )}

      <label
        htmlFor={fieldName}
        className="px-2 py-0 mt-3"
        style={{ height: "25px" }}
      >
        {labelText}
      </label>

      <ErrorMessage
        name={fieldName}
        component="small"
        className="text-danger"
      />

      {fieldType === "password" && inputType !== "select" && (
        <button
          type="button"
          className="span-btn-cirlce-btn eyeBtn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <i className="fa fa-eye-slash"></i>
          ) : (
            <i className="fa fa-eye"></i>
          )}
        </button>
      )}
    </Form.Floating>
  );
}

FloatingInputLabel.propTypes = {
  fieldName: PropTypes.string,
  formikFrom: PropTypes.any,
  labelText: PropTypes.string,
  fieldType: PropTypes.string,
  inputType: PropTypes.string,
  options: PropTypes.array,
};

export default FloatingInputLabel;
