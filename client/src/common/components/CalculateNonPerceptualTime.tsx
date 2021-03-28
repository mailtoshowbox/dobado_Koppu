import React, { useState, ChangeEvent } from "react";

function TextInput(props: any): JSX.Element {
  const [touched, setTouch] = useState(false);
  const [, setError] = useState("");
  const [, setHtmlClass] = useState("");
  const [, setValue] = useState(0);

  function onValueChanged(event: ChangeEvent<HTMLInputElement>): void {
    let [error, validClass, elementValue] = ["", "", event.target.value];

    if (elementValue.length > 2) {
      elementValue = elementValue.slice(0, 2);
    }

    props.onChange({
      value: parseInt(elementValue),
      error: error,
      touched: touched,
      field: props.field,
    });

    setTouch(true);
    setError(error);
    setHtmlClass(validClass);
    setValue(parseInt(elementValue));
  }

  //function add_years(n: number) {
   // return 2;
    //return new Date(dt.setFullYear(dt.getFullYear() + n));
  //}

  //let dt = new Date();

  const {
    
    value: { time = 0, calculateNonPerceptualTime = "MM/YY" },
  } = props;

  return (
    <div className="form-row">
      <div className="form-group col-md-6">
        <label style={{ color: "#736AFF" }}>{"To be retention Upto"}</label>
        <input
          value={time}
          onChange={onValueChanged}
          type="number"
          className={`form-control `}
          placeholder={"YY"}
          min="1"
          max="99"
        />
      </div>
      <div
        className="form-group col-md-6"
        style={{
          padding: "35px 36px 4px 1px",
          textAlign: "left",
        }}
      >
        { calculateNonPerceptualTime ?
        <span
        style={{
          border: "1px solid",
          padding: "7px 10px",
          borderRadius: "3px",
        }}
      >
        {calculateNonPerceptualTime}
      </span> : null
        }
        
      </div>
    </div>
  );
}

export default TextInput;
