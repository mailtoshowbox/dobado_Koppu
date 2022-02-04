import React, { useState, FormEvent, Dispatch } from "react";
import { OnChangeModel } from "../../common/types/Form.types";
import { useDispatch } from "react-redux";
import { login } from "../../store/actions/account.actions";
import TextInput from "../../common/components/TextInput";
import { Link } from "react-router-dom";
import { loginUser } from "../../services/index";
import {
  addNotification,
  parseApiResult,
} from "../../store/actions/notifications.action";
import logo from "../../assets/images/login-logo-new.jpg";

const Login: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const [formState, setFormState] = useState({
    email: { error: "", value: "qualityuser@gmail.com" },
    password: { error: "", value: "qualityuser" },
  });

  function hasFormValueChanged(model: OnChangeModel): void {
    setFormState({
      ...formState,
      [model.field]: { error: model.error, value: model.value },
    });
  }

  function submit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (isFormInvalid()) {
      return;
    }
    loginUser({
      email: formState.email.value,
      password: formState.password.value,
    })
      .then((status) => {
        const { titleMesage = "", bodyMessage = "" } = parseApiResult(status);
        const { success = false } = status;
        if (success) {
          dispatch(addNotification(titleMesage, bodyMessage));

          dispatch(login(status.data));
        } else {
          dispatch(
            addNotification(
              titleMesage,
              bodyMessage ? bodyMessage : "Unable to login"
            )
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // dispatch(login(formState.email.value));
  }

  function isFormInvalid() {
    return (
      formState.email.error ||
      formState.password.error ||
      !formState.email.value ||
      !formState.password.value
    );
  }

  function getDisabledClass(): string {
    let isError: boolean = isFormInvalid() as boolean;
    return isError ? "disabled" : "";
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-5">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-lg-12">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-4">
                        <img src={logo} alt="logo" width="200" height="120" />
                      </h1>
                    </div>
                    <form className="user" onSubmit={submit}>
                      <div className="form-group font-14">
                        <TextInput
                          id="input_email"
                          field="email"
                          value={formState.email.value}
                          onChange={hasFormValueChanged}
                          required={true}
                          maxLength={100}
                          label="Email"
                          customError={formState.email.error}
                          placeholder="Email"
                        />
                      </div>
                      <div className="form-group font-14">
                        <TextInput
                          id="input_password"
                          field="password"
                          value={formState.password.value}
                          onChange={hasFormValueChanged}
                          required={true}
                          maxLength={100}
                          type="password"
                          label="Password"
                          customError={formState.password.error}
                          placeholder="Password"
                        />
                      </div>

                      <button
                        className={`btn btn-primary btn-user btn-block ${getDisabledClass()}`}
                        type="submit"
                      >
                        Login
                      </button>

                      <Link
                        className={`btn btn-warning btn-user btn-block ${getDisabledClass()}`}
                        style={{ color: "#fff" }}
                        to="/register"
                      >
                        Register
                      </Link>
                    </form>
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

export default Login;
