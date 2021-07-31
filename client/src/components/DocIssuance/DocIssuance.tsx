import React, { Fragment, Dispatch, useState, useEffect } from "react";
import DocRequestList from "./DocIssuanceList";
import ProductForm from "./DocIssuanceForm";
import "./DocIssuance.css";
import { useDispatch, useSelector } from "react-redux";
import {
  IDocIssuanceState,
  IStateType,
  IRootPageStateType,
} from "../../store/models/root.interface";
import Popup from "reactjs-popup";
import {
  clearSelectedDocIssuance,
  setModificationState,
  loadListOfDocIssuance,
  changeSelectedDocIssuance,
} from "../../store/actions/docissuance.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  DocIssuanceModificationStatus,
  IDocIssuance,
  IDocIssuanceList,
} from "../../store/models/docIssuance.interface";
import {
  getDocIssuanceList,
  updateDocCat,
  initiateApprovalHistory,
} from "../../services/index";
import { IAccount } from "../../store/models/account.interface";
import { updateCurrentPath } from "../../store/actions/root.actions";

const Products: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const allowedUsers = ["Superadmin", "Developer", "Qualityuser"];
  const roles: any = useSelector((state: IStateType) => state.account.roles);
  let [userRole] = useState(roles[0] ? roles[0] : "Developer");

  const dispatch: Dispatch<any> = useDispatch();
  const docIssuance: IDocIssuanceState = useSelector(
    (state: IStateType) => state.docIssuances
  );
  const path: IRootPageStateType = useSelector(
    (state: IStateType) => state.root.page
  );

  const [popup, setPopup] = useState(false);

  useEffect(() => {
    getDocIssuanceList(account.auth, account.emp_id).then(
      (items: IDocIssuanceList) => {
        dispatch(loadListOfDocIssuance(items));
      }
    );
    dispatch(updateCurrentPath("Home", "Categories"));
  }, [path.area, dispatch]);

  function onApprovalSelect(approvalDoc: IDocIssuance): void {
    dispatch(changeSelectedDocIssuance(approvalDoc));

    dispatch(setModificationState(DocIssuanceModificationStatus.None));
    dispatch(setModificationState(DocIssuanceModificationStatus.Edit));
  }

  function onDeleteProduct(product: IDocIssuance): void {
    // dispatch(changeSelectedDocApproval(product));
    //  dispatch(setModificationState(DocIssuanceModificationStatus.None));
    // onProductRemove();
  }

  function onProductRemove() {
    /* if (doccategories.selectedDocCategory) {
      setPopup(true);
    } */
  }

  return (
    <Fragment>
      <h1 className="h5 mb-4 font-bold">Genarate Issuance</h1>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            {docIssuance.modificationState !==
              DocIssuanceModificationStatus.Edit && (
              <div className="card-header py-1">
                <h6 className="m-0 font-weight-bold text-white font-12">
                  Document Issuance List
                </h6>
              </div>
            )}
            {docIssuance.modificationState ===
              DocIssuanceModificationStatus.Edit && (
              <div className="card-header py-1">
                <h6 className="m-0 font-weight-bold text-white font-12">
                  Document Issuance
                </h6>
              </div>
            )}
            {docIssuance.modificationState ===
              DocIssuanceModificationStatus.Create ||
            (docIssuance.modificationState ===
              DocIssuanceModificationStatus.Edit &&
              docIssuance.selectedDocIssuance) ? (
              <ProductForm />
            ) : null}
            {docIssuance.modificationState ===
              DocIssuanceModificationStatus.Edit && (
              <div className="card-header py-1">
                <h6 className="m-0 font-weight-bold text-white font-12">
                  Document Issuance List
                </h6>
              </div>
            )}
            <div className="card-body">
              <DocRequestList
                onSelect={onApprovalSelect}
                onSelectDelete={onDeleteProduct}
                docIssuanceModificationStatus={docIssuance.modificationState}
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
                if (!docIssuance.selectedDocIssuance) {
                  return;
                }

                let boxInfoUpt = {
                  id: docIssuance.selectedDocIssuance._id,
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
                    getDocIssuanceList(account.auth).then(
                      (items: IDocIssuance) => {
                        //  dispatch(loadListOfDocCategory(items));
                      }
                    );
                    setPopup(false);
                  })
                  .catch((err) => {
                    dispatch(
                      addNotification(
                        "Category not removedf",
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
