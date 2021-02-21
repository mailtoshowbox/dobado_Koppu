import React, { Fragment, Dispatch, useState, useEffect } from "react";
import DocTypeList from "./DocTypeList";
import ProductForm from "./DocTypeForm";
import TopCard from "../../common/components/TopCard";
import "./DocType.css";
import { useDispatch, useSelector } from "react-redux";
import {
  IDocTypeState,
  IStateType,
  IRootPageStateType,
} from "../../store/models/root.interface";
import Popup from "reactjs-popup";
import {
  clearSelectedDocType,
  setModificationState,
  loadListOfDocType,
  changeSelectedDocType,
} from "../../store/actions/doctype.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  DocTypeModificationStatus,
  IDocType,
  IDocTypeList,
} from "../../store/models/doctype.interface";
import { getDocTypeList, updateDocType } from "../../services/index";
import { IAccount } from "../../store/models/account.interface";

const Products: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const allowedUsers = ["Superadmin", "Developer", "Qualityuser"];
  const roles: any = useSelector((state: IStateType) => state.account.roles);
  let [userRole] = useState(roles[0] ? roles[0] : "Developer");

  const dispatch: Dispatch<any> = useDispatch();
  const docType: IDocTypeState = useSelector(
    (state: IStateType) => state.docTypes
  );
  const path: IRootPageStateType = useSelector(
    (state: IStateType) => state.root.page
  );

  const numberItemsCount: number =
    docType.docTypes !== undefined ? docType.docTypes.length : 0;
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    getDocTypeList(account.auth).then((items: IDocTypeList) => {
      dispatch(loadListOfDocType(items));
    });
  }, [path.area, dispatch]);

  function onProductSelect(product: IDocType): void {
    dispatch(changeSelectedDocType(product));
    dispatch(setModificationState(DocTypeModificationStatus.None));
    dispatch(setModificationState(DocTypeModificationStatus.Edit));
  }

  function onDeleteProduct(product: IDocType): void {
    dispatch(changeSelectedDocType(product));
    dispatch(setModificationState(DocTypeModificationStatus.None));
    onProductRemove();
  }

  function onProductRemove() {
    if (docType.selectedDocType) {
      setPopup(true);
    }
  }

  return (
    <Fragment>
      <h1 className="h5 mb-4 font-bold">Document Types</h1>
      {/* <p className="mb-4 font-14">Document Category here</p> */}
      <div className="row">
        <TopCard
          title="Types"
          text={`${numberItemsCount}`}
          icon="project-diagram"
          class="success"
        />
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-1">
              <h6 className="m-0 font-weight-bold text-white font-12">
                Document Type List
              </h6>
              <div className="header-buttons">
                <button
                  className="btn btn-border"
                  onClick={() =>
                    dispatch(
                      setModificationState(DocTypeModificationStatus.Create)
                    )
                  }
                >
                  <i className="fas fa fa-plus"></i>
                </button>

                {/*  <button
                  className="btn btn-border  btn-red-color"
                  onClick={() => onProductRemove()}
                >
                  <i className="fas fa fa-trash" aria-hidden="true"></i>
                </button> */}
              </div>
            </div>
            {docType.modificationState === DocTypeModificationStatus.Create ||
            (docType.modificationState === DocTypeModificationStatus.Edit &&
              docType.selectedDocType) ? (
              <ProductForm />
            ) : null}
            <div className="card-body">
              <DocTypeList
                onSelect={onProductSelect}
                onSelectDelete={onDeleteProduct}
                allowDelete={allowedUsers.includes(userRole)}
                docCategoryModificationStatus={docType.modificationState}
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
                if (!docType.selectedDocType) {
                  return;
                }

                let boxInfoUpt = {
                  id: docType.selectedDocType._id,
                  isActive: false,
                };
                updateDocType(boxInfoUpt, account)
                  .then((status) => {
                    dispatch(
                      addNotification("Type removed", `Type  was removed`)
                    );
                    dispatch(clearSelectedDocType());
                    setPopup(false);
                  })
                  .catch((err) => {
                    dispatch(addNotification("Failed", `Type  not removed`));
                    setPopup(false);
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
