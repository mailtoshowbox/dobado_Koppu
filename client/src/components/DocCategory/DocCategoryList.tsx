import React, { Fragment, Dispatch, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  IStateType,
  IDocCategoryState,
} from "../../store/models/root.interface";
import { IDocCategory } from "../../store/models/doccategory.interface";

export type productListProps = {
  onSelect?: (product: IDocCategory) => void;
  children?: React.ReactNode;
};

function ProductList(props: productListProps): JSX.Element {
  const docCategories: IDocCategoryState = useSelector(
    (state: IStateType) => state.docCategories
  );

  if (docCategories.docCategories !== undefined) {
    const productElements: (JSX.Element | null)[] = docCategories.docCategories.map(
      (product) => {
        if (!product) {
          return null;
        }
        return (
          <tr
            className={`table-row ${
              docCategories.selectedDocCategory &&
              docCategories.selectedDocCategory._id === product._id
                ? "selected"
                : ""
            }`}
            onClick={() => {
              if (props.onSelect) props.onSelect(product);
            }}
            key={`product_${product._id}`}
          >
            <th scope="row">{product._id}</th>
            <td>{product.name}</td>
            <td>{product.description}</td>
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
              <th scope="col">description</th>
            </tr>
          </thead>
          <tbody>{productElements}</tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div className="table-responsive portlet custom-table-style  table-bordered table-hover">
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">description</th>
            </tr>
          </thead>
        </table>
      </div>
    );
  }
}

export default ProductList;
