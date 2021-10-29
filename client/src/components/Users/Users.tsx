import React, { Fragment, Dispatch, useEffect, useState } from "react";
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
  loadListOfDocDepartment,
} from "../../store/actions/users.action";
import { updateCurrentPath } from "../../store/actions/root.actions";
import {
  getUserList,
  approveUser,
  updateUserProfile,
  getDocDepartmentList,
} from "../../services/index";
import {
  DocDepartmentModificationStatus,
  IDocDepartment,
  IDocDepartmentList,
} from "../../store/models/docdepartment.interface";
import { IUser, IUserList } from "../../store/models/user.interface";
import SelectInput from "../../common/components/Select";
import Checkbox from "../../common/components/Checkbox";
import TextInput from "../../common/components/TextInput";

import { OnChangeModel } from "../../common/types/Form.types";
import { IAccount } from "../../store/models/account.interface";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import Popup from "reactjs-popup";

const Users: React.FC = () => {
  //Block to get the token and set Token
  const account: IAccount = useSelector((state: IStateType) => state.account);

  const dispatch: Dispatch<any> = useDispatch();
  const path: IRootPageStateType = useSelector(
    (state: IStateType) => state.root.page
  );

  const users: IUser[] = useSelector((state: IStateType) => state.users.users);
  const admins: IUser[] = useSelector(
    (state: IStateType) => state.users.admins
  );
  const departmentList: IDocDepartment[] = useSelector(
    (state: IStateType) => state.users.docDepartments
  );

  const [openModalForEditActiveUser, updateModalForEditActiveUser] =
    useState(false);
  const [openModalForEditUser, updateModal] = useState(true);
  const [inActiveUserEdit, updateInActiveUserEdit] = useState({
    name: "",
    email: "",
    roles: "",
    emp_id: "XXXXXX",
    isAllowedForApproval: false,
    departments: [],
    isRemoved : false
  });
  function closeDocUpdate(): void {
    updateModalForEditActiveUser(false);
  }
  useEffect(() => {
    getUserList(account.auth).then((items: IUserList) => {
      dispatch(loadListOfuser(items));
    });

    getUserList(account.auth).then((items: IUserList) => {
      dispatch(loadListOfuser(items));
    });
    getDocDepartmentList(account.auth).then((items: IDocDepartmentList) => {
      dispatch(loadListOfDocDepartment(items));
    });
    dispatch(updateCurrentPath("users", "list"));
  }, [path.area, dispatch]); 

  let listOfDept: { id: string; name: string }[] = [];
  departmentList.forEach((doc) => {
    let me = { id: doc._id, name: doc.name };
    listOfDept.push(me);
  });

  function updateUser(userMode: string): void {
 updateUserProfile(inActiveUserEdit, account).then((status) => {
      getUserList(account.auth).then((items: IUserList) => {
        dispatch(loadListOfuser(items));
        updateModalForEditActiveUser(!openModalForEditActiveUser);
      });
    });
  }

  function removeUser(user:any ): void { 
    let userUpdate = user;
      userUpdate = Object.assign(userUpdate, {isRemoved:true});  
      updateUserProfile(userUpdate, account).then((status) => {
      getUserList(account.auth).then((items: IUserList) => {
        dispatch(loadListOfuser(items)); 
      });
    }); 
  }

  const userRoles = [
    { id: "Documentcreater", name: "Document Creater" },
    { id: "Qualityuser", name: "Quality User" },
    { id: "Deactivated", name: "Deactivate User" },
  ];
  function hasFormValueChanged(model: OnChangeModel): void {
    updateInActiveUserEdit({
      ...inActiveUserEdit,
      [model.field]: model.value,
    });
  }
  const EditUser: React.FC = (props) => {
    const fadeIn = openModalForEditUser ? "in" : "";
    const display = openModalForEditUser ? "block" : "none";
    return (
      <div
        className={`modal fade ${fadeIn}`}
        id="myModal"
        role="dialog"
        style={{ display }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <input
                className={"-" + " form-control editor edit-text"}
                style={{ display: "inline", width: "50%" }}
                type="text"
                value={""}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary">
                Save
              </button>
              <button type="button" className="btn btn-default">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  function toggleField(userMode: string, model: OnChangeModel): void {
    let userUpdate = inActiveUserEdit;
    if (userMode === "inActiveUserEdit") {
      userUpdate = Object.assign({}, inActiveUserEdit, {
        [model.field]: model.value,
      });
    } else if (userMode === "activeUserEdit") {
    }

    updateInActiveUserEdit(userUpdate);
  }

  function selectField(userMode: string, model: OnChangeModel): void {
    let userUpdate = inActiveUserEdit;

    if (userMode === "inActiveUserEdit") {
      if(model.field === 'departments'){
 
const selected_department_details= listOfDept.find((dept)=> dept.id === model.value);
        userUpdate = Object.assign({}, inActiveUserEdit, {
          [model.field]:selected_department_details,
        });
      }else{
        
      
      userUpdate = Object.assign({}, inActiveUserEdit, {
        [model.field]: [model.value],
      });
    }
    } else if (userMode === "activeUserEdit") {
    }

    updateInActiveUserEdit(userUpdate);
  }
  const EditUser1: React.FC = (props: any) => {
    const { row = {} } = props;

    if (inActiveUserEdit.name === "") {
      updateInActiveUserEdit(row);
    }

    const {
      isAllowedForApproval = false,
      roles = [],
      emp_id,
      departments = [],
    } = inActiveUserEdit;
    const useRoles = roles[0];
    const userDepartment = departments[0] ? departments[0] : "";

    return (
      <div className="form-group usrpopup">
        <div className="row">
          <div className="mb-3">Edit 1</div>
        </div>
        <div className="row">
          <div className="mb-3">
            Approval Access
            <Checkbox
              id="input_email"
              field={"isAllowedForApproval"}
              onChange={(event: any) => toggleField("inActiveUserEdit", event)}
              label={""}
              value={isAllowedForApproval}
              name={"isAllowedForApproval"}
              disabled={false}
              customError={""}
              inputClass=" "
            />
          </div>
        </div>
        <div className="row">
          <div className="mb-3">
            <SelectInput
              id="input_category"
              field="roles"
              label="User Role"
              options={userRoles}
              required={true}
              onChange={(event: any) => selectField("inActiveUserEdit", event)}
              value={useRoles}
              type="select"
              customError={""}
              inputClass="form-control"
            />{" "}
          </div>
        </div>
        <div className="row">
          <div className="mb-3">
            <SelectInput
              id="input_department"
              field="departments"
              label="Department"
              options={listOfDept}
              required={true}
              onChange={(event: any) => selectField("inActiveUserEdit", event)}
              value={userDepartment}
              type="select"
              customError={""}
              inputClass="form-control"
            />{" "}
          </div>
        </div>
        <div className="row">
          <div className="mb-3">
            <TextInput
              id="input_request_no"
              field="emp_id"
              value={emp_id}
              onChange={hasFormValueChanged}
              required={false}
              maxLength={6}
              label="Emp Id"
              placeholder="Request Number"
              customError={""}
            />{" "}
          </div>
        </div>
        <div className="form-group row">
          <button
            className="btn btn-primary"
            onClick={(event: any) => updateUser("inActiveUserEdit")}
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  const createNameEditor = (onUpdate: any, props: any) => (
    <EditUser onUpdate={onUpdate} {...props} />
  );
  const userStatusFormatter = (cell: any, row: any) => {
    const verified = row.auth.email.valid;
    if (verified) {
      const userStatus = userRoles.filter((role) => role.id === row.roles[0])[0]
        .name;

      //return row.roles[0] ? row.roles[0] : "No Status";
      return <span className="">{userStatus}</span>;
    }
    return <button className="btn btn-warning">Email not verified</button>;
  };
  const userDepartmentFormatter = (cell: any, row: any) => {
    const verified = row.departments.length > 0;
    if (verified) {
      const userStatus =   row.departments[0].name;
       
      return <span className="">{userStatus}</span>;
    }
    return <span className="btn btn-warning">-</span>;
  };

  const userApprovalFormatter = (cell: any, row: any) => {
    return row.isAllowedForApproval ? "Allowed" : "Not Allowed";
  };
  const userActionEditor = (onUpdate: any, props: any) => {

   return  <EditUser1 onUpdate={onUpdate} {...props} />
  
    }

  const openModalToEditActiveUser = (props: any) => {
    // if (inActiveUserEdit.name === "") {
    updateInActiveUserEdit(props);
    //  }
    updateModalForEditActiveUser(!openModalForEditActiveUser);
  };
  const actionCoumnFormatter = (cell: any, row: any) => {
    const verified = row.auth.email.valid;
    // updateInActiveUserEdit({ name: "" });

    if (verified) {
      //return row.roles[0] ? row.roles[0] : "No Status";
      return (
        <button
          className="btn btn-info userfnt"
          onClick={() => {
            openModalToEditActiveUser(row);
          }}
        >
          {"Update"}
        </button>
      );
    }
    return (
      <>
      <button className="btn btn-light" disabled>
        {"Update"}
      </button>
       

      <button
                className="btn btn-primary"
                onClick={(event: any) => removeUser(row)}
              >
                Remove
              </button>
      </>
    );
  };

  const {
    isAllowedForApproval = false,
    roles = [],
    emp_id,
    departments = [],
  } = inActiveUserEdit;
  const useRoles = roles[0];
  const userDepartment = departments[0] ? departments[0]['id']: "";

  return (
    <Fragment>
      <h1 className="h5 mb-4 font-bold">Users</h1>
      {/* <p className="mb-4 font-14">Users here</p> */}

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
            <div className="card-header py-1">
              <h6 className="m-0 font-weight-bold text-white font-12">
                Approved Users
              </h6>
              <div className="header-buttons"></div>
            </div>
            <div className="card-body"  style={{height: "600px"}}>
              <div>
                <BootstrapTable
                  options={{}}
                  data={admins}
                  pagination={true}
                  hover={true}
                >
                  <TableHeaderColumn
                    dataField="_id"
                    isKey
                    searchable={false}
                    hidden={true}
                  >
                    DC NO
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="emp_id"
                    width="16%"
                    className="thead-light-1"
                  >
                    Emp Id
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="name"
                    width="16%"
                    className="thead-light-1"
                  >
                    Name
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="name"
                    width="16%"
                    className="thead-light-1"
                    dataFormat={userDepartmentFormatter}
                  >
                    Department
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField="email"
                    className="thead-light-1"
                    width="16%"
                  >
                    Email
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="isAllowedForApproval"
                    className="thead-light-1"
                    width="14%"
                    dataFormat={userApprovalFormatter}
                  >
                    Approval Permission
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="roles"
                    className="thead-light-1"
                    width="14%"
                    dataFormat={userStatusFormatter}
                  >
                    Role
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    className="thead-light-1"
                    width="20%"
                    dataFormat={actionCoumnFormatter}
                  >
                    Action
                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-1">
              <h6 className="m-0 font-weight-bold text-white font-12">
                Pending for Approval
              </h6>
              <div className="header-buttons"></div>
            </div>
            <div className="card-body">
              <div>
                <BootstrapTable
                  options={{}}
                  data={users}
                  pagination={true}
                  hover={true}
                  
                >
                  <TableHeaderColumn
                    dataField="_id"
                    isKey
                    searchable={false}
                    hidden={true}
                  >
                    DC NO
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="name"
                    width="16%"
                    className="thead-light-1"
                  >
                    Name
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField="email"
                    className="thead-light-1"
                    width="16%"
                  >
                    Email
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    dataField="roles"
                    className="thead-light-1"
                    width="14%"
                    dataFormat={userStatusFormatter}
                  >
                    Status
                  </TableHeaderColumn>
                  <TableHeaderColumn
                    className="thead-light-1"
                    width="20%"
                    dataFormat={actionCoumnFormatter}
                    
                  >
                    Action
                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Popup className="popup-modal" open={openModalForEditActiveUser}  onClose={() => closeDocUpdate()}>
        <div>
          <div className="form-group usrpopup">
            <div className="row">
              <div className="mb-3">Edit User</div>
            </div>
            <div className="row">
              <div className="mb-3">
                Approval Access
                <Checkbox
                  id="input_email"
                  field={"isAllowedForApproval"}
                  onChange={(event: any) =>
                    toggleField("inActiveUserEdit", event)
                  }
                  label={""}
                  value={isAllowedForApproval}
                  name={"isAllowedForApproval"}
                  disabled={false}
                  customError={""}
                  inputClass=" "
                />
              </div>
            </div>
            <div className="row">
              <div className="mb-3">
                <SelectInput
                  id="input_category"
                  field="roles"
                  label="User Role"
                  options={userRoles}
                  required={true}
                  onChange={(event: any) =>
                    selectField("inActiveUserEdit", event)
                  }
                  value={useRoles}
                  type="select"
                  customError={""}
                  inputClass="form-control"
                />{" "}
              </div>
            </div>
            <div className="row">
              <div className="mb-3">
                <SelectInput
                  id="input_department"
                  field="departments"
                  label="Department"
                  options={listOfDept}
                  required={true}
                  onChange={(event: any) =>
                    selectField("inActiveUserEdit", event)
                  }
                  value={userDepartment}
                  type="select"
                  customError={""}
                  inputClass="form-control"
                />{" "}
              </div>
            </div>
            <div className="row">
              <div className="mb-3">
                <TextInput
                  id="input_request_no"
                  field="emp_id"
                  value={emp_id}
                  onChange={hasFormValueChanged}
                  required={false}
                  maxLength={6}
                  label="Emp Id"
                  placeholder="Request Number"
                  customError={""}
                />{" "}
              </div>
            </div>
            <div className="form-group row">
              <button
                className="btn btn-primary"
                onClick={(event: any) => updateUser("inActiveUserEdit")}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Popup>
    </Fragment>
  );
};

export default Users;
