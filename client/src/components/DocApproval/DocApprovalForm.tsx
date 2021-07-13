import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import {
  IStateType,
  IDocApprovalState,
} from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import {
  IDocRequest,
  DocRequestModificationStatus,
  IDocRequestList,
} from "../../store/models/docrequest.interface";
import {
  IDocApproval,
  DocApprovalModificationStatus,
  IDocApprovalList,
} from "../../store/models/docapproval.interface";
import TextInput from "../../common/components/TextInput";
import {
  setModificationState,
  updateDocRequestApproval,
} from "../../store/actions/docapproval.action";
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
import { approveDocumentRequest } from "../../services/index";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import SelectInput from "../../common/components/Select";
import { IAccount } from "../../store/models/account.interface";
import { uniqueId } from "../../common/utils";
import APP_CONST from "../../common/contant";
import Popup from "reactjs-popup";

const ProductForm: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);

  const dispatch: Dispatch<any> = useDispatch();
  const docrequests: IDocApprovalState | null = useSelector(
    (state: IStateType) => state.docApprovals
  );
  let docrequest: IDocApproval | null = docrequests.selectedDocApproval;
  const isCreate: boolean =
    docrequests.modificationState === DocApprovalModificationStatus.Create;
  const [loginPopup, setLoginPopup] = useState(false);
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
      emp_code_approval_1: "222",
      emp_code_approval_2: "12",
      page_from: "approval",
      rejectDocumentRequest: {
        is_rejected: false,
        rejected_by: "",
        rejected_on: new Date(),
        rejected_reason: "",
        rejected_from_page: "",
      },
      comments: "",
    };
  }

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

  //const [recentSelectedCategory, setRecentSelectedCategory] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [openRejectReasonModal, setOpenRejectReasonModal] = useState(false);
  if (!isCreate) {
    const { approval = [] } = docrequest;
    docrequest.emp_code_approval_1 = approval[0] ? approval[0].empl_id : "XXXX";
    docrequest.emp_code_approval_2 = approval[1] ? approval[1].empl_id : "XXXX";
  }
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
    comments: { error: "", value: docrequest.comments },
    rejectDocumentRequest: {
      error: "",
      value: docrequest.rejectDocumentRequest,
    },
  };
  const [formState, setFormState] = useState(intialFormState);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [rejectDocumentRequestForm, setRejectDocumentRequestForm] = useState({
    is_rejected: false,
    rejected_by: account.emp_id,
    rejected_on: new Date(),
    rejected_reason: "",
    rejected_from_page: "approval",
  });

  function hasFormValueChanged(model: OnChangeModel): void {
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

  function hasRejectReasonValueChanged(model: OnChangeModel): void {
    console.log("-----model---", model);
    setRejectDocumentRequestForm({
      ...rejectDocumentRequestForm,
      ["rejected_reason"]: model.value.toString(),
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
    dispatch(setModificationState(DocApprovalModificationStatus.None));
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

    saveForm(formState, updateDocRequestApproval, "EDIT");
  }

  function rejectDocumentRequest(e: any): void {
    //setLoginPopup(true);
    e.preventDefault();
    if (!isFormInvalid()) {
      return;
    }
    console.log("rejectDocumentRequest---", rejectDocumentRequestForm);

    saveForm(formState, updateDocRequestApproval, "EDIT");
  }

  function saveForm(formState: any, saveFn: Function, mode: String): void {
    if (docrequest) {
      const currentApproval = formState.approval.value.filter(
        (approval: any) => approval.empl_id === account.emp_id
      );
      if (currentApproval.length > 0 && !openRejectReasonModal) {
        if (formState.approval.value.length) {
          formState.approval.value.map((apprv: any) => {
            if (apprv.empl_id === account.emp_id) {
              apprv.status = "approved";
            }
          });
        }
      } else if (currentApproval.length > 0 && openRejectReasonModal) {
        if (formState.approval.value.length) {
          formState.approval.value.map((apprv: any) => {
            if (apprv.empl_id === account.emp_id) {
              apprv.status = "rejected";
            }
          });
        }
      }

      if (mode === "EDIT") {
        let approvalInfo = {
          name: formState.name.value,
          empl_id: formState.empl_id.value,
          doc_type: formState.doc_type.value,
          request_no: formState.request_no.value,
          requested_doc: formState.requested_doc.value,
          approval: formState.approval.value,
          id: formState._id.value,
          comments: formState.comments.value,
        };
        if (openRejectReasonModal) {
          approvalInfo = Object.assign(
            { ...approvalInfo },
            {
              rejectDocumentRequest: {
                ...rejectDocumentRequestForm,
                ...{ is_rejected: true },
              },
            }
          );
          approveDocumentRequest(approvalInfo, account).then((status) => {
            cancelForm();
            dispatch(
              addNotification(
                "Document Rejected",
                `Document Request ${formState.request_no.value} Rejected by you`
              )
            );
          });
        } else {
          approveDocumentRequest(approvalInfo, account).then((status) => {
            cancelForm();
            dispatch(
              addNotification(
                "Document Approved",
                `Document Request ${formState.request_no.value} Approved by you`
              )
            );
          });
        }
      } else if (mode === "ADD") {
      }
    }

    /*  let boxInfoUpt = {
          id: formState._id.value,
          name: formState.name.value,
          description: formState.description.value,
          racks: formState.racks.value,
        };
        updateBox(boxInfoUpt, account).then((status) => {
          dispatch(
            saveFn({
              ...box,
              ...status,
            })
          );
          getBoxList(account.auth).then((items: IBoxList) => {
            dispatch(loadListOfBox(items));
          });
          dispatch(
            addNotification(
              "Box ",
              `New Box ${formState.name.value} edited by you`
            )
          );
          dispatch(clearSelectedBox());
          dispatch(setModificationState(BoxModificationStatus.None));
        }); */
  }

  function saveRequest(formState: any, saveFn: Function, mode: String): void {
    if (docrequest) {
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

    //   setRequestAuthenticated(true);

    //saveRequest(formState, saveUserFn, modeOfAction);

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
  function rejectDocRequest(eve: any): void {
    //openRejectReasonModal
    eve.preventDefault();
    console.log("docrequest--", docrequest);
    console.log("formState--", formState);
    setOpenRejectReasonModal(true);
  }

  return (
    <Fragment>
      <div className="col-xl-12 col-lg-12">
        <div className="card shadow mb-4">
          <div className="card-body">
            <form onSubmit={saveDocumentRequest}>
              <div className="form-group font-14">
                <div className="row">
                  <div className="col-md-4">
                    <TextInput
                      id="input_email"
                      value={formState.empl_id.value}
                      field="empl_id"
                      onChange={hasFormValueChanged}
                      required={true}
                      maxLength={100}
                      label="Emp Id"
                      placeholder="Employee Id"
                      customError={formState.name.error}
                      disabled={true}
                    />
                  </div>
                  <div className="col-md-4">
                    <TextInput
                      id="input_request_no"
                      field="request_no"
                      value={formState.request_no.value}
                      onChange={hasFormValueChanged}
                      required={false}
                      maxLength={100}
                      label="Request No"
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
                  <div className="col-md-3">
                    <SelectInput
                      id="input_document_type"
                      field="doc_type"
                      label={pickOne.length > 0 ? "Selected" : ""}
                      options={dcat1}
                      required={true}
                      onChange={hasFormValueChanged}
                      value={formState.doc_type.value.toString()}
                      type="select"
                      customError={""}
                    />
                  </div>
                  <div className="col-md-3">
                    <SelectInput
                      id="input_document_type"
                      field="doc_type"
                      label={pickTwo.length > 0 ? "Selected" : ""}
                      options={dcat2}
                      required={true}
                      onChange={hasFormValueChanged}
                      value={formState.doc_type.value.toString()}
                      type="select"
                      customError={""}
                    />
                  </div>
                  <div className="col-md-3">
                    <SelectInput
                      id="input_document_type"
                      field="doc_type"
                      label={pickThreee.length > 0 ? "Selected" : ""}
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
                        dataField="document_no"
                        editable={{
                          defaultValue: uniqueId("DOC"),
                        }}
                      >
                        DC NO
                      </TableHeaderColumn>

                      <TableHeaderColumn
                        dataField="document_name"
                        width="16%"
                        className="thead-light-1"
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
                      >
                        No of Pages
                      </TableHeaderColumn>

                      <TableHeaderColumn
                        dataField="reason_for_request"
                        className="thead-light-1"
                        width="10%"
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

                <div className="row">
                  <div className="col-md-3">
                    <TextInput
                      id="input_request_no"
                      field="comments"
                      value={formState.comments.value}
                      onChange={hasFormValueChanged}
                      required={false}
                      maxLength={100}
                      label="Comments"
                      placeholder="Comments"
                      customError={""}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-2">
                    <label>
                      <span className="blink_me" style={{}}>
                        Waiting for Your Approval
                      </span>
                    </label>
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
                APPROVE
              </button>
              <button
                className="btn btn-warning font-14"
                onClick={(eve) => rejectDocRequest(eve)}
              >
                Reject
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

        <Popup
          className="reject-reason-popup-modal"
          open={openRejectReasonModal}
        >
          <div>
            <div className="form-group font-14">
              <TextInput
                id="input_email"
                field="rejected_reason"
                value={rejectDocumentRequestForm.rejected_reason}
                onChange={hasRejectReasonValueChanged}
                required={true}
                maxLength={200}
                label="Reason for Reject"
                customError={""}
                placeholder="Reason"
              />
            </div>
            <button
              onClick={(eve) => rejectDocumentRequest(eve)}
              className={`btn btn-warning left-margin font-14 ${getDisabledClass()}`}
            >
              Reject
            </button>
            <button
              className="btn btn-danger font-14"
              onClick={(eve) => setOpenRejectReasonModal(false)}
            >
              Cancel
            </button>
          </div>
        </Popup>
      </div>
    </Fragment>
  );
};

export default ProductForm;