import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import { IStateType, IBoxState } from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
 
import TextInput from "../../common/components/TextInput";
import { editBox, clearSelectedBox, setModificationState, addBox } from "../../store/actions/box.action";
import { addNotification } from "../../store/actions/notifications.action";
import NumberInput from "../../common/components/NumberInput";
import {  addNewBox, updateBox  } from "../../services/index"; 

import { OnChangeModel, IBoxFormState } from "../../common/types/Form.types";
import { BoxModificationStatus, IBox } from "../../store/models/box.interface";

const BoxForm: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const boxes: IBoxState | null = useSelector((state: IStateType) => state.boxes);
  let box: IBox | null = boxes.selectedBox;
  const isCreate: boolean = (boxes.modificationState === BoxModificationStatus.Create);
  
  if (!box || isCreate) {
    box = { _id: "", name: "111", description: "22",racks: 40  };
  }

  const [formState, setFormState] = useState({
    _id: { error: "", value: box._id },
    name: { error: "", value: box.name },
    description: { error: "", value: box.description }    ,
    racks: { error: "", value: box.racks }    
  });

  function hasFormValueChanged(model: OnChangeModel): void {
    console.log("model---",model);
    setFormState({ ...formState, [model.field]: { error: model.error, value: model.value } });
  }

  function saveUser(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault(); 
    if (!isFormInvalid()) {
       return;
    }

    let saveUserFn: Function = (isCreate) ? addBox : editBox;
    let modeOfAction: String = (isCreate) ? "ADD": "EDIT";
    saveForm(formState, saveUserFn, modeOfAction);
  }

  function saveForm(formState: IBoxFormState, saveFn: Function, mode: String): void {
    if (box) {
              if(mode === 'ADD'){
          let boxInfo  ={
            "name": formState.name.value,
            "description": formState.description.value,
            "racks": formState.racks.value };
          addNewBox(boxInfo)
          .then((status) => {   
                dispatch(saveFn({
                  ...box,
                 ...status              
                }));      
                dispatch(addNotification("New Box added", `Box ${formState.name.value} added by you`));
                dispatch(clearSelectedBox());
                dispatch(setModificationState(BoxModificationStatus.None));  
          })
        }else if(mode === 'EDIT'){ 
          let boxInfoUpt  ={
           "id": formState._id.value,
            "name": formState.name.value,
            "description": formState.description.value,
            "racks": formState.racks.value };
          updateBox(boxInfoUpt)
          .then((status) => {    
                dispatch(saveFn({
                  ...box,
                 ...status              
                }));      
                dispatch(addNotification("Box ", `New Box ${formState.name.value} edited by you`));
                dispatch(clearSelectedBox());
                dispatch(setModificationState(BoxModificationStatus.None));  
          })
        }            
    }
  }
  function cancelForm(): void {
    dispatch(setModificationState(BoxModificationStatus.None));
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
      <div className="col-xl-12 col-lg-12">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-green">Box {(isCreate ? "create" : "edit")}</h6>
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
              
              <div className="form-group">
                <NumberInput id="input_ract"
                field = "racks"
                  value={formState.racks.value}
                  onChange={hasFormValueChanged}   
                  label="No of Racks"
                />
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

export default BoxForm;
