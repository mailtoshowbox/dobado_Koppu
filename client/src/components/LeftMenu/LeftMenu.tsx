import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { IStateType } from "../../store/models/root.interface";

import logo from "../../assets/images/login-logo.png";
const LeftMenu: React.FC = () => {
  let [leftMenuVisibility, setLeftMenuVisibility] = useState(false);

  const roles: any = useSelector((state: IStateType) => state.account.roles);
  let [userRoles] = useState(roles);

  function changeLeftMenuVisibility() {
    setLeftMenuVisibility(!leftMenuVisibility);
  }

  function getCollapseClass() {
    return leftMenuVisibility ? "" : "collapsed";
  }
  function checkAccess() {
    console.log("userRoles---", userRoles);
    var data = userRoles.map((item: string) => {
      console.log("item----", item);
      if (item === "Superadmin") {
        return -1;
      } else if (item === "admin") {
        return 0;
      } else {
        return 1;
      }
    });
    console.log("data---", data);
    return data[0];
  }

  return (
    <Fragment>
      <div className="toggle-area">
        <button
          className="btn btn-primary toggle-button"
          onClick={() => changeLeftMenuVisibility()}
        >
          <i className="fas fa-bolt"></i>
        </button>
      </div>

      <ul
        className={`navbar-nav bg-gradient-primary-green sidebar sidebar-dark accordion ${getCollapseClass()}`}
        id="collapseMenu"
      >
        <a
          className="sidebar-brand d-flex align-items-center justify-content-center"
          href="index.html"
        >
          <img src={logo} />
        </a>

        <hr className="sidebar-divider my-0" />

        <li className="nav-item active">
          <Link className="nav-link" to="Home">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        <hr className="sidebar-divider" />
        <div className="sidebar-heading">Warehouse</div>

        <li className="nav-item">
          <Link className="nav-link" to={`/products`}>
            <i className="fas fa-file-medical-alt"></i>
            <span>Documents</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to={`/doccategory`}>
            <i className="fas fa-project-diagram"></i>
            <span>Categories</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={`/boxes`}>
            <i className="fas fa-box-open"></i>
            <span>Boxes</span>
          </Link>
        </li>
        {checkAccess() === -1 && (
          <div>
            <hr className="sidebar-divider" />
            <div className="sidebar-heading">Admin</div>
            <li className="nav-item">
              <Link className="nav-link" to={`/users`}>
                <i className="fas fa-user-friends"></i>
                <span>Users</span>
              </Link>
            </li>
            <hr className="sidebar-divider d-none d-md-block" />{" "}
          </div>
        )}
      </ul>
    </Fragment>
  );
};

export default LeftMenu;
