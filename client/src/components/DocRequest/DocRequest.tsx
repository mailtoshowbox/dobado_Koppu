import React, { Fragment, Dispatch, useState, useEffect } from "react";
import DocCategoryList from "./DocRequestList";
import ProductForm from "./DocRequestForm";
import TopCard from "../../common/components/TopCard";
import "./DocRequest.css";
import { useDispatch, useSelector } from "react-redux";
import {
  IDocCategoryState,
  IStateType,
  IRootPageStateType,
} from "../../store/models/root.interface";
import Popup from "reactjs-popup";
import {
  clearSelectedDocCategory,
  setModificationState,
  loadListOfDocCategory,
  changeSelectedDocCategory,
} from "../../store/actions/doccategory.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  DocCategoryModificationStatus,
  IDocCategory,
  IDocCategoryList,
} from "../../store/models/doccategory.interface";
import { getDocCategoryList, updateDocCat } from "../../services/index";
import { IAccount } from "../../store/models/account.interface";
import { updateCurrentPath } from "../../store/actions/root.actions";

const Products: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const allowedUsers = ["Superadmin", "Developer", "Qualityuser"];
  const roles: any = useSelector((state: IStateType) => state.account.roles);
  let [userRole] = useState(roles[0] ? roles[0] : "Developer");
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
    getDocCategoryList(account.auth).then((items: IDocCategoryList) => {
      dispatch(loadListOfDocCategory(items));
    });
    dispatch(updateCurrentPath("Home", "Categories"));
  }, [path.area, dispatch]);

  function onProductSelect(product: IDocCategory): void {
    dispatch(changeSelectedDocCategory(product));
    dispatch(setModificationState(DocCategoryModificationStatus.None));
    dispatch(setModificationState(DocCategoryModificationStatus.Edit));
  }

  function onDeleteProduct(product: IDocCategory): void {
    dispatch(changeSelectedDocCategory(product));
    dispatch(setModificationState(DocCategoryModificationStatus.None));
    onProductRemove();
  }

  function onProductRemove() {
    if (doccategories.selectedDocCategory) {
      setPopup(true);
    }
  }

  return (
    <Fragment>
      <h1 className="h5 mb-4 font-bold">Document Request</h1>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-1">
              <h6 className="m-0 font-weight-bold text-white font-12">
                New Document Request
              </h6>
              <div className="header-buttons">
                <button
                  className="btn btn-border"
                  onClick={() =>
                    dispatch(
                      setModificationState(DocCategoryModificationStatus.Create)
                    )
                  }
                >
                  <i className="fas fa fa-plus"></i>
                </button>
              </div>
            </div>

            <ProductForm />
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

                let boxInfoUpt = {
                  id: doccategories.selectedDocCategory._id,
                  isActive: false,
                };
                updateDocCat(boxInfoUpt, account)
                  .then((status) => {
                    dispatch(
                      addNotification(
                        "Category removed",
                        `Category  was removed`
                      )
                    );
                    dispatch(clearSelectedDocCategory());
                    getDocCategoryList(account.auth).then(
                      (items: IDocCategoryList) => {
                        dispatch(loadListOfDocCategory(items));
                      }
                    );
                    setPopup(false);
                  })
                  .catch((err) => {
                    dispatch(
                      addNotification(
                        "Category not removed",
                        `Category  not removed`
                      )
                    );
                  });
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
