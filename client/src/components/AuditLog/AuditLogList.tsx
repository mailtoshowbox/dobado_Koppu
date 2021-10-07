import React, {  } from "react";
import { useSelector } from "react-redux";
import {
  IStateType,
  IAuditLogState,
} from "../../store/models/root.interface"; 
import { BootstrapTable, TableHeaderColumn , ExportCSVButton } from "react-bootstrap-table";
import APP_CONST from "../../common/contant";

import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'


export type productListProps = {
  
  children?: React.ReactNode;
  logLoaded : boolean
 
};

function DocCategoryList(props: productListProps): JSX.Element {
  const logSheet: IAuditLogState = useSelector(
    (state: IStateType) => state.auditLogList
  ); 

  const  {logLoaded=false} =props;

  function generatePDF  ()  {	 
	const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);
    const title = APP_CONST.EXPORT_PDF_COLUMN_AUDIT_LOG_NAME;
    const headers = [APP_CONST.EXPORT_PDF_COLUMN_AUDIT_LOG.map(elt=>  elt.FIELD_LABEL)];
	let newauditLogList = auditLogList;
	let constructedList:any = [];

    const data =auditLogList.map((elt:any)=> [elt.name, 
		elt.document_no,
		elt.document_category_details,
		elt.updatedBy,
		elt.createdOn,
		elt.updatedOn	
	]);

    let content:any = {
      startY: 50,
      head: headers,
      body: data
    };

    doc.text(title, marginLeft, 40);
	autoTable(doc, content)
   // doc.autoTable(content);
    doc.save(APP_CONST.EXPORT_PDF_COLUMN_AUDIT_LOG_FILE_NAME+".pdf")
  } 
  
	function handleExportCSVButtonClick(onClick:any)  {
		// Custom your onClick event here,
		// it's not necessary to implement this function if you have no any process before onClick
	  
		onClick();
	  }
	  
	  function createCustomExportCSVButton(onClick:any)  {

		let status = logLoaded ? true  : false;
		let onclickS = logLoaded ? ""  :'disabled="disabled"';
		return (
			<>
		  <ExportCSVButton
			btnText='Down CSV' 
			className= {logLoaded ? "" : " disabled "} 
			onClick={ logLoaded ?  () => handleExportCSVButtonClick(onClick) : (e)=>e.preventDefault() }/> &nbsp;&nbsp;
			<ExportCSVButton
			btnText='Down PDF'
			className= {logLoaded ? "" : " disabled "} 
			onClick={ logLoaded ?  () => generatePDF() :
			 (e)=>e.preventDefault() }/> 
		
		
			</>
		);
	  }
	  const {auditLogList = []} = logSheet;
  return (
    <div className="portlet">
	 
			<div id="auditlog">
     <BootstrapTable
				data={auditLogList}
				pagination={true}
				hover={true}
				search={true}
				options={{ exportCSVBtn: createCustomExportCSVButton,}}
				exportCSV	>
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
					dataSort={ true }				 
				>
					Title
				</TableHeaderColumn>

				<TableHeaderColumn
					dataField="document_no"
					className="thead-light-1"
					width="16%" dataSort={ true }
				>
					Reference number
				</TableHeaderColumn>
			 
				 
				<TableHeaderColumn
					dataField="document_category_details"
					className="thead-light-1"
					width="10%"  dataSort={ true }
				>
					Category
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="updatedBy"
					className="thead-light-1"
				 
					width="10%" dataSort={ true }
				
				>
					Modifier Name
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="createdOn"
					className="thead-light-1" 
					width="10%" dataSort={ true }
				>
					Created date
				</TableHeaderColumn>
				<TableHeaderColumn
					dataField="updatedOn"
					className="thead-light-1"
			 
					width="10%" dataSort={ true }
				>
					Modified On
				</TableHeaderColumn>
				 
			</BootstrapTable>
			</div>  </div>
  );
}

export default DocCategoryList;
