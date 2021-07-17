import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import {
  IStateType,
  IDocRequestState,
} from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import {
  IDocRequest,
  DocRequestModificationStatus,
  IDocRequestList,
} from "../../store/models/docrequest.interface";
import TextInput from "../../common/components/TextInput";
import {
  editDocRequest,
  clearSelectedDocRequest,
  setModificationState,
  addDocRequest,
  loadListOfDocRequest,
} from "../../store/actions/docrequest.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  addNewDocumentRequest,
  updateDocCat,
  getDocCategoryList,
  loadApproavalAccessUserInfo,
} from "../../services/index";
import {
  OnChangeModel,
  IDocRequestFormState,
} from "../../common/types/Form.types";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import SelectInput from "../../common/components/Select";
import { IAccount } from "../../store/models/account.interface";
import { uniqueId, diableFIeldForEdit } from "../../common/utils";
import APP_CONST from "../../common/contant";
import Popup from "reactjs-popup";

const ProductForm: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);

  const dispatch: Dispatch<any> = useDispatch();
  const docrequests: IDocRequestState | null = useSelector(
    (state: IStateType) => state.docRequests
  );
  let docrequest: IDocRequest | null = docrequests.selectedDocRequest;
  const isCreate: boolean =
    docrequests.modificationState === DocRequestModificationStatus.Create;
  const [loginPopup, setLoginPopup] = useState(false);
  const [requestAuthenticated, setRequestAuthenticated] = useState(false);
  if (!docrequest || isCreate) {
    docrequest = {
      _id: "",
      name: "",
      description: "",
      empl_id: account.emp_id ? account.emp_id : "XXXX",
      request_no: uniqueId(APP_CONST.REQUEST_DOCUMENT_PREFIX),
      doc_type: 1,
      requested_doc: [],
      approval: [],
      emp_code_approval_1: "",
      emp_code_approval_2: "",
      comments: "",
      issuance: [],
    };
  }

  const dcat1 = APP_CONST.DOC_REQUEST_DOC_TYPE.CATEGORY_ONE;
  const dcat2 = APP_CONST.DOC_REQUEST_DOC_TYPE.CATEGORY_TWO;
  const dcat3 = APP_CONST.DOC_REQUEST_DOC_TYPE.CATEGORY_THREE;

  //const [recentSelectedCategory, setRecentSelectedCategory] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("1");
  const intialFormState = {
    _id: { error: "", value: docrequest._id },
    name: { error: "", value: docrequest.name },
    description: { error: "", value: docrequest.description },
    empl_id: { error: "", value: docrequest.empl_id },
    doc_type: { error: "", value: docrequest.doc_type },
    request_no: { error: "", value: docrequest.request_no },
    requested_doc: { value: docrequest.requested_doc },
    emp_code_approval_1: { value: docrequest.emp_code_approval_1 },
    emp_code_approval_2: { value: docrequest.emp_code_approval_2 },
    approval: { value: docrequest.approval },
    comments: { value: docrequest.comments },
  };
  const [formState, setFormState] = useState(intialFormState);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  function hasFormValueChanged(model: OnChangeModel): void {
    //console.log("requestDoc----", model);
    if (model.field === "document_type") {
      setSelectedCategory(model.value.toString());
    }
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

    //console.log("approvalPos---", approvalPos);
  }

  function cancelForm(): void {
    dispatch(setModificationState(DocRequestModificationStatus.None));
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
    setLoginPopup(true);
    e.preventDefault();
    if (!isFormInvalid()) {
      return;
    }
  }

  function saveRequest(formState: any, saveFn: Function, mode: String): void {
    //console.log("DOC REQUEST---", formState, mode);
    if (docrequest) {
      if (mode === "ADD") {
        let boxInfo = {
          name: formState.name.value,
          empl_id: formState.empl_id.value,
          doc_type: formState.doc_type.value,
          request_no: formState.request_no.value,
          requested_doc: formState.requested_doc.value,
          approval: formState.approval.value,
          rejectDocumentRequest: {
            is_rejected: false,
            rejected_by: "",
            rejected_on: "",
            rejected_reason: "",
            rejected_from_page: "",
          },
          comments: formState.comments.value,
        };
        addNewDocumentRequest(boxInfo, account).then((status) => {
          setLoginPopup(false);
          setFormState(intialFormState);
          cancelForm();
          dispatch(
            saveFn({
              ...docrequest,
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
  function requiredField(fieldValue: any) {
    if (!fieldValue) {
      return "field is mandatory";
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
    } else {
      data = {
        access: accessLevel,
        emp_id: formState.emp_code_approval_2.value.toString(),
      };
    }

    loadApproavalAccessUserInfo(data, account).then((status) => {
      if (status.data) {
        const { email = "" } = status.data.data;
        const approvedUsers = formState.approval
          ? formState.approval.value
          : [];
        const accessLevelPos = accessLevel === "manager" ? 0 : 1;
        if (email) {
          approvedUsers[accessLevelPos] = {
            empl_id: formState.emp_code_approval_1.value.toString(),
            empl_email_id: email,
            status: "pending",
            approve_access_level: accessLevel, //Manager/Quality user
          };
        }

        setFormState({
          ...formState,
          ["approval"]: { value: approvedUsers },
        });
        /// dispatch(loadedApprovedUser(status.data));
      }
    });
  }

  //console.log("formState----", formState);

  const approval1 = formState.approval.value[0]
    ? formState.approval.value[0]
    : null;
  const approval2 = formState.approval.value[1]
    ? formState.approval.value[1]
    : null;

  function validateLogin(e: FormEvent<HTMLFormElement>): void {
    //console.log("f");
    e.preventDefault();

    //console.log("2");

    //   setRequestAuthenticated(true);

    let saveUserFn: Function = isCreate ? addDocRequest : editDocRequest;
    //console.log("3");

    let modeOfAction: String = isCreate ? "ADD" : "EDIT";
    //console.log("4");

    saveRequest(formState, saveUserFn, modeOfAction);
    //console.log("5");

    /* loginUser({
      email: formState.email.value,
      password: formState.password.value,
    })
      .then((status) => {
        const { titleMesage = "", bodyMessage = "" } = parseApiResult(status);
        const { success = false } = status;
        if (success) {
          dispatch(addNotification(titleMesage, bodyMessage));

          dispatch(login(status.data));
        } else {
          dispatch(
            addNotification(
              titleMesage,
              bodyMessage ? bodyMessage : "Unable to login"
            )
          );
        }
      })
      .catch((err) => {
        //console.log(err);
      }); */

    // dispatch(login(formState.email.value));
  }

  function setFieldDisabled(cell: any, row: any) {
    return diableFIeldForEdit();
  }

  function uniqueFieldinModal(
    column: any,
    attr: any,
    editorClass: any,
    ignoreEditable: any
  ) {
    const {
      editable: { defaultValue = "" },
    } = column;
    console.log("column===", column);
    console.log("attr===", attr);
    console.log("editorClass===", editorClass);
    console.log("ignoreEditable===", ignoreEditable);
    return (
      /*  <input
        type="text"
        className=" form-control editor edit-text"
        value={defaultValue}
        readonly
      /> */
      <TextInput
        id="document_no"
        value={defaultValue}
        field="document_no"
        onChange={hasFormValueChanged}
        required={true}
        maxLength={100}
        label=""
        placeholder="Employee Id"
        customError={formState.name.error}
        disabled={true}
      />
    );
  }

  function createCustomModalHeader(onClose: any, onSave: any) {
    return (
      <div
        className="modal-header"
        style={{
          fontWeight: "bold",
          textAlign: "center",
          backgroundColor: "#eeeeee",
        }}
      >
        <h3 className="modal-title">Add New Document</h3>
        {/* <i className="fa fa-close" onClick={onClose}>
        </i> */}
      </div>
    );
  }
  const options = {
    afterInsertRow: saveDocument,
    ignoreEditable: false,
    insertModalHeader: createCustomModalHeader,
  };
  return (
    <Fragment>
      <div className="col-xl-12 col-lg-12">
        <div className="card shadow mb-4">
          <div className="card-body">
            <form onSubmit={saveDocumentRequest}>
              <div className="form-group font-14">
                <div className="row paddingTB15">
                <div className="col-md-2">
                    <label style={{ margin: "26px 21px 19px 5px" }}>
                    Emp Id
                    </label>
                  </div>
                  <div className="col-md-4">
                    <TextInput
                      id="input_email"
                      value={formState.empl_id.value}
                      field="empl_id"
                      onChange={hasFormValueChanged}
                      required={true}
                      maxLength={100}
                      label=""
                      placeholder="Employee Id"
                      customError={formState.name.error}
                      disabled={true}
                    />
                  </div>
                <div className="col-md-2">
                    <label style={{ margin: "26px 21px 19px 5px" }}>
                    Request No
                    </label>
                  </div>
                  <div className="col-md-4">
                    <TextInput
                      id="input_request_no"
                      field="request_no"
                      value={formState.request_no.value}
                      onChange={hasFormValueChanged}
                      required={false}
                      maxLength={100}
                      label=""
                      placeholder="Request Number"
                      customError={formState.description.error}
                      disabled={true}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-2">
                    <label style={{ margin: "26px 21px 19px 5px" }}>
                      Doc Type:
                    </label>
                  </div>
                  <div
                    className={
                      pickOne.length > 0
                        ? "col-md-3 input_document_type_selected"
                        : "col-md-3 "
                    }
                  >
                    <SelectInput
                      id="input_document_type"
                      field="doc_type"
                      label={""}
                      options={dcat1}
                      required={true}
                      onChange={hasFormValueChanged}
                      value={formState.doc_type.value.toString()}
                      type="select"
                      customError={""}
                    />
                  </div>
                  <div
                    className={
                      pickTwo.length > 0
                        ? "col-md-3 input_document_type_selected"
                        : "col-md-3 "
                    }
                  >
                    <SelectInput
                      id="input_document_type"
                      field="doc_type"
                      label={""}
                      options={dcat2}
                      required={true}
                      onChange={hasFormValueChanged}
                      value={formState.doc_type.value.toString()}
                      type="select"
                      customError={""}
                    />
                  </div>
                  <div
                    className={
                      pickThreee.length > 0
                        ? "col-md-3 input_document_type_selected"
                        : "col-md-3 "
                    }
                  >
                    <SelectInput
                      id="input_document_type"
                      field="doc_type"
                      label={""}
                      options={dcat3}
                      required={true}
                      onChange={hasFormValueChanged}
                      value={formState.doc_type.value.toString()}
                      type="select"
                      customError={""}
                    />
                  </div>
                </div>
                {formState.doc_type.value < 6 && (
                  <div>
                    <BootstrapTable
                      options={options}
                      data={formState.requested_doc.value}
                      pagination={true}
                      hover={true}
                      insertRow={true}
                      keyField="document_no"
                    >
                      <TableHeaderColumn
                        width="15%"
                        dataField="document_no"
                        editable={{
                          defaultValue: uniqueId("DOC"),
                          validator: requiredField,
                        }}
                      >
                        DC NO
                      </TableHeaderColumn>

                      <TableHeaderColumn
                        dataField="document_name"
                        width="16%"
                        className="thead-light-1"
                        editable={{ validator: requiredField }}
                      >
                        DC Name
                      </TableHeaderColumn>

                      <TableHeaderColumn
                        dataField="no_of_copy"
                        className="thead-light-1"
                        width="16%"
                        editable={{ validator: numberValidator }}
                      >
                        No of Copy
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="no_of_page"
                        className="thead-light-1"
                        width="14%"
                        editable={{ validator: numberValidator }}
                      >
                        No of Pages
                      </TableHeaderColumn>

                      <TableHeaderColumn
                        dataField="reason_for_request"
                        className="thead-light-1"
                        width="20%"
                        editable={{
                          type: "textarea",
                        }}
                      >
                        Reason for Request
                      </TableHeaderColumn>
                    </BootstrapTable>
                  </div>
                )}
                {formState.doc_type.value > 5 && (
                  <div className="dynamic-request-form">
                    <div className="row">
                      <div className="col-md-4">
                        <TextInput
                          id="input_request_no"
                          field="emp_code"
                          value={""}
                          onChange={hasFormValueChanged}
                          required={false}
                          maxLength={100}
                          label=""
                          placeholder="Emp Code"
                          customError={""}
                        />
                      </div>
                      <div className="col-md-4">
                        <TextInput
                          id="input_request_no"
                          field="ref_no"
                          value={""}
                          onChange={hasFormValueChanged}
                          required={false}
                          maxLength={100}
                          label=""
                          placeholder="Reference No"
                          customError={""}
                        />
                      </div>
                      <div className="col-md-4">
                        <TextInput
                          id="input_request_no"
                          field="description"
                          value={""}
                          onChange={hasFormValueChanged}
                          required={false}
                          maxLength={100}
                          label=""
                          placeholder="Description"
                          customError={""}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <TextInput
                          id="input_request_no"
                          field="title"
                          value={""}
                          onChange={hasFormValueChanged}
                          required={false}
                          maxLength={100}
                          label=" "
                          placeholder="title "
                          customError={""}
                        />
                      </div>
                      <div className="col-md-4">
                        <TextInput
                          id="input_request_no"
                          field="category"
                          value={""}
                          onChange={hasFormValueChanged}
                          required={false}
                          maxLength={100}
                          label=""
                          placeholder="category"
                          customError={""}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-md-2">
                    <label style={{ margin: "26px 21px 19px 5px" }}>
                      Approval 1
                    </label>
                  </div>
                  <div className="col-md-3">
                    <TextInput
                      id="input_request_no"
                      field="emp_code_approval_1"
                      value={formState.emp_code_approval_1.value.toString()}
                      onChange={hasFormValueChanged}
                      required={false}
                      maxLength={100}
                      label=""
                      placeholder="Emp Code"
                      customError={""}
                    />
                  </div>
                  <div className="col-md-3" style={{ textAlign: "center" ,  marginTop: "2%"}}>
                    <div
                      className="btn"
                      onClick={() => loadApproavalAccessUserMail("manager")}
                    >
                      {" "}
                      <i className="fas fa-angle-double-right"></i>{" "}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <TextInput
                      id="input_request_no"
                      field="mail_id_0"
                      value={approval1 ? approval1.empl_email_id : ""}
                      onChange={hasFormValueChanged}
                      required={false}
                      maxLength={100}
                      label=""
                      placeholder="Mail Id"
                      customError={""}
                      disabled={true}
                    />
                  </div>
                </div>
                {formState.doc_type.value > 3 && (
                  <div className="row">
                    <div className="col-md-2">
                      <label style={{ margin: "26px 21px 19px 5px" }}>
                        Quality Approval
                      </label>
                    </div>
                    <div className="col-md-3">
                      <TextInput
                        id="input_request_no"
                        field="emp_code_approval_2"
                        value={formState.emp_code_approval_2.value.toString()}
                        onChange={hasFormValueChanged}
                        required={false}
                        maxLength={100}
                        label=""
                        placeholder="Emp Code"
                        customError={""}
                      />
                    </div>
                    <div className="col-md-3" style={{ textAlign: "center" , marginTop: "2%"}}>
                      <div
                        className="btn"
                        onClick={() =>
                          loadApproavalAccessUserMail("qualityuser")
                        }
                      >
                        {" "}
                        <i className="fas fa-angle-double-right"></i>{" "}
                      </div>
                    </div>
                    <div className="col-md-3">
                      <TextInput
                        id="input_request_no"
                        field="mail_id_1"
                        value={approval2 ? approval2.empl_email_id : ""}
                        onChange={hasFormValueChanged}
                        required={false}
                        maxLength={100}
                        label=""
                        placeholder="Mail Id"
                        customError={""}
                        disabled={true}
                      />
                    </div>
                  </div>
                )}
                <div className="row">
                <div className="col-md-2">
                    <label style={{ margin: "26px 21px 19px 5px" }}>
                    Comments
                    </label>
                  </div>
                  <div className="col-md-9">
                    <TextInput
                      id="input_request_no"
                      field="comments"
                      value={formState.comments.value.toString()}
                      onChange={hasFormValueChanged}
                      required={false}
                      maxLength={100}
                      label=""
                      placeholder="Comments"
                      customError={""}
                    />
                  </div>
                </div>
              </div>

              <button
                className="btn btn-danger font-14"
                onClick={() => cancelForm()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-success left-margin font-14 ${getDisabledClass()}`}
              >
                REQUEST
              </button>
            </form>
          </div>
        </div>

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

export default ProductForm;
