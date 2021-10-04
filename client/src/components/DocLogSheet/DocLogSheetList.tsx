import React, {  } from "react";
import { useSelector } from "react-redux";
import {
  IStateType,
  IDocLogSheetState,
} from "../../store/models/root.interface"; 
import { BootstrapTable, TableHeaderColumn , ExportCSVButton } from "react-bootstrap-table";
 
import moment, { Moment } from "moment";

export type productListProps = {
  
  children?: React.ReactNode;
  docCategoryModificationStatus: any;
  allowDelete: boolean;
  selectedFieldsToDownload : any
};

function DocCategoryList(props: productListProps): JSX.Element {
  const logSheet: IDocLogSheetState = useSelector(
    (state: IStateType) => state.docLogSheetData
  ); 
   const {docLogSheetList = []} = logSheet;

 //  const {selectedFieldsToDownload = []} = props;

  
   function handleExportCSVButtonClick(onClick:any)  {
    // Custom your onClick event here,
    // it's not necessary to implement this function if you have no any process before onClick
  
    onClick();
  }
  function createCustomExportCSVButton(onClick:any)  {
    return (
      <ExportCSVButton
        btnText='Down CSV'
        onClick={ () => handleExportCSVButtonClick(onClick) }/>
    );
  }
  //...
  const options = {
    exportCSVBtn: createCustomExportCSVButton,
    deleteBtn: createCustomExportCSVButton1

  };
  function document_request_no_format(cell: any, row: any, field: any) {
 
    if(field === 'document_issued_on'){
      return (
        <>
        { row.document_request_info[field] ? moment(row.document_request_info[field]).format('YYYY-MM-DD') : "-"}
        </>
      );
    }else{
      return (
        <>
        { row.document_request_info[field]}
        </>
      );
    }
    
  }
   
  function common_format(cell: any, row: any ){
     return cell ? cell  : "-";     
  }
   
  function createCustomExportCSVButton1 (onClick:any)   {
  return (
    <button style={ { color: 'red' } } onClick={ onClick }>Delete rows</button>
  );
}
 
function request_no_format(cell: any, row: any) { 
  console.log("YUUU1?", cell, row);
    return row.document_request_info && row.document_request_info['document_request_no']  ? row.document_request_info['document_request_no']  : "-";    
} 
 
function document_issued_on_format(cell: any, row: any) { 

  return row.document_request_info && row.document_request_info['document_issued_on'] ? row.document_request_info['document_issued_on'] : "-";    
}
 
function document_submitted_on_format(cell: any, row: any) { 

  return row.document_request_info && row.document_request_info['document_submitted_on'] ? row.document_request_info['document_submitted_on'] : "" ;    
}
function document_submitted_by_format(cell: any, row: any) {  

  return row.document_request_info && row.document_request_info['document_submitted_by'] ? row.document_request_info['document_submitted_by'] : "" ;    
   
}
function document_issued_to_format(cell: any, row: any) { 

  return row.document_request_info && row.document_request_info['document_issued_to'] ? row.document_request_info['document_issued_to'] : "-";    
}
function document_issued_by_format(cell: any, row: any) { 

  return row.document_request_info && row.document_request_info['document_issued_by'] ?row.document_request_info['document_issued_by']  : "-";    
}
function document_submitted_department_format(cell: any, row: any) { 

  return row.document_request_info && row.document_request_info.document_request_department['name'] ? row.document_request_info.document_request_department['name'] : "-";    
}
function document_type_format(cell: any, row: any, inpu : any) {  
  if(row.document_type_details){
    return row.document_type_details.name;
  }
 return "-";    
}

function document_submitted_by_nr_format(cell: any, row: any, inpu : any) {  

  if(!row.isRequestedDocument){
    return row.document_info && row.document_info.createdBy && row.document_info.createdBy.name ? row.document_info.createdBy.name : "-"; 
  }
  return row.document_request_info && row.document_request_info['document_submitted_by'] ? row.document_request_info['document_submitted_by'] : "" ;    
   
}

function document_submitted_on_nr_format(cell: any, row: any, inpu : any) {  

  if(!row.isRequestedDocument){
    return row.document_info && row.document_info.createdOn  ? row.document_info.createdOn: "-"; 
  }
  return row.document_request_info && row.document_request_info['document_submitted_on'] ? row.document_request_info['document_submitted_on'] : "" ;    
   
}


  return (
    <div className="portlet">
      <BootstrapTable  tableContainerClass='my-table-container-hide' data={docLogSheetList} keyField='id' options={options} exportCSV>
{
    props.selectedFieldsToDownload.filter((item:any) => item.FIELD_VALUE).map( (column :any) => {
       
      if( column.FIELD_NAME === 'document_request_info.document_request_no'){
        return (
        <TableHeaderColumn csvHeader={column.FIELD_LABEL} csvFormat={request_no_format} dataField={ column.FIELD_NAME }>{ column.FIELD_LABEL }</TableHeaderColumn>
        );
      }else if( column.FIELD_NAME === 'document_request_info.document_issued_to'){
        return (
        <TableHeaderColumn csvHeader={column.FIELD_LABEL} csvFormat={document_issued_to_format} dataField={ column.FIELD_NAME }>{ column.FIELD_LABEL }</TableHeaderColumn>
        );
      }else if( column.FIELD_NAME === 'document_request_info.document_issued_on'){
        return (
        <TableHeaderColumn csvHeader={column.FIELD_LABEL} csvFormat={document_issued_on_format} dataField={ column.FIELD_NAME }>{ column.FIELD_LABEL }</TableHeaderColumn>
        );
      }else if( column.FIELD_NAME === 'document_request_info.document_issued_by'){
        return (
        <TableHeaderColumn csvHeader={column.FIELD_LABEL} csvFormat={document_issued_by_format} dataField={ column.FIELD_NAME }>{ column.FIELD_LABEL }</TableHeaderColumn>
        );
      }else if( column.FIELD_NAME === 'document_request_info.document_submitted_by'){
        return (
        <TableHeaderColumn csvHeader={column.FIELD_LABEL} csvFormat={document_submitted_by_format} dataFormat={document_submitted_by_nr_format}  dataField={ column.FIELD_NAME }>{ column.FIELD_LABEL }</TableHeaderColumn>
        );
      }
      else if( column.FIELD_NAME === 'document_request_info.document_submitted_on'){
        return (
        <TableHeaderColumn csvHeader={column.FIELD_LABEL} csvFormat={document_submitted_on_format} dataFormat={document_submitted_on_nr_format} dataField={ column.FIELD_NAME }>{ column.FIELD_LABEL }</TableHeaderColumn>
        );
      } 
      else if( column.FIELD_NAME === 'document_request_info.department'){
        return (
        <TableHeaderColumn csvHeader={column.FIELD_LABEL} csvFormat={document_submitted_department_format} dataField={ column.FIELD_NAME }>{ column.FIELD_LABEL }</TableHeaderColumn>
        );
      } 
      else if( column.FIELD_NAME === 'document_type'){
        console.log("column.sgdsrg", column.FIELD_NAME);
        return (
        <TableHeaderColumn   dataFormat={document_type_format} formatExtraData={column} dataField={ column.FIELD_NAME }>{ column.FIELD_LABEL }</TableHeaderColumn>
        );
      } 
      else{  
        
       // console.log("column.FIELD_NAME", column.FIELD_NAME);

        return (          
            <TableHeaderColumn  csvHeader={column.FIELD_LABEL} dataField={ column.FIELD_NAME }  csvFormat={ common_format }>{ column.FIELD_LABEL }</TableHeaderColumn>
        );
      }
   // }
    })
}
</BootstrapTable>
    </div>
  );
}

export default DocCategoryList;
