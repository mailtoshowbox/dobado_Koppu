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
import { IAccount } from "../../store/models/account.interface";

import DataTableComp from '../../common/components/DataTableComp';

const Products: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);

  const dispatch: Dispatch<any> = useDispatch();
  const products: IProductState = useSelector(
    (state: IStateType) => state.products
  );
  const path: IRootPageStateType = useSelector(
    (state: IStateType) => state.root.page
  );
  const numberItemsCount: number = products.products.length;
  const [popup, setPopup] = useState(false);
  const dataSet = [
    {
      id: 1,
      name: "Tiger Nixon",
      position: "System Architect",
      office: "Edinburgh",
      ext: 5421,
      date: "2011/04/25",
      salary: "$320,800",
    },
    {
      id: 2,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      ext: 8422,
      date: "2011/07/25",
      salary: "$170,750",
    },
    {
      id: 3,
      name: "Ashton Cox",
      position: "Junior Technical Author",
      office: "San Francisco",
      ext: 1562,
      date: "2009/01/12",
      salary: "$86,000",
    },
    {
      id: 1,
      name: "Tiger Nixon",
      position: "System Architect",
      office: "Edinburgh",
      ext: 5421,
      date: "2011/04/25",
      salary: "$320,800",
    },
    {
      id: 2,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      ext: 8422,
      date: "2011/07/25",
      salary: "$170,750",
    },
    {
      id: 3,
      name: "Ashton Cox",
      position: "Junior Technical Author",
      office: "San Francisco",
      ext: 1562,
      date: "2009/01/12",
      salary: "$86,000",
    },
    {
      id: 1,
      name: "Tiger Nixon",
      position: "System Architect",
      office: "Edinburgh",
      ext: 5421,
      date: "2011/04/25",
      salary: "$320,800",
    },
    {
      id: 2,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      ext: 8422,
      date: "2011/07/25",
      salary: "$170,750",
    },
    {
      id: 3,
      name: "Ashton Cox",
      position: "Junior Technical Author",
      office: "San Francisco",
      ext: 1562,
      date: "2009/01/12",
      salary: "$86,000",
    },
    {
      id: 1,
      name: "Tiger Nixon",
      position: "System Architect",
      office: "Edinburgh",
      ext: 5421,
      date: "2011/04/25",
      salary: "$320,800",
    },
    {
      id: 2,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      ext: 8422,
      date: "2011/07/25",
      salary: "$170,750",
    },
    {
      id: 3,
      name: "Ashton Cox",
      position: "Junior Technical Author",
      office: "San Francisco",
      ext: 1562,
      date: "2009/01/12",
      salary: "$86,000",
    },
    {
      id: 1,
      name: "Tiger Nixon",
      position: "System Architect",
      office: "Edinburgh",
      ext: 5421,
      date: "2011/04/25",
      salary: "$320,800",
    },
    {
      id: 2,
      name: "Garrett Winters",
      position: "Accountant",
      office: "Tokyo",
      ext: 8422,
      date: "2011/07/25",
      salary: "$170,750",
    },
    {
      id: 3,
      name: "Ashton Cox",
      position: "Junior Technical Author",
      office: "San Francisco",
      ext: 1562,
      date: "2009/01/12",
      salary: "$86,000",
    }
  ];

  const columns = [
    { title: "Name", data:'name' },
    { title: "Position", data:'position'  },
    { title: "Office", data:'office' },
    { title: "Extn.", data: 'ext' },
    { title: "Start date", data:"date" },
    { title: "Salary", data: 'salary' },
  ];
  useEffect(() => {
    //Load Documents
    getDocumentList(account.auth).then((items: IProductList) => {
      dispatch(loadListOfProduct(items));
    });
    //Load Available Doc Categories
    getDocCategoryList(account.auth).then((items: IDocCategoryList) => {
      dispatch(loadListOfDocCategory(items));
    });
    //Load Available Boxes
    getBoxList(account.auth).then((items: IBoxList) => {
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

  // deleteRow = (id) => {
  //   const filteredData = this.state.data.filter((i) =>  i.id !== id);
  //   this.setState({data: filteredData});
  // };

  return (
    <Fragment>
      <h1 className="h5 mb-4 text-gray-800 font-bold">Documents</h1>
      {/* <p className="mb-4 font-14">Documents here</p> */}
      <div className="row">
        <TopCard
          title="Documents COUNT"
          text={`${numberItemsCount}`}
          icon="file-contract"
          class="success"
        />
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-1">
              <h6 className="m-0 font-weight-bold text-white font-12">Document List</h6>
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
              <DataTableComp data={dataSet} columns={columns}/>
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
              className="btn btn-danger font-14"
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
