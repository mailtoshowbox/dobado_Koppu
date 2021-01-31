import React, {
  useState,
  FormEvent,
  Dispatch,
  Fragment,
  useEffect,
} from "react";
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
import { IProductList } from "../../store/models/product.interface";
import TextInput from "../../common/components/TextInput";
import QRCODE from "../../common/components/QrCode";
import {
  editProduct,
  clearSelectedProduct,
  setModificationState,
  addProduct,
  loadListOfProduct,
  updateQrCode,
} from "../../store/actions/products.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  addNewDoc,
  updateDoc,
  getRacks,
  getDocumentList,
  getNewQrCode,
} from "../../services/index";
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
      qr_code: "",
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
    name: { error: "", value: product.name },
    description: { error: "", value: product.description },
    box: { error: "", value: product.box },
    rack: { error: "", value: product.rack },
    category: { error: "", value: product.category },
    type_of_space: { error: "", value: product.type_of_space },
    qr_code: { error: "", value: product.qr_code },
  });

  const [boxRacks, setBoxRacks] = useState([]);
  const [pickRack, setPickedRack] = useState(false);
  const [qrRequested, setQrRequested] = useState({
    name: "",
    box: "",
    rack: "",
  });
  const [qrModified, setQrModified] = useState(false);
  const selectField = ["box"];
  const qrFields = ["box", "name", "rack"];

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
      setQrRequested(
        Object.assign({ ...qrRequested }, { [model.field]: model.value })
      );
      setQrModified(true);
    } else {
      //Prepare QR
      if (field === "name") {
        setQrRequested(
          Object.assign({ ...qrRequested }, { [model.field]: value })
        );
        // setQrModified(true);
      }

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
    checkPossibleToGenerateQR({
      ...formState,
      [model.field]: { error: model.error, value: model.value },
    });
  }
  function hasRacksValueChanged(model: OnChangeModel): void {
    const newObj: any = boxRacks;
    const { field = "" } = model;

    boxRacks.forEach((rack: IRack, index) => {
      if (rack._id === field) {
        newObj[index]["picked"] = true;
      } else {
        newObj[index]["picked"] = false;
      }
    });
    setBoxRacks(newObj);

    let newObject = Object.assign(
      {},
      { ...formState },
      { ["rack"]: { error: model.error, value: field } }
    );

    checkPossibleToGenerateQR(newObject);
  }

  function saveUser(event: FormEvent<HTMLFormElement>): void {
    var target = document.activeElement;

    event.preventDefault();
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
          qr_code: formState.qr_code.value,
        };
        addNewDoc(boxInfo).then((status) => {
          getDocumentList().then((items: IProductList) => {
            dispatch(loadListOfProduct(items));
          });
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
    console.log("formState---->>>", formState);
    let formIsValid = true;
    if (formState.name.value === "") {
      formIsValid = false;
      formState.name.error = "Docuemnt name is mandatory";
      setFormState(formState);
    } else if (formState.box.value === "") {
      formIsValid = false;
      formState.name.error = "Box name is mandatory";
    } else if (formState.rack.value === "") {
      formIsValid = false;
      formState.name.error = "Rack name is mandatory";
    } else if (formState.category.value === "") {
      formIsValid = false;
      formState.name.error = "Category name is mandatory";
    } else if (formState.type_of_space.value === "") {
      formIsValid = false;
      formState.name.error = "Type of space is mandatory";
    } else if (formState.qr_code.value === "") {
      formIsValid = false;
      formState.name.error = "Qr Code for the doc is mandatory";
    }

    return formIsValid;
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
              customError={""}
            />
          </div>
        );
      });
    }
  }
  function checkPossibleToGenerateQR(dataToProcess: any) {
    let availableToMakeQrRequest = false;

    if (dataToProcess.name.value !== "") {
      availableToMakeQrRequest = true;
    } else {
      availableToMakeQrRequest = false;
    }
    if (availableToMakeQrRequest && dataToProcess.rack.value !== "") {
      availableToMakeQrRequest = true;
    } else {
      availableToMakeQrRequest = false;
    }
    if (availableToMakeQrRequest && dataToProcess.box.value !== "") {
      availableToMakeQrRequest = true;
    } else {
      availableToMakeQrRequest = false;
    }

    if (availableToMakeQrRequest) {
      getNewQrCode(dataToProcess).then((status) => {
        let newObject = Object.assign(
          {},
          { ...dataToProcess },
          { ["qr_code"]: { error: "", value: status.qrImage } }
        );

        setQrModified(false);
        setFormState(newObject);
      });
    } else {
      setFormState(dataToProcess);
    }
  }

  let type_of_space_Check = "";
  if (formState.type_of_space !== undefined) {
    type_of_space_Check = formState.type_of_space.value;
  }
  console.log("RENDER--", formState);

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
              <div className="form-row 14">
                <div className="form-group col-md-6">
                  <TextInput
                    id="input_email"
                    value={formState.name.value}
                    customError={formState.name.error}
                    field="name"
                    onChange={hasFormValueChanged}
                    required={true}
                    maxLength={20}
                    label="Name"
                    placeholder="Name"
                  />
                  {formState.name.error ? (
                    <div className="invalid-feedback">
                      {formState.name.error}
                    </div>
                  ) : null}
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
                    customError={formState.name.error}
                  />
                </div>
              </div>
              <div className="form-row 13">
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
                    customError={formState.name.error}
                  />
                </div>
              </div>
              <div className="form-row 12">
                <div className="form-group col-md-6">
                  <div className="form-row">
                    <div className="form-group col-md-12">
                      <SelectInput
                        id="input_category"
                        field="box"
                        label="Box"
                        options={listOfBoxws}
                        required={true}
                        onChange={hasFormValueChanged}
                        value={""}
                        type="select"
                        customError={formState.name.error}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-12">
                      {" "}
                      {pickRack && (
                        <div className="form-row">Racks {loadRacks()}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="form-group col-md-6">
                  <div className="form-row">
                    <div
                      className="col-xs-10"
                      style={{ paddingLeft: "41px" }}
                      key={"non_perceptual_space"}
                    >
                      {" "}
                      <QRCODE
                        value={formState.qr_code.value}
                        modified={qrModified}
                      />
                    </div>{" "}
                  </div>
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
                        customError={formState.name.error}
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
                        customError={formState.name.error}
                      />
                    </div>
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
