import React, { useState, Dispatch, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-notifications/lib/notifications.css";
import logo from "../../assets/images/login-logo.png";
import { useParams } from "react-router-dom";
import { confirmEmailToken } from "../../services/index";
import {
  IStateType,
  IRootPageStateType,
} from "../../store/models/root.interface";
const Register: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();

  const path: IRootPageStateType = useSelector(
    (state: IStateType) => state.root.page
  );
  let df: any = useParams(); 
  //
  console.log("ID", df.id);

  const [] = useState({ status: false, message: "" });
  const [emailVerified, setEmailVerified] = useState(false);
  const [confirmationToken] = useState(df.id);

  const loaderClass = "";

  useEffect(() => {
    confirmEmailToken(confirmationToken).then((result: any) => {
      setEmailVerified(result.success);
    });
  }, [path.area, dispatch]);

  return (
    <div className={`container  ${loaderClass}`}>
      <div className="row justify-content-center">
        <div className="col-lg-12 col-md-12">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-lg-12">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-3">
                        <img src={logo} alt="logo" />
                      </h1>
                      {emailVerified ? (
                        <h4 className="mb-3">
                          Your Email verified Successfully!
                        </h4>
                      ) : null}

                      {!emailVerified ? (
                        <h4 className="mb-3 invalid-field">
                          {"Email Verification failed"}
                        </h4>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
