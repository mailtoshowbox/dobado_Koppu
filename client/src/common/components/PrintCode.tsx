import React, { ReactElement } from "react";

function PrintCode(props: any): ReactElement {
  const { qr_code = {}, category = {} } = props.code;
  const { docCategories = [] } = props;
  let category_name = "";
  const selectedCatValue = category?.value;
  let selectedCat =
    docCategories.filter((catee: any) => catee._id === selectedCatValue) || [];
  if (selectedCat.length > 0) {
    category_name = selectedCat[0].name;
  }
  const tableStyle = {
    border: "1px solid #000",
    borderCollapse: "collapse",
    margin: "auto",
  } as React.CSSProperties;

  const tableCellStyle = {
    border: "1px solid #000",
    width: "40%",
  } as React.CSSProperties;
  return (
    <div
      className="card"
      style={{ width: "18rem", display: "none", textAlign: "center" }}
      id="uniquename"
    >
      <img
        className="card-img-top"
        src="..."
        alt="Card cap"
        style={{ textAlign: "center", display: "block" }}
      />
      <div className="card-body">
        <h4 className="card-title" style={{ textAlign: "center" }}>
          PRINT LABEL
        </h4>
        <table className="print-table" style={tableStyle}>
          <tr>
            <td style={tableCellStyle}>DOCUMENT NUMBER</td>
            <td style={tableCellStyle}>{qr_code?.value}</td>
          </tr>
          <tr>
            <td style={tableCellStyle}>CATEGORY</td>
            <td style={tableCellStyle}>{category_name}</td>
          </tr>
          <tr>
            <td style={tableCellStyle}>NO OF COPIES</td>
            <td style={tableCellStyle}>{0}</td>
          </tr>
        </table>
        {/* <div className="form-row">
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
        </div> */}
      </div>
    </div>
  );
}

export default PrintCode;
