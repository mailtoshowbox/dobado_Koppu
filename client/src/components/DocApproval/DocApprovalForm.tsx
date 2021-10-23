import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import {
  IStateType,
  IDocApprovalState,
} from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";

import {
  IDocApproval,
  DocApprovalModificationStatus,IDocApprovalList
} from "../../store/models/docapproval.interface";
import TextInput from "../../common/components/TextInput";
import NumberInput from "../../common/components/NumberInput";
import TextAreaInput from "../../common/components/TextAreaInput";

import {
  setModificationState,
  updateDocRequestApproval,loadListOfDocApproval
} from "../../store/actions/docapproval.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  addNewDocumentRequest,
  loadApproavalAccessUserInfo,getDocRequestApprovalList
} from "../../services/index";
import { OnChangeModel } from "../../common/types/Form.types";
import { approveDocumentRequest } from "../../services/index";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import SelectInput from "../../common/components/Select";
import { IAccount } from "../../store/models/account.interface";
import { uniqueId, getDocRequestStatus } from "../../common/utils";
import APP_CONST from "../../common/contant";
import Popup from "reactjs-popup";

export type productFormProps = {
  onUpdateDocument?: (product: IDocApproval) => void;
};
//const ProductForm: React.FC = () => {
function ProductForm(props: productFormProps): JSX.Element {
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

 
  const [, setSelectedCategory] = useState("1");
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
  const [openDocumentEditorModal, updateDocumentEditorModal] = useState(false);

  const [documentforEdit, updateDocumentforEdit] = useState({
    reason_for_request: "",
    edited: false,
    empl_id: "",
    doc_type: "",
    request_no: "",
    is_doc_approved: false,
    document_name: "",
    document_no: "",
    no_of_page: 0,
    no_of_copy: 0,
    OriginalDocNum : ""
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
    setRejectDocumentRequestForm({
      ...rejectDocumentRequestForm,
      ["rejected_reason"]: model.value.toString(),
    });
  }

  function cancelForm(): void {
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
            getDocRequestApprovalList(account.auth, account.emp_id).then(
              (items: IDocApprovalList) => {
                dispatch(loadListOfDocApproval(items));
                dispatch(
                  addNotification(
                    "Document Approved",
                    `Document Request ${formState.request_no.value} Approved by you`
                  )
                );
              }
            );
          });
        }
      } else if (mode === "ADD") {
      }
    }

   
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
  const options = { afterInsertRow: saveDocument, ignoreEditable: false };
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
    setOpenRejectReasonModal(true);
  }
  const currentDocRequestStatus = getDocRequestStatus({
    approval: formState.approval.value,
  });
  function onClickDocumentEdit(cell: any, row: any, rowIndex: any) {
    updateDocumentEditorModal(true);

    updateDocumentforEdit({ ...documentforEdit, ...row , OriginalDocNum : row.document_no});
  }
  function buttonFormatter(cell: any, row: any, rowIndex: any) {
    return (
      <>
        <button
          type="button"
          className="btn btn-border"
          onClick={() => onClickDocumentEdit(cell, row, rowIndex)}
        >
          <i className="fas fa fa-pen"></i>
        </button>
      </>
    );
  }
  function hasEditDocument(model: OnChangeModel): void {


  
      updateDocumentforEdit({
        ...documentforEdit,
        [model.field]: model.value,
        ["edited"]: true,
      });
  
    
  }
  function closeDocUpdate(): void {
    updateDocumentEditorModal(false);
  }
  function updateDocument(): void {
    let docList = docrequest?.requested_doc ? docrequest?.requested_doc : [];
    let newDocList: any = [];

    docList.map((cat1) => {
      if (  documentforEdit.OriginalDocNum  !== "" &&
        cat1.document_no.toString() === documentforEdit.OriginalDocNum.toString()
      ) { 
        newDocList.push({...documentforEdit, ...{document_no:documentforEdit.document_no} });   
      } else {newDocList.push(cat1); 
      }
    });

  


    setFormState({
      ...formState,
      ["requested_doc"]: { value: newDocList },
    });
    updateDocumentEditorModal(false);
  }

  function checkUpdatedRow(row: any) {
    const { edited = false } = row;
    return edited ? "updated_row" : "";
  }



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
                      label={pickOne.length > 0 ? "" : ""}
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
                      label={pickTwo.length > 0 ? "" : ""}
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
                      label={pickThreee.length > 0 ? "" : ""}
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
                      trClassName={checkUpdatedRow}
                    >
                      <TableHeaderColumn
                        dataField="document_no"
                        width="15%"
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
                        width="20%"
                        editable={{
                          type: "textarea",
                        }}
                      >
                        Reason for Request
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="button"
                        className="thead-light-1"
                        width="10%"
                        dataFormat={buttonFormatter}
                        hiddenOnInsert={true}
                      >
                        Action
                      </TableHeaderColumn>
                    </BootstrapTable>
                  </div>
                )}
                {formState.doc_type.value > 5 && (
                  <div className="dynamic-request-form">
                       <div>
                       <BootstrapTable
                      options={options}
                      data={formState.requested_doc.value}
                      pagination={true}
                      hover={true}
                     
                      keyField="document_no"
                      trClassName={checkUpdatedRow}
                    >
                      <TableHeaderColumn
                        dataField="document_no"
                        width="15%"
                        
                        
                      >
                        DC NO
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="name"
                        width="16%"
                        className="thead-light-1"
                      >
                        DC Name
                      </TableHeaderColumn> 
                      <TableHeaderColumn
                        dataField="no_of_page"
                        className="thead-light-1"
                        width="14%"
                      >
                        No of Pages
                      </TableHeaderColumn>
                      
                    </BootstrapTable>
                      </div>
                  </div>
                )}

                <div className="row">
                  <div className="col-md-2">
                    <label style={{ margin: "26px 0 0 5px" }}>Comments</label>
                  </div>
                  <div className="col-md-9">
                    <TextInput
                      id="input_request_no"
                      field="comments"
                      value={formState.comments.value}
                      onChange={hasFormValueChanged}
                      required={false}
                      maxLength={100}
                      label=""
                      placeholder="Comments"
                      customError={""}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-8">
                    {/* <label>
                      <span className="blink_me" style={{}}>
                        Waiting for Your Approval
                      </span>
                    </label> */}
                  </div>
                </div>
              </div>
              {currentDocRequestStatus !== 3 && ( //pending//success
                <div>
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
                    className="btn left-margin btn-warning font-14"
                    onClick={(eve) => rejectDocRequest(eve)}
                  >
                    Reject
                  </button>
                </div>
              )}
              {currentDocRequestStatus === 3 && ( //Rejected
                <div>
                  <button
                    className="btn btn-danger font-14"
                    onClick={() => cancelForm()}
                  >
                    Close
                  </button>
                </div>
              )}
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

        <Popup
          className="popup-modal"
          open={openDocumentEditorModal}
          onClose={() => closeDocUpdate()}
        >
          <div>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    <b> Edit Document {documentforEdit.document_name}</b>
                  </h5>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <div className="row">
                      <div
                        className="mb-3 col-md-8"
                        style={{ textAlign: "left" }}
                      >
                        <TextInput
                          id="input_request_no"
                          field="document_no"
                          value={documentforEdit.document_no}
                          onChange={hasEditDocument}
                          required={false}
                          maxLength={10}
                          label="Document Number"
                          placeholder="Document Number"
                          customError={""}
                          disabled={false}
                        />{" "}
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="mb-3 col-md-8"
                        style={{ textAlign: "left" }}
                      >
                        <TextInput
                          id="input_request_no"
                          field="document_name"
                          value={documentforEdit.document_name}
                          onChange={hasEditDocument}
                          required={false}
                          maxLength={6}
                          label="Document Name"
                          placeholder="Document Name"
                          customError={""}
                        />{" "}
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="mb-3 col-md-8"
                        style={{ textAlign: "left" }}
                      >
                        <NumberInput
                          id="input_request_no"
                          field="no_of_copy"
                          value={documentforEdit.no_of_copy}
                          onChange={hasEditDocument}
                          label="No of Copy"
                          customError={""}
                        />{" "}
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="mb-3 col-md-8"
                        style={{ textAlign: "left" }}
                      >
                        <NumberInput
                          id="input_request_no"
                          field="no_of_page"
                          value={documentforEdit.no_of_page}
                          onChange={hasEditDocument}
                          label="No of page"
                          customError={""}
                        />{" "}
                      </div>
                    </div>

                    <div className="row">
                      <div
                        className="mb-3 col-md-8"
                        style={{ textAlign: "left" }}
                      >
                        <div>
                          <TextAreaInput
                            id="input_request_no"
                            field="reason_for_request"
                            value={documentforEdit.reason_for_request}
                            onChange={hasEditDocument}
                            required={false}
                            maxLength={100}
                            label="Reason for Request"
                            placeholder="Reason for Request"
                            customError={""}
                          />{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => closeDocUpdate()}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => updateDocument()}
                  >
                    Update Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Popup>
      </div>
    </Fragment>
  );
}

export default ProductForm;
