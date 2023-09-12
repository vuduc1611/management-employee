import { useRouter } from "next/router";
import React, { useContext, useState, useRef, useEffect } from "react";
import AppConfig from "../../../layout/AppConfig";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { LayoutContext } from "../../../layout/context/layoutcontext";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import authService from "../../api/AuthServices/authService";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
// import { useDispatch, useSelector } from "react-redux";
// import { login } from "../../../features/auth/authSlice";

const LoginPage = () => {
  const initUser = {
    firstname: null,
    lastname: null,
    email: null,
    role: [],
    username: null,
    password: null,
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [checked, setChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { layoutConfig } = useContext(LayoutContext);
  const [forgetPassDialog, setForgetPassDialog] = useState(false);
  const [registerDialog, setRegisterDialog] = useState(false);
  const [userRegister, setUserRegister] = useState(initUser);
  const [submitRegister, setSubmitRegister] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);

  const toast = useRef(null);
  const router = useRouter();
  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": layoutConfig.inputStyle === "filled" }
  );
  const roles = [
    { name: "Admin", code: "admin" },
    { name: "PM", code: "pm" },
    { name: "User", code: "user" },
  ];

  useEffect(() => {
    if (localStorage.getItem("user") !== null) {
      setUsername(localStorage.getItem("user"));
      setChecked(true);
    }
  }, []);
  // const dispatch = useDispatch();

  const onChangeInput = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _userRegister = { ...userRegister };

    _userRegister[`${name}`] = val;
    setUserRegister(_userRegister);
  };

  const handleSignIn = async () => {
    setSubmitted(true);
    let res;
    try {
      res = await authService.login({ username, password }).then((res) => res);

      if (checked) {
        localStorage.setItem("user", username);
      } else {
        localStorage.clear();
      }
      localStorage.setItem("token", res.accessToken);
      // dispatch(login(res.username));

      router.push("/");
    } catch (e) {
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: "Username or Password is error",
        life: 5000,
      });
    }
  };

  const handleSubmitRegister = async () => {
    console.log("check", userRegister);
    if (
      userRegister.email &&
      userRegister.firstname &&
      userRegister.role.toString() &&
      userRegister.lastname &&
      userRegister.username &&
      userRegister.password
    ) {
      setUserRegister({
        ...userRegister,
        email: "",
        firstname: "",
        role: [],
        lastname: "",
        username: "",
        password: "",
      });
      setSubmitRegister(false);
      console.log("check", userRegister);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Success",
        life: 3000,
      });
    } else {
      setSubmitRegister(true);
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: "Error",
        life: 3000,
      });
    }
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const backHomeLogin = () => {
    router.reload();
  };

  return (
    <div className={containerClassName}>
      <Toast ref={toast} />
      <div className="flex flex-column align-items-center justify-content-center">
        <div
          style={{
            borderRadius: "56px",
            padding: "0.3rem",
            background:
              "linear-gradient(180deg, #ff3d32 10%, rgba(33, 150, 243, 0) 30%)",
          }}
        >
          <div
            className="w-full surface-card py-8 px-5 sm:px-8"
            style={{ borderRadius: "53px" }}
          >
            <div className="text-center mb-5">
              <div className="text-900 text-3xl font-medium mb-3">Welcome!</div>
              <span className="text-600 font-medium">Sign in to continue</span>
            </div>

            <div>
              {/* Username */}
              <div
                htmlFor="username"
                className="block text-900 text-xl font-medium mb-2"
              >
                Username
              </div>
              <InputText
                inputid="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full md:w-30rem mb-3"
              />
              {!username && submitted && (
                <small className="p-invalid text-red-500 block mb-3">
                  Username is required.
                </small>
              )}

              {/* Password */}
              <div
                htmlFor="password"
                className="block text-900 font-medium text-xl mb-2 flex justify-content-between"
              >
                Password
                <a
                  className="text-sm font-normal cursor-pointer text-blue-600 align-items-center justify-content-center"
                  onClick={() => setForgetPassDialog(true)}
                >
                  Forget Password?
                </a>
              </div>
              <InputText
                inputid="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-2"
              ></InputText>
              {!password && submitted && (
                <small className="p-invalid text-red-500 block mb-3">
                  Password is required.
                </small>
              )}

              <div className="flex align-items-center justify-content-between mb-5 gap-5">
                <div className="flex align-items-center">
                  <Checkbox
                    inputid="rememberme"
                    checked={checked}
                    onChange={(e) => {
                      setChecked(e.checked);
                    }}
                    className="mr-2"
                  ></Checkbox>
                  <div htmlFor="rememberme1">Remember me</div>
                </div>
                <a
                  className="text-sm no-underline ml-2 text-blue-600 cursor-pointer text-blue-600"
                  onClick={() => setRegisterDialog(true)}
                >
                  Register?
                </a>
              </div>
              <Button
                label="Sign In"
                severity="danger"
                className="w-full p-3 text-xl "
                onClick={() => handleSignIn()}
              ></Button>
            </div>
            <Dialog
              header="Forget Password"
              visible={forgetPassDialog}
              style={{ width: "30vw" }}
              onHide={() => setForgetPassDialog(false)}
            >
              <p>
                Enter your user account verified email address and we will send
                you a password reset link.
              </p>

              <div className="field row">
                <InputText
                  id="fname"
                  required
                  placeholder="Email"
                  autoFocus
                  className="w-full p-inputtext-sm w-10 bg-right"
                />
              </div>
              <Button
                label="Send password"
                outlined
                size="small"
                className=" mr-0 block"
                onClick={() => setForgetPassDialog(false)}
              ></Button>
            </Dialog>

            <Dialog
              header="Register"
              visible={registerDialog}
              style={{ width: "36vw" }}
              onHide={() => {
                setUserRegister({
                  ...userRegister,
                  email: "",
                  firstname: "",
                  role: [],
                  lastname: "",
                  username: "",
                  password: "",
                });
                setRegisterDialog(false);
              }}
            >
              <div className="card p-fluid">
                <div className="formgrid grid">
                  <div className="field col">
                    <InputText
                      id="firstname"
                      type="text"
                      placeholder="First name"
                      value={userRegister.firstname}
                      onChange={(e) => onChangeInput(e, "firstname")}
                    />
                    {submitRegister && !userRegister.firstname && (
                      <small className="p-invalid text-red-500">
                        First Name is required.
                      </small>
                    )}
                  </div>
                  <div className="field col">
                    <InputText
                      id="lastname"
                      type="text"
                      placeholder="Last name"
                      value={userRegister.lastname}
                      onChange={(e) => onChangeInput(e, "lastname")}
                    />
                    {submitRegister && !userRegister.lastname && (
                      <small className="p-invalid text-red-500">
                        Last Name is required.
                      </small>
                    )}
                  </div>
                </div>
                <div className="formgrid grid">
                  <div className="field col">
                    <InputText
                      id="email"
                      type="text"
                      placeholder="Email"
                      value={userRegister.email}
                      onChange={(e) => onChangeInput(e, "email")}
                    />
                    {submitRegister && !validateEmail(userRegister.email) && (
                      <small className="p-invalid text-red-500">
                        Email is not valid.
                      </small>
                    )}
                  </div>
                  <div className="field col">
                    <MultiSelect
                      value={userRegister.role}
                      onChange={(e) => onChangeInput(e, "role")}
                      options={roles}
                      optionLabel="name"
                      optionValue="code"
                      placeholder="Select Roles"
                      maxSelectedLabels={2}
                    />
                    {submitRegister && !userRegister.role.toString() && (
                      <small className="p-invalid text-red-500">
                        Role is required.
                      </small>
                    )}
                  </div>
                </div>
                <div className="formgrid grid">
                  <div className="field col">
                    <InputText
                      id="username"
                      type="text"
                      placeholder="Username"
                      value={userRegister.username}
                      onChange={(e) => onChangeInput(e, "username")}
                    />
                    {submitRegister && !userRegister.username && (
                      <small className="p-invalid text-red-500">
                        Username is required.
                      </small>
                    )}
                  </div>
                </div>
                <div className="formgrid grid">
                  <div className="field col">
                    <InputText
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={userRegister.password}
                      onChange={(e) => onChangeInput(e, "password")}
                    />
                    {submitRegister && !userRegister.password && (
                      <small className="p-invalid text-red-500">
                        Password is required.
                      </small>
                    )}
                  </div>
                </div>
                <div className="formgrid grid">
                  <div className="field col">
                    <Button
                      label="Submit"
                      onClick={handleSubmitRegister}
                    ></Button>
                  </div>
                </div>
                <div className="formgrid grid">
                  <div className="field col">
                    <a className="cursor-pointer" onClick={backHomeLogin}>
                      {" "}
                      Already have an account?
                    </a>
                  </div>
                </div>
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginPage.getLayout = function getLayout(page) {
  return (
    <React.Fragment>
      {page}
      <AppConfig simple />
    </React.Fragment>
  );
};
export default LoginPage;
