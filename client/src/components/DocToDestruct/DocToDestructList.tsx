import React, { useState, Dispatch } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  IStateType,
  IDocDestructState,
} from "../../store/models/root.interface"; 
import { BootstrapTable, TableHeaderColumn , ExportCSVButton } from "react-bootstrap-table";
import { IAccount } from "../../store/models/account.interface";
import moment from "moment";
import {
	getDestructiveList,
	destructDocument
  } from "../../services/index";
  import {
  
	loadDocumentDescSheet
  } from "../../store/actions/docdestruct.action";
  import {  
	IProductDestructList
  } from "../../store/models/productDesctruct.interface";   
export type productListProps = {
  
  children?: React.ReactNode;
  docCategoryModificationStatus: any;
  allowDelete: boolean;
  selectedFieldsToDownload : any;
  onSelect:any
};

function DocCategoryList(props: productListProps): JSX.Element {
  const logSheet: IDocDestructState = useSelector(
    (state: IStateType) => state.docDestructData
  ); 

  const account: IAccount = useSelector((state: IStateType) => state.account);
   const {docDestructList = []} = logSheet; 

   const [selectedRowsForDestruct, setRowsForDestruct] = useState([]);
 
 
   const selectedSearchDates = logSheet.searchDates;
   const dispatch: Dispatch<any> = useDispatch();
   function handleExportCSVButtonClick(onClick:any)  {  
    onClick();
  }
  function createCustomExportCSVButton(onClick:any)  {
    return (
      <ExportCSVButton
        btnText='Down CSV'
        onClick={ () => handleExportCSVButtonClick(onClick) }/>
    );
  }
  
	function onClickProductSelected(cell: any, row: any, rowIndex: any) {
		if (props.onSelect) props.onSelect(row);
	}
  function buttonFormatter(
		cell: any,
		row: any,
		enumObject: any,
		rowIndex: any
	) {
		//const { status = "n-approved" } = row.document_info || {};
		const {
			docCategoryModificationStatus = 0,
			//currentUser: { roles },
			 
		} = props;
		//const loggedInUserRole = roles[0] ? roles[0] : "Developer";

		if (docCategoryModificationStatus === 0) {
			return (
				<>
					<button
						type="button"
						className="btn btn-border"			
            onClick={() => onClickProductSelected(cell, row, rowIndex)}		 
					>
				<i className="fas fa-redo"></i>
					</button>		 
				 
				</>
			);
		} else {
			return (
				<>-
					 
				</>
			);
		}
	}
  
  function createCustomExportCSVButton1 (onClick:any)   {
  return (
    <button style={ { color: 'red' } } onClick={ onClick }>Delete rows</button>
  );
} 
 
function convertRetentionExactDate(cell: any, row: any) {

	const {retension_time : {retension_exact_date=""}={}} = row;
	if(retension_exact_date !== ""){
		var date = new Date(retension_exact_date),
	  mnth = ("0" + (date.getMonth() + 1)).slice(-2),
	  day = ("0" + date.getDate()).slice(-2);
  
	return [date.getFullYear(), mnth, day].join("-");
	}
	  return "convertRetentionExactDate";
 
  }
 
  function checkStatus(cell: any, row: any) { 

	const {retension_time : {retension_exact_date="", retensionDateExtended="", status=""}={}} = row;
	
	var expDate = moment(new  Date(retension_exact_date),"DD/MM/YYYY");
    var CurrDate = moment(new Date(),"DD/MM/YYYY");
    if(status === "destructed"){
		return "Taken out for desctruction";	
	}else	 if(CurrDate > expDate){	
		 if(retensionDateExtended !== ""){
			return "EXTENDED";
		 }else{
			return "AWAITING";	
		 } 
	 }	else{
		return "-";	
	 } 	
  }

  function getDocType(cell: any, row: any) {
	const {document_type_details={}} = row;
	  if(document_type_details.name){
		return document_type_details.name;
	  }
	  return "-";
  }

  
  function convertRetentionExtentDate(cell: any, row: any) {
	const {retension_time : {retensionDateExtended=""}={}} = row;	
	if(retensionDateExtended !== ""){
		var date = new Date(retensionDateExtended),
	  mnth = ("0" + (date.getMonth() + 1)).slice(-2),
	  day = ("0" + date.getDate()).slice(-2);
  
	return [date.getFullYear(), mnth, day].join("-");
	}
	return "-"; 
  }
  function checkDestrucStatus(cell: any, row: any){

	const {retension_time : {status =""}} = row;	
	if(status === "Destructed"){
		return "Yes"
	}
	return "No";

  }
  function loadDocToDestruct() {
    const  {startDate,endDate } = selectedSearchDates
		const m = moment(startDate).startOf("day").toDate(); // moment(date).format('YYYY-MM-DD');
		getDestructiveList(account, {startDate :startDate , endDate :endDate }).then((items: IProductDestructList) => {
			dispatch(loadDocumentDescSheet(items));
		//	setDataLogSheetLoaded(true);
		});
	}
  function destructDoc( ){destructDocument( account, selectedRowsForDestruct).then((status) => {

	loadDocToDestruct();
		}); 
	 

	//setRowsForDestruct

  }



  function  createCustomButtonGroup(props : any) {
    return (
      <div className='my-custom-class'  >       
        <button type='button'
		 onClick={() => destructDoc()}
          className={ `btn btn-primary` }>
          Desctruct
        </button>
      </div>
    );
	}

	
 function handleRowSelect( row:any, isSelected:any, e:any){
	 

	  const {_id=""} =row;
	  let selectedRows :any = selectedRowsForDestruct;
	  if(isSelected){
		selectedRows.push(_id) 
		setRowsForDestruct(selectedRows);	  
	  }else{
		const index = selectedRows.indexOf(_id);
		if (index > -1) {
			selectedRows.splice(index, 1);
		}
		setRowsForDestruct(selectedRows);	
	  }
	 

	//setRowsForDestruct

  }

 

  return (
    <div className="portlet logsheet">
      <BootstrapTable  data={docDestructList} 
	   options={{ btnGroup : createCustomButtonGroup }}
       selectRow ={{ mode: 'checkbox',
	   onSelect: handleRowSelect,
	   clickToSelect: true,}}  >
        <TableHeaderColumn
					dataField="_id"
					isKey
					searchable={false}
					hidden={true}
				>
					ID
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="name"
					width="16%"
					className="thead-light-1"
				 
				>
					Name
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="name"
					width="16%"
					className="thead-light-1"
				 
				>
					Name
				</TableHeaderColumn>
				<TableHeaderColumn
			 
					className="thead-light-1"
					dataFormat={getDocType}
					width="10%"
				>
					Type
				</TableHeaderColumn>
					<TableHeaderColumn
					dataField="description"
					className="thead-light-1"
				 
					width="10%"
				>
					Decscrption
				</TableHeaderColumn>
				 
				<TableHeaderColumn
					dataField="retension_time.retension_exact_date"
					className="thead-light-1"
					dataFormat={convertRetentionExactDate}
					width="10%"
				>
					To be Destructed On
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="expiredate"
					className="thead-light-1"
					dataFormat={convertRetentionExtentDate}
					width="15%"
				>
					Doc timeline Extention
				</TableHeaderColumn>
				<TableHeaderColumn
					 
					className="thead-light-1" 
					width="15%"
				>
					Reason
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="expiredate"
					className="thead-light-1"
					dataFormat={checkStatus}
					width="10%"
				>
					Status
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="expiredate"
					className="thead-light-1"
					dataFormat={checkDestrucStatus}
					width="10%"
				>
					Destructed
				</TableHeaderColumn>
      
        
         <TableHeaderColumn
					dataField="button"
					dataFormat={buttonFormatter}
					className="thead-light-1"
					width="9%"
				>
					Action
				</TableHeaderColumn>


</BootstrapTable>
    </div>
  );
}

export default DocCategoryList;
