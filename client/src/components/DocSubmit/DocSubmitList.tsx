import React, {useState} from "react";
import { useSelector } from "react-redux";
import { IStateType, IProductState } from "../../store/models/root.interface";
import { IProduct } from "../../store/models/product.interface";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import {
	OnChangeModel,
	IProductFormState,
} from "../../common/types/Form.types";

import TextInput from "../../common/components/TextInput";
export type productListProps = {
	onSelect?: (product: IProduct) => void;
	productModificationStatus: any;
	onSelectDelete?: (box: IProduct) => void;
	currentUser: any;
	allowDelete: boolean;
	children?: React.ReactNode;
};

function ProductList(props: productListProps): JSX.Element {
	const products: IProductState = useSelector(
		(state: IStateType) => state.products
	);
	const [tempProducts, setSearchFilterParam] = useState(products.products);
	function convertDate(str: Date) {
		if (!str) return "-";
		var date = new Date(str),
			mnth = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2);

		return [date.getFullYear(), mnth, day].join("-");
	}

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
		return (
			<>
				{status === "n-approved" && loggedInUserRole === "Qualityuser" ? (
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
					{allowDelete && (
						<button
							className="btn btn-border  btn-red-color"
							onClick={() => onClickProductDelete(cell, row, rowIndex)}
						>
							<i className="fas fa fa-trash" aria-hidden="true"></i>
						</button>
					)}
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
					<button
						className="btn btn-border  btn-red-color"
						onClick={() => onClickProductDelete(cell, row, rowIndex)}
					>
						<i className="fas fa fa-trash" aria-hidden="true"></i>
					</button>
				</>
			);
		}
	}

	function document_request_format_dpet_name(cell: any, row: any, field: any) {
		if (
			row.isRequestedDocument &&
			row.document_request_info.document_request_department
		) {
			return row.document_request_info.document_request_department[field]
				? row.document_request_info.document_request_department[field]
				: "-";
		} else {
			return "-";
		}
		/* )
    
    
    () (
      <>
      { row.document_request_info.document_request_department[field] ?  row.document_request_info.document_request_department[field] : "-"}
      </>
    ); */
	}
	function document_request_format_doctype_name(
		cell: any,
		row: any,
		field: any
	) {
		const {
			document_request_info: { document_request_doc_type = {} } = {},
			is_requested_for_takeout = false,
			takeout_requested_details: { current_status: { label = "" } = {} } = {},
		} = row;
		const { name = "Not Available" } = document_request_doc_type;

		if (is_requested_for_takeout) {
			return (
				<div>
					{name}/<b>Takeout Status:</b>
					{label}
				</div>
			);
		} else {
			return <div>{name}</div>;
		}
	}
	function document_request_format_doctype_cate(
		cell: any,
		row: any,
		field: any
	) {
		const {
			document_type_details: { name = '' } = {},
		 } = row;
	 

	 
			return (
				<div>
					{name} 
				</div>
			);
		 
	}

	function document_request_format_gen_name(
		cell: any,
		row: any,
		field: any
	) {
		const {
			document_request_info: { document_issued_by = "N?A" } = {},
			is_requested_for_takeout = false,
			takeout_requested_details: { current_status: { label = "" } = {} } = {},
		} = row;
 

		
			return <div>{document_issued_by}</div>;
		
	}


	function document_request_format(cell: any, row: any, field: any, field2: any) {
		 
		const {
			takeout_requested_details: {
				current_status: { request_no = "XXXXXX" } = {},
			} = {},
		} = row;

		if (row.is_requested_for_takeout) {
			return <>{request_no}</>;
		} else {
			return (
				<>
					{row.document_request_info
						? row.document_request_info[field]
							? row.document_request_info[field]
							: ""
						: ""}
				</>
			);
		}
	}
 
 

 

	const options = {
		clearSearch: true
	};

		/* BLock for Search DDocument */
		const intialSearchDocParam = {
			search_desc: { error: "", value: ""},
			search_doc_type: { error: "", value: ""},
			search_doc_name: { error: "", value: ""},
			search_doc_num: { error: "", value: ""},
			ref_no: { error: "", value: ""} 
		};
	 
	
		const [searchDocParam, setSearchDocParam] = useState(intialSearchDocParam);
	
		function referenceNumberFortakeOutChanged(model: OnChangeModel): void {
			setSearchDocParam({
				...searchDocParam,
				[model.field]: { error: model.error, value: model.value },
			});
		}
		function loadDocumentforTakeOut() {
			let temp:any=[];
			//let temp = products.filter(x=>x.name===searchDocParam.search_doc_name.value);
			if(searchDocParam.search_doc_name.value!==''){
				 temp = tempProducts.filter((x:any)=>x.name===searchDocParam.search_doc_name.value);
				 setSearchFilterParam(temp);
			}
			if(searchDocParam.search_doc_num.value!==''){
				temp = tempProducts.filter((x:any)=>x.document_no===searchDocParam.search_doc_num.value);
				setSearchFilterParam(temp);
		   }
		   if(searchDocParam.search_desc.value!==''){
				temp = tempProducts.filter((x:any)=>x.description===searchDocParam.search_desc.value);
				setSearchFilterParam(temp);
	   		}

			 console.log("ARUN UPADTE YOUR LOGIC her to Filter the  products", temp);

			 console.log("intialSearchDocParam---", searchDocParam.search_doc_name.value);
		}
	return (
		<div className="portlet">

<div className="dynamic-request-form">
										<div className="row">
											<div className="col-md-2">
												<TextInput
													id="input_request_no"
													field="ref_no"
													value={searchDocParam.ref_no.value ? searchDocParam.ref_no.value  : ""}
													onChange={referenceNumberFortakeOutChanged}
													required={false}
													maxLength={100}
													label=""
													placeholder="Reference No"
													customError={""}
												/>
											</div>
											<div className="col-md-2">
												<TextInput
													id="input_request_no"
													field="search_doc_num"
													value={searchDocParam.search_doc_num.value ? searchDocParam.search_doc_num.value  : ""}
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
													value={searchDocParam.search_doc_name.value ? searchDocParam.search_doc_name.value  : ""}
													onChange={referenceNumberFortakeOutChanged}
													required={false}
													maxLength={100}
													label=""
													placeholder="DC Name"
													customError={""}
												/>
											</div>
											<div className="col-md-2">
												<TextInput
													id="input_request_no"
													field="search_doc_type"
													value={searchDocParam.search_doc_type.value ? searchDocParam.search_doc_type.value  : ""}
													onChange={referenceNumberFortakeOutChanged}
													required={false}
													maxLength={100}
													label=""
													placeholder="Doc.type"
													customError={""}
												/>
											</div>
											<div className="col-md-2">
												<TextInput
													id="input_request_no"
													field="search_desc"
													value={searchDocParam.search_desc.value ? searchDocParam.search_desc.value  : ""}
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
												style={{ textAlign: "center", marginTop: "2%" }}
											>
												<div
													onClick={(e) => loadDocumentforTakeOut()}
													className={`btn btn-success left-margin font-14  }`}
												>
													{" Load Documents "}
												</div>
											</div>
											 

										
										</div>
									</div>
			<BootstrapTable
				options={options}
				data={tempProducts}
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
					dataFormat={document_request_format}
					formatExtraData={"document_request_no"} 				 
				>
					Request NO
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="document_no"
					className="thead-light-1"
					width="12%"
				>
					DC NO
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="document_type"
					className="thead-light-1"
					width="14%"
					dataFormat={document_request_format_gen_name}
					formatExtraData={"name"}
				>
					Gererated By
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="document_type"
					className="thead-light-1"
					width="14%"
					dataFormat={document_request_format_doctype_name}
					formatExtraData={"name"}
				>
					Doc Type
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="category"
					className="thead-light-1"
					width="8%"
					dataFormat={document_request_format_doctype_cate}
				>
					Doc Type
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="qr_code"
					className="thead-light-1"
					width="10%"
					dataFormat={document_request_format_dpet_name}
					formatExtraData={"name"}
				>
					Dept
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="manufacturedate"
					className="thead-light-1"
					dataFormat={convertDate}
					width="10%"
				>
					MFG Date
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="expiredate"
					className="thead-light-1"
					dataFormat={convertDate}
					width="10%"
				>
					EXP Date
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="no_of_copy"
					className="thead-light-1"
					width="10%"
				>
					No of Copies
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="no_of_page"
					className="thead-light-1"
					width="10%"
				>
					No of Pages
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="button"
					dataFormat={buttonFormatter}
					className="thead-light-1"
					width="10%"
				>
					Action
				</TableHeaderColumn>
			</BootstrapTable>
		</div>
	);
}

export default ProductList;
