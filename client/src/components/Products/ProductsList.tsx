import React from "react";
import { useSelector } from "react-redux";
import { IStateType, IProductState } from "../../store/models/root.interface";
import { IProduct } from "../../store/models/product.interface";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
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
	function convertDate(str: Date) {
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
    const {takeout_requested_details : {current_status:{request_no="XXXXXX"}={}} = {}} = row;
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
				{row.batch && row.batch.length > 2 && (
					<span style={{ color: "dodgerblue " }}>
						<br />
						Batch : {row.batch}
					</span>
				)}
        	{row.is_requested_for_takeout && (
					<span style={{ color: "dodgerblue "  }}>
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

	const options = {
		clearSearch: true,
	};
	return (
		<div className="portlet">
			<BootstrapTable
				options={options}
				data={products.products}
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
