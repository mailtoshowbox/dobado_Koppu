import React, { Fragment, Dispatch, useEffect } from "react";
import TopCard from "../../common/components/TopCard";

import { useDispatch, useSelector } from "react-redux";
import {
  IStateType,
  IRootPageStateType,
} from "../../store/models/root.interface";
import {
  addAdmin,
  removeAdmin,
  loadListOfuser,
} from "../../store/actions/users.action";
import { updateCurrentPath } from "../../store/actions/root.actions";
import { getUserList, approveUser } from "../../services/index";
import { IUser, IUserList } from "../../store/models/user.interface";
import SelectInput from "../../common/components/Select";
import { OnChangeModel } from "../../common/types/Form.types";
const Users: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const path: IRootPageStateType = useSelector(
    (state: IStateType) => state.root.page
  );

  const users: IUser[] = useSelector((state: IStateType) => state.users.users);
  const admins: IUser[] = useSelector(
    (state: IStateType) => state.users.admins
  );

  useEffect(() => {
    getUserList().then((items: IUserList) => {
      console.log("items---", items);
      dispatch(loadListOfuser(items));
    });
    dispatch(updateCurrentPath("users", "list"));
  }, [path.area, dispatch]);

  function setUserAdmin(user: IUser): void {
    dispatch(addAdmin(user));
  }

  function setUserNotAdmin(admin: IUser): void {
    dispatch(removeAdmin(admin));
  }
  function activateUser(admin: IUser, model: OnChangeModel): void {
    approveUser({ user: admin, selected: model }).then((status) => {
      getUserList().then((items: IUserList) => {
        console.log("items---", items);
        dispatch(loadListOfuser(items));
      });
      console.log("APproved Suer");

      // dispatch(addNotification("New Box added", `User  added by you`));
      //  dispatch(clearSelectedBox());
      //  dispatch(setModificationState(BoxModificationStatus.None));
    });

    // dispatch(removeAdmin(admin));
  }

  const userElements: JSX.Element[] = users.map((user) => {
    console.log("user----", user);
    const verified = user.auth.email.valid;
    const roles = user.roles[0];
    return (
      <tr className={`table-row`} key={`user_${user.id}`}>
        <th scope="row">{user.id}</th>
        <td>{user.name}</td>

        <td>{user.email}</td>
        {verified && (
          <td>
            {/*   <button
              className="btn btn-success"
              onClick={() => activateUser(user)}
            >
              Activate
            </button> */}
            <SelectInput
              id="input_category"
              field="Activate as"
              label=""
              options={[
                { id: "Documentcreater", name: "Document Creater" },
                { id: "Qualityuser", name: "Quality User" },
                { id: "Deactivated", name: "Waiting for Approval" },
              ]}
              required={true}
              onChange={(event: any) => activateUser(user, event)}
              value={roles}
              type="select"
              customError="dsf"
            />{" "}
          </td>
        )}
        {!verified && (
          <td>
            <button className="btn btn-warning">Email not verified</button>{" "}
          </td>
        )}
      </tr>
    );
  });

  const adminElements: JSX.Element[] = admins.map((admin) => {
    const roless = admin.roles[0];

    return (
      <tr className={`table-row`} key={`user_${admin.id}`}>
        <th scope="row">{admin.id}</th>
        <td>{admin.name}</td>

        <td>{admin.email}</td>
        <td>
          <button className="btn btn-success">{admin.roles[0]}</button>{" "}
        </td>
        <td>
          <SelectInput
            id="input_category"
            field="Activate as"
            label=""
            options={[
              { id: "Documentcreater", name: "Document Creater" },
              { id: "Qualityuser", name: "Quality User" },
              { id: "Deactivated", name: "Deactivated" },
            ]}
            required={true}
            onChange={(event: any) => activateUser(admin, event)}
            value={roless}
            type="select"
            customError="dsf"
          />{" "}
        </td>
      </tr>
    );
  });

  return (
    <Fragment>
      <h1 className="h3 mb-2 text-gray-800">Users</h1>
      <p className="mb-4">Users here</p>

      <div className="row">
        <TopCard
          title="Approved Users"
          text={admins.length.toString()}
          icon="user-tie"
          class="primary"
        />
        <TopCard
          title="Pending for Approval"
          text={users.length.toString()}
          icon="user"
          class="danger"
        />
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-2">
              <h6 className="m-0 font-weight-bold text-white">Approved List</h6>
              <div className="header-buttons"></div>
            </div>
            <div className="card-body">
              <div className="table-responsive portlet">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>

                      <th scope="col">Email</th>
                      <th scope="col">Status</th>
                      <th scope="col">Revert as</th>
                    </tr>
                  </thead>
                  <tbody>{adminElements}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-2">
              <h6 className="m-0 font-weight-bold text-white">
                Pending for Approval
              </h6>
              <div className="header-buttons"></div>
            </div>
            <div className="card-body">
              <div className="table-responsive portlet">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Activate as</th>
                    </tr>
                  </thead>
                  <tbody>{userElements}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Users;
