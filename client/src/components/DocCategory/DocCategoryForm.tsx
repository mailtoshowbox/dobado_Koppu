import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import {
  IStateType,
  IDocCategoryState,
} from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import {
  IDocCategory,
  DocCategoryModificationStatus,
} from "../../store/models/doccategory.interface";
import TextInput from "../../common/components/TextInput";
import {
  editDocCategory,
  clearSelectedDocCategory,
  setModificationState,
  addDocCategory,
} from "../../store/actions/doccategory.action";
import { addNotification } from "../../store/actions/notifications.action";
import { addNewDocCat, updateDocCat } from "../../services/index";
import {
  OnChangeModel,
  IDocCategoryFormState,
} from "../../common/types/Form.types";
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
        addNewDocCat(boxInfo, account.auth).then((status) => {
          dispatch(
            saveFn({
              ...doccategory,
              ...status,
            })
          );
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
        updateDocCat(boxInfoUpt, account.auth).then((status) => {
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

  return (
    <Fragment>
      <div className="col-xl-7 col-lg-7">
        <div className="card shadow mb-4">
          <div className="card-header py-2">
            <h6 className="m-0 font-weight-bold text-white">
              Document {isCreate ? "create" : "edit"}
            </h6>
          </div>
          <div className="card-body">
            <form onSubmit={saveUser}>
              <div className="form-group">
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
              <div className="form-group">
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

              <button className="btn btn-danger" onClick={() => cancelForm()}>
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-success left-margin ${getDisabledClass()}`}
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
