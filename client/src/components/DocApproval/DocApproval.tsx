import React, { Fragment, Dispatch, useState, useEffect } from "react";
import DocRequestList from "./DocApprovalList";
import ProductForm from "./DocApprovalForm";
import "./DocApproval.css";
import { useDispatch, useSelector } from "react-redux";
import {
  IDocApprovalState,
  IStateType,
  IRootPageStateType,
} from "../../store/models/root.interface";
import Popup from "reactjs-popup";
import {
  clearSelectedDocApproval,
  setModificationState,
  loadListOfDocApproval,
  changeSelectedDocApproval,
} from "../../store/actions/docapproval.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  DocApprovalModificationStatus,
  IDocApproval,
  IDocApprovalList,
} from "../../store/models/docapproval.interface";
import {
  getDocRequestApprovalList,
  updateDocCat,
  initiateApprovalHistory,
} from "../../services/index";
import { IAccount } from "../../store/models/account.interface";
import { updateCurrentPath } from "../../store/actions/root.actions";
import { IDocCategoryList } from "../../store/models/doccategory.interface";

const Products: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const allowedUsers = ["Superadmin", "Developer", "Qualityuser"];
  const roles: any = useSelector((state: IStateType) => state.account.roles);
  let [userRole] = useState(roles[0] ? roles[0] : "Developer");

  const dispatch: Dispatch<any> = useDispatch();
  const docApprovals: IDocApprovalState = useSelector(
    (state: IStateType) => state.docApprovals
  );
  const path: IRootPageStateType = useSelector(
    (state: IStateType) => state.root.page
  );

  const [popup, setPopup] = useState(false);

  useEffect(() => {
    getDocRequestApprovalList(account.auth, account.emp_id).then(
      (items: IDocApprovalList) => {
        dispatch(loadListOfDocApproval(items));
      }
    );
    dispatch(updateCurrentPath("Home", "Document Approval"));
  }, [path.area, dispatch]);

  function onApprovalSelect(approvalDoc: IDocApproval): void {
    dispatch(changeSelectedDocApproval(approvalDoc));
    approvalDoc.page_from = "approval";
    initiateApprovalHistory(account, approvalDoc).then((result: any) => {
      // dispatch(loadListOfDocApproval(items));
    });

    dispatch(setModificationState(DocApprovalModificationStatus.None));
    dispatch(setModificationState(DocApprovalModificationStatus.Edit));
  }

  function onDeleteProduct(product: IDocApproval): void {
    // dispatch(changeSelectedDocApproval(product));
    //  dispatch(setModificationState(DocApprovalModificationStatus.None));
    // onProductRemove();
  }

  function onProductRemove() {
    /* if (doccategories.selectedDocCategory) {
      setPopup(true);
    } */
  }

  return (
    <Fragment>
      <h1 className="h5 mb-4 font-bold">Document Approval</h1>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            {docApprovals.modificationState !==
              DocApprovalModificationStatus.Edit && (
              <div className="card-header py-1">
                <h6 className="m-0 font-weight-bold text-white font-12">
                  Document Approval List
                </h6>
              </div>
            )}
            {docApprovals.modificationState ===
              DocApprovalModificationStatus.Edit && (
              <div className="card-header py-1">
                <h6 className="m-0 font-weight-bold text-white font-12">
                  Update Document Approval
                </h6>
              </div>
            )}
            {docApprovals.modificationState ===
              DocApprovalModificationStatus.Create ||
            (docApprovals.modificationState ===
              DocApprovalModificationStatus.Edit &&
              docApprovals.selectedDocApproval) ? (
              <ProductForm onUpdateDocument={onApprovalSelect} />
            ) : null}
            {docApprovals.modificationState ===
              DocApprovalModificationStatus.Edit && (
              <div className="card-header py-1">
                <h6 className="m-0 font-weight-bold text-white font-12">
                  Document Approval List
                </h6>
              </div>
            )}
            <div className="card-body">
              <DocRequestList
                onSelect={onApprovalSelect}
                onSelectDelete={onDeleteProduct}
                docApprovalModificationStatus={docApprovals.modificationState}
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
                if (!docApprovals.selectedDocApproval) {
                  return;
                }

                let boxInfoUpt = {
                  id: docApprovals.selectedDocApproval._id,
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
                    getDocRequestApprovalList(account.auth).then(
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
