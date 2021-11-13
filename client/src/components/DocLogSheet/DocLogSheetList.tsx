import React from "react";
import { useSelector } from "react-redux";
import {
	IStateType,
	IDocLogSheetState,
} from "../../store/models/root.interface";
import {
	BootstrapTable,
	TableHeaderColumn,
	ExportCSVButton,
} from "react-bootstrap-table";
import APP_CONST from "../../common/contant";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import moment, { Moment } from "moment";
import { listenerCount } from "cluster";

export type productListProps = {
	children?: React.ReactNode;
	docCategoryModificationStatus: any;
	allowDelete: boolean;
	selectedFieldsToDownload: any;
};

function DocCategoryList(props: productListProps): JSX.Element {
	const logSheet: IDocLogSheetState = useSelector(
		(state: IStateType) => state.docLogSheetData
	);
	const { docLogSheetList = [] } = logSheet;
	const options = {
		exportCSVBtn: createCustomExportCSVButton,
		deleteBtn: createCustomExportCSVButton1,
	};
	function document_request_no_format(cell: any, row: any, field: any) {
		if (field === "document_issued_on") {
			return (
				<>
					{row.document_request_info[field]
						? moment(row.document_request_info[field]).format("YYYY-MM-DD")
						: "-"}
				</>
			);
		} else {
			return <>{row.document_request_info[field]}</>;
		}
	}

	function common_format(cell: any, row: any) {
		return cell ? cell : "-";
	}

	function createCustomExportCSVButton1(onClick: any) {
		return (
			<button style={{ color: "red" }} onClick={onClick}>
				Delete rows
			</button>
		);
	}
	function convertDate(retensionDateExtended: any) {
		if (retensionDateExtended !== "" && retensionDateExtended !== "-") {
			var date = new Date(retensionDateExtended),
				mnth = ("0" + (date.getMonth() + 1)).slice(-2),
				day = ("0" + date.getDate()).slice(-2);

			return [date.getFullYear(), mnth, day].join("-");
		}
		return "-";
	}

	function document_issued_on_format(cell: any, row: any) {
		const dvv =
			row.document_request_info &&
			row.document_request_info["document_issued_on"]
				? row.document_request_info["document_issued_on"]
				: "-";
		return convertDate(dvv);
	}

	function document_submitted_on_format(cell: any, row: any) {
		const dvv =
			row.document_request_info &&
			row.document_request_info["document_submitted_on"]
				? row.document_request_info["document_submitted_on"]
				: "";
		return convertDate(dvv);
	}
	function document_submitted_by_format(cell: any, row: any) {
		return row.document_request_info &&
			row.document_request_info["document_submitted_by"]
			? row.document_request_info["document_submitted_by"]
			: "";
	}
	function document_issued_to_format(cell: any, row: any) {
		return row.document_request_info &&
			row.document_request_info["document_issued_to"]
			? row.document_request_info["document_issued_to"]
			: "-";
	}
	function document_issued_by_format(cell: any, row: any) {
		return row.document_request_info &&
			row.document_request_info["document_issued_by"]
			? row.document_request_info["document_issued_by"]
			: "-";
	}
	function document_submitted_department_format(cell: any, row: any) {
		if (
			row.document_request_info &&
			row.document_request_info.document_request_department
		) {
			if (row.document_request_info.document_request_department.name) {
				return row.document_request_info.document_request_department.name;
			}
		}
		return "-";
	}
	function document_type_format(cell: any, row: any) {
		if (row.document_type_details) {
			return row.document_type_details.name;
		}
		return "-";
	}
	function batch_format(cell: any, row: any) {
		let batch = "";
		if (!row.isRequestedDocument) {
			const {
				document_box_details = {},
				document_category_details = {},
				document_rack_details = {},
			} = row;
			batch += document_category_details.name
				? document_category_details.name + "/"
				: "";
			batch += document_box_details.name ? document_box_details.name + "/" : "";
			batch += document_rack_details.name
				? document_rack_details.name + "/"
				: "";
			return batch;
		} else {
			const { batch = "-" } = row;
			return batch;
		}
	}
	//
	function retension_exact_date_format(cell: any, row: any) {
		let batch = "";
		if (!row.isRequestedDocument) {
			const {
				retension_time: { retension_exact_date = "", status = "" } = {},
			} = row;
			//if(status === 'destructed'){
			//return "Destructed";
			//}
			return convertDate(retension_exact_date);
		} else {
			batch = "-";
		}
		return batch;
	}

	function retension_destructed_on_format(cell: any, row: any) {
		let batch = "";
		if (!row.isRequestedDocument) {
			const { retension_time: { destructed_on = "" } = {} } = row;
			return convertDate(destructed_on);
		} else {
			batch = "-";
		}
		return batch;
	}
	function receivedBy(cell: any, row: any) {
		let batch = "";
		if (row.isRequestedDocument) {
			const { document_request_info: { document_request_approved = [] } = {} } =
				row;

			const apr =
				document_request_approved.length > 0
					? document_request_approved[0]
					: { empl_id: "-" };
 
			batch = apr["empl_id"];
		} else {
			batch = "-";
		}
		return batch;
	}

	function receivedOn(cell: any, row: any) {
		let batch = "";
		if (
			row.document_request_info &&
			row.document_request_info.document_requested_on
		) {
			batch = convertDate(row.document_request_info.document_requested_on);
		}

		return batch;
	}

	function takeoutBy(cell: any, row: any) {
		let batch = "-";
		const { is_requested_for_takeout = false } = row;
		if (is_requested_for_takeout) {
			const {
				takeout_requested_details: { takeout_request_details_list = [] } = {},
			} = row;
			if (takeout_request_details_list.length > 0) {
				let takeout_request_details =
					takeout_request_details_list[takeout_request_details_list.length - 1];
				const { requested_by = "" } = takeout_request_details;
				batch = requested_by
			} else {
				batch = "N/A";
			}
		}
		return batch;
	}

	function format_reference_no(cell: any, row: any) {
		let batch = "";
		if (row.isRequestedDocument) {
			const { document_request_info: { document_issued_from = "" } = {} } = row;
			batch = document_issued_from;
		} else {
			batch = "-";
		}

		return batch;
	}

	function document_type_issueto(cell: any, row: any) {
		return row.document_request_info &&
			row.document_request_info.document_issued_to
			? row.document_request_info.document_issued_to
			: "-";
	}
	function request_no_format(cell: any, row: any) {
		return row.document_request_info &&
			row.document_request_info["document_request_no"]
			? row.document_request_info["document_request_no"]
			: "-";
	}

	function document_submitted_by_nr_format(cell: any, row: any, inpu: any) {
		if (!row.isRequestedDocument) {
			return row.document_info &&
				row.document_info.createdBy &&
				row.document_info.createdBy.emp_id
				? row.document_info.createdBy.emp_id
				: "-";
		}
		return row.document_request_info &&
			row.document_request_info["document_submitted_by"]
			? row.document_request_info["document_submitted_by"]
			: "";
	}

	function document_submitted_on_nr_format(cell: any, row: any, inpu: any) {
		let submittedOn = "";
		if (!row.isRequestedDocument) {
			submittedOn =
				row.document_info && row.document_info.createdOn
					? row.document_info.createdOn
					: "";
		} else {
			submittedOn =
				row.document_request_info &&
				row.document_request_info["document_submitted_on"]
					? row.document_request_info["document_submitted_on"]
					: "";
		}
		return convertDate(submittedOn);
	}

	function generatePDF() {
		const unit = "pt";
		const size = "A4"; // Use A1, A2, A3 or A4
		const orientation = "landscape"; // portrait or landscape
		const marginLeft = 40;
		const doc = new jsPDF(orientation, unit, size);
		doc.setFontSize(15);
		const title = APP_CONST.EXPORT_PDF_COLUMN_LOG_SHEET_NAME;

		const headersw = APP_CONST.EXPORT_PDF_COLUMN_LOG_SHEET.filter(
			(elt) => elt.PDF_VIEW
		);

		let newauditLogList = docLogSheetList;
		let constructedList: any = [];

		newauditLogList.map((log: any) => {
			const { document_info: { updatedBy = [], createdOn = "" } = {} } = log;
			//const doc_CretedDate = convertDate(createdOn);
			let ar: any = {};
			const {
				document_request_info: {
					department = "",
					document_issued_on = "",
					document_issued_by = "",
					document_submitted_on = "",
					document_submitted_by = "",
					document_issued_to = "",
					request_no = "",
					document_request_doc_type = {},
					document_request_department = {},
				} = {},
				document_type_details = {},
				isRequestedDocument = false,
			} = log;

			headersw.forEach((elt) => {
				let fieldName = elt.FIELD_NAME;
				if (fieldName === "document_request_info.document_request_no") {
					const { document_request_info: { document_request_no = "" } = {} } =
						log;
					ar[fieldName] = document_request_no;
				} else if (fieldName === "rdocument_no") {
					let bs = "";
					if (isRequestedDocument) {
						const {
							isRequestedDocument = false,
							document_request_info: { document_issued_from = "" } = {},
						} = log;
						bs = document_issued_from;
					} else {
						bs = "-";
					}
					ar[fieldName] = bs;
				} else if (fieldName === "document_request_info.document_issued_on") {
					ar[fieldName] = convertDate(document_issued_on);
				} else if (fieldName === "document_request_info.document_issued_to") {
					ar[fieldName] = document_issued_to;
				} else if (fieldName === "document_request_info.document_issued_by") {
					ar[fieldName] = document_issued_by;
				} else if (fieldName === "document_request_info.department") {
					let fieldValue = "";
					if (isRequestedDocument) {
						const { name = "" } = document_request_department;
						fieldValue = name;
					} else {
						fieldValue = "-";
					}
					ar[fieldName] = fieldValue;
				} else if (
					fieldName === "document_request_info.document_submitted_on"
				) {
					ar[fieldName] = convertDate(document_submitted_on);
				} else if (fieldName === "document_type") {
					let fieldValue = "";
					if (isRequestedDocument) {
						const { name = "" } = document_request_doc_type;
						fieldValue = name;
					} else {
						const { name = "" } = document_type_details;
						fieldValue = name;
					}
					ar[fieldName] = fieldValue;
				} else if (
					fieldName === "document_request_info.document_submitted_by"
				) {
					ar[fieldName] = document_submitted_by;
				} else {
					ar[fieldName] = log[fieldName];
				}
			});
			constructedList.push(ar);
		});

		let data = constructedList.map((log: any) => {
			let tem: any = [];
			headersw.forEach((elt) => {
				let fieldName = elt.FIELD_NAME;
				const fd = log[fieldName] ? log[fieldName] : "-";
				tem.push(fd);
			});
			return tem;
		});

		const headers = [headersw.map((elt) => elt.FIELD_LABEL)];

		let content: any = {
			startY: 50,
			head: headers,
			body: data,
		};

		doc.text(title, marginLeft, 40);
		autoTable(doc, content);
		doc.save(APP_CONST.EXPORT_PDF_COLUMN_LOG_SHEET_FILE_NAME + ".pdf");
	}

	function handleExportCSVButtonClick(onClick: any) {
		// Custom your onClick event here,
		// it's not necessary to implement this function if you have no any process before onClick

		onClick();
	}

	function createCustomExportCSVButton(onClick: any) {
		return (
			<>
				<ExportCSVButton
					btnText="Down CSV"
					onClick={() => handleExportCSVButtonClick(onClick)}
				/>{" "}
				&nbsp;&nbsp;
				<ExportCSVButton btnText="Down PDF" onClick={() => generatePDF()} />
			</>
		);
	}
	return (
		<div className="portlet">
			<BootstrapTable
				tableContainerClass="my-table-container-hide"
				data={docLogSheetList}
				keyField="id"
				options={options}
				exportCSV
			>
				{props.selectedFieldsToDownload
					.filter((item: any) => item.FIELD_VALUE)
					.map((column: any) => {
						console.log("column.FIELD_NAME---", column.FIELD_NAME);
						if (
							column.FIELD_NAME === "document_request_info.document_request_no"
						) {
							return (
								<TableHeaderColumn
									csvHeader={column.FIELD_LABEL}
									dataFormat={request_no_format}
									csvFormat={request_no_format}
									dataField={column.FIELD_NAME}
								>
									{column.FIELD_LABEL}
								</TableHeaderColumn>
							);
						} else if (column.FIELD_NAME === "TO By") {
							return (
								<TableHeaderColumn
									dataFormat={takeoutBy}
									csvFormat={takeoutBy}
									formatExtraData={column}
									dataField={column.FIELD_NAME}
								>
									{column.FIELD_LABEL}
								</TableHeaderColumn>
							);
						} else if (column.FIELD_NAME === "Received By") {
							return (
								<TableHeaderColumn
									dataFormat={receivedBy}
									csvFormat={receivedBy}
									formatExtraData={column}
									dataField={column.FIELD_NAME}
								>
									{column.FIELD_LABEL}
								</TableHeaderColumn>
							);
						} else if (column.FIELD_NAME === "Received On") {
							return (
								<TableHeaderColumn
									dataFormat={receivedOn}
									csvFormat={receivedOn}
									formatExtraData={column}
									dataField={column.FIELD_NAME}
								>
									{column.FIELD_LABEL}
								</TableHeaderColumn>
							);
						} else if (
							column.FIELD_NAME === "document_request_info.document_issued_on"
						) {
							return (
								<TableHeaderColumn
									csvHeader={column.FIELD_LABEL}
									dataFormat={document_issued_on_format}
									csvFormat={document_issued_on_format}
									dataField={column.FIELD_NAME}
								>
									{column.FIELD_LABEL}
								</TableHeaderColumn>
							);
						} else if (
							column.FIELD_NAME === "document_request_info.document_issued_to"
						) {
							return (
								<TableHeaderColumn
									dataFormat={document_type_issueto}
									csvFormat={document_type_issueto}
									dataField={column.FIELD_NAME}
								>
									{column.FIELD_LABEL}
								</TableHeaderColumn>
							);
						} else if (
							column.FIELD_NAME === "document_request_info.document_issued_by"
						) {
							return (
								<TableHeaderColumn
									csvHeader={column.FIELD_LABEL}
									dataFormat={document_issued_by_format}
									csvFormat={document_issued_by_format}
									dataField={column.FIELD_NAME}
								>
									{column.FIELD_LABEL}
								</TableHeaderColumn>
							);
						} else if (
							column.FIELD_NAME ===
							"document_request_info.document_submitted_by"
						) {
							return (
								<TableHeaderColumn
									csvHeader={column.FIELD_LABEL}
									csvFormat={document_submitted_by_format}
									dataFormat={document_submitted_by_nr_format}
									dataField={column.FIELD_NAME}
								>
									{column.FIELD_LABEL}
								</TableHeaderColumn>
							);
						} else if (
							column.FIELD_NAME ===
							"document_request_info.document_submitted_on"
						) {
							return (
								<TableHeaderColumn
									csvHeader={column.FIELD_LABEL}
									csvFormat={document_submitted_on_format}
									dataFormat={document_submitted_on_nr_format}
									dataField={column.FIELD_NAME}
								>
									{column.FIELD_LABEL}
								</TableHeaderColumn>
							);
						} else if (
							column.FIELD_NAME === "document_request_info.department"
						) {
							return (
								<TableHeaderColumn
									csvHeader={column.FIELD_LABEL}
									dataFormat={document_submitted_department_format}
									csvFormat={document_submitted_department_format}
									dataField={column.FIELD_NAME}
								>
									{column.FIELD_LABEL}
								</TableHeaderColumn>
							);
						} else if (column.FIELD_NAME === "document_type") {
							return (
								<TableHeaderColumn
									dataFormat={document_type_format}
									csvFormat={document_type_format}
									formatExtraData={column}
									dataField={column.FIELD_NAME}
								>
									{column.FIELD_LABEL}
								</TableHeaderColumn>
							);
						} else if (column.FIELD_NAME === "Location") {
							return (
								<TableHeaderColumn
									dataFormat={batch_format}
									csvFormat={batch_format}
									formatExtraData={column}
									dataField={column.FIELD_NAME}
								>
									{column.FIELD_LABEL}
								</TableHeaderColumn>
							);
						} else if (column.FIELD_NAME === "To be destruct") {
							return (
								<TableHeaderColumn
									dataFormat={retension_exact_date_format}
									csvFormat={retension_exact_date_format}
									formatExtraData={column}
									dataField={column.FIELD_NAME}
								>
									{column.FIELD_LABEL}
								</TableHeaderColumn>
							);
						} else if (column.FIELD_NAME === "Destructed On") {
							return (
								<TableHeaderColumn
									dataFormat={retension_destructed_on_format}
									csvFormat={retension_destructed_on_format}
									formatExtraData={column}
									dataField={column.FIELD_NAME}
								>
									{column.FIELD_LABEL}
								</TableHeaderColumn>
							);
						} else if (column.FIELD_NAME === "Reference No") {
							return (
								<TableHeaderColumn
									dataFormat={format_reference_no}
									csvFormat={format_reference_no}
									formatExtraData={column}
									dataField={column.FIELD_NAME}
								>
									{column.FIELD_LABEL}
								</TableHeaderColumn>
							);
						}
						//
						else {
							return (
								<TableHeaderColumn
									csvHeader={column.FIELD_LABEL}
									dataField={column.FIELD_NAME}
									csvFormat={common_format}
								>
									{column.FIELD_LABEL}
								</TableHeaderColumn>
							);
						}
						// }
					})}
			</BootstrapTable>
		</div>
	);
}

export default DocCategoryList;
