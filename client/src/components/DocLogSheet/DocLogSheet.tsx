import React, { Fragment, Dispatch, useState, useEffect } from "react";
import DocLogSheetList from "./DocLogSheetList";
import ProductForm from "./DocLogSheetForm";
import TopCard from "../../common/components/TopCard";
import "./DocLogSheet.css";
import { useDispatch, useSelector } from "react-redux";
import {
  IDocCategoryState,
  IStateType,
  IRootPageStateType,
} from "../../store/models/root.interface";
import Popup from "reactjs-popup";
import {
  loadDocumentLogSheet
} from "../../store/actions/doclogsheet.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  IProductList
} from "../../store/models/product.interface";
import { getLogSheet, updateDocCat } from "../../services/index";
import { IAccount } from "../../store/models/account.interface";
import { updateCurrentPath } from "../../store/actions/root.actions";
import DatePicker from "react-datepicker";
import CheckboxInput from "../../common/components/Checkbox";
import {
  OnChangeModel 
} from "../../common/types/Form.types";
import APP_CONST from "../../common/contant";
 
import moment, { Moment } from "moment";
import { values } from "lodash";

const Products: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const allowedUsers = ["Superadmin", "Developer", "Qualityuser"];
  const roles: any = useSelector((state: IStateType) => state.account.roles);
  let [userRole] = useState(roles[0] ? roles[0] : "Developer");
  const dispatch: Dispatch<any> = useDispatch();
  const doccategories: IDocCategoryState = useSelector(
    (state: IStateType) => state.docCategories
  );
  const path: IRootPageStateType = useSelector(
    (state: IStateType) => state.root.page
  );
  const [selectedFieldsToDownload, setSelectedFieldsToDownload] = useState(APP_CONST.EXPORT_CSV_COLUMN);


  useEffect(() => {    
    dispatch(updateCurrentPath("Home", "Log Sheet"));
  }, [path.area, dispatch]);
 

  const [dataLogSheetLoaded, setDataLogSheetLoaded] = useState(false);
 
  function setStartDate(date:any) { 
   
    const m = moment(date).startOf('day').toDate();// moment(date).format('YYYY-MM-DD');    
      setStartDateInfo(date);    
  }
  function setEnbDate(date:any) {
    const m = moment(date).startOf('day').toDate();// moment(date).format('YYYY-MM-DD');  
    setEndDateInfo(m);    
  }
  const [startDate, setStartDateInfo] = useState(new Date());
  const [endDate, setEndDateInfo] = useState(new Date());
 
  function hasRacksValueChanged(model: OnChangeModel): void { 
    const {field ="request_no",
    label= "Document title",
    name="request_no",    value=false,
    } = model;

    let fiueld = selectedFieldsToDownload;
  //  let fiueld = JSON.parse(JSON.stringify(selectedFieldsToDownload)); 

    

    const result = fiueld.filter(seleField => seleField.FIELD_VALUE); 
    if(!value){
      fiueld.map((selField:any)=>{
        if(selField.FIELD_LABEL === label && selField.FIELD_NAME === field){     
          selField.FIELD_VALUE = value;// value === 'false' ? false : true;
        }
      })
      setSelectedFieldsToDownload(JSON.parse(JSON.stringify(fiueld))); 
    }
    if(APP_CONST.ALLOWED_DOC_SHEET_FILED_TO_DOWNLOAD <= result.length){
      dispatch(
        addNotification(
          "Not Allowed",
          APP_CONST.ALLOWED_DOC_SHEET_FILED_TO_DOWNLOAD_MESSAGE + APP_CONST.ALLOWED_DOC_SHEET_FILED_TO_DOWNLOAD
        )
      );
    }else{
      fiueld.map((selField:any)=>{
        if(selField.FIELD_LABEL === label && selField.FIELD_NAME === field){     
          selField.FIELD_VALUE = value;// value === 'false' ? false : true;
        }
      })
      setSelectedFieldsToDownload(JSON.parse(JSON.stringify(fiueld))); 
    }

    
  }
  function addCheckBoxInput() {    
   return selectedFieldsToDownload.map((field) => {  
              return (
          <div className="col-3" key={"_"+field.FIELD_NAME} style={{"float":"left"}}>
            {" "}
            <CheckboxInput
              id="input_email"
              field={field.FIELD_NAME}
              onChange={hasRacksValueChanged}
              label={field.FIELD_LABEL}
              value={field.FIELD_VALUE}
              name={field.FIELD_NAME}
              disabled={false}
              customError={""}
            />
          </div>
        );
              });
    
  }

 function loadDocLogSheet(){
  const m = moment(startDate).startOf('day').toDate();// moment(date).format('YYYY-MM-DD');   
 

  let date2 = new Date(startDate).toDateString();
  date2 = moment(date2).format('YYYY-MM-DD');

  let date3 = new Date(endDate).toDateString();
  date3 = moment(date3).format('YYYY-MM-DD'); 
  setDataLogSheetLoaded(false)
  getLogSheet(account, {startDate : date2, endDate:date3}).then((items: IProductList =[]) => {
    dispatch(loadDocumentLogSheet(items));
    if(items.length > 0){
      setDataLogSheetLoaded(true)
    }    
  });
 }
  return (
    <Fragment>
      <h1 className="h5 mb-4 font-bold">Document Log Sheet</h1>     
      <div className="row">
      <div className="col-xl-12 col-lg-12">    
      <div className="card shadow mb-4">     
      <div className="card-body date-filter">
      <div className="card-title">
      <h1 className="h5 mb-4 font-bold">Load Log Sheet</h1>
      </div>
      <div className="col-xl-4 col-lg-4" style={{"float":"left"}}>
      <label>Start Date: </label>
      <DatePicker dateFormat="yyyy/MM/dd" selected={startDate} onChange={(date) => setStartDate(date)} />
      </div>
      <div className="col-xl-4 col-lg-4" style={{"float":"left"}}>
      <label>End Date: </label>
      <DatePicker dateFormat="yyyy/MM/dd" selected={endDate} onChange={(date) => setEnbDate(date)} />
      </div>
      <div className="col-xl-3 col-lg-3 logsheet-btn" style={{"float":"left"}}>
      
       <button  type="button"
                  className="btn btn-primary"      
                  onClick={()=>loadDocLogSheet()}           
                >
                  Load Sheet
                </button>
      </div>
 
      </div>
      
      
   
     
      </div>
    
      </div>  { dataLogSheetLoaded &&
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4" id="saasd">

          <div className="card-body" id="saaswerd">
      <div className="card-title">
      <h1 className="h5 mb-4 font-bold">Selec CSV Fields to Download</h1>
      </div>
      <div className="checkbox-conatiner">
        {addCheckBoxInput()}

       </div>

       
      </div>
            <div className="card-body" style={{height: "900px"}}>
              <DocLogSheetList
                
                allowDelete={allowedUsers.includes(userRole)}
                docCategoryModificationStatus={doccategories.modificationState}
                selectedFieldsToDownload={selectedFieldsToDownload}
              />
            </div>
          </div>
        </div> }
      </div>

     
    </Fragment>
  );
};

export default Products;
