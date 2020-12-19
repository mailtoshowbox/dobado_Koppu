import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import { IStateType, IProductState } from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import { IProduct, ProductModificationStatus } from "../../store/models/product.interface";
import TextInput from "../../common/components/TextInput";
import { editProduct, clearSelectedProduct, setModificationState, addProduct } from "../../store/actions/products.action";
import { addNotification } from "../../store/actions/notifications.action";

import {  addNewDoc, updateDoc  } from "../../services/index"; 

 
import { OnChangeModel, IProductFormState } from "../../common/types/Form.types";

const ProductForm: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const products: IProductState | null = useSelector((state: IStateType) => state.products);
  let product: IProduct | null = products.selectedProduct;
  const isCreate: boolean = (products.modificationState === ProductModificationStatus.Create);
  
  if (!product || isCreate) {
    product = { _id: "", name: "", description: "", box:"", rack:0 };
  }

  const [formState, setFormState] = useState({
    _id: { error: "", value: product._id },
    name: { error: "", value: product.name },
    description: { error: "", value: product.description }  ,
    box: { error: "", value: product.box } ,
    rack: { error: "", value: product.rack } 
  });

  function hasFormValueChanged(model: OnChangeModel): void {
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
  }

  function saveUser(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (isFormInvalid()) {
      return;
    }

    let saveUserFn: Function = (isCreate) ? addProduct : editProduct;
    let modeOfAction: String = (isCreate) ? "ADD": "EDIT";
    saveForm(formState, saveUserFn, modeOfAction);
  }

  function saveForm(formState: IProductFormState, saveFn: Function, mode: String): void {
   


    if (product) {
      if(mode === 'ADD'){
  let boxInfo  ={
    "name": formState.name.value,
    "description": formState.description.value,
    "box": formState.box.value,
    "rack": formState.rack.value
      };
      addNewDoc(boxInfo)
  .then((status) => {   
        dispatch(saveFn({
          ...product,
         ...status              
        }));      
        dispatch(addNotification("New Box added", `Box ${formState.name.value} added by you`));
        dispatch(clearSelectedProduct());
        dispatch(setModificationState(ProductModificationStatus.None));  
  })
}else if(mode === 'EDIT'){ 
  let boxInfoUpt  ={
    "id": formState._id.value,
    "name": formState.name.value,
    "description": formState.description.value,
    "box": formState.box.value,
    "rack": formState.rack.value };
    updateDoc(boxInfoUpt)
  .then((status) => {    
        dispatch(saveFn({
          ...product,
         ...status              
        }));      
        dispatch(addNotification("Box ", `New Box ${formState.name.value} edited by you`));
        dispatch(clearSelectedProduct());
        dispatch(setModificationState(ProductModificationStatus.None));  
  })
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

  return (
    <Fragment>
      <div className="col-xl-7 col-lg-7">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-green">Document {(isCreate ? "create" : "edit")}</h6>
          </div>
          <div className="card-body">
            <form onSubmit={saveUser}>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <TextInput id="input_email"
                    value={formState.name.value}
                    field="name"
                    onChange={hasFormValueChanged}
                    required={true}
                    maxLength={20}
                    label="Name"
                    placeholder="Name" />
                </div>
                
              </div>
              <div className="form-group">
                <TextInput id="input_description"
                field = "description"
                  value={formState.description.value}
                  onChange={hasFormValueChanged}
                  required={false}
                  maxLength={100}
                  label="Description"
                  placeholder="Description" />
              </div>
              
              
              <button className="btn btn-danger" onClick={() => cancelForm()}>Cancel</button>
              <button type="submit" className={`btn btn-success left-margin ${getDisabledClass()}`}>Save</button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductForm;
