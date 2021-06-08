import React from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

function BoostrapTable(props: any): JSX.Element {
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
