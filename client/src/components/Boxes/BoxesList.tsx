import React, { Fragment, Dispatch, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IStateType, IBoxState } from "../../store/models/root.interface";
import { IBox } from "../../store/models/box.interface";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

export type productListProps = {
  onSelect?: (box: IBox) => void;
  onSelectDelete?: (box: IBox) => void;

  children?: React.ReactNode;
  boxModificationStatus: any;
  allowDelete: boolean;
};

function BoxList(props: productListProps): JSX.Element {
  const boxes: IBoxState = useSelector((state: IStateType) => state.boxes);

  const productElements: (JSX.Element | null)[] = boxes.boxes.map((box) => {
    if (!box) {
      return null;
    }
    return (
      <tr
        className={`table-row ${
          boxes.selectedBox && boxes.selectedBox._id === box._id
            ? "selected"
            : ""
        }`}
        onClick={() => {
          if (props.onSelect) props.onSelect(box);
        }}
        key={`product_${box._id}`}
      >
        <td>{box.name}</td>
        <td>{box.racks}</td>
      </tr>
    );
  });
  const options = {
    clearSearch: true,
  };
  function onClickProductSelected(cell: any, row: any, rowIndex: any) {
    if (props.onSelect) props.onSelect(row);
  }
  function onClickProductDelete(cell: any, row: any, rowIndex: any) {
    if (props.onSelectDelete) props.onSelectDelete(row);
  }
  function buttonFormatter(
    cell: any,
    row: any,
    enumObject: any,
    rowIndex: any
  ) {
    const { boxModificationStatus = 0, allowDelete = false } = props;
    if (boxModificationStatus === 0) {
      return (
        <>
          <button
            type="button" className="btn btn-border"
            onClick={() => onClickProductSelected(cell, row, rowIndex)}
          >
            <i className="fas fa fa-pen" aria-hidden="true"></i>
          </button>
          {allowDelete && (
            <button
              className="btn btn-border btn-red-color"
              onClick={() => onClickProductDelete(cell, row, rowIndex)}
            >
              <i className="fas fa fa-trash" aria-hidden="true"></i>
            </button>
          )}
        </>
      );
    } else {
      return (
        <>
          <button
            type="button" className="btn btn-border"
            disabled
            style={{ cursor: "not-allowed" }}
            onClick={() => onClickProductSelected(cell, row, rowIndex)}
          >
            <i className="fas fa fa-pen"></i>
          </button>
          <button
            className="btn btn-border"
            onClick={() => onClickProductDelete(cell, row, rowIndex)}
          >
            <i className="fas fa fa-trash" aria-hidden="true"></i>
          </button>
        </>
      );
    }
  }
  return (
    <div className=" portlet custom-table-style  table-bordered table-hover">
      <BootstrapTable
        options={options}
        data={boxes.boxes}
        pagination={true}
        hover={true}
        search={true}
      >
        <TableHeaderColumn
          dataField="_id"
          isKey
          searchable={false}
          hidden={true}
        >
          ID
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="name"
          width="16%"
          className="thead-light-1"
        >
          Name
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="description"
          className="thead-light-1"
          width="16%"
        >
          Description
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="button"
          dataFormat={buttonFormatter}
          className="thead-light-1"
          width="10%"
        >
          Action
        </TableHeaderColumn>
      </BootstrapTable>
      {/* <table className="table">
        <thead className="thead-light">
          <tr>
            
            <th scope="col">Name</th>
            <th scope="col">No of Racks</th>
            
          </tr>
        </thead>
        <tbody>
          {productElements}
        </tbody>
      </table> */}
    </div>
  );
}

export default BoxList;
