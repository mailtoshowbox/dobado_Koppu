import React, { Fragment, Dispatch, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IStateType, IProductState } from "../../store/models/root.interface";
import { IProduct } from "../../store/models/product.interface";

export type productListProps = {
  onSelect?: (product: IProduct) => void;
  children?: React.ReactNode;
};

function ProductList(props: productListProps): JSX.Element {
  const products: IProductState = useSelector(
    (state: IStateType) => state.products
  );
  function convert(str: Date) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);

    return [date.getFullYear(), mnth, day].join("-");
  }
  const productElements: (JSX.Element | null)[] = products.products.map(
    (product, io) => {
      const prdMDate = convert(product.manufacturedate);
      const prdEDate = convert(product.expiredate);
      if (!product) {
        return null;
      }

      // let cate = products.rack;
      return (
        <tr
          className={`table-row ${
            products.selectedProduct &&
            products.selectedProduct._id === product._id
              ? "selected"
              : ""
          }`}
          onClick={() => {
            if (props.onSelect) props.onSelect(product);
          }}
          key={`product_${io}`}
        >
          <td>{io + 1}</td>
          <td>{product.name}</td>
          <td>{product.category}</td>
          <td>{product.box}</td>
          <td>{product.rack}</td>
          <td>{prdMDate}</td>
          <td>{prdEDate}</td>
        </tr>
      );
    }
  );

  return (
    <div className="table-responsive portlet custom-table-style  table-bordered table-hover">
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Category</th>
            <th scope="col">Box</th>
            <th scope="col">Rack</th>
            <th scope="col">M Date</th>
            <th scope="col">E Date</th>
          </tr>
        </thead>
        <tbody>{productElements}</tbody>
      </table>
    </div>
  );
}

export default ProductList;
