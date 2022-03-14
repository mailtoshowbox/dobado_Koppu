import React from "react";
import { useSelector } from "react-redux";
import {
  IStateType,
  IDocIssuanceState,
} from "../../store/models/root.interface";
import { IDocIssuance } from "../../store/models/docIssuance.interface";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

export type productListProps = {
  onSelect?: (product: IDocIssuance) => void;
  onSelectDelete?: (product: IDocIssuance) => void;
  children?: React.ReactNode;
  docIssuanceModificationStatus: any;
  allowDelete: boolean;
};

function DocApprovalList(props: productListProps): JSX.Element {
  const docIssuances: IDocIssuanceState = useSelector(
    (state: IStateType) => state.docIssuances
  );

  function onClickProductSelected(cell: any, row: any, rowIndex: any) {
    if (props.onSelect) props.onSelect(row);
  }
  function onClickProductDelete(cell: any, row: any, rowIndex: any) {
    if (props.onSelectDelete) props.onSelectDelete(row);
  }

  function document_type_format(cell: any, row: any) {
		if (row.doc_requested_doctype) {
			return row.doc_requested_doctype.name;
		}
		return "-";
	}

  function buttonFormatter(
    cell: any,
    row: any,
    enumObject: any,
    rowIndex: any
  ) {
    const { docIssuanceModificationStatus = 0, allowDelete } = props;
    if (docIssuanceModificationStatus === 0) {
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
        </>
      );
    }
  }

  const docApprovalFormatter = (cell: any, row: any) => {
    const { approval = [], issuance = {} } = row;

    let stsus = "";
    if (approval.length > 0) {
      let issued = false;
      approval.forEach((appr: any) => {
        if (appr.status === "pending") {
         /*  stsus +=
            "<span class=' approval-status btn-info'>" +
            appr.approve_access_level +
            " approval " +
            "Pending</span>&nbsp;"; */
            stsus +=
            "<span class=' approval-status btn-info'>" +

            "<span style=' text-transform: capitalize;'> "+     appr.approve_access_level +  " Appproval" +" </span>"+        
       
           
            " is Pending</span>";
        } else if (appr.status === "approved") {
          const { doc_issued_by = [], is_issued = false, is_doc_issuance_cancelled = false } = issuance;
          if (is_doc_issuance_cancelled && !is_issued) {
            stsus +=
              "<span class=' approval-status btn-info'>Document request issue has been rejected</span>";
          }
          else if (doc_issued_by.length > 0 && !is_issued) {
            stsus +=
              "<span class=' approval-status btn-info issued-cls'>Part of request has been issued</span>";
          } else if (is_issued) {
            stsus +=
              "<span class=' approval-status btn-info issued-cls'>Request has been issued</span>";
          } else {
            stsus +=
              "<span class=' approval-status btn-info'>" +
              appr.approve_access_level +
              " is Approved</span>";
          }
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
        data={docIssuances.docIssuances}
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
          width="10%"
          className="thead-light-1"
         
        >
          Request No
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="doc_type"
          className="thead-light-1"
          	dataFormat={document_type_format}
          width="10%"
        >
          Doc Type
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="empl_id"
          className="thead-light-1"
          width="10%"
        >
          Emp Id
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="button"
          className="thead-light-1"
          width="35%"
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
