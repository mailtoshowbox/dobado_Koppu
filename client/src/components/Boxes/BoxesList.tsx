import React, { Fragment, Dispatch, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IStateType, IBoxState } from "../../store/models/root.interface";
import { IBox } from "../../store/models/box.interface";

export type productListProps = {
  onSelect?: (box: IBox) => void;
  children?: React.ReactNode;
};

function BoxList(props: productListProps): JSX.Element  {
  const boxes: IBoxState = useSelector((state: IStateType) => state.boxes);

    
  const productElements: (JSX.Element | null)[] = boxes.boxes.map(box => {
    if (!box) { return null; }
    return (<tr className={`table-row ${(boxes.selectedBox && boxes.selectedBox._id === box._id) ? "selected" : ""}`}
      onClick={() => {
        if(props.onSelect) props.onSelect(box);
      }}
      key={`product_${box._id}`}>
     
      <td>{box.name}</td>
      <td>{box.racks}</td>
       
    </tr>);
  });


  return (
    <div className="table-responsive portlet">
      <table className="table">
        <thead className="thead-light">
          <tr>
            
            <th scope="col">Name</th>
            <th scope="col">No of Racks</th>
            
          </tr>
        </thead>
        <tbody>
          {productElements}
        </tbody>
      </table>
    </div>

  );
}

export default BoxList;
