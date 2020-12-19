import React, { Fragment, Dispatch, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IStateType, IProductState } from "../../store/models/root.interface";
import { IProduct } from "../../store/models/product.interface";

export type productListProps = {
  onSelect?: (product: IProduct) => void;
  children?: React.ReactNode;
};

function ProductList(props: productListProps): JSX.Element  {
  const products: IProductState = useSelector((state: IStateType) => state.products);
 
  const productElements: (JSX.Element | null)[] = products.products.map(product => {
    if (!product) { return null; }
    return (<tr className={`table-row ${(products.selectedProduct && products.selectedProduct._id === product._id) ? "selected" : ""}`}
      onClick={() => {
        if(props.onSelect) props.onSelect(product);
      }}
      key={`product_${product._id}`}>
      <th scope="row">{product._id}</th>
      <td>{product.name}</td>
      <td>{product.description}</td>
       
    </tr>);
  });


  return (
    <div className="table-responsive portlet">
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">description</th>
            
          </tr>
        </thead>
        <tbody>
          {productElements}
        </tbody>
      </table>
    </div>

  );
}

export default ProductList;
