import React, { Fragment, Dispatch, useState, useEffect } from "react";
import DocRequestList from "./DocRequestList";
import ProductForm from "./DocRequestForm";
import TopCard from "../../common/components/TopCard";
import "./DocRequest.css";
import { useDispatch, useSelector } from "react-redux";
import {
  IDocRequestState,
  IStateType,
  IRootPageStateType,
} from "../../store/models/root.interface";
import Popup from "reactjs-popup";
import {
  clearSelectedDocRequest,
  setModificationState,
  loadListOfDocRequest,
  changeSelectedDocRequest,
} from "../../store/actions/docrequest.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  DocRequestModificationStatus,
  IDocRequest,
  IDocRequestList,
} from "../../store/models/docrequest.interface";
import { getDocRequestList, updateDocCat } from "../../services/index";
import { IAccount } from "../../store/models/account.interface";
import { updateCurrentPath } from "../../store/actions/root.actions";
import { IDocCategoryList } from "../../store/models/doccategory.interface";

const Products: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const allowedUsers = ["Superadmin", "Developer", "Qualityuser"];
  const roles: any = useSelector((state: IStateType) => state.account.roles);
  let [userRole] = useState(roles[0] ? roles[0] : "Developer");
  const dispatch: Dispatch<any> = useDispatch();
  const docRequest: IDocRequestState = useSelector(
    (state: IStateType) => state.docRequests
  );
  const path: IRootPageStateType = useSelector(
    (state: IStateType) => state.root.page
  );

  const [popup, setPopup] = useState(false);

  useEffect(() => {
    getDocRequestList(account.auth, account.emp_id).then(
      (items: IDocRequestList) => {
        dispatch(loadListOfDocRequest(items));
      }
    );
    dispatch(updateCurrentPath("Home", "Document Request"));
  }, [path.area, dispatch]);

  function onProductSelect(product: IDocRequest): void {
    //  dispatch(changeSelectedDocCategory(product));
    // dispatch(setModificationState(DocRequestModificationStatus.None));
    //  dispatch(setModificationState(DocRequestModificationStatus.Edit));
  }

  function onDeleteProduct(product: IDocRequest): void {
    // dispatch(changeSelectedDocCategory(product));
    // dispatch(setModificationState(DocRequestModificationStatus.None));
    // onProductRemove();
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
                      setModificationState(DocRequestModificationStatus.Create)
                    )
                  }
                >
                  <i className="fas fa fa-plus"></i>
                </button>
              </div>
            </div>
            {docRequest.modificationState ===
              DocRequestModificationStatus.Create ||
            (docRequest.modificationState ===
              DocRequestModificationStatus.Edit &&
              docRequest.selectedDocRequest) ? (
              <ProductForm />
            ) : null}
            <div className="card-body">
              <DocRequestList
                onSelect={onProductSelect}
                onSelectDelete={onDeleteProduct}
                docRequestModificationStatus={docRequest.modificationState}
                allowDelete={allowedUsers.includes(userRole)}
              />
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
                if (!docRequest.selectedDocRequest) {
                  return;
                }

                let boxInfoUpt = {
                  id: docRequest.selectedDocRequest._id,
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
                    //  dispatch(clearSelectedDocCategory());
                    getDocRequestList(account.auth).then(
                      (items: IDocCategoryList) => {
                        //  dispatch(loadListOfDocCategory(items));
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
