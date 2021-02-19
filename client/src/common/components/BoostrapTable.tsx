import React, { useState } from "react";
import {
  BootstrapTable,
  TableHeaderColumn,
  InsertButton,
} from "react-bootstrap-table";

function BoostrapTable(props: any): JSX.Element {
  const columns = [
    { title: "Name", data: "name" },
    { title: "Position", data: "position" },
    { title: "Office", data: "office" },
    { title: "Extn.", data: "ext" },
    { title: "Start date", data: "date" },
    { title: "Salary", data: "salary" },
  ];
  const products: any[] = [];
  function convertDate(str: Date) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);

    return [date.getFullYear(), mnth, day].join("-");
  }

  const productElements: (JSX.Element | null)[] = props.columns.map(
    (header: any, io: any) => {
      // let cate = products.rack;

      console.log("-0-0-", { ...header });

      const { isKey = false, ...others } = header;

      if (header.customNewFormat !== undefined) {
        if (header.dataField === "manufacturedate") {
          return (
            <TableHeaderColumn {...header} dataFormat={convertDate}>
              {header.title}
            </TableHeaderColumn>
          );
        } else if (header.dataField === "expiredate") {
          return (
            <TableHeaderColumn {...header} dataFormat={convertDate}>
              {header.title}
            </TableHeaderColumn>
          );
        }
      } else {
        return (
          <TableHeaderColumn isKey={isKey} {...others}>
            {header.title}
          </TableHeaderColumn>
        );
      }
    }
  );
  function handleInsertButtonClick() {
    // Custom your onClick event here,
    // it's not necessary to implement this function if you have no any process before onClick
    console.log("This is my custom function for InserButton click event");
    //onClick();
  }
  function createCustomInsertButton() {
    return (
      <InsertButton
        btnText="CustomInsertText"
        btnContextual="btn-warning"
        className="my-custom-class"
        btnGlyphicon="glyphicon-edit"
        /*  onClick={() => this.handleInsertButtonClick(onClick)} */
      />
    );
  }

  function addProducts(quantity: any) {
    const startId = products.length;
    for (let i = 1; i < quantity; i++) {
      const id = startId + i;
      products.push({
        _id: id,
        name: "Item name " + id,
        category: "category name " + id,
      });
    }
  }
  const options = {
    noDataText: "This is custom text for empty data",
  };
  addProducts(50);
  function onClickProductSelected(cell: any, row: any, rowIndex: any) {
    if (props.onCustomSelect) props.onCustomSelect(row);
  }
  function buttonFormatter(
    cell: any,
    row: any,
    enumObject: any,
    rowIndex: any
  ) {
    return (
      <button
        type="button"
        onClick={() => onClickProductSelected(cell, row, rowIndex)}
      >
        Click me {rowIndex}
      </button>
    );
  }
  return (
    <div>
      <BootstrapTable data={[]}>
        {productElements}
        <TableHeaderColumn
          dataField="button"
          dataFormat={buttonFormatter}
          className="thead-light-1"
        >
          Action
        </TableHeaderColumn>
      </BootstrapTable>
      {/*  <BootstrapTable data={products} search={true} options={options}>
        <TableHeaderColumn dataField="_id" isKey>
          Product ID
        </TableHeaderColumn>
        <TableHeaderColumn dataField="name">Product Name</TableHeaderColumn>
        <TableHeaderColumn dataField="price">Product Price</TableHeaderColumn>
      </BootstrapTable> */}
    </div>
  );
}

export default BoostrapTable;
