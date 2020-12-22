import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import {
  IStateType,
  IProductState,
  IDocCategoryState,
  IBoxState,
} from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import {
  IProduct,
  ProductModificationStatus,
} from "../../store/models/product.interface";

import { IRack } from "../../store/models/box.interface";
import TextInput from "../../common/components/TextInput";
import {
  editProduct,
  clearSelectedProduct,
  setModificationState,
  addProduct,
} from "../../store/actions/products.action";
import { addNotification } from "../../store/actions/notifications.action";
import { addNewDoc, updateDoc, getRacks } from "../../services/index";
import {
  OnChangeModel,
  IProductFormState,
} from "../../common/types/Form.types";
import SelectInput from "../../common/components/Select";
import Checkbox from "../../common/components/Checkbox";

const ProductForm: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const products: IProductState | null = useSelector(
    (state: IStateType) => state.products
  );
  let product: IProduct | null = products.selectedProduct;
  const isCreate: boolean =
    products.modificationState === ProductModificationStatus.Create;

  if (!product || isCreate) {
    product = {
      _id: "",
      name: "",
      description: "",
      box: "",
      rack: "",
      category: "",
      type_of_space: "",
    };
  }
  //Document Category loaded
  const doccategoriesList: IDocCategoryState | null = useSelector(
    (state: IStateType) => state.docCategories
  );

  let listOfCate: { id: string; name: string }[] = [];
  doccategoriesList.docCategories.forEach((doc) => {
    let me = { id: doc._id, name: doc.name };
    listOfCate.push(me);
  });
  //Document Boxes loaded
  const boxes: IBoxState = useSelector((state: IStateType) => state.boxes);
  let listOfBoxws: { id: string; name: string }[] = [];
  boxes.boxes.forEach((doc) => {
    let me = { id: doc._id, name: doc.name };
    listOfBoxws.push(me);
  });

  const [formState, setFormState] = useState({
    _id: { error: "", value: product._id },
    name: { error: "ertert", value: product.name },
    description: { error: "", value: product.description },
    box: { error: "", value: product.box },
    rack: { error: "", value: product.rack },
    category: { error: "", value: product.category },
    type_of_space: { error: "", value: product.type_of_space },
  });

  const [boxRacks, setBoxRacks] = useState([]);
  const [pickRack, setPickedRack] = useState(false);
  const selectField = ["box"];

  function hasFormValueChanged(model: OnChangeModel): void {
    const { field, value = "", name = "" } = model;
    if (selectField.indexOf(field) > -1) {
      getRacks(value).then((racks = []) => {
        if (racks.length > 0) {
          setPickedRack(true);
          setBoxRacks(racks);
          // dispatch(updateRacks(racks));
        }
      });
      setFormState({
        ...formState,
        [model.field]: { error: model.error, value: model.value },
      });
    } else {
      console.log("name-", name);
      if (name === "type_of_space") {
        setFormState({
          ...formState,
          [model.name]: { error: model.error, value: model.field },
        });
      } else {
        setFormState({
          ...formState,
          [model.field]: { error: model.error, value: model.value },
        });
      }
    }
  }
  function hasRacksValueChanged(model: OnChangeModel): void {
    const newObj: any = boxRacks;
    const { field = "" } = model;

    console.log("model---", model);

    boxRacks.forEach((rack: IRack, index) => {
      if (rack._id === field) {
        // newObj[index]["status"] = "Occupied";
        newObj[index]["picked"] = true;
        // setPickedRack(index);
      } else {
        //  newObj[index]["status"] = "Available";
        newObj[index]["picked"] = false;
      }
    });

    /*   const foundIndex: number = newObj.findIndex(
      (rack: any) => rack._id === field
    );
    newObj[foundIndex]["status"] = "Occupied"; */
    setBoxRacks(newObj);

    setFormState({
      ...formState,
      ["rack"]: { error: model.error, value: model.field },
    });
  }
  function saveUser(e: FormEvent<HTMLFormElement>): void {
    console.log("FORM---", formState);
    e.preventDefault();
    if (!isFormInvalid()) {
      return;
    }

    let saveUserFn: Function = isCreate ? addProduct : editProduct;
    let modeOfAction: String = isCreate ? "ADD" : "EDIT";
    saveForm(formState, saveUserFn, modeOfAction);
  }

  function saveForm(
    formState: IProductFormState,
    saveFn: Function,
    mode: String
  ): void {
    if (product) {
      if (mode === "ADD") {
        let boxInfo = {
          name: formState.name.value,
          description: formState.description.value,
          box: formState.box.value,
          rack: formState.rack.value,
          category: formState.category.value,
        };
        addNewDoc(boxInfo).then((status) => {
          dispatch(
            saveFn({
              ...product,
              ...status,
            })
          );
          dispatch(
            addNotification(
              "New Docuemnt added",
              `Box ${formState.name.value} added by you`
            )
          );
          dispatch(clearSelectedProduct());
          dispatch(setModificationState(ProductModificationStatus.None));
        });
      } else if (mode === "EDIT") {
        let boxInfoUpt = {
          id: formState._id.value,
          name: formState.name.value,
          description: formState.description.value,
          box: formState.box.value,
          rack: formState.rack.value,
          category: formState.category.value,
        };
        updateDoc(boxInfoUpt).then((status) => {
          dispatch(
            saveFn({
              ...product,
              ...status,
            })
          );
          dispatch(
            addNotification(
              "Box ",
              `Docuemnt ${formState.name.value} edited by you`
            )
          );
          dispatch(clearSelectedProduct());
          dispatch(setModificationState(ProductModificationStatus.None));
        });
      }
    }
  }

  function cancelForm(): void {
    dispatch(setModificationState(ProductModificationStatus.None));
  }

  function getDisabledClass(): string {
    let isError: boolean = isFormInvalid();
    return isError ? "disabled" : "";
  }

  function isFormInvalid(): boolean {
    return true;
  }

  function loadRacks() {
    if (boxRacks.length > 0) {
      return boxRacks.map((rack, index) => {
        const { name, _id, status, picked = false } = rack; //destructuring

        let disbaledStatus = false;
        let pickedStatus = picked;
        if (status === "Occupied") {
          disbaledStatus = true;
          pickedStatus = true;
        }

        // let pickedStatus = rack.picked;
        return (
          <div className="col-xs-2" key={_id}>
            {" "}
            <Checkbox
              id="input_email"
              field={_id}
              onChange={hasRacksValueChanged}
              label={name}
              value={pickedStatus}
              name={name}
              disabled={disbaledStatus}
            />
          </div>
        );
      });
    }
  }

  const { type_of_space = {} } = formState;
  let type_of_space_Check = "";
  if (formState.type_of_space !== undefined) {
    type_of_space_Check = formState.type_of_space.value;
  }

  let ty;
  return (
    <Fragment>
      <div className="col-xl-7 col-lg-7">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-green">
              Document {isCreate ? "create" : "edit"}
            </h6>
          </div>
          <div className="card-body">
            <form onSubmit={saveUser}>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <TextInput
                    id="input_email"
                    value={formState.name.value}
                    field="name"
                    onChange={hasFormValueChanged}
                    required={true}
                    maxLength={20}
                    label="Name"
                    placeholder="Name"
                  />
                </div>
                <div className="form-group col-md-6">
                  <SelectInput
                    id="input_category"
                    field="category"
                    label="Category"
                    options={listOfCate}
                    required={true}
                    onChange={hasFormValueChanged}
                    value={""}
                    type="select"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-12">
                  <TextInput
                    id="input_description"
                    field="description"
                    value={formState.description.value}
                    onChange={hasFormValueChanged}
                    required={false}
                    maxLength={100}
                    label="Description"
                    placeholder="Description"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <SelectInput
                    id="input_category"
                    field="box"
                    label="Box"
                    options={listOfBoxws}
                    required={true}
                    onChange={hasFormValueChanged}
                    value={""}
                    type="select"
                  />
                </div>
                <div className="form-group col-md-6">
                  {" "}
                  {pickRack && (
                    <div className="form-row">Racks {loadRacks()}</div>
                  )}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  Type of Space
                  <div className="form-row">
                    <div
                      className="col-xs-3"
                      style={{ paddingLeft: "41px" }}
                      key={"non_perceptual_space"}
                    >
                      {" "}
                      <Checkbox
                        id="input_email"
                        field={"non_perceptual"}
                        onChange={hasFormValueChanged}
                        label={"Non Perpetual documents "}
                        value={
                          type_of_space_Check === "non_perceptual"
                            ? true
                            : false
                        }
                        name={"type_of_space"}
                        disabled={false}
                      />
                    </div>
                    <div
                      className="col-xs-3"
                      style={{ paddingLeft: "41px" }}
                      key={"perceptual_space"}
                    >
                      {" "}
                      <Checkbox
                        id="input_email"
                        field={"perceptual"}
                        onChange={hasFormValueChanged}
                        label={"Perpetual documents "}
                        value={
                          type_of_space_Check === "perceptual" ? true : false
                        }
                        name={"type_of_space"}
                        disabled={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group col-md-6">
                  <div className="form-row">
                    <div className="col-xs-12"> QR Code</div>
                  </div>
                  <div className="form-row">
                    <div
                      className="col-xs-6"
                      style={{ paddingLeft: "41px" }}
                      key={"non_perceptual_space"}
                    >
                      <button type="submit" className={`btn btn-dark  `}>
                        Genarate
                      </button>
                    </div>{" "}
                  </div>
                </div>
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
