import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import {
  IStateType,
  IDocCategoryState,
} from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import {
  IDocCategory,
  DocCategoryModificationStatus,
  IDocCategoryList,
} from "../../store/models/doccategory.interface";
import TextInput from "../../common/components/TextInput";
import {
  editDocCategory,
  clearSelectedDocCategory,
  setModificationState,
  addDocCategory,
  loadListOfDocCategory,
} from "../../store/actions/doccategory.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  addNewDocCat,
  updateDocCat,
  getDocCategoryList,
} from "../../services/index";
import {
  OnChangeModel,
  IDocCategoryFormState,
} from "../../common/types/Form.types";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import SelectInput from "../../common/components/Select";
import { IAccount } from "../../store/models/account.interface";

const ProductForm: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);

  const dispatch: Dispatch<any> = useDispatch();
  const doccategories: IDocCategoryState | null = useSelector(
    (state: IStateType) => state.docCategories
  );
  let doccategory: IDocCategory | null = doccategories.selectedDocCategory;
  const isCreate: boolean =
    doccategories.modificationState === DocCategoryModificationStatus.Create;

  if (!doccategory || isCreate) {
    doccategory = { _id: "", name: "", description: "" };
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

  const [formState, setFormState] = useState({
    _id: { error: "", value: doccategory._id },
    name: { error: "", value: doccategory.name },
    description: { error: "", value: doccategory.description },
  });

  function hasFormValueChanged(model: OnChangeModel): void {
    setFormState({
      ...formState,
      [model.field]: { error: model.error, value: model.value },
    });
  }

  function saveUser(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (!isFormInvalid()) {
      return;
    }

    let saveUserFn: Function = isCreate ? addDocCategory : editDocCategory;
    let modeOfAction: String = isCreate ? "ADD" : "EDIT";
    saveForm(formState, saveUserFn, modeOfAction);
  }

  function saveForm(
    formState: IDocCategoryFormState,
    saveFn: Function,
    mode: String
  ): void {
    if (doccategory) {
      if (mode === "ADD") {
        let boxInfo = {
          name: formState.name.value,
          description: formState.description.value,
        };
        addNewDocCat(boxInfo, account).then((status) => {
          dispatch(
            saveFn({
              ...doccategory,
              ...status,
            })
          );
          getDocCategoryList(account.auth).then((items: IDocCategoryList) => {
            dispatch(loadListOfDocCategory(items));
          });
          dispatch(
            addNotification(
              "New Box added",
              `Box ${formState.name.value} added by you`
            )
          );

          dispatch(clearSelectedDocCategory());
          dispatch(setModificationState(DocCategoryModificationStatus.None));
        });
      } else if (mode === "EDIT") {
        let boxInfoUpt = {
          id: formState._id.value,
          name: formState.name.value,
          description: formState.description.value,
        };
        updateDocCat(boxInfoUpt, account).then((status) => {
          dispatch(
            saveFn({
              ...doccategory,
              ...status,
            })
          );
          dispatch(
            addNotification(
              "Box ",
              `New Box ${formState.name.value} edited by you`
            )
          );
          getDocCategoryList(account.auth).then((items: IDocCategoryList) => {
            dispatch(loadListOfDocCategory(items));
          });
          dispatch(clearSelectedDocCategory());
          dispatch(setModificationState(DocCategoryModificationStatus.None));
        });
      }
    }
  }

  function cancelForm(): void {
    dispatch(setModificationState(DocCategoryModificationStatus.None));
  }

  function getDisabledClass(): string {
    let isError: boolean = isFormInvalid();
    return isError ? "disabled" : "";
  }

  function isFormInvalid(): boolean {
    return true;
  }

  const options = {};

  return (
    <Fragment>
      <div className="col-xl-12 col-lg-12">
        <div className="card shadow mb-4">
          <div className="card-body">
            <form onSubmit={saveUser}>
              <div className="form-group font-14">
                <div className="row">
                  <div className="col-md-4">
                    <TextInput
                      id="input_email"
                      value={formState.name.value}
                      field="emp_id"
                      onChange={hasFormValueChanged}
                      required={true}
                      maxLength={100}
                      label="Emp Id"
                      placeholder="Employee Id"
                      customError={formState.name.error}
                    />
                  </div>
                  <div className="col-md-4">
                    <TextInput
                      id="input_request_no"
                      field="doc_request_no"
                      value={formState.description.value}
                      onChange={hasFormValueChanged}
                      required={false}
                      maxLength={100}
                      label="Request No"
                      placeholder="Request Number"
                      customError={formState.description.error}
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
                      field="document_type"
                      label=""
                      options={dcat1}
                      required={true}
                      onChange={hasFormValueChanged}
                      value={""}
                      type="select"
                      customError={"a"}
                    />
                  </div>
                  <div className="col-md-3">
                    <SelectInput
                      id="input_document_type"
                      field="document_type"
                      label=""
                      options={dcat2}
                      required={true}
                      onChange={hasFormValueChanged}
                      value={""}
                      type="select"
                      customError={"a"}
                    />
                  </div>
                  <div className="col-md-3">
                    <SelectInput
                      id="input_document_type"
                      field="document_type"
                      label=""
                      options={dcat3}
                      required={true}
                      onChange={hasFormValueChanged}
                      value={""}
                      type="select"
                      customError={"a"}
                    />
                  </div>
                </div>
                <div>
                  <BootstrapTable
                    options={options}
                    data={[]}
                    pagination={true}
                    hover={true}
                    insertRow={true}
                  >
                    <TableHeaderColumn
                      dataField="_id"
                      isKey
                      searchable={false}
                      hidden={true}
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
                      dataField="category"
                      className="thead-light-1"
                      width="16%"
                    >
                      No of Copy
                    </TableHeaderColumn>
                    <TableHeaderColumn
                      dataField="box"
                      className="thead-light-1"
                      width="14%"
                    >
                      No of Pages
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField="qr_code"
                      className="thead-light-1"
                      width="10%"
                    >
                      Reason for Request
                    </TableHeaderColumn>
                  </BootstrapTable>
                </div>

                <div className="row" id="catergory_2">
                  <div className="col-md-4">
                    <TextInput
                      id="input_email"
                      value={formState.name.value}
                      field="emp_id"
                      onChange={hasFormValueChanged}
                      required={true}
                      maxLength={100}
                      label="Emp Code"
                      placeholder="Emp Code"
                      customError={formState.name.error}
                    />
                  </div>
                </div>
                <div className="row" id="catergory_2">
                  <div className="col-md-4">
                    <TextInput
                      id="input_email"
                      value={formState.name.value}
                      field="emp_id"
                      onChange={hasFormValueChanged}
                      required={true}
                      maxLength={100}
                      label="Reference No"
                      placeholder="Reference No"
                      customError={formState.name.error}
                    />
                  </div>
                  <div className="col-md-4">
                    <TextInput
                      id="input_email"
                      value={formState.name.value}
                      field="emp_id"
                      onChange={hasFormValueChanged}
                      required={true}
                      maxLength={100}
                      label="Description"
                      placeholder="Description"
                      customError={formState.name.error}
                    />
                  </div>
                </div>
                <div className="row" id="catergory_2">
                  <div className="col-md-4">
                    <TextInput
                      id="input_email"
                      value={formState.name.value}
                      field="emp_id"
                      onChange={hasFormValueChanged}
                      required={true}
                      maxLength={100}
                      label="Title"
                      placeholder="Title"
                      customError={formState.name.error}
                    />
                  </div>
                  <div className="col-md-4">
                    <TextInput
                      id="input_email"
                      value={formState.name.value}
                      field="emp_id"
                      onChange={hasFormValueChanged}
                      required={true}
                      maxLength={100}
                      label="Category"
                      placeholder="Category"
                      customError={formState.name.error}
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
      </div>
    </Fragment>
  );
};

export default ProductForm;
