import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import {
  IStateType,
  IDocIssuanceState,
} from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import {
  IDocIssuance,
  DocIssuanceModificationStatus,
  IDocIssuanceList,
} from "../../store/models/docIssuance.interface";

import TextInput from "../../common/components/TextInput";
import NumberInput from "../../common/components/NumberInput";

import { setModificationState } from "../../store/actions/docissuance.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  approveDocumentRequest,
  issueGenaralIssuance,
} from "../../services/index";
import {
  OnChangeModel,
  IDocIssuanceFormState,
} from "../../common/types/Form.types";
import { updateDocumentRequest } from "../../services/index";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import SelectInput from "../../common/components/Select";
import { IAccount } from "../../store/models/account.interface";
import { uniqueId } from "../../common/utils";
import APP_CONST from "../../common/contant";
import Popup from "reactjs-popup";
import { UL } from "@blueprintjs/core";

const DocIssuanceYesForm: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);

  const dispatch: Dispatch<any> = useDispatch();
  const docIssuances: IDocIssuanceState | null = useSelector(
    (state: IStateType) => state.docIssuances
  );

  let docIssuance: IDocIssuance | null = docIssuances.selectedDocIssuance;
  const isCreate: boolean =
    docIssuances.modificationState === DocIssuanceModificationStatus.Create;
  const [loginPopup, setLoginPopup] = useState(false);
  const [printYesDoc, setPrintYesDoc] = useState(false);
  const [selectedDocForPrint, setSelectedDocForPrint] = useState({
    document_name: "",
    document_no: "",
    no_of_copy: "",
    no_of_page: "",
    reason_for_request: "",
    no_of_label: 0,
  });

  if (!docIssuance || isCreate) {
    docIssuance = {
      _id: "",
      name: "",
      description: "",
      empl_id: account.emp_id ? account.emp_id : "XXXX",
      request_no: uniqueId(APP_CONST.REQUEST_DOCUMENT_PREFIX),
      doc_type: 1,
      requested_doc: [],
      approval: [],
      emp_code_approval_1: "222",
      emp_code_approval_2: "12",
    };
  }
  const [showYes, setShowYes] = useState(false);
  const [generateNumYes, setGenerateNumYes] = useState(false);
  const [generateNumNo, setGenerateNumNo] = useState(true);

  const intialFormState = {
    _id: { error: "", value: docIssuance._id },
    name: { error: "", value: docIssuance.name },
    description: { error: "", value: docIssuance.description },
    empl_id: { error: "", value: docIssuance.empl_id },
    doc_type: { error: "", value: docIssuance.doc_type },
    request_no: { error: "", value: docIssuance.request_no },
    requested_doc: { value: docIssuance.requested_doc },
    emp_code_approval_1: { value: docIssuance.emp_code_approval_1 },
    emp_code_approval_2: { value: docIssuance.emp_code_approval_2 },
    approval: { value: docIssuance.approval },
  };
  const [formState, setFormState] = useState(intialFormState);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  function hasFormValueChanged(model: OnChangeModel): void {
    setFormState({
      ...formState,
      [model.field]: { error: model.error, value: model.value },
    });
  }

  function hasLoginFormValueChanged(model: OnChangeModel): void {
    setLoginForm({
      ...loginForm,
      [model.field]: model.value,
    });
  }

  function cancelForm(): void {
    console.log();
    dispatch(setModificationState(DocIssuanceModificationStatus.None));
  }
  function handleYes(): void {
    console.log("");
    setShowYes(true);
  }

  function getDisabledClass(): string {
    let isError: boolean = isFormInvalid();
    return isError ? "disabled" : "";
  }

  function isFormInvalid(): boolean {
    return true;
  }

  function saveDocumentRequest(e: FormEvent<HTMLFormElement>): void {
    //setLoginPopup(true);
    e.preventDefault();
    if (!isFormInvalid()) {
      return;
    }

    // saveForm(formState, updateDocRequestApproval, "EDIT");
  }

  function validateLogin(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const { value = [] } = formState.approval;
    const currentApproval = value.filter;
  }

  function hasGenarateNumberChanged(model: any): void {
    console.log("OnChangeModel---", model.target.value);
    setGenerateNumYes(!generateNumYes);
    setGenerateNumNo(!generateNumNo);
    if (model.target.value === "yes") {
      // setGenerateNumYes(!!generateNumYes);
    } else {
      //no
      // setGenerateNumNo(!!generateNumNo);
    }
  }
  function hasGenarateNumberPrint(model: any, docNum: string): void {
    console.log("formState.requested_doc---", formState.requested_doc);
    const selectedDocu: any = formState.requested_doc.value.filter(
      (doc: any) => {
        return doc.document_no === docNum;
      }
    )[0];
    setSelectedDocForPrint(selectedDocu);
    setPrintYesDoc(true);
  }
  const printOptionFormatter = (cell: any, row: any) => {
    console.log("row------", row);
    if (generateNumYes) {
      const { is_doc_approved = false } = row;
      if (is_doc_approved) {
        return (
          <span>
            <i className="fa fa-thumbs-up" aria-hidden="true"></i>
          </span>
        );
      } else {
        return (
          <span>
            <i
              onClick={(even) => hasGenarateNumberPrint(even, row.document_no)}
              className="fa fa-print"
              aria-hidden="true"
            ></i>
          </span>
        );
      }
    } else {
      return (
        <span onClick={() => hasGenarateNumberPrint}>
          <i className="fa fa-podcast" aria-hidden="true"></i>
        </span>
      );
    }
  };

  const printLabel = (event: any) => {
    event.preventDefault();
    var divContents = document.getElementById("printme")?.innerHTML;
    var a = window.open("", "", "height=500, width=500");
    a?.document.write("<html>");
    a?.document.write("<body >");
    a?.document.write(divContents ? divContents : "nothing to display");
    a?.document.write("</body></html>");
    a?.document.close();
    a?.print();

    const requestedDoc = formState.requested_doc.value;
    const apprvedDoc = requestedDoc.map((doc) => {
      if (doc.document_no === selectedDocForPrint.document_no) {
        doc.is_doc_approved = true;
      } else {
        doc.is_doc_approved = false;
      }
      return doc;
    });
    let approvalInfo = {
      name: formState.name.value,
      empl_id: formState.empl_id.value,
      doc_type: formState.doc_type.value,
      request_no: formState.request_no.value,
      requested_doc: apprvedDoc,
      approval: formState.approval.value,
      id: formState._id.value,
    };
    issueGenaralIssuance(approvalInfo, account).then((status) => {
      console.log("issueGenaralIssuance--", status);
    });
  };
  function hasNoOfLabelValueChanged(model: OnChangeModel): void {
    setSelectedDocForPrint({
      ...selectedDocForPrint,
      [model.field]: model.value,
    });
  }
  const printLabels = () => {
    let menuItems = [];
    for (var i = 0; i < selectedDocForPrint.no_of_label; i++) {
      const printO = (
        <div key={i}>
          <div>Logo</div>
          <div>Reference Number : {selectedDocForPrint.document_no} </div>
          <div>Categoy : ? </div>
          <div>Name of Doc : {selectedDocForPrint.document_name} </div>
          <div>Type of Doc : {formState.doc_type.value} </div>
          <div></div>
          <br></br>
        </div>
      );
      menuItems.push(<span>{printO}</span>);
    }

    return (
      <div>
        Print Label<br></br>
        {menuItems}
      </div>
    );
  };

  function rowClassNameFormat(row: any, rowIdx: any) {
    if (row.is_doc_approved !== undefined && row.is_doc_approved) {
      return "class-doc-approved-already";
    } else {
      return "class-doc-not-approved-already";
    }
  }

  const issueGenaralIssuanceAll = (event: any) => {
    event.preventDefault();

    console.log("issuanceDocissuanceDocissuanceDoc-");

    const requestedDoc = formState.requested_doc.value;
    const apprvedDoc = requestedDoc.map((doc) => {
      doc.is_doc_approved = true;
      return doc;
    });

    if (!generateNumYes && generateNumNo) {
      const issuanceDoc = {
        empl_id: account.emp_id,
        empl_email_id: account.email,
        status: "issued",
        approve_access_level: account.roles[0],
      };

      let approvalInfo = {
        name: formState.name.value,
        empl_id: formState.empl_id.value,
        doc_type: formState.doc_type.value,
        request_no: formState.request_no.value,
        requested_doc: apprvedDoc,
        approval: formState.approval.value,
        id: formState._id.value,
        issuance: issuanceDoc,
      };
      issueGenaralIssuance(approvalInfo, account).then((status) => {
        console.log("issueGenaralIssuance--", status);
      });
    }
  };

  return (
    <Fragment>
      <div className="col-xl-12 col-lg-12">
        <div className="card shadow mb-4">
          <div className="card-body">
            <form onSubmit={saveDocumentRequest}>
              <div className="form-group font-14">
                <br></br>

                <BootstrapTable
                  data={formState.requested_doc.value}
                  trClassName={rowClassNameFormat}
                >
                  <TableHeaderColumn
                    dataField="id"
                    isKey
                    row={0}
                    colSpan={1}
                    csvHeader="Customer"
                    className="label-field-column-black"
                  >
                    Request no
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    row={1}
                    csvHeader="order"
                    dataField="order"
                    dataSort
                    className="label-field-column-black"
                  >
                    Department
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row={2}
                    csvHeader="order"
                    dataField="document_no"
                    dataSort
                    width="16%"
                  >
                    DOc No
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    row={0}
                    colSpan={1}
                    csvHeader="Customer"
                    filter={{ type: "TextFilter", delay: 1000 }}
                    className="label-field-column"
                  >
                    {formState.request_no.value}
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    row={1}
                    csvHeader="order"
                    dataField="order"
                    dataSort
                    className="label-field-column"
                  >
                    MAIN DEPT
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row={2}
                    csvHeader="order"
                    dataField="document_name"
                    dataSort
                    width="16%"
                  >
                    DOc Name
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    row={0}
                    colSpan={1}
                    csvHeader="Customer"
                    className="label-field-column-black"
                  >
                    REQUESTED BY
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    row={1}
                    csvHeader="order"
                    dataField="order"
                    dataSort
                    className="label-field-column-black"
                  >
                    CATEGORY
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    row={0}
                    colSpan={1}
                    csvHeader="Customer"
                    filter={{ type: "TextFilter", delay: 1000 }}
                    className="label-field-column"
                  >
                    {formState.empl_id.value}
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    row={1}
                    csvHeader="order"
                    dataField="order"
                    dataSort
                    className="label-field-column"
                  >
                    {formState.doc_type.value}
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row={2}
                    csvHeader="order"
                    dataField="no_of_copy"
                    dataSort
                    width="16%"
                  >
                    no of Copy
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    row={0}
                    colSpan={3}
                    csvHeader="Customer"
                    filter={{ type: "TextFilter", delay: 1000 }}
                  >
                    REFERENCE NUMBER GENERATION
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row={1}
                    csvHeader="order"
                    dataField="order"
                    dataSort
                  >
                    <input
                      type="checkbox"
                      name="active"
                      value="yes"
                      checked={generateNumYes}
                      onChange={(eve) => hasGenarateNumberChanged(eve)}
                    />
                    Yes
                    <input
                      type="checkbox"
                      name="qtype"
                      value="no"
                      checked={generateNumNo}
                      onChange={(eve) => hasGenarateNumberChanged(eve)}
                    />
                    No
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row={2}
                    csvHeader="order"
                    dataField="no_of_page"
                    dataSort
                    width="16%"
                  >
                    no of Pages
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row={2}
                    csvHeader="order"
                    dataField="reason_for_request"
                    dataSort
                    width="16%"
                  >
                    Reason for Request
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    row={0}
                    rowSpan={3}
                    dataFormat={printOptionFormatter}
                  >
                    Print LEABELS
                  </TableHeaderColumn>
                </BootstrapTable>

                {formState.doc_type.value > 5 && (
                  <div>
                    <div className="row">
                      <div className="col-md-3">
                        <TextInput
                          id="input_request_no"
                          field="emp_code"
                          value={""}
                          onChange={hasFormValueChanged}
                          required={false}
                          maxLength={100}
                          label="Emp Code"
                          placeholder="Emp Code"
                          customError={""}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3">
                        <TextInput
                          id="input_request_no"
                          field="ref_no"
                          value={""}
                          onChange={hasFormValueChanged}
                          required={false}
                          maxLength={100}
                          label="Reference No"
                          placeholder="Reference No"
                          customError={""}
                        />
                      </div>
                      <div className="col-md-3">
                        <TextInput
                          id="input_request_no"
                          field="description"
                          value={""}
                          onChange={hasFormValueChanged}
                          required={false}
                          maxLength={100}
                          label="Description"
                          placeholder="Description"
                          customError={""}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3">
                        <TextInput
                          id="input_request_no"
                          field="title"
                          value={""}
                          onChange={hasFormValueChanged}
                          required={false}
                          maxLength={100}
                          label="title "
                          placeholder="title "
                          customError={""}
                        />
                      </div>
                      <div className="col-md-3">
                        <TextInput
                          id="input_request_no"
                          field="category"
                          value={""}
                          onChange={hasFormValueChanged}
                          required={false}
                          maxLength={100}
                          label="category"
                          placeholder="category"
                          customError={""}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {generateNumNo && (
                <button
                  onClick={(e) => issueGenaralIssuanceAll(e)}
                  className={`btn btn-success left-margin font-14 ${getDisabledClass()}`}
                >
                  APPROVE1
                </button>
              )}
              <button
                className="btn btn-danger font-14 left-margin font-14"
                onClick={() => cancelForm()}
              >
                CLOSE
              </button>
            </form>
          </div>
        </div>

        <Popup className="popup-modal" open={printYesDoc}>
          <div>
            <form className="user">
              <div className="form-group font-14">
                <TextInput
                  id="input_doc_num"
                  field="document_number"
                  value={selectedDocForPrint.document_no}
                  onChange={() => {}}
                  required={true}
                  maxLength={100}
                  label="Document Number"
                  customError={""}
                  placeholder="Email"
                />
              </div>
              <div className="form-group font-14">
                <NumberInput
                  id="input_password"
                  field="no_of_label"
                  value={selectedDocForPrint.no_of_label}
                  onChange={hasNoOfLabelValueChanged}
                  label="No of Labels"
                  customError={""}
                />
              </div>

              <button
                className={`btn btn-primary btn-user btn-block ${getDisabledClass()}`}
                onClick={(event) => printLabel(event)}
              >
                Approve/Print
              </button>
            </form>
          </div>
        </Popup>

        <Popup className="popup-modal" open={loginPopup}>
          <div>
            <form className="user" onSubmit={validateLogin}>
              <div className="form-group font-14">
                <TextInput
                  id="input_email"
                  field="email"
                  value={loginForm.email}
                  onChange={hasLoginFormValueChanged}
                  required={true}
                  maxLength={100}
                  label=""
                  customError={""}
                  placeholder="Email"
                />
              </div>
              <div className="form-group font-14">
                <TextInput
                  id="input_password"
                  field="password"
                  value={loginForm.password}
                  onChange={hasLoginFormValueChanged}
                  required={true}
                  maxLength={100}
                  type="password"
                  label=""
                  customError={""}
                  placeholder="Password"
                />
              </div>

              <button
                className={`btn btn-primary btn-user btn-block ${getDisabledClass()}`}
                type="submit"
              >
                Authenticate
              </button>
            </form>
          </div>
        </Popup>

        <div id="printme" style={{ display: "none" }}>
          <div id={"printableIdyu"}>{printLabels()}</div>
        </div>
      </div>
    </Fragment>
  );
};

export default DocIssuanceYesForm;
