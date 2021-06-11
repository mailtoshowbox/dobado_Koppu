import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import {
  IStateType,
  IDocDepartmentState,
} from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import {
  IDocDepartment,
  DocDepartmentModificationStatus,
  IDocDepartmentList,
} from "../../store/models/docdepartment.interface";
import TextInput from "../../common/components/TextInput";
import {
  editDocDepartment,
  clearSelectedDocDepartment,
  setModificationState,
  addDocDepartment,
  loadListOfDocDepartment,
} from "../../store/actions/docdepartment.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  addNewDocDept,
  updateDocDept,
  getDocDepartmentList,
} from "../../services/index";
import {
  OnChangeModel,
  IDocDepartmentFormState,
} from "../../common/types/Form.types";
import { IAccount } from "../../store/models/account.interface";

const ProductForm: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);

  const dispatch: Dispatch<any> = useDispatch();
  const doccategories: IDocDepartmentState | null = useSelector(
    (state: IStateType) => state.docDepartments
  );
  let docdepartment: IDocDepartment | null =
    doccategories.selectedDocDepartment;
  const isCreate: boolean =
    doccategories.modificationState === DocDepartmentModificationStatus.Create;

  if (!docdepartment || isCreate) {
    docdepartment = { _id: "", name: "", description: "" };
  }

  const [formState, setFormState] = useState({
    _id: { error: "", value: docdepartment._id },
    name: { error: "", value: docdepartment.name },
    description: { error: "", value: docdepartment.description },
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

    let saveUserFn: Function = isCreate ? addDocDepartment : editDocDepartment;
    let modeOfAction: String = isCreate ? "ADD" : "EDIT";
    saveForm(formState, saveUserFn, modeOfAction);
  }

  function saveForm(
    formState: IDocDepartmentFormState,
    saveFn: Function,
    mode: String
  ): void {
    if (docdepartment) {
      if (mode === "ADD") {
        let boxInfo = {
          name: formState.name.value,
          description: formState.description.value,
        };
        addNewDocDept(boxInfo, account).then((status) => {
          dispatch(
            saveFn({
              ...docdepartment,
              ...status,
            })
          );
          getDocDepartmentList(account.auth).then(
            (items: IDocDepartmentList) => {
              dispatch(loadListOfDocDepartment(items));
            }
          );
          dispatch(
            addNotification(
              "New Box added",
              `Box ${formState.name.value} added by you`
            )
          );

          dispatch(clearSelectedDocDepartment());
          dispatch(setModificationState(DocDepartmentModificationStatus.None));
        });
      } else if (mode === "EDIT") {
        let boxInfoUpt = {
          id: formState._id.value,
          name: formState.name.value,
          description: formState.description.value,
        };
        updateDocDept(boxInfoUpt, account).then((status) => {
          dispatch(
            saveFn({
              ...docdepartment,
              ...status,
            })
          );
          dispatch(
            addNotification(
              "Box ",
              `New Box ${formState.name.value} edited by you`
            )
          );
          getDocDepartmentList(account.auth).then(
            (items: IDocDepartmentList) => {
              dispatch(loadListOfDocDepartment(items));
            }
          );
          dispatch(clearSelectedDocDepartment());
          dispatch(setModificationState(DocDepartmentModificationStatus.None));
        });
      }
    }
  }

  function cancelForm(): void {
    dispatch(setModificationState(DocDepartmentModificationStatus.None));
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
              Document {isCreate ? "create" : "edit"}
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
