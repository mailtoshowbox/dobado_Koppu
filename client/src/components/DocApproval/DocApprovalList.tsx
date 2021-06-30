import React from "react";
import { useSelector } from "react-redux";
import {
  IStateType,
  IDocApprovalState,
} from "../../store/models/root.interface";
import { IDocApproval } from "../../store/models/docapproval.interface";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { docRequestDocumentType } from "../../common/utils";

export type productListProps = {
  onSelect?: (product: IDocApproval) => void;
  onSelectDelete?: (product: IDocApproval) => void;
  children?: React.ReactNode;
  docApprovalModificationStatus: any;
  allowDelete: boolean;
};

function DocApprovalList(props: productListProps): JSX.Element {
  const docApprovals: IDocApprovalState = useSelector(
    (state: IStateType) => state.docApprovals
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
    const { docApprovalModificationStatus = 0, allowDelete } = props;
    if (docApprovalModificationStatus === 0) {
      return (
        <>
          <button
            type="button"
            className="btn btn-border"
            onClick={() => onClickProductSelected(cell, row, rowIndex)}
          >
            <i className="fas fa fa-pen"></i>
          </button>
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
            "<br>&nbsp; >> &nbsp;&nbsp;<span class=' btn-info'>" +
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

  const docRequestDocumentTypeFormatter = (cell: any, row: any) => {
    return docRequestDocumentType(cell);
  };
  const options = {
    clearSearch: true,
  };

  return (
    <div className="portlet">
      <BootstrapTable
        options={options}
        data={docApprovals.docApprovals}
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
          dataFormat={docRequestDocumentTypeFormatter}
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
        <TableHeaderColumn
          dataField="button"
          className="thead-light-1"
          width="10%"
          dataFormat={buttonFormatter}
        >
          Action
        </TableHeaderColumn>
      </BootstrapTable>
    </div>
  );
}

export default DocApprovalList;
