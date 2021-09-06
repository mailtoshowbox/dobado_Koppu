import React, { Fragment, Dispatch, useState, useEffect } from "react";
import DocRequestList from "./DocIssuanceTakeoutList";
import ProductForm from "./DocIssuanceTakeoutForm";
import "./DocIssuanceTakeout.css";
import { useDispatch, useSelector } from "react-redux";
import {
  IDocIssuanceTakeoutState,
  IStateType,
  IRootPageStateType,
} from "../../store/models/root.interface";
import Popup from "reactjs-popup";
import {
  clearSelectedDocIssuance,
  setModificationState,
  loadListOfDocIssuanceTakeout,
  changeSelectedDocIssuance,
} from "../../store/actions/docissuancetakeout.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  DocIssuanceTakeoutModificationStatus,
  IDocIssuanceTakeout,
  IDocIssuanceTakeoutList,
} from "../../store/models/docIssuancetakeout.interface";
import {
  getDocIssuancetakeoutList,
  updateDocCat,
  initiateApprovalHistory,
} from "../../services/index";
import { IAccount } from "../../store/models/account.interface";
import { updateCurrentPath } from "../../store/actions/root.actions";

const DocIssuanceTakeout: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const allowedUsers = ["Superadmin", "Developer", "Qualityuser"];
  const roles: any = useSelector((state: IStateType) => state.account.roles);
  let [userRole] = useState(roles[0] ? roles[0] : "Developer");

  const dispatch: Dispatch<any> = useDispatch();

  const docIssuance: IDocIssuanceTakeoutState = useSelector(
    (state: IStateType) => state.docIssuancesTakeout
  );
   
  const path: IRootPageStateType = useSelector(
    (state: IStateType) => state.root.page
  );

  const [popup, setPopup] = useState(false);

  console.log("state----", docIssuance);

  useEffect(() => {
    getDocIssuancetakeoutList(account.auth, account.emp_id).then(
      (items: IDocIssuanceTakeoutList) => {
        console.log("items---",items);
        dispatch(loadListOfDocIssuanceTakeout(items));
      }
    );
    dispatch(updateCurrentPath("Home", "Genarate Issuance Takeout"));
  }, [path.area, dispatch]);

  function onApprovalSelect(approvalDoc: IDocIssuanceTakeout): void {
    console.log("modificationState-approvalDoc---",approvalDoc);
    
    dispatch(changeSelectedDocIssuance(approvalDoc));
    dispatch(setModificationState(DocIssuanceTakeoutModificationStatus.None));
    dispatch(setModificationState(DocIssuanceTakeoutModificationStatus.Edit));
  }

  function onDeleteProduct(product: IDocIssuanceTakeout): void {
    // dispatch(changeSelectedDocApproval(product));
    //  dispatch(setModificationState(DocIssuanceTakeoutModificationStatus.None));
    // onProductRemove();
  }

  function onProductRemove() {
    /* if (doccategories.selectedDocCategory) {
      setPopup(true);
    } */
  }

  return (
    <Fragment>
      <h1 className="h5 mb-4 font-bold">Genarate Issuance Takeout</h1>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            {docIssuance.modificationState !==
              DocIssuanceTakeoutModificationStatus.Edit && (
              <div className="card-header py-1">
                <h6 className="m-0 font-weight-bold text-white font-12">
                  Document Issuance Takeout List
                </h6>
              </div>
            )}
            {docIssuance.modificationState ===
              DocIssuanceTakeoutModificationStatus.Edit && (
              <div className="card-header py-1">
                <h6 className="m-0 font-weight-bold text-white font-12">
                  Document Issuance Takeout
                </h6>
              </div>
            )}
            {docIssuance.modificationState ===
              DocIssuanceTakeoutModificationStatus.Create ||
            (docIssuance.modificationState ===
              DocIssuanceTakeoutModificationStatus.Edit &&
              docIssuance.selectedDocIssuanceTakeout) ? (
              <ProductForm />
            ) : null}
            {docIssuance.modificationState ===
              DocIssuanceTakeoutModificationStatus.Edit && (
              <div className="card-header py-1">
                <h6 className="m-0 font-weight-bold text-white font-12">
                  Document Issuance Takeout List
                </h6>
              </div>
            )}
            <div className="card-body" style={{ height: "650px" }}>
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
                if (!docIssuance.selectedDocIssuanceTakeout) {
                  return;
                }

                let boxInfoUpt = {
                  id: docIssuance.selectedDocIssuanceTakeout._id,
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
                    getDocIssuancetakeoutList(account.auth).then(
                      (items: IDocIssuanceTakeout) => {
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

export default DocIssuanceTakeout;