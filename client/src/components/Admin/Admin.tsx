import React, { Fragment } from "react";
import LeftMenu from "../LeftMenu/LeftMenu";
import TopMenu from "../TopMenu/TopMenu";
import { Switch, Route } from "react-router";
import Users from "../Users/Users";
import Products from "../Products/Products";
import Orders from "../Orders/Orders";
import Boxes from "../Boxes/Boxes";
import Home from "../Home/Home";
import DocCategories from "../DocCategory/DocCategory";
import DocRequest from "../DocRequest/DocRequest";
import DocRequestApproval from "../DocApproval/DocApproval";
import DocIssuance from "../DocIssuance/DocIssuance";
import DocDepartment from "../DocDepartment/DocDepartment";
import DocTypes from "../DocType/DocType";
import Notifications from "../../common/components/Notification";
import { useSelector } from "react-redux";
import { IStateType } from "../../store/models/root.interface";
import { IAccount } from "../../store/models/account.interface";

const Admin: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);
  const { roles } = account;

  return (
    <Fragment>
      <Notifications />
      <LeftMenu />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <TopMenu />
          <div className="container-fluid">
            <Switch>
              {roles[0] === "Superadmin" && (
                <Route path={`/users`}>
                  <Users />
                </Route>
              )}
              <Route path={`/products`}>
                <Products />
              </Route>
              <Route path={`/requestdoc`}>
                <DocRequest />
              </Route>
              <Route path={`/orders`}>
                <Orders />
              </Route>
              <Route path={`/doccategory`}>
                <DocCategories />
              </Route>
              <Route path={`/boxes`}>
                <Boxes />
              </Route>
              <Route path={`/department`}>
                <DocDepartment />
              </Route>
              <Route path={`/doctype`}>
                <DocTypes />
              </Route>
              <Route path={`/docrequestapproval`}>
                <DocRequestApproval />
              </Route>
              <Route path={`/genarateissuance`}>
                <DocIssuance />
              </Route>

              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Admin;
