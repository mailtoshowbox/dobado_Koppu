import React, { Fragment, Dispatch, useState, useEffect } from "react";
import BoxesList from "./BoxesList";
import BoxForm from "./BoxesForm";
import TopCard from "../../common/components/TopCard";
import "./Boxes.css";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPath } from "../../store/actions/root.actions";
import {
  IBoxState,
  IStateType,
  IRootPageStateType,
} from "../../store/models/root.interface";
import Popup from "reactjs-popup";
import {
  removeBox,
  clearSelectedBox,
  setModificationState,
  changeSelectedBox,
  loadListOfBox,
} from "../../store/actions/box.action";
import { addNotification } from "../../store/actions/notifications.action";
import {
  BoxModificationStatus,
  IBox,
  IBoxList,
} from "../../store/models/box.interface";
import { getBoxList, updateBox } from "../../services/index";
import { IAccount } from "../../store/models/account.interface";

const Boxs: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const allowedUsers = ["Superadmin", "Developer", "Qualityuser"];
  const roles: any = useSelector((state: IStateType) => state.account.roles);
  let [userRole] = useState(roles[0] ? roles[0] : "Developer");

  const dispatch: Dispatch<any> = useDispatch();
  const boxes: IBoxState = useSelector((state: IStateType) => state.boxes);
  const path: IRootPageStateType = useSelector(
    (state: IStateType) => state.root.page
  );
  const numberItemsCount: number = boxes.boxes.length;
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    getBoxList(account.auth).then((items: IBoxList) => {
      dispatch(loadListOfBox(items));
    });
    dispatch(clearSelectedBox());
    dispatch(updateCurrentPath("boxes", "list"));
  }, [path.area, dispatch]);

  function onBoxSelect(box: IBox): void {
    dispatch(changeSelectedBox(box));
    dispatch(setModificationState(BoxModificationStatus.None));
    dispatch(setModificationState(BoxModificationStatus.Edit));
  }

  function onBoxRemove() {
    if (boxes.selectedBox) {
      setPopup(true);
    }
  }

  function onDeleteProduct(box: IBox): void {
    dispatch(changeSelectedBox(box));
    dispatch(setModificationState(BoxModificationStatus.None));
    onProductRemove();
  }

  function onProductRemove() {
    if (boxes.selectedBox) {
      setPopup(true);
    }
  }

  return (
    <Fragment>
      <h1 className="h5 mb-4 font-bold">Boxes</h1>
      {/* <p className="mb-4 font-14">Boxes here</p> */}
      <div className="row">
        <TopCard
          title="Boxes"
          text={`${numberItemsCount}`}
          icon="box-open"
          class="success"
        />
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-1">
              <h6 className="m-0 font-weight-bold text-white">Box List</h6>
              <div className="header-buttons">
                <button
                  className="btn btn-border"
                  onClick={() =>
                    dispatch(setModificationState(BoxModificationStatus.Create))
                  }
                >
                  <i className="fas fa fa-plus"></i>
                </button>

                {/*  <button className="btn btn-border btn-red-color" onClick={() => onBoxRemove()}>
                  <i className="fas fa fa-times"></i>
                </button> */}
              </div>
            </div>

            {boxes.modificationState === BoxModificationStatus.Create ||
            (boxes.modificationState === BoxModificationStatus.Edit &&
              boxes.selectedBox) ? (
              <BoxForm />
            ) : null}
            <div className="card-body">
              <BoxesList
                onSelect={onBoxSelect}
                onSelectDelete={onDeleteProduct}
                boxModificationStatus={boxes.modificationState}
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
                if (!boxes.selectedBox) {
                  return;
                }
                let boxInfoUpt = {
                  id: boxes.selectedBox._id,
                  isActive: false,
                };
                updateBox(boxInfoUpt, account)
                  .then((status) => {
                    dispatch(
                      addNotification("Box removed", `Box  was removed`)
                    );
                    dispatch(clearSelectedBox());
                    setPopup(false);
                  })
                  .catch((err) => {
                    dispatch(addNotification("Failed", `Box  not removed`));
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

export default Boxs;
