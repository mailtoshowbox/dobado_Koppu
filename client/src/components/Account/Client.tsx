import React, { Fragment } from "react";
import TopMenu from "../TopMenu/TopMenu";
import { Switch, Route } from "react-router";

import Login from "../../components/Account/Login";
import Register from "../../components/Account/Register";

const Admin: React.FC = () => {
  return (
    <Fragment>
      <div id="content-wrapper" className="d-flex flex-column main-bg">
        <div id="content">
          <div className="container-fluid">
            <Switch>
              <Route path={`/login`}>
                <Login />
              </Route>
              <Route path={`/register`}>
                <Register />
              </Route>

              <Route path="/">
                <Login />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Admin;
