import React from "react";
import { useSelector } from "react-redux";
import {
  IStateType,
  IDocIssuanceState,IDocIssuanceTakeoutState
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


  const docIssuance: IDocIssuanceTakeoutState = useSelector(
    (state: IStateType) => state.docIssuancesTakeout
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
    const { doc_issued_by = [], is_issued = false, is_doc_issuance_cancelled = false } = issuance;

  let stsus = "";

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
        }  
  return stsus;
  }; 

  
  const docTypeFormatter = (cell: any, row: any) => { 
    let stsus = "";
    if(row.doc_requested_doctype){
      stsus = row.doc_requested_doctype.name ? row.doc_requested_doctype.name : ""
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
        data={docIssuance.docIssuancesTakeout}
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
          width="10%"
          dataFormat={docTypeFormatter}
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
