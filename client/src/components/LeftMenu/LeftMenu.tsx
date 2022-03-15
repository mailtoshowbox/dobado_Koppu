import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { IStateType } from "../../store/models/root.interface";
import { IAccount } from "../../store/models/account.interface";

import logo from "../../assets/images/login-logo-new.png";
const LeftMenu: React.FC = () => {
  let [leftMenuVisibility, setLeftMenuVisibility] = useState(false);
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const { isAllowedForApproval = false } = account;

  const roles: any = useSelector((state: IStateType) => state.account.roles);
  let [userRole] = useState(roles[0] ? roles[0] : "Developer");


  let [activeMenu, setMenu ]= useState(1);
  
  function changeLeftMenuVisibility() {
    setLeftMenuVisibility(!leftMenuVisibility);
  }

  function checkActiveClass(item:any) {
 
   
    if(item === activeMenu){
      return "active";
    }else {
      return "non-active";
    } 
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
        
       
        <Link className="nav-link" to="Home">
          <img src={logo} alt="logo" width="130" height="70" />
          </Link>

        <hr className="sidebar-divider my-0" />

        <li 
        className={`nav-item ${checkActiveClass(1)}`}  onClick={() => setMenu(1)}>
          <Link className="nav-link" to="Home">
            <i className="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </Link>
        </li>

        <hr className="sidebar-divider" />
        {/* <div className="sidebar-heading">Warehouse</div> */}

        <li  className={`nav-item ${checkActiveClass(2)}`}  onClick={() => setMenu(2)}>
          <Link className="nav-link" to={`/products`}>
            <i className="fas fa-folder-open"></i>
            <span>Documents</span>
          </Link>
        </li>
        <li   className={`nav-item ${checkActiveClass(3)}`}   onClick={() => setMenu(3)}>
          <Link className="nav-link" to={`/requestdoc`}>
            <i className="fas fa-folder-open"></i>
            <span>Document Request</span>
          </Link>
        </li>
        <li  className={`nav-item ${checkActiveClass(4)}`}  onClick={() => setMenu(4)}>
          <Link className="nav-link" to={`/doctype`}>
            <i className="fas fa-project-diagram"></i>
            <span>Types</span>
          </Link>
        </li>
        {["Superadmin", "Developer", "Qualityuser"].includes(userRole) && (
          <>
            <li  className={`nav-item ${checkActiveClass(5)}`}  onClick={() => setMenu(5)}>
              <Link className="nav-link" to={`/doccategory`}>
                <i className="fas fa-sitemap"></i>
                <span>Compactor</span>
              </Link>
            </li>
            <li  className={`nav-item ${checkActiveClass(6)}`}  onClick={() => setMenu(6)}>
              <Link className="nav-link" to={`/boxes`}>
                <i className="fas fa-box-open"></i>
                <span>Rack system</span>
              </Link>
            </li>
            <li className={`nav-item ${checkActiveClass(7)}`}  onClick={() => setMenu(7)}>
              <Link className="nav-link" to={`/department`}>
                <i className="fas fa-sitemap"></i>
                <span>Department</span>
              </Link>
            </li>

            <li className={`nav-item ${checkActiveClass(8)}`}  onClick={() => setMenu(8)}>
              <Link className="nav-link" to={`/docrequestapproval`}>
                <i className="fas fa-sitemap"></i>
                <span>Approve Document</span>
              </Link>
            </li>
            
            
            <li className={`nav-item ${checkActiveClass(9)}`}  onClick={() => setMenu(9)}>
              <Link className="nav-link" to={`/genarateissuance`}>
                <i className="fas fa-sitemap"></i>
                <span>Generate Issuance</span>
              </Link>
            </li>
            <li className={`nav-item ${checkActiveClass(10)}`} onClick={() => setMenu(10)}>
              <Link className="nav-link" to={`/genarateissuancetakeout`}>
                <i className="fas fa-sitemap"></i>
                <span>TakeOut</span>
              </Link>
            </li>
            <li className={`nav-item ${checkActiveClass(11)}`} onClick={() => setMenu(11)}>
              <Link className="nav-link" to={`/documentsubmit`}>
                <i className="fas fa-sitemap"></i>
                <span>Doc Submit</span>
              </Link>
            </li>
            <li className={`nav-item ${checkActiveClass(12)}`} onClick={() => setMenu(12)}>
              <Link className="nav-link" to={`/documentlogsheet`}>
                <i className="fas fa-sitemap"></i>
                <span>Doc LogSheet</span>
              </Link>
            </li>
            <li className={`nav-item ${checkActiveClass(13)}`} onClick={() => setMenu(13)}>
              <Link className="nav-link" to={`/documentdestruct`}>
                <i className="fas fa-sitemap"></i>
                <span>Doc Destruct</span>
              </Link>
            </li>
          </>
        )}

        {["Documentcreater"].includes(userRole) && isAllowedForApproval && (
          <>
            {" "}
            <li className={`nav-item ${checkActiveClass(14)}`}  onClick={() => setMenu(14)}>
              <Link className="nav-link" to={`/docrequestapproval`}>
                <i className="fas fa-sitemap"></i>
                <span>Approve Document</span>
              </Link>
            </li> 
            
          </>
        )}

         {["Documentcreater"].includes(userRole) && (
          <>
            {" "}
            <li className={`nav-item ${checkActiveClass(15)}`}  onClick={() => setMenu(15)}>
              <Link className="nav-link" to={`/documentsubmit`}>
                <i className="fas fa-sitemap"></i>
                <span>Doc Submit.</span>
              </Link>
            </li>
          </>
        )}

        {["Superadmin", "Developer"].includes(userRole) && (
          <div className="admin_cls">
            <hr className="sidebar-divider" />
            <div className="sidebar-heading fnt">Admin</div>
            <li className={`nav-item ${checkActiveClass(16)}`}  onClick={() => setMenu(16)}>
              <Link className="nav-link" to={`/users`}>
                <i className="fas fa-user-friends"></i>
                <span>Users</span>
              </Link>
            </li>
            <>
            {" "}
            <li className={`nav-item ${checkActiveClass(17)}`}  onClick={() => setMenu(17)}>
              <Link className="nav-link" to={`/auditLog`}>
                <i className="fas fa-sitemap"></i>
                <span>Audit Log.</span>
              </Link>
            </li>
          </>
            <hr className="sidebar-divider d-none d-md-block" />{" "}
          </div>
        )}
      </ul>
    </Fragment>
  );
};

export default LeftMenu;
