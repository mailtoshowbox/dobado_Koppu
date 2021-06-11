import React from "react";
import { useSelector } from "react-redux";
import {
  IStateType,
  IDocRequestState,
} from "../../store/models/root.interface";
import { IDocRequest } from "../../store/models/docrequest.interface";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

export type productListProps = {
  onSelect?: (product: IDocRequest) => void;
  onSelectDelete?: (product: IDocRequest) => void;
  children?: React.ReactNode;
  docRequestModificationStatus: any;
  allowDelete: boolean;
};

function DocRequestList(props: productListProps): JSX.Element {
  const docRequests: IDocRequestState = useSelector(
    (state: IStateType) => state.docRequests
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
    const { docRequestModificationStatus = 0, allowDelete } = props;
    if (docRequestModificationStatus === 0) {
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

  const docApprovalFormatter = (cell: any, row: any) => {
    const { approval = [] } = row;

    let stsus = "";
    if (approval.length > 0) {
      approval.forEach((appr: any) => {
        if (appr.status === "pending") {
          stsus +=
            "<br><i class='fal fa-hourglass-half'></i>&nbsp;&nbsp;<span class=' btn-info'>" +
            appr.approve_access_level +
            " approval is " +
            "Pending</span>&nbsp;";
        } else if (appr.status === "approved") {
          stsus +=
            "<br><span class=' btn-info'>" +
            appr.approve_access_level +
            " approval is " +
            "Approved</span>";
        }
      });
    }

    return stsus;
  };

  const options = {
    clearSearch: true,
  };
  return (
    <div className="portlet">
      <BootstrapTable
        options={options}
        data={docRequests.docRequests}
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
          dataField="request_no"
          width="16%"
          className="thead-light-1"
        >
          Request No
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="doc_type"
          className="thead-light-1"
          width="16%"
        >
          Doc Type
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="empl_id"
          className="thead-light-1"
          width="16%"
        >
          Emp Id
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="button"
          className="thead-light-1"
          width="10%"
          dataFormat={docApprovalFormatter}
        >
          Status
        </TableHeaderColumn>
      </BootstrapTable>
    </div>
  );
}

export default DocRequestList;
