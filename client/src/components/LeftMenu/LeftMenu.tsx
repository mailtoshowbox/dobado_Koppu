import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { IStateType } from "../../store/models/root.interface";

import logo from "../../assets/images/login-logo.png";
const LeftMenu: React.FC = () => {
  let [leftMenuVisibility, setLeftMenuVisibility] = useState(false);

  const roles: any = useSelector((state: IStateType) => state.account.roles);
  let [userRole] = useState(roles[0] ? roles[0] : "Developer");

  function changeLeftMenuVisibility() {
    setLeftMenuVisibility(!leftMenuVisibility);
  }

  function getCollapseClass() {
    return leftMenuVisibility ? "" : "collapsed";
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
          <img src={logo} alt="logo"/>
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
            <i className="fas fa-folder-open"></i>
            <span>Documents</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to={`/doctype`}>
            <i className="fas fa-project-diagram"></i>
            <span>Types</span>
          </Link>
        </li>
        {["Superadmin", "Developer", "Qualityuser"].includes(userRole) && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to={`/doccategory`}>
                <i className="fas fa-sitemap"></i>
                <span>Categories</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={`/boxes`}>
                <i className="fas fa-box-open"></i>
                <span>Rack system</span>
              </Link>
            </li>
          </>
        )}
        {["Superadmin", "Developer"].includes(userRole) && (
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
