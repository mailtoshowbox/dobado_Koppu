import React, { Fragment, Dispatch, useState, useEffect } from "react";
import AuditLogList from "./AuditLogList";
import "./AuditLog.css";
import { useDispatch, useSelector } from "react-redux";
import {
	IAuditLogState,
	IStateType,
	IRootPageStateType,
} from "../../store/models/root.interface";

import { loadAuditLog } from "../../store/actions/auditlog.action";
import {
	IAuditLog,
	IAuditLogList,
} from "../../store/models/auditLog.interface";
import { getAuditLog } from "../../services/index";
import { IAccount } from "../../store/models/account.interface";
import { updateCurrentPath } from "../../store/actions/root.actions";
import DatePicker from "react-datepicker";
import APP_CONST from "../../common/contant";


import moment from "moment";

const Products: React.FC = () => {
	const account: IAccount = useSelector((state: IStateType) => state.account);
	const allowedUsers = ["Superadmin", "Developer", "Qualityuser"];
	const roles: any = useSelector((state: IStateType) => state.account.roles);
	let [userRole] = useState(roles[0] ? roles[0] : "Developer");
	const dispatch: Dispatch<any> = useDispatch();
	const docList: IAuditLogState = useSelector(
		(state: IStateType) => state.auditLogList
	);
	const path: IRootPageStateType = useSelector(
		(state: IStateType) => state.root.page
	);

	useEffect(() => {
		dispatch(updateCurrentPath("Home", "Log Sheet"));
	}, [path.area, dispatch]);

	const [startDate, setStartDateInfo] = useState(new Date());
	const [endDate, setEndDateInfo] = useState(new Date());
	const [isLogLoaded, setLogLoaded] = useState(false);
	function setStartDate(date: any) {
		const m = moment(date).startOf("day").toDate(); // moment(date).format('YYYY-MM-DD');
		setStartDateInfo(date);
	}
	function setEnbDate(date: any) {
		const m = moment(date).startOf("day").toDate(); // moment(date).format('YYYY-MM-DD');
		setEndDateInfo(m);
	}

	function convertDate(retensionDateExtended:any) {
	 
		if(retensionDateExtended !== ""){
			var date = new Date(retensionDateExtended),
		  mnth = ("0" + (date.getMonth() + 1)).slice(-2),
		  day = ("0" + date.getDate()).slice(-2);
	  
		return [date.getFullYear(), mnth, day].join("-");
		}
		return "-"; 
	  }
	function loadAuditLogList() {
		const m = moment(startDate).startOf("day").toDate(); // moment(date).format('YYYY-MM-DD');

		let date2 = new Date(startDate).toDateString();
		date2 = moment(date2).format("YYYY-MM-DD");

		let date3 = new Date(endDate).toDateString();
		date3 = moment(date3).format("YYYY-MM-DD");
 
		getAuditLog(account, { startDate: date2, endDate: date3 }).then(
			(items: IAuditLogList) => {
				let constructedList:any = [];
				items.map((log:any)=>{

					const {document_info:{updatedBy=[], createdOn=""}={}} = log;
					const doc_CretedDate = convertDate(createdOn); 
			
					if(updatedBy.length > 0){
						let ar:any = {};
						APP_CONST.EXPORT_PDF_COLUMN_AUDIT_LOG.forEach((elt)=> {
							let fieldName = elt.FIELD_NAME					
							if(fieldName ==='document_category_details'){
								const {document_category_details:{name=""}={}} = log;
								ar[fieldName] = name;
							}else if(fieldName ==='updatedBy'){					
								ar[fieldName] = "-";
							}else if(fieldName ==='createdOn'){					 
								ar[fieldName] = doc_CretedDate;
							}else if(fieldName ==='updatedOn'){
								ar[fieldName] = "-"
							}else{					
								ar[fieldName] = log[fieldName];										
							}
						})
						constructedList.push(ar);
			
						updatedBy.forEach((updxatedLog:any)=>{
							let ar:any = {};
							const {name="", updatedOn=""} = updxatedLog;
							APP_CONST.EXPORT_PDF_COLUMN_AUDIT_LOG.forEach((elt)=> {
								let fieldName = elt.FIELD_NAME					
								if(fieldName ==='document_category_details'){
									const {document_category_details:{name=""}={}} = log;
									ar[fieldName] = name;
								}else if(fieldName ==='updatedBy'){
									
									ar[fieldName] = name;
								}else if(fieldName ==='createdOn'){					 
									ar[fieldName] = doc_CretedDate;
								}else if(fieldName ==='updatedOn'){
									ar[fieldName] = convertDate(updatedOn);;
								}else{
									if(fieldName === 'name'){
										ar[fieldName] = "       -" ;
									}else{
										ar[fieldName] = log[fieldName];
									}						
								}
							})
							constructedList.push(ar);
						});
			
					}else{
						let ar:any = {};
						APP_CONST.EXPORT_PDF_COLUMN_AUDIT_LOG.forEach((elt)=> {
							let fieldName = elt.FIELD_NAME					
							if(fieldName ==='document_category_details'){
								const {document_category_details:{name=""}={}} = log;
								ar[fieldName] = name;
							}else if(fieldName ==='updatedBy'){					
								ar[fieldName] = log.name;
							}else if(fieldName ==='createdOn'){					 
								ar[fieldName] = doc_CretedDate;
							}else if(fieldName ==='updatedOn'){
								ar[fieldName] = "-"
							}else{					
									ar[fieldName] = log[fieldName];										
							}
						})
						constructedList.push(ar);
					} 
				}) 
				if(constructedList.length > 0){
					setLogLoaded(true);
				}
				dispatch(loadAuditLog(constructedList));		 
			}
		);
	}

	return (
		<Fragment>
			<h1 className="h5 mb-4 font-bold">Document Audit Log</h1>
			{/* <p className="mb-4 font-14">Document Category here</p> */}
		
			<div className="row">
				<div className="col-xl-12 col-lg-12">
					<div className="card shadow mb-4">
						<div className="card-body date-filter">
							<div className="card-title">
								<h1 className="h5 mb-4 font-bold">Audit Log</h1>
							</div>
							<div className="col-xl-4 col-lg-4" style={{ float: "left" }}>
								<label>Start Date:</label>
								<DatePicker
									dateFormat="yyyy/MM/dd"
									selected={startDate}
									onChange={(date) => setStartDate(date)}
								/>
							</div>
							<div className="col-xl-4 col-lg-4" style={{ float: "left" }}>
							<label>End Date:</label>
								<DatePicker
									dateFormat="yyyy/MM/dd"
									selected={endDate}
									onChange={(date) => setEnbDate(date)}
								/>
							</div>
							<div className="col-xl-4 col-lg-4 audit-btn" style={{ float: "left" }}>
								<button
									type="button"
									className="btn btn-primary"
									onClick={() => loadAuditLogList()}
								>
									Load Sheet
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="col-xl-12 col-lg-12">
					<div className="card shadow mb-4">
						<div className="card-body">
							<div className="card-title">
							 
							</div>
						</div>
						<div className="card-body" id="YUSUFF">
							<AuditLogList
							logLoaded ={isLogLoaded} 
							/>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Products;
