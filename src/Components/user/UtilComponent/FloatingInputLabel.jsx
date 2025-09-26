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
          maxLength={fieldName === "mobileno" ? "10" : ""}
          autoComplete="off"
          className={
            isError(formikFrom, fieldName) ? "is-invalid py-1" : "py-1"
          }
          value={formikFrom.values[fieldName]}
          onChange={formikFrom.handleChange}
          onBlur={formikFrom.handleBlur}
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
          className="span-btn eyeBtn"
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
