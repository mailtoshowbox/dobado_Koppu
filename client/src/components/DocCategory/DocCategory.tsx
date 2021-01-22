import React, { Fragment, Dispatch, useState, useEffect } from "react";
import DocCategoryList from "./DocCategoryList";
import ProductForm from "./DocCategoryForm";
import TopCard from "../../common/components/TopCard";
import "./DocCategory.css";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPath } from "../../store/actions/root.actions";
import {
  IDocCategoryState,
  IStateType,
  IRootPageStateType,
} from "../../store/models/root.interface";
import Popup from "reactjs-popup";
import {
  removeDocCategory,
  clearSelectedDocCategory,
  setModificationState,
  changeDocCategoryAmount,
  loadListOfDocCategory,
  changeSelectedDocCategory,
} from "../../store/actions/doccategory.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  DocCategoryModificationStatus,
  IDocCategory,
  IDocCategoryList,
} from "../../store/models/doccategory.interface";
import { getDocCategoryList } from "../../services/index";

const Products: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const doccategories: IDocCategoryState = useSelector(
    (state: IStateType) => state.docCategories
  );
  const path: IRootPageStateType = useSelector(
    (state: IStateType) => state.root.page
  );

  const numberItemsCount: number =
    doccategories.docCategories !== undefined
      ? doccategories.docCategories.length
      : 0;
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    getDocCategoryList().then((items: IDocCategoryList) => {
      dispatch(loadListOfDocCategory(items));
    });
  }, [path.area, dispatch]);

  function onProductSelect(product: IDocCategory): void {
    dispatch(changeSelectedDocCategory(product));
    dispatch(setModificationState(DocCategoryModificationStatus.None));
  }

  function onProductRemove() {
    if (doccategories.selectedDocCategory) {
      setPopup(true);
    }
  }

  return (
    <Fragment>
      <h1 className="h3 mb-2 text-gray-800">Categories</h1>
      <p className="mb-4">Document Category here</p>
      <div className="row">
        <TopCard
          title="Categories COUNT"
          text={`${numberItemsCount}`}
          icon="box"
          class="success"
        />
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-green">Document List</h6>
              <div className="header-buttons">
                <button
                  className="btn btn-success btn-green"
                  onClick={() =>
                    dispatch(
                      setModificationState(DocCategoryModificationStatus.Create)
                    )
                  }
                >
                  <i className="fas fa fa-plus"></i>
                </button>
                <button
                  className="btn btn-success btn-blue"
                  onClick={() =>
                    dispatch(
                      setModificationState(DocCategoryModificationStatus.Edit)
                    )
                  }
                >
                  <i className="fas fa fa-pen"></i>
                </button>
                <button
                  className="btn btn-success btn-red"
                  onClick={() => onProductRemove()}
                >
                  <i className="fas fa fa-times"></i>
                </button>
              </div>
            </div>
            {doccategories.modificationState ===
              DocCategoryModificationStatus.Create ||
            (doccategories.modificationState ===
              DocCategoryModificationStatus.Edit &&
              doccategories.selectedDocCategory) ? (
              <ProductForm />
            ) : null}
            <div className="card-body">
              <DocCategoryList onSelect={onProductSelect} />
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
                if (!doccategories.selectedDocCategory) {
                  return;
                }
                dispatch(
                  addNotification(
                    "Product removed",
                    `Product ${doccategories.selectedDocCategory.name} was removed`
                  )
                );
                //  dispatch(removeDocCategory(products.selectedProduct._id));
                dispatch(clearSelectedDocCategory());
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
