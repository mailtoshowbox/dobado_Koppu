import React from "react";
import "./App.css";
import "./styles/sb-admin-2.min.css";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import { IStateType } from "./store/models/root.interface";
import { IAccount } from "./store/models/account.interface";
import Client from "./components/Account/Client";
import Admin from "./components/Admin/Admin";

import { PrivateRoute } from "./common/components/PrivateRoute";
import { AccountRoute } from "./common/components/AccountRoute";

const App: React.FC = () => {
  const account: IAccount = useSelector((state: IStateType) => state.account);

  console.log("DEMO-----", account, !account.email);
  return (
    <div className="App" id="wrapper">
      <Router>{account.email ? <Admin /> : <Client />}</Router>
    </div>
  );
};

export default App;
