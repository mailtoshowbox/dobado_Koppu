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
import TextAreaInput from "../../common/components/TextAreaInput";

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
import { findLastIndex } from "lodash";

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
      issuance: {
        is_issued: false,
        issued_on: new Date(),
        doc_issued_by: [],
        is_doc_issuance_cancelled:false
      },
      doc_requested_department :{},
      doc_requested_doctype : {}
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
    doc_requested_department: { error: "", value: docIssuance.doc_requested_department },

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
    doc_issuance: [],
    doc_issuances_status: {
      is_issued: false,
      issued_on: new Date(),
      doc_issued_by: [],
    },
    doc_requested_department: {}
  };
  const [selectedDocForPrint, setSelectedDocForPrint] = useState(
    initialSelectedDocForPrint
  );

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [openIssuanceDocumentEditorModal, updateIssuanceDocumentEditorModal] =
    useState(false);

  const [issuanceDocumentforEdit, updateIssuanceDocumentforEdit] = useState({
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
    doc_requested_department:{}
  });

      /** filter Doc request Master Data */
      const {departments=[]} = account;
      const { doc_requested_doctype={} } = docIssuance;
    //  const {issuance: {is_issued = false}} = docIssuance;
      
      const department_info = departments.length > 0  ? departments[0]['name'] : 'Admin';
      const doc_type_info = doc_requested_doctype.name ? doc_requested_doctype.name : "";

      const [requested_doc_type] = useState(
        doc_requested_doctype
      );
      const [requested_doc_department] = useState(
        departments.length > 0  ? departments[0]  : {name : 'Admin'}
      );    
 
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

  function numberValidator(fieldValue: any) {
    const nan = isNaN(parseInt(fieldValue, 10));
    if (nan) {
      return "must be a integer!";
    }
    return true;
  }

  const printLabel = (event: any) => {
    event.preventDefault();
    const requestedDoc = formState.requested_doc.value;
    let approved_doc_issuance: any = {};
    let processedDocForApproval: any = [];
    let approvedDocCount = 0;

    let doc_issuances_status_info = {
      is_issued: false,
      issued_on: new Date(),
      doc_issued_by: [],
    };
    requestedDoc.map((doc: any) => {
      if (doc.document_no === selectedDocForPrint.document_no) {
        if (selectedDocForPrint.no_of_label > 1) {
          for (var i = 0; i < selectedDocForPrint.no_of_label; i++) {
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
        doc.doc_issuance = processedDocForApproval;
        doc.is_doc_approved = true;
        setSelectedDocForPrint(doc);
        approved_doc_issuance = doc;
      } else {
        doc.is_doc_approved = doc.is_doc_approved ? doc.is_doc_approved : false;
      }

      if (doc.is_doc_approved) {
        approvedDocCount++;
      }

      //Doc Issuances
      const doc_issued = { 
        document_id: selectedDocForPrint.document_no,
        document_issued_on: new Date(),
        document_issued_by: account.emp_id,
      };
      

      if (approvedDocCount && approvedDocCount === requestedDoc.length) {
        const doc_issuances_status = docIssuance?.issuance;
        const doc_issued_by = doc_issuances_status?.doc_issued_by || [];
        // doc_issuances_status_info = docIssuance?.doc_issuances_status;
        // const { doc_issued_by } = doc_issuances_status;
        const doc_issued_by_list: any = [...doc_issued_by, { ...doc_issued }];
        //  doc_issued_by_list.push(doc_issued);
        doc_issuances_status_info = {
          is_issued: true,
          issued_on: new Date(),
          doc_issued_by: doc_issued_by_list,
        };
      } else {
        if (doc.document_no === selectedDocForPrint.document_no) {
          const doc_issuances_status = docIssuance?.issuance;
          const doc_issued_by = doc_issuances_status?.doc_issued_by || [];
          // doc_issuances_status_info = docIssuance?.doc_issuances_status;
          // const { doc_issued_by } = doc_issuances_status;
          const doc_issued_by_list: any = [...doc_issued_by, { ...doc_issued }];

          doc_issuances_status_info = {
            is_issued: false,
            issued_on: new Date(),
            doc_issued_by: doc_issued_by_list,
          };
        }
      }
      return doc;
    });

    let approvalInfo = {
      name: formState.name.value,
      empl_id: formState.empl_id.value,
      doc_type: formState.doc_type.value,
      request_no: formState.request_no.value,
      requested_doc: requestedDoc,
      approval: formState.approval.value,
      id: formState._id.value,
      issuance: doc_issuances_status_info,
      doc_requested_department : formState.doc_requested_department.value,
      doc_requested_doctype : requested_doc_type 
    };

    issueGenaralIssuance(approvalInfo, account).then((status) => {
      formState.requested_doc.value = status.requested_doc
        ? status.requested_doc
        : [];
      // docIssuance = status;
      cancelForm();
      setPrintYesDoc(false);
      //  setSelectedDocForPrint(initialSelectedDocForPrint);
      setShowYes(false);
      dispatch(
        addNotification("Document issued", `Part of document request issued`)
      );
    });
    const approved_doc_issuances: any = approved_doc_issuance.doc_issuance
      ? approved_doc_issuance.doc_issuance
      : [];

    let divContents: any = "<div>nothing to display</div>";
    var a = window.open("", "", "height=500, width=500");
    a?.document.write("<html>");
    a?.document.write("<body >");
    if (approved_doc_issuances.length > 0) {
      approved_doc_issuances.forEach((element: any, i: any): any => {
 
        divContents = (
          <div key={i}>
            <div>Logo</div>
            <div>Reference Number : {element.document_no} </div>
            <div>Categoy :  </div>
            <div>Name of Doc : {element.document_name} </div>
            <div>Type of Doc- : {requested_doc_type.name ? requested_doc_type.name : 'Type Not Selected'}</div>
            <div></div>
            <br></br>
          </div>
        );
        a?.document.write(
          "<div><div>Logo</div><div>Reference Number : " +
            element.document_no +
            " </div><div>Categoy : "+
            requested_doc_department.name +
            " </div><div>Name of Doc :" +
            element.document_name +
            "</div><div>Type of Doc : "+
            requested_doc_type.name +
            "</div><div></div><br></br></div>"
        );
      });

      a?.document.write("</body></html>");
      a?.document.close();
      a?.print();
    }
  };
  function hasNoOfLabelValueChanged(model: OnChangeModel): void {
    setSelectedDocForPrint({
      ...selectedDocForPrint,
      [model.field]: model.value,
    });
  }

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
   
   /*  const apprvedDoc = requestedDoc.map((doc: any) => {
      let processedDocForApproval: any = [];
      const no_of_label = 1;
      for (var i = 0; i < no_of_label; i++) {
        const processedApproval = Object.assign(
          { ...doc },
          {
            is_doc_approved: true,
          }
        );
        processedDocForApproval.push(processedApproval);
      }
      doc.doc_issuance = processedDocForApproval;
      doc.is_doc_approved = true;
      return doc;
    }); */ 
  //Doc Issuances

    
    let doc_issuances_status_info = {
      is_issued: false,
      issued_on: new Date(),
      doc_issued_by: [],
    };
    const doc_issuances_status = docIssuance?.issuance;
    const doc_issued_by = doc_issuances_status?.doc_issued_by || [];
    let doc_issued_by_list: any = [...doc_issued_by];
    requestedDoc.map((doc: any) => {
      let processedDocForApproval: any = [];
      if (!doc.is_doc_issued && !doc.is_doc_approved) {

         // for (var i = 0; i < selectedDocForPrint.no_of_label; i++) {
            const processedApproval = Object.assign(
              { ...doc },
              {
                is_doc_approved: true,
                document_no: doc.document_no,
                request_no: formState.request_no.value,
              }
            );
            processedDocForApproval.push(processedApproval);
         // }
        
        doc.doc_issuance = processedDocForApproval;
        doc.is_doc_approved = true;    
      }  
      const doc_issued = { 
        document_id: doc.document_no,
        document_issued_on: new Date(),
        document_issued_by: account.emp_id,
      };
 
      doc_issued_by_list.push(doc_issued)
  return doc;
    });




    doc_issuances_status_info = {
      is_issued: true,
      issued_on: new Date(),
      doc_issued_by: doc_issued_by_list,
    }; 
  
 
    let approvalInfo = {
      name: formState.name.value,
      empl_id: formState.empl_id.value,
      doc_type: formState.doc_type.value,
      request_no: formState.request_no.value,
      requested_doc: requestedDoc,
      approval: formState.approval.value,
      id: formState._id.value,
      issuance: doc_issuances_status_info,
      doc_requested_department : formState.doc_requested_department.value,
      doc_requested_doctype : requested_doc_type 
    }; 
 

     issueGenaralIssuance(approvalInfo, account).then((status) => {
      setPrintYesDoc(false);
      //  setSelectedDocForPrint(initialSelectedDocForPrint);
      setShowYes(false);
      dispatch(addNotification("Document issued", `Document request issued`));
    }) 
  };
  const rejectIssueGenaralIssuanceAll = (event: any) => {
    event.preventDefault();
    const requestedDoc = formState.requested_doc.value;
       
    let doc_issuances_status_info = {
      is_issued: false,
      issued_on: new Date(),
      doc_issued_by: [],
      is_doc_issuance_cancelled : false
    };
    const doc_issuances_status = docIssuance?.issuance;
    const doc_issued_by = doc_issuances_status?.doc_issued_by || [];
    let doc_issued_by_list: any = [...doc_issued_by];
    requestedDoc.map((doc: any) => {
      let processedDocForApproval: any = [];
      if (!doc.is_doc_issued && !doc.is_doc_approved) {
            const processedApproval = Object.assign(
              { ...doc },
              {
                is_doc_approved: false,
                document_no: doc.document_no,
                request_no: formState.request_no.value,
                is_doc_issuance_cancelled: true,
              }
            );
            processedDocForApproval.push(processedApproval);
        doc.doc_issuance = processedDocForApproval;
        doc.is_doc_approved = false;    
      }  
      const doc_issued = { 
        document_id: doc.document_no,
        document_issued_on: new Date(),
        document_issued_by: account.emp_id,
      };
 
      doc_issued_by_list.push(doc_issued)
      return doc;
    });




    doc_issuances_status_info = {
      is_issued: false,
      is_doc_issuance_cancelled: true,
      issued_on: new Date(),
      doc_issued_by: doc_issued_by_list,
    }; 
  
 
    let approvalInfo = {
      name: formState.name.value,
      empl_id: formState.empl_id.value,
      doc_type: formState.doc_type.value,
      request_no: formState.request_no.value,
      requested_doc: requestedDoc,
      approval: formState.approval.value,
      id: formState._id.value,
      issuance: doc_issuances_status_info,
      doc_requested_department : formState.doc_requested_department.value,
      doc_requested_doctype : requested_doc_type 
    }; 
 

     issueGenaralIssuance(approvalInfo, account).then((status) => {
      dispatch(setModificationState(DocIssuanceModificationStatus.None)); 
      dispatch(addNotification("Document issue rejected", `Document issue rejected`));
    }) 
  };

  const options = { afterInsertRow: saveDocument, ignoreEditable: false };

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
  function onClickIssuanceDocumentEdit(cell: any, row: any, rowIndex: any) {
    updateIssuanceDocumentEditorModal(true);
    updateIssuanceDocumentforEdit({ ...issuanceDocumentforEdit, ...row });
  }
  function buttonFormatter(cell: any, row: any, rowIndex: any) {
    const { issuance = {} } = row;
    const { is_issued = false } = issuance;

    if (!is_issued) {
      return (
        <>
          <button
            type="button"
            className="btn btn-border"
            onClick={() => onClickIssuanceDocumentEdit(cell, row, rowIndex)}
          >
            <i className="fas fa fa-pen"></i>
          </button>
        </>
      );
    } else {
      return <i className="fa fa-thumbs-up" aria-hidden="true"></i>;
    }
  }
  function closeDocUpdate(): void {
    updateIssuanceDocumentEditorModal(false);
  }
  function hasEditIssuanceDocument(model: OnChangeModel): void {
    updateIssuanceDocumentforEdit({
      ...issuanceDocumentforEdit,
      [model.field]: model.value,
      ["edited"]: true,
    });
  }
  function updateIssuanceDocument(): void {
    let docList = docIssuance?.requested_doc ? docIssuance?.requested_doc : [];
    let newDocList: any = [];

    docList.map((cat1: any) => {
      if (
        cat1.document_no.toString() ===
        issuanceDocumentforEdit.document_no.toString()
      ) {
        newDocList.push(issuanceDocumentforEdit);
      } else {
        newDocList.push(cat1);
      }
    });
    setFormState({
      ...formState,
      ["requested_doc"]: { value: newDocList },
    });
    updateIssuanceDocumentEditorModal(false);
  }

  const approved_doc_issuance: any = selectedDocForPrint.doc_issuance
    ? selectedDocForPrint.doc_issuance
    : [];
    console.log("docIssuances--", docIssuances)
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
                        width="10%"
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
                        width="10%"
                        editable={{ validator: numberValidator }}
                      >
                        No of Copy
                      </TableHeaderColumn>
                      <TableHeaderColumn
                        dataField="no_of_page"
                        className="thead-light-1"
                        width="10%"
                      >
                        No of Pages
                      </TableHeaderColumn>

                      <TableHeaderColumn
                        dataField="reason_for_request"
                        className="thead-light-1"
                        width="16%"
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
                      >
                        Action
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
              {((docIssuance.issuance &&
                !docIssuance.issuance.is_issued && !docIssuance.issuance.is_doc_issuance_cancelled) ||
                !docIssuance.issuance) && (
                <span>
                  <button
                    onClick={() => handleYes(true)}
                    className={`btn btn-success left-margin font-14 ${getDisabledClass()}`}
                  >
                    YES
                  </button>
                  <button
                    className="btn btn-warning font-14 left-margin font-14"
                    onClick={(e) => rejectIssueGenaralIssuanceAll(e)}
                  >
                    NO
                  </button>
                </span>
              )}

              {docIssuance.issuance &&
                docIssuance.issuance.is_issued && (
                  <label>
                    <span className="blink_me" style={{}}>
                      All Documents are issued
                    </span>
                  </label>
                )}
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
                            Department1
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
                            {department_info}
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            row={2}
                            csvHeader="order"
                            dataField="document_name"
                            dataSort
                            width="16%"
                          >
                            Doc Name
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
                            {doc_type_info}
                            {/* {formState.doc_type.value} */}
                          </TableHeaderColumn>
                          <TableHeaderColumn
                            row={2}
                            csvHeader="order"
                            dataField="no_of_copy"
                            dataSort
                            width="16%"
                          >
                            No of Copy
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
                            No of Pages
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
                            Print Label
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
                          APPROVE
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
                          placeholder="Document Number"
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

                <div id="printme">
                  <div id={"printableIdyu"}>
                    {" "}
                    {approved_doc_issuance.map(function (object: any, i: any) {
                      return (
                        <div key={i}>
                          <div>Logo</div>
                          <div>
                            Reference Number : {selectedDocForPrint.document_no}{" "}
                          </div>
                          <div>Categoy : ? </div>
                          <div>
                            Name of Doc : {selectedDocForPrint.document_name}{" "}
                          </div>
                          <div>Type of Doc : {formState.doc_type.value} </div>
                          <div></div>
                          <br></br>
                        </div>
                      );
                    })}
                  </div>
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

        <Popup
          className="popup-modal"
          open={openIssuanceDocumentEditorModal}
          onClose={() => closeDocUpdate()}
        >
          <div>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    <b>
                      {" "}
                      Edit Document {issuanceDocumentforEdit.document_name}
                    </b>
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
                          value={issuanceDocumentforEdit.document_no}
                          onChange={hasEditIssuanceDocument}
                          required={false}
                          maxLength={6}
                          label="Document Number"
                          placeholder="Document Number"
                          customError={""}
                          disabled={true}
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
                          value={issuanceDocumentforEdit.document_name}
                          onChange={hasEditIssuanceDocument}
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
                          value={issuanceDocumentforEdit.no_of_copy}
                          onChange={hasEditIssuanceDocument}
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
                          value={issuanceDocumentforEdit.no_of_page}
                          onChange={hasEditIssuanceDocument}
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
                            value={issuanceDocumentforEdit.reason_for_request}
                            onChange={hasEditIssuanceDocument}
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
                    onClick={() => updateIssuanceDocument()}
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
};

export default ProductForm;
