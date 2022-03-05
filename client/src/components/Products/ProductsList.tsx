import React, { useState } from "react";
import { useSelector } from "react-redux";
import { IStateType, IProductState } from "../../store/models/root.interface";
import { IProduct } from "../../store/models/product.interface";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import TextInput from "../../common/components/TextInput";
import SelectInput from "../../common/components/Select";
import {
	OnChangeModel
} from "../../common/types/Form.types";
import APP_CONST from "../../common/contant";


export type productListProps = {
	onSelect?: (product: IProduct) => void;
	productModificationStatus: any;
	onSelectDelete?: (box: IProduct) => void;
	currentUser: any;
	allowDelete: boolean;
	children?: React.ReactNode;
	loadInitialSearchData?: any;
};

function ProductList(props: productListProps): JSX.Element {
	const products: IProductState = useSelector(
		(state: IStateType) => state.products
	);
	const productsTemp: IProductState = useSelector(
		(state: IStateType) => state.products
	);

	const pageProductsTemp = productsTemp.products;
	const [pageProducts, setpageProducts] = useState(pageProductsTemp);
	function convertDate(str: Date) {
		if (str === null) {
			return "-";
		}
		var date = new Date(str),
			mnth = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2);
		return [date.getFullYear(), mnth, day].join("-");
	}
	const dCat = APP_CONST.DOC_REQUEST_DOC_TYPE.CATEGORY;
	function onClickProductSelected(cell: any, row: any, rowIndex: any) {
		if (props.onSelect) props.onSelect(row);
	}
	function onClickProductDelete(cell: any, row: any, rowIndex: any) {
		if (props.onSelectDelete) props.onSelectDelete(row);
	}

	function dataFormatter(documentName: string, row: any) {

		const {
			// productModificationStatus = 0,
			currentUser: { roles = [] },
			// allowDelete = false,
		} = props;
		const { status = "n-approved" } = row.document_info || {};
		const loggedInUserRole = roles[0] ? roles[0] : "Developer";
		const { isRequestedDocument = false, takeout_requested_details: { current_status: { request_no = "XXXXXX" } = {} } = {} } = row;
		return (
			<>
				{!isRequestedDocument && status === "n-approved" && loggedInUserRole === "Qualityuser" ? (
					<div>
						<span>{documentName}</span>
						<span
							style={{ padding: "6px 8px 6px 10px", margin: "2% 4% 2% 3%" }}
							className="blink_me"
						>
							New
						</span>
					</div>
				) : (
					<span>{documentName}</span>
				)}
				{row.batch && row.batch.length > 2 && (
					<span style={{ color: "dodgerblue " }}>
						<br />
						Batch : {row.batch}
					</span>
				)}

				{row.docStatus && row.docStatus === "destroyed" && (
					<span style={{ color: "dodgerblue " }}>
						<br />
						(To be Destroyed)
					</span>
				)}


				{row.is_requested_for_takeout && (
					<span style={{ color: "dodgerblue " }}>
						<br />
						<b>	Document requested for Takeout({request_no}) </b>
					</span>
				)}
			</>
		);
	}

	function buttonFormatter(
		cell: any,
		row: any,
		enumObject: any,
		rowIndex: any
	) {
		//const { status = "n-approved" } = row.document_info || {};
		const {
			productModificationStatus = 0,
			//currentUser: { roles },
			allowDelete = false,
		} = props;
		//const loggedInUserRole = roles[0] ? roles[0] : "Developer";

		if (productModificationStatus === 0) {
			return (
				<>
					<button
						type="button"
						className="btn btn-border"
						onClick={() => onClickProductSelected(cell, row, rowIndex)}
					>
						<i className="fas fa fa-pen"></i>
					</button>
					{/* {status === "n-approved" && loggedInUserRole === "Qualityuser" && (
            <span
              style={{ padding: "6px 8px 6px 10px", margin: "2% 4% 2% 3%" }}
              className="badge  badge-danger"
            >
              New
            </span>
          )} */}
					{/* {allowDelete && (
						<button
							className="btn btn-border  btn-red-color"
							onClick={() => onClickProductDelete(cell, row, rowIndex)}
						>
							<i className="fas fa fa-trash" aria-hidden="true"></i>
						</button>
					)} */}
				</>
			);
		} else {
			return (
				<>
					<button
						type="button"
						className="btn btn-border"
						disabled
						style={{ cursor: "not-allowed" }}
					>
						<i className="fas fa fa-pen"></i>
					</button>
					{/* {status === "n-approved" && loggedInUserRole === "Qualityuser" && (
            <span
              style={{ padding: "6px 8px 6px 10px", margin: "2% 4% 2% 3%" }}
              className="badge  badge-danger"
            >
              New
            </span>
          )} */}
					{/* <button
						className="btn btn-border  btn-red-color"
						onClick={() => onClickProductDelete(cell, row, rowIndex)}
					>
						<i className="fas fa fa-trash" aria-hidden="true"></i>
					</button> */}
				</>
			);
		}
	}
	/* BLock for Search DDocument */
	const intialSearchDocParam = {
		search_desc: { error: "", value: "" },
		search_doc_type: { error: "", value: "" },
		search_doc_name: { error: "", value: "" },
		search_doc_num: { error: "", value: "" },
		ref_no: { error: "", value: "" }
	};
	const [isSearchTriggered, setSearchTriggered] = useState(false);
	function loadDocumentforTakeOut() {
		setSearchTriggered(true);
		let temp: any = pageProductsTemp;
		if (searchDocParam.search_doc_num.value !== '') {
			temp = temp.filter((x: any) => x.document_no.includes(searchDocParam.search_doc_num.value.trim()));
		}
		if (searchDocParam.search_doc_name.value !== '') {
			temp =  temp.filter((x: any) => x.name.includes(searchDocParam.search_doc_name.value.trim())); 
		}
		if (searchDocParam.ref_no.value !== '') {
			let newtemp: any = [];
			temp.forEach((element: any) => {
				const { document_request_info: { document_request_no = 0 } = {} } = element;
				if (document_request_no === searchDocParam.ref_no.value.trim()) {
					newtemp.push(element);
				}
			});
			//if (newtemp.length > 0) {
				temp = newtemp;
			//}
		}
		if (searchDocParam.search_desc.value !== '') {
			temp = temp.filter((x: any) => x.description.includes(searchDocParam.search_desc.value.trim()));
		} 
		if (searchDocParam.search_doc_type.value !== '') {
			let newtemp: any = [];
			temp.forEach((element: any) => {
				const { document_request_info: { document_request_doc_type: { id = 0 } = {} } = {} } = element;
				if (id === searchDocParam.search_doc_type.value.trim()) {
					newtemp.push(element);
				}
			});
			//if (newtemp.length > 0) {
				temp = newtemp;
			//}
		}
		setpageProducts(temp);
	}

	const [searchDocParam, setSearchDocParam] = useState(intialSearchDocParam);
	function referenceNumberFortakeOutChanged(model: OnChangeModel): void {
		setSearchDocParam({
			...searchDocParam,
			[model.field]: { error: model.error, value: model.value },
		});
	}
	function loadInitialSearchData() {
		setSearchTriggered(false);
		setSearchDocParam(intialSearchDocParam);
	//	setpageProducts([]);
		if (props.loadInitialSearchData) props.loadInitialSearchData();
	} 
 
 
	const finalProducts = (pageProducts!== undefined && pageProducts.length > 0  ) || isSearchTriggered ? pageProducts : products.products;
 
	
	const options = {
		clearSearch: true,
	};
	return (
		<div className="portlet">
			<div className="dynamic-request-form">
				<div className="row">
					<div className="col-md-2">
						<TextInput
							id="input_request_no"
							field="ref_no"
							value={searchDocParam.ref_no.value ? searchDocParam.ref_no.value : ""}
							onChange={referenceNumberFortakeOutChanged}
							required={false}
							maxLength={100}
							label=""
							placeholder="Request No"
							customError={""}
						/>
					</div>
					<div className="col-md-2">
						<TextInput
							id="input_request_no"
							field="search_doc_num"
							value={searchDocParam.search_doc_num.value ? searchDocParam.search_doc_num.value : ""}
							onChange={referenceNumberFortakeOutChanged}
							required={false}
							maxLength={100}
							label=""
							placeholder="DC No"
							customError={""}
						/>
					</div>
					<div className="col-md-2">
						<TextInput
							id="input_request_no"
							field="search_doc_name"
							value={searchDocParam.search_doc_name.value ? searchDocParam.search_doc_name.value : ""}
							onChange={referenceNumberFortakeOutChanged}
							required={false}
							maxLength={100}
							label=""
							placeholder="DC Name"
							customError={""}
						/>
					</div>
					<div
						className={"col-md-2 "
						}
					>
						<SelectInput
							id="input_document_type"
							field="search_doc_type"
							label={""}
							options={dCat}
							required={false}
							onChange={referenceNumberFortakeOutChanged}
							value={searchDocParam.search_doc_type.toString()}
							type="select"
							customError={""}
						/>
					</div>
					<div className="col-md-2">
						<TextInput
							id="input_request_no"
							field="search_desc"
							value={searchDocParam.search_desc.value ? searchDocParam.search_desc.value : ""}
							onChange={referenceNumberFortakeOutChanged}
							required={false}
							maxLength={100}
							label=""
							placeholder="Description"
							customError={""}
						/>
					</div>


					<div
						className="col-md-2"
						style={{ marginTop: "2%" }}
					>
						<div
							onClick={(e) => loadInitialSearchData()}
							className={`btn btn-success left-margin font-14`}
						>
							<i className="fas fa-sync-alt"></i>

						</div>
						<div
							onClick={(e) => loadDocumentforTakeOut()}
							className={`btn btn-success left-margin font-14  }`}
						>
							<i className="fas fa-search"></i>
						</div>
					</div>



				</div>
			</div>
			<BootstrapTable
				options={options}
				data={finalProducts}
				pagination={true}
				hover={true}
				search={true}
			>
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
					dataFormat={dataFormatter}
				>
					Name
				</TableHeaderColumn>

				<TableHeaderColumn
					dataField="category"
					className="thead-light-1"
					width="16%"
				>
					Compactor
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="box"
					className="thead-light-1"
					width="14%"
				>
					Rack system
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="document_type"
					className="thead-light-1"
					width="14%"
				>
					Type
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="qr_code"
					className="thead-light-1"
					width="10%"
				>
					QR Code
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="type_of_space"
					className="thead-light-1"
					width="10%"
				>
					Type of space
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="manufacturedate"
					className="thead-light-1"
					dataFormat={convertDate}
					width="10%"
				>
					M Date
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="expiredate"
					className="thead-light-1"
					dataFormat={convertDate}
					width="10%"
				>
					E Date
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

export default ProductList;
