import '../../styles/datatable.css';

import React, { Component } from 'react'
import ReactDOM from "react-dom";

const $ = require("jquery");
$.DataTable = require("datatables.net");

class DataTableComp extends Component {
   el: any;
   $el: any;
   props:any;
   constructor(props:any) {
      super(props);
   }
   componentDidMount() {
      this.$el = $(this.el);
      this.$el.DataTable({
         data: this.props.data,
         columns: this.props.columns,
         scrollX: true,
         columnDefs:[{
            targets: [5],
            width: 100,
            creadtedCell:(td: any, cellData: any, rowData: any) => 
            ReactDOM.render(
               <div data-toggle= "modal"
                  data-target="#DeleteModal"
                  id={rowData.id}
                  onClick={()=>{
                     this.props.deleteRow(rowData.id);
                  }}> Delete </div>,td
            ),
         }]
      });
   }

   componentWillUnmount() {
      $(".data-table-wrapper").find("table").DataTable().destroy(true);
   }

//    reloadTableData = (data: any) => {
//       const table = $('.data-table-wrapper').find('table').DataTable();
//       table.clear();
//       table.rows.add(data);
//       table.draw();
//     }

//    shouldComponentUpdate(nextProps:any, nextState:any){
//       if (nextProps.data.length !== this.props.data.length) {
//          this.reloadTableData(nextProps.data);
//             }
//       return false;
//   }


   render() {
      return (
         <div>
            <table className="table table-striped table-bordered"
               id="dataTable"
               cellSpacing="0"
               width="100%"
               ref={(el) => (this.el = el)}
            />
         </div>
      );
   }
}
export default DataTableComp;