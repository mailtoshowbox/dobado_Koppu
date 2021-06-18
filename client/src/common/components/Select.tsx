import React, { useState, ChangeEvent, Fragment } from "react";
import { SelectProps } from "../types/Select.types";
import { IRootOption } from "../../store/models/root.interface";
function SelectInput(props: SelectProps): JSX.Element {
  const [touched, setTouch] = useState(false);
  const [error, setError] = useState("");
  const [htmlClass, setHtmlClass] = useState("");
  const [value, setValue] = useState(props.value);

  function onValueChanged(event: ChangeEvent<HTMLSelectElement>): void {
    let [error, validClass, elementValue] = ["", "", event.target.value];

    [error, validClass] =
      !elementValue && props.required
        ? ["Value has to be selected", "is-invalid"]
        : ["", "is-valid"];

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

  let selectedValue = "";
  const getOptions = props.options.map((option) => {
    if (!selectedValue) {
      selectedValue =
        option.id === value
          ? option.id
          : option.name === value
          ? option.id
          : "";
    }
    return (
      <option key={option.id} value={`${option.id}`}>
        {option.name}
      </option>
    );
  });
  const { customError, disabled = false } = props;

  return (
    <Fragment>
      <label htmlFor={`${props.id}`}>{props.label}</label>
      <select
        value={selectedValue}
        id={`${props.id}`}
        className={`form-control ${
          props.inputClass ? props.inputClass : ""
        } ${htmlClass}`}
        onChange={onValueChanged}
        disabled={disabled}
      >
        <option value="">Choose...</option>
        {getOptions}
      </select>
      {!customError && error ? (
        <div className="invalid-feedback">{error}</div>
      ) : null}
      {!error && customError ? (
        <div className="invalid-field">{customError}</div>
      ) : null}
    </Fragment>
  );
}

export default SelectInput;
