import React, { useState, ChangeEvent } from "react";
import { QrCodeProps } from "../types/QrCode.types";

var QRCode = require("qrcode.react");

function NumberInput(props: QrCodeProps): JSX.Element {
  const [touched, setTouch] = useState(false);
  const [error, setError] = useState("");
  const [htmlClass, setHtmlClass] = useState("");
  const [, setValue] = useState(0);
  const { value = "", modified = true } = props;
  const qrData = modified
    ? "Yeah, There is new changes in the Docuemnt path, Pleae Save the Doc to Get the New QR Code."
    : value;

  function onValueChanged(event: ChangeEvent<HTMLInputElement>): void {}

  return (
    <div className={modified ? "qrtobeloaded" : ""}>
      {!modified && value !== "" ? (
        <img src={`${value}`} />
      ) : (
        "Please complete your selection"
      )}
      {/* {modified &&
        {
          <span style={{ padding: "61px 15px 6px 10px", position: "absolute" }}>
          there is new changes inSave the Doc to Get the New QR Code
        </span> 
        }} */}
    </div>
  );
}

export default NumberInput;
