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
  function common_format(cell: any, row: any, field: any){
    if(row[field]){
      return (
        <>
        {row[field]}
        </>
      );
    }else{
      return (
        <>
        {"-"}
        </>
      );
    }     
  }
  function createCustomExportCSVButton1 (onClick:any)   {
  return (
    <button style={ { color: 'red' } } onClick={ onClick }>Delete rows</button>
  );
}
 
 
 
  return (
    <div className="portlet">
      <BootstrapTable  tableContainerClass='my-table-container-hide'data={docLogSheetList} keyField='id' options={options} exportCSV>
{
    props.selectedFieldsToDownload.filter((item:any) => item.FIELD_VALUE).map( (column :any) => {
    //  if(column.FIELD_VALUE){

      if( column.FIELD_NAME === 'document_request_info.document_request_no'){
        return (
          <TableHeaderColumn csvHeader={column.FIELD_LABEL} dataFormat={document_request_no_format} formatExtraData ={"document_request_no"} dataField={ column.FIELD_NAME }>{ column.FIELD_LABEL }</TableHeaderColumn>
      );
      }else if( column.FIELD_NAME === 'document_request_info.document_issued_to'){
        return (
          <TableHeaderColumn csvHeader={column.FIELD_LABEL} dataFormat={document_request_no_format} formatExtraData ={"document_issued_to"} dataField={ column.FIELD_NAME }>{ column.FIELD_LABEL }</TableHeaderColumn>
      );
        }else if( column.FIELD_NAME === 'document_request_info.document_issued_on'){
          return (
            <TableHeaderColumn csvHeader={column.FIELD_LABEL} dataFormat={document_request_no_format} formatExtraData ={"document_issued_on"} dataField={ column.FIELD_NAME }>{ column.FIELD_LABEL }</TableHeaderColumn>
        );
          }else if( column.FIELD_NAME === 'document_request_info.document_issued_by'){
            return (
              <TableHeaderColumn csvHeader={column.FIELD_LABEL} dataFormat={document_request_no_format} formatExtraData ={"document_issued_by"} dataField={ column.FIELD_NAME }>{ column.FIELD_LABEL }</TableHeaderColumn>
          );
            }
      else{

      
        return (
          
            <TableHeaderColumn csvHeader={column.FIELD_LABEL} dataFormat={common_format} formatExtraData ={column.FIELD_NAME } dataField={ column.FIELD_NAME }>{ column.FIELD_LABEL }</TableHeaderColumn>
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
