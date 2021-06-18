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
import { setModificationState } from "../../store/actions/docissuance.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  addNewDocumentRequest,
  updateDocCat,
  getDocCategoryList,
  loadApproavalAccessUserInfo,
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
  const dcat1 = [
    { id: "1", name: "Executed Copy" },
    { id: "2", name: "Controlled Copy" },
    { id: "3", name: "Add Docs" },
  ];
  const dcat2 = [
    { id: "4", name: "UC Copy" },
    { id: "5", name: "Add Docs" },
  ];
  const dcat3 = [{ id: "6", name: "Take Out" }];

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

  function hasApprovalValueChanged(model: OnChangeModel): void {
    const { field = "" } = model;
    const approvalPos = field.split("_");
    let approvalPosition = formState.approval.value || [];
    let slectedData: any = [];
    if (approvalPos[2]) {
      if (approvalPos[1] === "code") {
      } else if (approvalPos[1] === "mail") {
      }
    }
    slectedData[approvalPos[2]] = { emp_id: 1 };
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

  const pickOne = dcat1.filter(
    (cat1) => cat1.id.toString() === formState.doc_type.value.toString()
  );
  const pickTwo = dcat2.filter(
    (cat1) => cat1.id === formState.doc_type.value.toString()
  );
  const pickThreee = dcat3.filter(
    (cat1) => cat1.id === formState.doc_type.value.toString()
  );

  function saveDocument(row: any) {
    let requested_doc = formState.requested_doc.value || [];
    requested_doc.push(row);

    setFormState({
      ...formState,
      ["requested_doc"]: { value: requested_doc },
    });
  }

  function saveDocumentRequest(e: FormEvent<HTMLFormElement>): void {
    //setLoginPopup(true);
    e.preventDefault();
    if (!isFormInvalid()) {
      return;
    }

    // saveForm(formState, updateDocRequestApproval, "EDIT");
  }

  function saveUser(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (!isFormInvalid()) {
      return;
    }
  }

  function saveForm(formState: any, saveFn: Function, mode: String): void {
    if (docIssuance) {
      const currentApproval = formState.approval.value.filter(
        (approval: any) => approval.empl_id === account.emp_id
      );
      if (currentApproval.length > 0) {
        if (formState.approval.value.length) {
          formState.approval.value.map((apprv: any) => {
            if (apprv.empl_id === account.emp_id) {
              apprv.status = "approved";
            }
          });
        }
      }

      if (mode === "EDIT") {
        let boxInfo = {
          name: formState.name.value,
          empl_id: formState.empl_id.value,
          doc_type: formState.doc_type.value,
          request_no: formState.request_no.value,
          requested_doc: formState.requested_doc.value,
          approval: formState.approval.value,
          id: formState._id.value,
        };
        updateDocumentRequest(boxInfo, account).then((status) => {
          cancelForm();
          dispatch(
            addNotification(
              "Document Approved",
              `Document Request ${formState.request_no.value} Approved by you`
            )
          );
        });
      } else if (mode === "ADD") {
      }
    }
  }

  function saveRequest(formState: any, saveFn: Function, mode: String): void {
    if (docIssuance) {
      if (mode === "ADD") {
        let boxInfo = {
          name: formState.name.value,
          empl_id: formState.empl_id.value,
          doc_type: formState.doc_type.value,
          request_no: formState.request_no.value,
          requested_doc: formState.requested_doc.value,
          approval: formState.approval.value,
        };
        addNewDocumentRequest(boxInfo, account).then((status) => {
          setLoginPopup(false);
          setFormState(intialFormState);
          cancelForm();
          dispatch(
            saveFn({
              ...docIssuance,
              ...status,
            })
          );

          dispatch(
            addNotification(
              "New Document Requested",
              `Document Request ${formState.request_no.value} added by you`
            )
          );
        });
      } else if (mode === "EDIT") {
      }
    }
  }
  function numberValidator(fieldValue: any) {
    const nan = isNaN(parseInt(fieldValue, 10));
    if (nan) {
      return "must be a integer!";
    }
    return true;
  }
  function loadApproavalAccessUserMail(accessLevel: string) {
    let data = {};
    if (accessLevel === "manager") {
      data = {
        access: accessLevel,
        emp_id: formState.emp_code_approval_1.value.toString(),
      };
    }

    loadApproavalAccessUserInfo(data, account).then((status) => {
      if (status.data) {
        console.log("formState----", formState);
        const { email = "" } = status.data.data;
        const approvedUsers = [];
        if (email) {
          approvedUsers.push({
            empl_id: formState.emp_code_approval_1.value.toString(),
            empl_email_id: email,
            status: "pending",
            approve_access_level: accessLevel, //Manager/Quality user
          });
        }

        setFormState({
          ...formState,
          ["approval"]: { value: approvedUsers },
        });
        /// dispatch(loadedApprovedUser(status.data));
      }
    });
  }

  const options = { afterInsertRow: saveDocument, ignoreEditable: false };

  //console.log("formState----", formState);

  const approval1 = formState.approval.value[0]
    ? formState.approval.value[0]
    : null;
  const approval2 = formState.approval.value[1]
    ? formState.approval.value[1]
    : null;

  function validateLogin(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    const { value = [] } = formState.approval;

    const currentApproval = value.filter;
  }

  return (
    <Fragment>
      <div className="col-xl-12 col-lg-12">
        <div className="card shadow mb-4">
          <div className="card-body">
            <form onSubmit={saveDocumentRequest}>
              <div className="form-group font-14">
                <br></br>

                <BootstrapTable data={formState.requested_doc.value}>
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
                    YES NO
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row={2}
                    csvHeader="order"
                    dataField="no_of_page"
                    dataSort
                  >
                    no of Pages
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    row={2}
                    csvHeader="order"
                    dataField="reason_for_request"
                    dataSort
                  >
                    Reason for Request
                  </TableHeaderColumn>

                  <TableHeaderColumn row={0} rowSpan={3} dataField="status">
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

              <button
                onClick={() => handleYes()}
                className={`btn btn-success left-margin font-14 ${getDisabledClass()}`}
              >
                APPROVE
              </button>
              <button
                className="btn btn-danger font-14 left-margin font-14"
                onClick={() => cancelForm()}
              >
                CLOSE
              </button>
            </form>
          </div>
        </div>

        <Popup className="popup-modal" open={showYes}>
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
      </div>
    </Fragment>
  );
};

export default DocIssuanceYesForm;
