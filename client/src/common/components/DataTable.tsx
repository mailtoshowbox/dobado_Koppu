import React, { useState } from "react";
import DataTable from "react-data-table-component";

function DataTableComponent(): JSX.Element {
  const columns = [
    { title: "Name", data: "name" },
    { title: "Position", data: "position" },
    { title: "Office", data: "office" },
    { title: "Extn.", data: "ext" },
    { title: "Start date", data: "date" },
    { title: "Salary", data: "salary" },
  ];

  return (
    <div>
      <DataTable
        title="Arnold Movies"
        data={[{ name: "YUU" }]}
        columns={[{ name: "Name", selector: "name" }]}
      />
    </div>
  );
}

export default DataTableComponent;
