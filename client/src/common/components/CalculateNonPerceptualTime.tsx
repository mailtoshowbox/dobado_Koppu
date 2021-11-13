import React, { useState, ChangeEvent } from "react";
import DateInput from "../../common/components/DateInput";
function TextInput(props: any): JSX.Element {
  const [touched, setTouch] = useState(false);
  const [, setError] = useState("");
  const [, setHtmlClass] = useState("");
  const [, setValue] = useState(0);

  function onValueChanged(dateValue: ChangeEvent<HTMLInputElement>): void {
    let [error, validClass, elementValue] = ["", "", dateValue];

   
    props.onChange({
      value: elementValue,
      error: error,
      touched: touched,
      field: props.field,
    });

    setTouch(true);
    setError(error);
    setHtmlClass(validClass); 
  }
 

  const {    
    value: { time = 0, calculateNonPerceptualTime = "MM/YY", defaultYear="3" },
  } = props;

  let dt = new Date();
  let selectedDate = new Date(dt.setFullYear(dt.getFullYear() + defaultYear)); 
  let timeSeed = new Date(selectedDate).getUTCFullYear() - new Date().getUTCFullYear();// parseInt(value.toString());



  console.log("props----", props);
  if(props.value.retension_exact_date !== ""){    
      selectedDate =   new Date(props.value.retension_exact_date);
      timeSeed = time;
    
  }
  return (
    <div className="form-row">
      <div className="form-group col-md-6">
        <input
          value={timeSeed}
          onChange={onValueChanged}
          type="number"
          className={`form-control `}
          placeholder={"YY"}
          min="1"
          max="99"
          style={{"display":"none"}}
          name="calculateNonPerceptualTime"
        />

<DateInput
										id="retension_exact_date"
										field="retension_exact_date"
										value={ selectedDate
										}
										required={false}
										label="To be retention Upto"
										placeholder="Manufacture date"
										onChange={onValueChanged}
                    
									/>
      </div>
      <div
        className="form-group col-md-6"
        style={{
          padding: "35px 36px 4px 1px",
          textAlign: "left","display":"none"
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
