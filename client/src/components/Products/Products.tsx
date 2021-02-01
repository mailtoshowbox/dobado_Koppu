import React, { Fragment, Dispatch, useState, useEffect } from "react";
import ProductList from "./ProductsList";
import ProductForm from "./ProductsForm";
import TopCard from "../../common/components/TopCard";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPath } from "../../store/actions/root.actions";
import {
  IProductState,
  IStateType,
  IRootPageStateType,
} from "../../store/models/root.interface";
import Popup from "reactjs-popup";
import {
  removeProduct,
  clearSelectedProduct,
  setModificationState,
  changeSelectedProduct,
  loadListOfProduct,
} from "../../store/actions/products.action";
import { loadListOfDocCategory } from "../../store/actions/doccategory.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  ProductModificationStatus,
  IProduct,
  IProductList,
} from "../../store/models/product.interface";
import { IDocCategoryList } from "../../store/models/doccategory.interface";

import { IBoxList } from "../../store/models/box.interface";
import { loadListOfBox } from "../../store/actions/box.action";
import {
  getDocumentList,
  getDocCategoryList,
  getBoxList,
} from "../../services/index";

const Products: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const products: IProductState = useSelector(
    (state: IStateType) => state.products
  );
  const path: IRootPageStateType = useSelector(
    (state: IStateType) => state.root.page
  );
  const numberItemsCount: number = products.products.length;
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    //Load Documents
    getDocumentList().then((items: IProductList) => {
      dispatch(loadListOfProduct(items));
    });
    //Load Available Doc Categories
    getDocCategoryList().then((items: IDocCategoryList) => {
      dispatch(loadListOfDocCategory(items));
    });
    //Load Available Boxes
    getBoxList().then((items: IBoxList) => {
      dispatch(loadListOfBox(items));
    });

    // dispatch(clearSelectedProduct());
    // dispatch(updateCurrentPath("products", "list"));
  }, [path.area, dispatch]);

  function onProductSelect(product: IProduct): void {
    dispatch(changeSelectedProduct(product));
    dispatch(setModificationState(ProductModificationStatus.None));
  }

  function onProductRemove() {
    if (products.selectedProduct) {
      setPopup(true);
    }
  }

  return (
    <Fragment>
      <h1 className="h3 mb-2 text-gray-800">Documents</h1>
      <p className="mb-4">Documents here</p>
      <div className="row">
        <TopCard
          title="Documents COUNT"
          text={`${numberItemsCount}`}
          icon="box"
          class="success"
        />
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-2">
              <h6 className="m-0 font-weight-bold text-white">Document List</h6>
              <div className="header-buttons">
                <button
                  className="btn btn-border"
                  onClick={() =>
                    dispatch(
                      setModificationState(ProductModificationStatus.Create)
                    )
                  }
                >
                  <i className="fas fa fa-plus"></i>
                </button>
                <button
                  className="btn btn-border"
                  onClick={() =>
                    dispatch(
                      setModificationState(ProductModificationStatus.Edit)
                    )
                  }
                >
                  <i className="fas fa fa-pen"></i>
                </button>
                {/*  <button
                  className="btn btn-border btn-red-color"
                  onClick={() => onProductRemove()}
                >
                  <i className="fas fa fa-times"></i>
                </button> */}
              </div>
            </div>
            {products.modificationState === ProductModificationStatus.Create ||
            (products.modificationState === ProductModificationStatus.Edit &&
              products.selectedProduct) ? (
              <ProductForm />
            ) : null}
            <div className="card-body">
              <ProductList onSelect={onProductSelect} />
            </div>
          </div>
        </div>
      </div>

      <Popup
        className="popup-modal"
        open={popup}
        onClose={() => setPopup(false)}
        closeOnDocumentClick
      >
        <div className="popup-modal">
          <div className="popup-title">Are you sure?</div>
          <div className="popup-content">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                if (!products.selectedProduct) {
                  return;
                }
                dispatch(
                  addNotification(
                    "Product removed",
                    `Product ${products.selectedProduct.name} was removed`
                  )
                );
                //  dispatch(removeProduct(products.selectedProduct._id));
                dispatch(clearSelectedProduct());
                setPopup(false);
              }}
            >
              Remove
            </button>
          </div>
        </div>
      </Popup>
    </Fragment>
  );
};

export default Products;
