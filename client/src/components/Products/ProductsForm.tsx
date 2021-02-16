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
import DateInput from "../../common/components/DateInput";
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
import { IAccount } from "../../store/models/account.interface";
/* import DatePicker, {
  DayValue,
  DayRange,
  Day,
} from "react-modern-calendar-datepicker"; */
import uniquebg from "../../assets/images/uniquebg.png";

const ProductForm: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);

  const { roles = [] } = account;

  const [boxRacks, setBoxRacks] = useState([]);
  const [formWithError, setFormWithError] = useState(false);
  const [pickRack, setPickedRack] = useState(false);
  const [userRole] = useState(roles[0]);
  const [qrRequested, setQrRequested] = useState({
    name: "",
    box: "",
    rack: "",
  });
  const [qrModified, setQrModified] = useState(false);
  const selectField = ["box"];
  const qrFields = ["box", "name", "rack"];
  const dispatch: Dispatch<any> = useDispatch();
  const products: IProductState | null = useSelector(
    (state: IStateType) => state.products
  );

  let product: IProduct | null = products.selectedProduct;
  const isCreate: boolean =
    products.modificationState === ProductModificationStatus.Create;

  //"expiredate" manufacturedate

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
      manufacturedate: new Date(),
      expiredate: new Date(),
    };
  } else {
    const { box = "", category = "", rack = "" } = product;
    let updatedProduct: IProduct = product;
    if (box) {
      let selectedBox = boxes.boxes.filter((boxe) => boxe.name === box);

      if (selectedBox.length > 0) {
        updatedProduct.box = selectedBox[0]._id;
      }

      if (rack && boxRacks.length === 0) {
        getRacks(product.box).then((racks = []) => {
          if (racks.length > 0) {
            if (boxRacks.length === 0) {
              let selectedRacks = racks.filter((rck: any) => rck.name === rack);
              // console.log("fsdf--444", selectedRacks);
              if (selectedRacks.length > 0) {
                //  console.log("selectedRacks----", selectedRacks);
                updatedProduct.rack = selectedRacks[0]._id;
              }
            }
            setPickedRack(true);
            setBoxRacks(racks);
          }
        });
      }
    }

    if (category) {
      let selectedCat = doccategoriesList.docCategories.filter(
        (catee) => catee.name === category
      );

      if (selectedCat.length > 0) {
        updatedProduct.category = selectedCat[0]._id;
      }
    }

    console.log("updatedProduct----", updatedProduct);

    product = updatedProduct;
  }

  const [formState, setFormState] = useState({
    _id: { error: "", value: product._id },
    name: { error: "", value: product.name },
    description: { error: "", value: product.description },
    box: { error: "", value: product.box },
    rack: { error: "", value: product.rack },
    category: { error: "", value: product.category },
    type_of_space: { error: "", value: product.type_of_space },
    qr_code: { error: "", value: product.qr_code },
    manufacturedate: { error: "", value: product.manufacturedate },
    expiredate: { error: "", value: product.expiredate },
  });
  function makeid() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
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
        if (formState.qr_code.value === "") {
          setFormState({
            ...formState,
            [model.name]: { error: model.error, value: model.field },
            ["qr_code"]: { error: model.error, value: makeid() },
          });
        } else {
          setFormState({
            ...formState,
            [model.name]: { error: model.error, value: model.field },
          });
        }

        // generateCode();
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

    boxRacks.forEach((rack: IRack, index) => {
      if (rack._id === field) {
        newObj[index]["picked"] = true;
      } else {
        newObj[index]["picked"] = false;
      }
    });
    setBoxRacks(newObj);

    setFormState({
      ...formState,
      ["rack"]: { error: model.error, value: field },
    });

    /*  let newObject = Object.assign(
      {},
      { ...formState },
      { ["rack"]: { error: model.error, value: field } }
    );

    checkPossibleToGenerateQR(newObject); */
  }

  function saveUser(event: FormEvent<HTMLFormElement>): void {
    var target = document.activeElement;

    event.preventDefault();
    if (!isFormInvalid()) {
      setFormWithError(!formWithError);
    } else {
      let saveUserFn: Function = isCreate ? addProduct : editProduct;
      let modeOfAction: String = isCreate ? "ADD" : "EDIT";
      saveForm(formState, saveUserFn, modeOfAction);
    }
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
          manufacturedate: formState.manufacturedate.value,
          expiredate: formState.expiredate.value,
          type_of_space: formState.type_of_space.value,
        };

        /* if (roles[0] === "Qualityuser") {
          boxInfo =  {...boxInfo, }
        } */
        addNewDoc(boxInfo, account.auth).then((status) => {
          getDocumentList(account.auth).then((items: IProductList) => {
            dispatch(loadListOfProduct(items));
          });
          dispatch(
            addNotification(
              "New Docuemnt added",
              `Docuemnt ${formState.name.value} added by you`
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
          manufacturedate: formState.manufacturedate.value,
          expiredate: formState.expiredate.value,
          type_of_space: formState.type_of_space.value,
          qr_code: formState.qr_code.value,
        };

        updateDoc(boxInfoUpt, account.auth).then((status) => {
          dispatch(
            saveFn({
              ...product,
              ...status,
            })
          );

          getDocumentList(account.auth).then((items: IProductList) => {
            dispatch(loadListOfProduct(items));
          });
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
    let formIsValid = true;
    if (formState.name.value === "") {
      formIsValid = false;
      formState.name.error = "Document name is mandatory";
    } else if (formState.category.value === "") {
      formIsValid = false;
      formState.category.error = "Category name is mandatory";
    } else if (formState.box.value === "") {
      formIsValid = false;
      formState.box.error = "Box name is mandatory";
    } else if (formState.description.value === "") {
      formIsValid = false;
      formState.description.error = "Box Desc is mandatory";
    } else if (formState.rack.value === "") {
      formIsValid = false;
      formState.rack.error = "Rack name is mandatory";
    } else if (formState.category.value === "") {
      formIsValid = false;
      formState.category.error = "Category name is mandatory";
    } else if (
      formState.type_of_space.value === "" &&
      roles[0] === "Qualityuser"
    ) {
      formIsValid = false;
      formState.type_of_space.error = "Type of space is mandatory";
    } else if (formState.qr_code.value === "" && roles[0] === "Qualityuser") {
      formIsValid = false;
      formState.qr_code.error = "Qr Code for the doc is mandatory";
    }
    setFormState(formState);

    return formIsValid;
  }

  function loadRacks() {
    if (boxRacks.length > 0) {
      const { rack = "" } = product || {};
      return boxRacks.map((rack2) => {
        const { name, _id, status, picked = false, box = "" } = rack2; //destructuring

        let disbaledStatus = false;
        let pickedStatus = picked;
        if (formState.rack.value) {
          if (formState.rack.value === name) {
            pickedStatus = true;
          } else if (formState.rack.value === _id) {
            pickedStatus = true;
          }
        } else {
          if (product?.box === box) {
            let selectdRack = _id === rack ? _id : "";
            pickedStatus = _id === selectdRack ? true : pickedStatus;
          }
        }

        if (status === "Occupied") {
          disbaledStatus = true;
          pickedStatus = true;
        }

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

  function generateCode() {
    getNewQrCode(formState).then((status) => {
      let newObject = Object.assign(
        {},
        { ...formState },
        { ["qr_code"]: { error: "", value: status.qrImage } }
      );

      setQrModified(false);
      setFormState(newObject);
    });
  }

  let type_of_space_Check = "";
  if (formState.type_of_space !== undefined) {
    type_of_space_Check = formState.type_of_space.value;
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
              <div className="form-row 14">
                <div className="form-group col-md-6 font-14">
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
                </div>
                <div className="form-group col-md-6 font-14">
                  <SelectInput
                    id="input_category"
                    field="category"
                    label="Category"
                    options={listOfCate}
                    required={true}
                    onChange={hasFormValueChanged}
                    value={formState.category.value}
                    type="select"
                    customError={formState.category.error}
                  />
                </div>
              </div>
              <div className="form-row 13">
                <div className="form-group col-md-12 font-14">
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
              </div>
              <div className="form-row 12">
                <div className="form-group col-md-6 font-14">
                  <DateInput
                    id="manufacturedate"
                    field="manufacturedate"
                    value={formState.manufacturedate.value}
                    required={false}
                    label="Manufacture date"
                    placeholder="Manufacture date"
                    onChange={hasFormValueChanged}
                  />
                </div>
                <div className="form-group col-md-6 font-14">
                  <DateInput
                    id="expiredate"
                    field="expiredate"
                    value={new Date(formState.expiredate.value)}
                    required={false}
                    label="Expire date   "
                    placeholder="Expire date"
                    onChange={hasFormValueChanged}
                  />
                </div>
              </div>
              <div className="form-row 12">
                <div className="form-group col-md-6 font-14">
                  <div className="form-row">
                    <div className="form-group col-md-12 font-14">
                      <SelectInput
                        id="input_box"
                        field="box"
                        label="Box"
                        options={listOfBoxws}
                        required={true}
                        onChange={hasFormValueChanged}
                        value={formState.box.value}
                        type="select"
                        customError={formState.box.error}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-12 font-14">
                      {" "}
                      {pickRack && (
                        <div className="form-row">Racks {loadRacks()}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {roles[0] === "Qualityuser" && (
                <div className="form-row">
                  <div className="form-group col-md-6 font-14">
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
                  <div className="form-group col-md-6 font-14">
                    <div className="form-row">
                      <div
                        className="col-xs-10"
                        style={{ paddingLeft: "41px" }}
                        key={"non_perceptual_space"}
                      >
                        {" "}
                        {/*  <QRCODE
                          value={formState.qr_code.value}
                          modified={qrModified}
                        />  style={{                
             "backgroundImage": URL(uniquebg : string),                                
              height: "576px"          
     }} */}
                        <div
                          className="uniquename"
                          style={{
                            backgroundImage: "url(" + uniquebg + ")",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            height: "58px",
                            width: "160px",
                            textAlign: "center",
                          }}
                        >
                          <span style={{ fontSize: "32px" }}>
                            {formState.qr_code.value}
                          </span>
                        </div>
                      </div>{" "}
                    </div>
                  </div>
                </div>
              )}
              <button className="btn btn-danger font-14" onClick={() => cancelForm()}>
                Cancel
              </button>
              <button type="submit" className={`btn btn-success left-margin font-14`}>
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
