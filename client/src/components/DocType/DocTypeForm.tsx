import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import { IStateType, IDocTypeState } from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import {
  IDocType,
  DocTypeModificationStatus,
  IDocTypeList,
} from "../../store/models/doctype.interface";
import TextInput from "../../common/components/TextInput";
import {
  editDocType,
  clearSelectedDocType,
  setModificationState,
  addDocType,
  loadListOfDocType,
} from "../../store/actions/doctype.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  addNewDocType,
  updateDocType,
  getDocTypeList,
} from "../../services/index";
import {
  OnChangeModel,
  IDocTypeFormState,
} from "../../common/types/Form.types";
import { IAccount } from "../../store/models/account.interface";

const ProductForm: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);

  const dispatch: Dispatch<any> = useDispatch();
  const docType: IDocTypeState | null = useSelector(
    (state: IStateType) => state.docTypes
  );
  let doctype: IDocType | null = docType.selectedDocType;
  const isCreate: boolean =
    docType.modificationState === DocTypeModificationStatus.Create;

  if (!doctype || isCreate) {
    doctype = { _id: "", name: "", description: "" };
  }

  const [formState, setFormState] = useState({
    _id: { error: "", value: doctype._id },
    name: { error: "", value: doctype.name },
    description: { error: "", value: doctype.description },
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

    let saveUserFn: Function = isCreate ? addDocType : editDocType;
    let modeOfAction: String = isCreate ? "ADD" : "EDIT";
    saveForm(formState, saveUserFn, modeOfAction);
  }

  function saveForm(
    formState: IDocTypeFormState,
    saveFn: Function,
    mode: String
  ): void {
    if (doctype) {
      if (mode === "ADD") {
        let boxInfo = {
          name: formState.name.value,
          description: formState.description.value,
        };
        addNewDocType(boxInfo, account).then((status) => {
          dispatch(
            saveFn({
              ...doctype,
              ...status,
            })
          );
          dispatch(
            addNotification(
              "New Box added",
              `Box ${formState.name.value} added by you`
            )
          );
          getDocTypeList(account.auth).then((items: IDocTypeList) => {
            dispatch(loadListOfDocType(items));
          });
          dispatch(clearSelectedDocType());
          dispatch(setModificationState(DocTypeModificationStatus.None));
        });
      } else if (mode === "EDIT") {
        let boxInfoUpt = {
          id: formState._id.value,
          name: formState.name.value,
          description: formState.description.value,
        };
        updateDocType(boxInfoUpt, account).then((status) => {
          dispatch(
            saveFn({
              ...doctype,
              ...status,
            })
          );
          getDocTypeList(account.auth).then((items: IDocTypeList) => {
            dispatch(loadListOfDocType(items));
          });
          dispatch(
            addNotification("Box ", `Box ${formState.name.value} edited by you`)
          );
          dispatch(clearSelectedDocType());
          dispatch(setModificationState(DocTypeModificationStatus.None));
        });
      }
    }
  }

  function cancelForm(): void {
    dispatch(setModificationState(DocTypeModificationStatus.None));
  }

  function getDisabledClass(): string {
    let isError: boolean = isFormInvalid();
    return isError ? "disabled" : "";
  }

  function isFormInvalid(): boolean {
    return true;
  }

  return (
    <Fragment>
      <div className="col-xl-7 col-lg-7">
        <div className="card shadow mb-4">
          <div className="card-header py-1">
            <h6 className="m-0 font-weight-bold text-white">
              Document Type {isCreate ? "create" : "edit"}
            </h6>
          </div>
          <div className="card-body">
            <form onSubmit={saveUser}>
              <div className="form-group font-14">
                <TextInput
                  id="input_email"
                  value={formState.name.value}
                  field="name"
                  onChange={hasFormValueChanged}
                  required={true}
                  maxLength={100}
                  label="Name"
                  placeholder="Name"
                  customError={formState.name.error}
                />
              </div>
              <div className="form-group font-14">
                <TextInput
                  id="input_description"
                  field="description"
                  value={formState.description.value}
                  onChange={hasFormValueChanged}
                  required={false}
                  maxLength={100}
                  label="Description"
                  placeholder="Description"
                  customError={formState.description.error}
                />
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
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductForm;
