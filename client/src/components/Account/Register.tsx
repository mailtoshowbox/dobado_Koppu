import React, { useState, FormEvent, Dispatch } from "react";
import { OnChangeModel } from "../../common/types/Form.types";
import { useDispatch } from "react-redux";
import { login } from "../../store/actions/account.actions";
import TextInput from "../../common/components/TextInput";
import { registerUser } from "../../services/index";
import "react-notifications/lib/notifications.css";
import { addNotification } from "../../store/actions/notifications.action";
import logo from "../../assets/images/login-logo.png";

const Register: React.FC = () => {
  const dispatch: Dispatch<any> = useDispatch();
  //

  const [formState, setFormState] = useState({
    email: { error: "", value: "" },
    password: { error: "", value: "" },
    confirmPassword: { error: "", value: "" },
    name: { error: "", value: "" },
  });

  const [regError, setRegError] = useState({ status: false, message: "" });
  const [startApi, setStartApi] = useState(false);

  function hasFormValueChanged(model: OnChangeModel): void {
    const { field = "", value = undefined, error } = model;
    let newError = error;

    if (field === "confirmPassword") {
      if (
        typeof formState.password.value !== "undefined" &&
        typeof value !== "undefined"
      ) {
        if (formState.password.value != value) {
          newError = "Confirm Passwords don't match.";
        } else {
          newError = "";
        }
      }
    }

    setFormState({
      ...formState,
      [field]: { error: newError, value: value },
    });
  }

  function submit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (isFormInvalid()) {
      return;
    }
    setStartApi(true);

    let boxInfo = {
      name: formState.name.value,
      email: formState.email.value,
      password: formState.password.value,
      approved: false,
    };
    registerUser(boxInfo).then((status) => {
      setStartApi(false);
      const { success = false } = status;
      if (success) {
        setRegError({ status: false, message: "" });
        dispatch(
          addNotification(
            "Registered successfully",
            `please verify the email ${formState.email.value} to complete the registration`
          )
        );

        setFormState({
          email: { error: "", value: "" },
          password: { error: "", value: "" },
          confirmPassword: { error: "", value: "" },
          name: { error: "", value: "" },
        });
      } else {
        dispatch(
          addNotification("Registration failed", `please try again later`)
        );
        setRegError({
          status: true,
          message: "Unable to register the user",
        });
      }
    });

    //  dispatch(login(formState.email.value));
  }

  function isFormInvalid() {
    let newObj = formState;

    if (!formState.name.value) {
      newObj.name.error = "Please enter your name.";
    }

    if (!formState.email.value) {
      newObj.email.error = "Please enter your email Address.";
    }

    if (typeof formState.email.value !== "undefined") {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(formState.email.value)) {
        newObj.email.error = "Please enter valid email address.";
      }
    }

    if (!formState.password.value) {
      newObj.password.error = "Please enter your password.";
    }

    if (!formState.confirmPassword.value) {
      newObj.confirmPassword.error = "Please enter your confirm password.";
    }

    if (
      typeof formState.password.value !== "undefined" &&
      typeof formState.confirmPassword.value !== "undefined"
    ) {
      if (formState.password.value != formState.confirmPassword.value) {
        newObj.password.error = "Passwords don't match.";
      } else {
        newObj.password.error = "";
      }
    }

    setFormState({
      ...formState,
      ...newObj,
    });

    return (
      formState.email.error ||
      formState.password.error ||
      formState.confirmPassword.error ||
      !formState.email.value ||
      !formState.password.value ||
      !formState.confirmPassword.value
    );
  }

  function getDisabledClass(): string {
    let isError: boolean = isFormInvalid() as boolean;
    return isError ? "disabled" : "";
  }

  const loaderClass = startApi ? "regLoader" : "";

  return (
    <div className={`container  ${loaderClass}`}>
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-5">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-lg-12">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-3">
                        <img src={logo} />
                      </h1>
                      <h4 className="mb-3">New User Registration!</h4>
                    </div>
                    <form onSubmit={submit}>
                      <div className="form-group font-14">
                        <TextInput
                          id="input_name"
                          field="name"
                          value={formState.name.value}
                          onChange={hasFormValueChanged}
                          required={true}
                          maxLength={100}
                          label="Name"
                          customError={formState.name.error}
                          placeholder="Enter your Name"
                        />
                      </div>
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
                          id="input_password_1"
                          field="password"
                          value={formState.password.value}
                          onChange={hasFormValueChanged}
                          required={true}
                          maxLength={100}
                          label="Password"
                          customError={formState.password.error}
                          placeholder="Password"
                          type="password"
                        />
                      </div>
                      <div className="form-group font-14">
                        <TextInput
                          id="input_confirmPassword"
                          field="confirmPassword"
                          value={formState.confirmPassword.value}
                          onChange={hasFormValueChanged}
                          required={true}
                          maxLength={100}
                          label="Confirm Password"
                          customError={formState.confirmPassword.error}
                          placeholder="Confirm Password"
                          type="password"
                        />
                      </div>
                      {formState.confirmPassword.error ? (
                        <div className="invalid-field">
                          {formState.confirmPassword.error}
                        </div>
                      ) : null}

                      {/*  <div className="pa0 gray">
                        By registering you agree to our{" "}
                        <a href="/policies">policies</a>.
                      </div> */}
                      <div className="pa0 gray" style={{ marginTop: "26px" }}>
                        <button
                          style={{ height: "51px" }}
                          className={`btn btn-primary btn-user btn-block  `}
                          type="submit"
                        >
                          Register
                        </button>
                      </div>
                    </form>

                    {regError.status ? (
                      <div className="invalid-field">{regError.message}</div>
                    ) : null}
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
