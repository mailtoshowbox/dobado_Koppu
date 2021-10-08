import React, { Fragment, Dispatch, useState, useEffect } from "react";
import DocToDestructList from "./DocToDestructList";
import ProductForm from "./DocToDestructForm";
import TopCard from "../../common/components/TopCard";
import "./DocToDestruct.css";
import { useDispatch, useSelector } from "react-redux";
import {
	IDocDestructState,
	IStateType,
	IRootPageStateType,
} from "../../store/models/root.interface";
import Popup from "reactjs-popup";
import {
	loadDocumentDescSheet,
	changeSelectedDocForDestruct,
	setModificationState,
} from "../../store/actions/docdestruct.action";

import { addNotification } from "../../store/actions/notifications.action";
import {
	IProductDestructList,
	ProductDestructModificationStatus,
} from "../../store/models/productDesctruct.interface";
import { getDestructiveList, updateDocCat } from "../../services/index";
import { IAccount } from "../../store/models/account.interface";
import { updateCurrentPath } from "../../store/actions/root.actions";
import DatePicker from "react-datepicker";
import CheckboxInput from "../../common/components/Checkbox";
import { OnChangeModel } from "../../common/types/Form.types";
import APP_CONST from "../../common/contant";

import moment, { Moment } from "moment";

const Products: React.FC = () => {
	const account: IAccount = useSelector((state: IStateType) => state.account);
	const allowedUsers = ["Superadmin", "Developer", "Qualityuser"];
	const roles: any = useSelector((state: IStateType) => state.account.roles);
	let [userRole] = useState(roles[0] ? roles[0] : "Developer");
	const dispatch: Dispatch<any> = useDispatch();
	const docDestructData: IDocDestructState = useSelector(
		(state: IStateType) => state.docDestructData
	);
	const [startDate, setStartDateInfo] = useState(new Date());
	const [endDate, setEndDateInfo] = useState(new Date());

	const path: IRootPageStateType = useSelector(
		(state: IStateType) => state.root.page
	);
	const [selectedFieldsToDownload, setSelectedFieldsToDownload] = useState(
		APP_CONST.EXPORT_CSV_COLUMN
	);

	useEffect(() => {
		dispatch(updateCurrentPath("Home", "Log Sheet"));
	}, [path.area, dispatch]);

	const [dataLogSheetLoaded, setDataLogSheetLoaded] = useState(false);

	function setStartDate(date: any) {
		const m = moment(date).format('YYYY-MM-DD'); //moment(date).startOf("day").toDate(); // moment(date).format('YYYY-MM-DD');
		setStartDateInfo(date);
	}
	function setEnbDate(date: any) {
		const m = moment(date).format('YYYY-MM-DD'); // moment(date).startOf("day").toDate(); // moment(date).format('YYYY-MM-DD');
		setEndDateInfo(date);
	}

 

	function loadDocToDestruct() {
		const m = moment(startDate).startOf("day").toDate(); // moment(date).format('YYYY-MM-DD');
		getDestructiveList(account, {startDate :startDate , endDate :endDate }).then((items: IProductDestructList) => {
			dispatch(loadDocumentDescSheet(items));
			setDataLogSheetLoaded(true);
		});
	}

	function onProductSelect(product: any): void {
		dispatch(changeSelectedDocForDestruct(product));
		dispatch(setModificationState(ProductDestructModificationStatus.None));
		dispatch(setModificationState(ProductDestructModificationStatus.Edit));
	}

	return (
		<Fragment>
			<h1 className="h5 mb-4 font-bold">Destruct Document List</h1>
			{/* <p className="mb-4 font-14">Document Category here</p> */}

			<div className="row">
				<div className="col-xl-12 col-lg-12">
					<div className="card shadow mb-4">
						<div className="card-body date-filter">
							<div className="card-title">
								<h1 className="h5 mb-4 font-bold">
									Load Destruct Document List
								</h1>
							</div>
							<div className="col-xl-4 col-lg-4" style={{ float: "left" }}>
							<label>Start Date: </label>
								<DatePicker
									dateFormat="yyyy/MM/dd"
									selected={startDate}
									onChange={(date) => setStartDate(date)}
								/>
							</div>
							<div className="col-xl-4 col-lg-4" style={{ float: "left" }}>
							<label>End Date: </label>
								<DatePicker
									dateFormat="yyyy/MM/dd"
									selected={endDate}
									onChange={(date) => setEnbDate(date)}
								/>
							</div>
							<div className="col-xl-4 col-lg-4 logsheet-btn" style={{ float: "left" }}>
								<button
									type="button"
									className="btn btn-primary"
									onClick={() => loadDocToDestruct()}
								>
									Load List
								</button>
							</div>
						</div>
					</div>
          {docDestructData.modificationState ===
              ProductDestructModificationStatus.Create ||
            (docDestructData.modificationState ===
              ProductDestructModificationStatus.Edit &&
              docDestructData.selectedDocForDestruct) ? (
              <ProductForm />
            ) : null}
				</div>
				<div className="col-xl-12 col-lg-12">
					<div className="card shadow mb-4">
						<div className="card-body">
							<DocToDestructList
								onSelect={onProductSelect}
								allowDelete={allowedUsers.includes(userRole)}
								docCategoryModificationStatus={docDestructData.modificationState}
								selectedFieldsToDownload={selectedFieldsToDownload}
							/>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Products;
