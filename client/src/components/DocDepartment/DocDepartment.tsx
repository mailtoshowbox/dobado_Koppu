import React, { Fragment, Dispatch, useState, useEffect } from "react";
import DocDepartmentList from "./DocDepartmentList";
import ProductForm from "./DocDepartmentForm";
import TopCard from "../../common/components/TopCard";
import "./DocDepartment.css";
import { useDispatch, useSelector } from "react-redux";
import {
  IDocDepartmentState,
  IStateType,
  IRootPageStateType,
} from "../../store/models/root.interface";
import Popup from "reactjs-popup";
import {
  clearSelectedDocDepartment,
  setModificationState,
  loadListOfDocDepartment,
  changeSelectedDocDepartment,
} from "../../store/actions/docdepartment.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  DocDepartmentModificationStatus,
  IDocDepartment,
  IDocDepartmentList,
} from "../../store/models/docdepartment.interface";
import { getDocDepartmentList, updateDocCat } from "../../services/index";
import { IAccount } from "../../store/models/account.interface";
import { updateCurrentPath } from "../../store/actions/root.actions";

const Products: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const allowedUsers = ["Superadmin", "Developer", "Qualityuser"];
  const roles: any = useSelector((state: IStateType) => state.account.roles);
  let [userRole] = useState(roles[0] ? roles[0] : "Developer");
  const dispatch: Dispatch<any> = useDispatch();
  const doccategories: IDocDepartmentState = useSelector(
    (state: IStateType) => state.docDepartments
  );
  const path: IRootPageStateType = useSelector(
    (state: IStateType) => state.root.page
  );

  const numberItemsCount: number =
    doccategories.docDepartments !== undefined
      ? doccategories.docDepartments.length
      : 0;
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    getDocDepartmentList(account.auth).then((items: IDocDepartmentList) => {
      dispatch(loadListOfDocDepartment(items));
    });
    dispatch(updateCurrentPath("Home", "Categories"));
  }, [path.area, dispatch]);

  function onProductSelect(product: IDocDepartment): void {
    dispatch(changeSelectedDocDepartment(product));
    dispatch(setModificationState(DocDepartmentModificationStatus.None));
    dispatch(setModificationState(DocDepartmentModificationStatus.Edit));
  }

  function onDeleteProduct(product: IDocDepartment): void {
    dispatch(changeSelectedDocDepartment(product));
    dispatch(setModificationState(DocDepartmentModificationStatus.None));
    onProductRemove();
  }

  function onProductRemove() {
    if (doccategories.selectedDocDepartment) {
      setPopup(true);
    }
  }

  return (
    <Fragment>
      <h1 className="h5 mb-4 font-bold">Departments</h1>
      {/* <p className="mb-4 font-14">Document Department here</p> */}
      <div className="row">
        <TopCard
          title="Departments"
          text={`${numberItemsCount}`}
          icon="sitemap"
          class="success"
        />
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-1">
              <h6 className="m-0 font-weight-bold text-white font-12">
                Department List
              </h6>
              <div className="header-buttons">
                <button
                  className="btn btn-border"
                  onClick={() =>
                    dispatch(
                      setModificationState(
                        DocDepartmentModificationStatus.Create
                      )
                    )
                  }
                >
                  <i className="fas fa fa-plus"></i>
                </button>
              </div>
            </div>
            {doccategories.modificationState ===
              DocDepartmentModificationStatus.Create ||
            (doccategories.modificationState ===
              DocDepartmentModificationStatus.Edit &&
              doccategories.selectedDocDepartment) ? (
              <ProductForm />
            ) : null}
            <div className="card-body">
              <DocDepartmentList
                onSelect={onProductSelect}
                onSelectDelete={onDeleteProduct}
                allowDelete={allowedUsers.includes(userRole)}
                docDepartmentModificationStatus={
                  doccategories.modificationState
                }
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
                if (!doccategories.selectedDocDepartment) {
                  return;
                }

                let boxInfoUpt = {
                  id: doccategories.selectedDocDepartment._id,
                  isActive: false,
                };
                updateDocCat(boxInfoUpt, account)
                  .then((status) => {
                    dispatch(
                      addNotification(
                        "Department removed",
                        `Department  was removed`
                      )
                    );
                    dispatch(clearSelectedDocDepartment());
                    getDocDepartmentList(account.auth).then(
                      (items: IDocDepartmentList) => {
                        dispatch(loadListOfDocDepartment(items));
                      }
                    );
                    setPopup(false);
                  })
                  .catch((err) => {
                    dispatch(
                      addNotification(
                        "Department not removed",
                        `Department  not removed`
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
