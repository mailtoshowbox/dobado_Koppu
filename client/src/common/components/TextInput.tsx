import React, { useState, ChangeEvent } from "react";
import { TextInputProps } from "../types/TextInput.types";

function TextInput(props: TextInputProps): JSX.Element {
  const [touched, setTouch] = useState(false);
  const [error, setError] = useState("");
  const [htmlClass, setHtmlClass] = useState("");
  const [, setValue] = useState("");

  function onValueChanged(event: ChangeEvent<HTMLInputElement>): void {
    let [error, validClass, elementValue] = ["", "", event.target.value];

    const { field, customError } = props;

    if (field === "email") {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      [error, validClass] = !pattern.test(elementValue)
        ? ["Complete field with proper email", "is-invalid"]
        : ["", "is-valid"];
    } else {
      [error, validClass] =
        !elementValue && props.required
          ? ["Value cannot be empty", "is-invalid"]
          : ["", "is-valid"];
    }

    if (!error) {
      [error, validClass] =
        props.maxLength && elementValue && elementValue.length > props.maxLength
          ? [
              `Value can't have more than ${props.maxLength} characters`,
              "is-invalid",
            ]
          : ["", "is-valid"];
    }

    props.onChange({
      value: elementValue,
      error: error,
      touched: touched,
      field: props.field,
    });

    setTouch(true);
    setError(error);
    setHtmlClass(validClass);
    setValue(elementValue);
  }

  const { customError } = props;
  return (
    <div>
      <label htmlFor={props.id.toString()}>{props.label}</label>
      <input
        value={props.value}
        type={props.type}
        onChange={onValueChanged}
        className={`form-control ${props.inputClass} ${htmlClass}`}
        id={`id_${props.label}`}
        placeholder={props.placeholder}
      />
      {!customError && error ? (
        <div className="invalid-feedback">{error}</div>
      ) : null}
      {!error && customError ? (
        <div className="invalid-field">{customError}</div>
      ) : null}
    </div>
  );
}

export default TextInput;
