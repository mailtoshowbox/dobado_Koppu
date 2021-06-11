import React from "react";
import { useSelector } from "react-redux";
import {
  IStateType,
  IDocDepartmentState,
} from "../../store/models/root.interface";
import { IDocDepartment } from "../../store/models/docdepartment.interface";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

export type productListProps = {
  onSelect?: (product: IDocDepartment) => void;
  onSelectDelete?: (product: IDocDepartment) => void;
  children?: React.ReactNode;
  docDepartmentModificationStatus: any;
  allowDelete: boolean;
};

function DocCategoryList(props: productListProps): JSX.Element {
  const docDepartments: IDocDepartmentState = useSelector(
    (state: IStateType) => state.docDepartments
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
    const { docDepartmentModificationStatus = 0, allowDelete } = props;
    if (docDepartmentModificationStatus === 0) {
      return (
        <>
          <button
            type="button"
            className="btn btn-border"
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
            type="button"
            className="btn btn-border"
            disabled
            style={{ cursor: "not-allowed" }}
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
        data={docDepartments.docDepartments}
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
