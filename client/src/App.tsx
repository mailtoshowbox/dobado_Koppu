import React,{ useEffect, useState,Dispatch }  from "react";
import { useDispatch,useSelector } from "react-redux";

import "./App.css";
import "./styles/sb-admin-2.min.css";
import { BrowserRouter as Router } from "react-router-dom";
 
import { IStateType } from "./store/models/root.interface";
import { IAccount } from "./store/models/account.interface";
import Client from "./components/Account/Client";
import Admin from "./components/Admin/Admin"; 
import IdleTimer from "./IdleTimer"; 
import { logout } from "./store/actions/account.actions";
import APP_CONST from "./common/contant"; 
//import { PrivateRoute } from "./common/components/PrivateRoute";
//import { AccountRoute } from "./common/components/AccountRoute";

const App: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const account: IAccount = useSelector((state: IStateType) => state.account);
 
  useEffect(() => { 
    
   if(APP_CONST.AUTO_LOGOUT_ENABLED){
    const timer = new IdleTimer({
      timeout: APP_CONST.AUTO_LOGOUT_TIME , //expire after 10 seconds
      onTimeout: () => {  
        dispatch(logout());
        timer.cleanUp();
      },
      onExpired: () => { 
        dispatch(logout())
        return () => {
          timer.cleanUp();
        };
      }
    });
    return () => {
      timer.cleanUp();
    };
  }
   
  }, []);
 

  return (
    <div className="App" id="wrapper">
      <Router>{account.email ? <Admin /> : <Client />}</Router>
    </div>
  );
};

export default App;
