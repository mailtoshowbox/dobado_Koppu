import React, { ReactElement } from "react";

function PrintCode(props: any): ReactElement {
  const { qr_code = {}, category = {} } = props.code;
  return (
    <div
      className="card"
      style={{ width: "18rem", display: "none" }}
      id="uniquename"
    >
      <img className="card-img-top" src="..." alt="Card image cap" />
      <div className="card-body">
        <h5 className="card-title">PRINT LABEL</h5>
        <div className="form-row">
          <div className="form-group col-md-6">DOCUMENT NUMBER</div>
          <div className="form-group col-md-4">{qr_code?.value}</div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">CATEGORY</div>
          <div className="form-group col-md-4">{category?.value}</div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">NO OF COPIES</div>
          <div className="form-group col-md-4">{0}</div>
        </div>
      </div>
    </div>
  );
}

export default PrintCode;
