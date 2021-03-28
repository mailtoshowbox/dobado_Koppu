import React, { } from "react";
import { useSelector } from "react-redux";
import { IStateType, IDocTypeState } from "../../store/models/root.interface";
import { IDocType } from "../../store/models/doctype.interface";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

export type productListProps = {
  onSelect?: (product: IDocType) => void;
  children?: React.ReactNode;
  onSelectDelete?: (box: IDocType) => void;
  allowDelete: boolean;
  docCategoryModificationStatus: any;
};

function DocCategoryList(props: productListProps): JSX.Element {
  const docTypes: IDocTypeState = useSelector(
    (state: IStateType) => state.docTypes
  );
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
    const { docCategoryModificationStatus = 0, allowDelete = false } = props;
    if (docCategoryModificationStatus === 0) {
      return (
        <>
          <button
            type="button" className="btn btn-border"
            onClick={() => onClickProductSelected(cell, row, rowIndex)}
          >
            <i className="fas fa fa-pen"></i>
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
            className="btn btn-border  btn-red-color"
            onClick={() => onClickProductDelete(cell, row, rowIndex)}
          >
            <i className="fas fa fa-trash" aria-hidden="true"></i>
          </button>
        </>
      );
    }
  }

  const options = {
    clearSearch: true,
  };
  return (
    <div className="portlet">
      <BootstrapTable
        options={options}
        data={docTypes.docTypes}
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
    </div>
  );
}

export default DocCategoryList;
