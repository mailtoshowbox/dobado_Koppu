import React, { useState, ChangeEvent } from "react";
import { TextInputProps } from "../types/DateInput.types";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
function TextInput(props: TextInputProps): JSX.Element {
  //const [startDate, setStartDate] = useState(new Date());

  const [touched, setTouch] = useState(false);
  const [error, setError] = useState("");
  const [, setHtmlClass] = useState("");
  //const [, ,] = useState("");

  function onValueChanged(dateValue: ChangeEvent<HTMLInputElement>): void {
    let [error, validClass, elementValue] = ["", "", dateValue];

    [error, validClass] =
      !elementValue && props.required
        ? ["Value cannot be empty", "is-invalid"]
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
    // setValue(elementValue);
    //

    //setStartDate(new Date(dateValue));
  }

  return (
    <div>
      <label htmlFor={props.id.toString()}>{props.label}</label>

      <DatePicker
        className={"form-control"}
        selected={new Date(props.value)}
        isClearable
        closeOnScroll={true}
        placeholderText={props.placeholder}
        onChange={(date: any) => onValueChanged(date)}
      />

      {error ? <div className="invalid-feedback">{error}</div> : null}
    </div>
  );
}

export default TextInput;
