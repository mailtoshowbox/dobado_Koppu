import React, { useState, FormEvent, Dispatch, Fragment } from "react";
import {
  IStateType,
  IDocCategoryState,IDocDestructState
} from "../../store/models/root.interface";
import { useSelector, useDispatch } from "react-redux";
import {
  IProductDestructList,
  ProductDestructModificationStatus,
  IProductDestruct,
} from "../../store/models/productDesctruct.interface";     
import TextInput from "../../common/components/TextInput";
import {
 
  setModificationState,
 
} from "../../store/actions/docdestruct.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  addNewDocCat,
  updateDoc,
  getDocCategoryList,
} from "../../services/index";
import {
  OnChangeModel,   
  IDocCategoryFormState,IDocDesctFormState
} from "../../common/types/Form.types";
import { IAccount } from "../../store/models/account.interface";
import SelectInput from "../../common/components/Select";
import DatePicker from "react-datepicker";
 
import moment from "moment";
const DocToDestructForm: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);

  const dispatch: Dispatch<any> = useDispatch();
  const logSheet: IDocDestructState = useSelector(
    (state: IStateType) => state.docDestructData
  ); 
  let docDesc: any = logSheet.selectedDocForDestruct;
  const isCreate: boolean =
  logSheet.modificationState === ProductDestructModificationStatus.Create;



  const [formState, setFormState] = useState({
    _id: { error: "", value: docDesc._id },
    name: { error: "", value: docDesc.name } ,    
    status: { error: "", value: docDesc.retension_time.status } ,
    retensionDateActual: { error: "", value: docDesc.retension_time.retension_exact_date } ,
    retensionDateExtended: { error: "", value: docDesc.retension_time.retension_extended_date } ,    
   
  }); //    retension_time : {error: "", value: docDesc.retension_time }

  const [listOfStatus] = useState([
    {'id':"1", name:'AWAITING'},
    {'id':"2", name:'taken out for destruction'},
    {'id':"3", name:'EXTENDED'},
  ]);

  function setStartDate(date:any) { 
   
    const m = moment(date).startOf('day').toDate();// moment(date).format('YYYY-MM-DD');    
  
      setFormState({
        ...formState,
        ['retensionDateExtended']: { error: '', value:date },
      });
  }

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
 
    let modeOfAction: String =  "EDIT";
   saveForm(formState,  modeOfAction);
  }

  function saveForm(
    formState: any,  
    mode: String
  ): void {    
    if (docDesc) {
        let boxInfoUpt = {
          id: formState._id.value,
          retension_time : {
            ...docDesc.retension_time,
            status : formState.status.value,
            retensionDateExtended : formState.retensionDateExtended.value
          }
        };       
        updateDoc(boxInfoUpt, account).then((status) => {	dispatch(
						addNotification(
							"Extention ",
							`Docuemnt ${formState.name.value} edited by you`
						)
					);
          dispatch(setModificationState(ProductDestructModificationStatus.None));
				});   
    }
  } 

  function cancelForm(): void {
    dispatch(setModificationState(ProductDestructModificationStatus.None));
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
              Document { formState.name.value}
            </h6>
          </div>
          <div className="card-body">
            <form onSubmit={saveUser}>
            <div className="form-group row">
  
                <div className="form-group col-md-6">
                <TextInput
                  id="input_description"
                  field="description"
                  value={formState.retensionDateActual.value}
                  onChange={hasFormValueChanged}
                  required={false}
                  disabled={true}
                  maxLength={100}
                  label="Retenstion Date"
                  placeholder="Retenstion Date"
                  customError={formState.retensionDateActual.error}
                />
                	</div>
                	</div>
                  <div className="form-group row">
                  <div className="form-group col-md-6">
        Start Date
      <DatePicker dateFormat="yyyy/MM/dd"  selected={formState.retensionDateExtended.value}  onChange={(date) => setStartDate(date)} />
      </div>
      </div>
                 
             {/*  <div className="form-group font-14">
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
              </div> */}

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

export default DocToDestructForm;
