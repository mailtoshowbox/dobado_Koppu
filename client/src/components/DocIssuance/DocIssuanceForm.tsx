import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import {
  IStateType,
  IDocIssuanceState,
} from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import {
  IDocIssuance,
  DocIssuanceModificationStatus,
} from "../../store/models/docIssuance.interface";

import TextInput from "../../common/components/TextInput";
import NumberInput from "../../common/components/NumberInput";
import CheckboxInput from "../../common/components/Checkbox";
import _uniqueId from "lodash/uniqueId";
import { setModificationState } from "../../store/actions/docissuance.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  addNewDocumentRequest,
  loadApproavalAccessUserInfo,
  issueGenaralIssuance,
} from "../../services/index";
import { OnChangeModel } from "../../common/types/Form.types";
import { updateDocumentRequest } from "../../services/index";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import SelectInput from "../../common/components/Select";
import { IAccount } from "../../store/models/account.interface";
import { uniqueId } from "../../common/utils";
import APP_CONST from "../../common/contant";
import Popup from "reactjs-popup";

const ProductForm: React.FC = () => {
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

  const [generateNumYes, setGenerateNumYes] = useState(false);
  const [generateNumNo, setGenerateNumNo] = useState(true);
  const [printYesDoc, setPrintYesDoc] = useState(false);
  const initialSelectedDocForPrint = {
    document_name: "",
    document_no: "",
    no_of_copy: "",
    no_of_page: "",
    reason_for_request: "",
    no_of_label: 0,
    generate_unique_num: true,
  };
  const [selectedDocForPrint, setSelectedDocForPrint] = useState(
    initialSelectedDocForPrint
  );

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

  function cancelForm(): void {
    console.log();
    dispatch(setModificationState(DocIssuanceModificationStatus.None));
  }
  function handleYes(status: boolean): void {
    setShowYes(status);
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
          /*   setLoginPopup(false);
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
          ); */
        });
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

  function checkUniqueId(fieldValue: any = [], currentId: any = "") {
    const isExists = fieldValue.some((it: any) => it.document_no === currentId);

    return { isExists, currentId };
  }

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

    let processedDocForApproval: any = [];
    const apprvedDoc = requestedDoc.map((doc: any) => {
      if (doc.document_no === selectedDocForPrint.document_no) {
        if (selectedDocForPrint.no_of_label > 1) {
          for (var i = 0; i < selectedDocForPrint.no_of_label; i++) {
            console.log("doc----", doc);
            const processedApproval = Object.assign(
              { ...doc },
              {
                is_doc_approved: true,
                document_no: selectedDocForPrint.generate_unique_num
                  ? _uniqueId(doc.document_no)
                  : doc.document_no,
                request_no: formState.request_no.value,
              }
            );
            processedDocForApproval.push(processedApproval);
          }
        }
        console.log("ISSUED", processedDocForApproval);
        doc.doc_issuance = processedDocForApproval;
        doc.is_doc_approved = true;
      } else {
        doc.is_doc_approved = doc.is_doc_approved ? doc.is_doc_approved : false;
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
    console.log("approvalInfo----", approvalInfo);

    issueGenaralIssuance(approvalInfo, account).then((status) => {
      setPrintYesDoc(false);
      setSelectedDocForPrint(initialSelectedDocForPrint);
      setShowYes(false);
      dispatch(
        addNotification("Document issued", `Part of document request issued`)
      );
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

  function rowClassNameFormate(row: any, rowIdx: any) {
    if (row.is_doc_approved !== undefined && row.is_doc_approved) {
      return "class-doc-approved-already";
    } else {
      return "class-doc-not-approved-already";
    }
  }

  function hasGenarateNumberPrint(model: any, docNum: string): void {
    const selectedDocu: any = formState.requested_doc.value.filter(
      (doc: any) => {
        return doc.document_no === docNum;
      }
    )[0];
    setSelectedDocForPrint(selectedDocu);
    setPrintYesDoc(true);
  }
  const printOptionFormatter = (cell: any, row: any) => {
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

  const issueGenaralIssuanceAll = (event: any) => {
    event.preventDefault();

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
  function rowClassNameFormat(row: any, rowIdx: any) {
    if (row.is_doc_approved !== undefined && row.is_doc_approved) {
      return "class-doc-approved-already doc-issuance-page";
    } else {
      return "class-doc-not-approved-already doc-issuance-page";
    }
  }
  return (
    <Fragment>
      <div className="col-xl-12 col-lg-12">
        <div className="card shadow mb-4">
          <div className="card-body">
            <form onSubmit={saveDocumentRequest}>
              <div className="form-group font-14">
                <div className="row">
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
                </div>
                <div className="row">
                  <div className="col-md-2">
                    <label style={{ margin: "26px 21px 19px 5px" }}>
                      Approved By
                    </label>
                  </div>
                  <div className="col-md-4">
                    <div className="row">
                      <div className="col-md-12">
                        <p>
                          <label>A1 : {approval1?.empl_id}</label>
                        </p>
                        <p>
                          <label>A2 : {approval2?.empl_id}</label>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <label style={{ margin: "26px 21px 19px 5px" }}>
                      Category
                    </label>
                  </div>
                  {pickOne.length > 0 && (
                    <div className="col-md-4">
                      <SelectInput
                        id="input_document_type"
                        field="doc_type"
                        label=""
                        options={dcat1}
                        required={true}
                        onChange={hasFormValueChanged}
                        value={formState.doc_type.value.toString()}
                        type="select"
                        customError={""}
                        disabled={true}
                      />
                    </div>
                  )}
                  {pickTwo.length > 0 && (
                    <div className="col-md-3">
                      <SelectInput
                        id="input_document_type"
                        field="doc_type"
                        label={"Category"}
                        options={dcat2}
                        required={true}
                        onChange={hasFormValueChanged}
                        value={formState.doc_type.value.toString()}
                        type="select"
                        customError={""}
                        disabled={true}
                      />
                    </div>
                  )}
                  {pickThreee.length > 0 && (
                    <div className="col-md-3">
                      <SelectInput
                        id="input_document_type"
                        field="doc_type"
                        label={"Category"}
                        options={dcat3}
                        required={true}
                        onChange={hasFormValueChanged}
                        value={formState.doc_type.value.toString()}
                        type="select"
                        customError={""}
                        disabled={true}
                      />
                    </div>
                  )}
                </div>
                <br></br>
                {formState.doc_type.value < 6 && (
                  <div>
                    <BootstrapTable
                      options={options}
                      data={formState.requested_doc.value}
                      pagination={true}
                      hover={true}
                      insertRow={false}
                      keyField="document_no"
                      trClassName={rowClassNameFormat}
                    >
                      <TableHeaderColumn
                        dataField="document_no"
                        width="8%"
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
                        width="6%"
                        editable={{ validator: numberValidator }}
                      >
                        No of Copy
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="no_of_page"
                        className="thead-light-1"
                        width="6%"
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
              </div>
              <button
                className="btn btn-danger font-14 left-margin font-14x`"
                onClick={() => cancelForm()}
              >
                CLOSE
              </button>
              <button
                onClick={() => handleYes(true)}
                className={`btn btn-success left-margin font-14 ${getDisabledClass()}`}
              >
                YES
              </button>
              <button
                className="btn btn-warning font-14 left-margin font-14"
                onClick={() => cancelForm()}
              >
                NO
              </button>
            </form>
          </div>
        </div>

        <Popup
          className="popup-modal default-modal-size-digidesk"
          open={showYes}
        >
          <div>
            {/*  <DocIssuanceYesForm /> */}
            <Fragment>
              <div className="col-xl-12 col-lg-12">
                <div className="card shadow mb-4">
                  <div className="card-body">
                    <form onSubmit={saveDocumentRequest}>
                      <div className="form-group font-14">
                        <br></br>

                        <BootstrapTable
                          data={formState.requested_doc.value}
                          trClassName={rowClassNameFormate}
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
                            Doc No
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
                            Main Dept
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
                            Requested By
                          </TableHeaderColumn>

                          <TableHeaderColumn
                            row={1}
                            csvHeader="order"
                            dataField="order"
                            dataSort
                            className="label-field-column-black"
                          >
                            Category
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
                            className="label-field-column-black"
                            filter={{ type: "TextFilter", delay: 1000 }}
                          >
                            Reference Number Generation
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            row={1}
                            colSpan={2}
                            csvHeader="order"
                            dataField="order"
                            dataSort
                            className="label-field-column-black"
                          >
                            <label className="col-md-6 table-check">
                              <input
                                type="checkbox"
                                name="active"
                                value="yes"
                                checked={generateNumYes}
                                onChange={(eve) =>
                                  hasGenarateNumberChanged(eve)
                                }
                              />
                              Yes
                            </label>
                            <label className="col-md-6 table-check">
                              <input
                                type="checkbox"
                                name="qtype"
                                value="no"
                                checked={generateNumNo}
                                onChange={(eve) =>
                                  hasGenarateNumberChanged(eve)
                                }
                              />
                              No
                            </label>
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
                            row={2}
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
                          label="Document Numbers"
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
                        <CheckboxInput
                          id="input_email"
                          field={"generate_unique_num"}
                          onChange={hasNoOfLabelValueChanged}
                          label={"Unique number"}
                          value={
                            selectedDocForPrint.generate_unique_num
                              ? true
                              : false
                          }
                          name={"generate_unique_num"}
                          customError={""}
                          disabled={false}
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

export default ProductForm;
