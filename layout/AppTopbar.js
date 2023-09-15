import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { classNames } from "primereact/utils";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { LayoutContext } from "./context/layoutcontext";
import { Menu } from "primereact/menu";
import userApi from "../pages/api/userApi";
import positionApi from "../pages/api/positionApi";
import departmentApi from "../pages/api/departmentApi";
import Calendar from "../demo/components/Calendar";
import UserProfile from "../demo/components/UserProfile";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

const AppTopbar = forwardRef(function AppTopbar(props, ref) {
  const toast = useRef(null);
  const menuRight = useRef(null);
  const router = useRouter();
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [curInfo, setCurInfo] = useState({});
  const [visible, setVisible] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      await positionApi.getAll().then((response) => setPositions(response));
      await departmentApi.getAll().then((res) => setDepartments(res));
    };
    fetchData();
  }, []);

  const items = [
    {
      label: "Profile",
      icon: "pi pi-id-card",
      command: async () => {
        try {
          const username = localStorage.getItem("user");
          await userApi.getEmployByUsername(username).then((res) =>
            setCurInfo({
              ...res,
              positionId: positions.find((pos) => pos.id === res.positionId)
                .name,
              departmentId: departments.find(
                (dept) => dept.departmentId === res.departmentId
              ).name,
            })
          );
          setVisible(true);
        } catch (e) {
          console.log("error", e);
        }
      },
    },
    {
      label: "Change Password",
      icon: "pi pi-cog",
      command: () => {
        setChangePasswordDialog(true);
      },
    },

    {
      label: "Sign out",
      icon: "pi pi-sign-out",
      command: () => {
        if (localStorage.getItem("isRememberMe") === 1) {
          localStorage.removeItem("token");
        } else if (localStorage.getItem("isRememberMe") === 0) {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
        }
        router.push("/auth/login");
      },
    },
  ];
  const saveChangePassword = async () => {
    const username = localStorage.getItem("user");
    if (password.length < 6) {
      return toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Password must be at least 6 characters",
      });
    }
    if (password === confirmPassword) {
      const request = {
        username: username,
        password: password,
        confirmPassword: confirmPassword,
      };
      await userApi.changePassword(request).then((res) => res);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Changed password is success",
        life: 3000,
      });
      setChangePasswordDialog(true);
      setPassword("");
      setConfirmPassword("");
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Password and confirm Password is not same",
      });
    }
  };

  const hideChangePassDialog = () => {
    setChangePasswordDialog(false);
    setPassword("");
    setConfirmPassword("");
  };

  const changePassDialog = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={() => setChangePasswordDialog(false)}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        text
        onClick={saveChangePassword}
      />
    </React.Fragment>
  );

  const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
    useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  return (
    <div className="layout-topbar">
      <Link href="/" className="layout-topbar-logo">
        <img
          src={"../layout/images/Viettel_logo_2021.png"}
          alt="VTnet logo"
          className="mb-0 w-8rem h-2rem flex-shrink-0"
        />
      </Link>

      <button
        ref={menubuttonRef}
        type="button"
        className="p-link layout-menu-button layout-topbar-button"
        onClick={onMenuToggle}
      >
        <i className="pi pi-bars" />
      </button>

      <button
        ref={topbarmenubuttonRef}
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={showProfileSidebar}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      <div
        ref={topbarmenuRef}
        className={classNames("layout-topbar-menu", {
          "layout-topbar-menu-mobile-active": layoutState.profileSidebarVisible,
        })}
      >
        <button
          type="button"
          className="p-link layout-topbar-button"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <i className="pi pi-calendar"></i>
          <span>Calendar</span>
        </button>

        {showCalendar && <Calendar />}
        <button
          type="button"
          id="btn-extend"
          className="p-link layout-topbar-button"
          onClick={(event) => menuRight.current.toggle(event)}
          aria-controls="popup_menu_right"
          aria-haspopup
        >
          <i className="pi pi-user"></i>
          <span>User</span>
        </button>
        <Menu
          model={items}
          ref={menuRight}
          popup
          id="popup_menu_right"
          className="p-menu"
          appendTo="self"
        />
      </div>

      <UserProfile
        visible={visible}
        curInfo={curInfo}
        setVisible={setVisible}
      />

      <Dialog
        header="Change Password"
        visible={changePasswordDialog}
        className="p-fluid"
        style={{ width: "30vw" }}
        onHide={hideChangePassDialog}
        footer={changePassDialog}
      >
        <div className="field">
          <Toast ref={toast} />
          <label htmlFor="password">Password</label>
          <InputText
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <InputText
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </Dialog>
    </div>
  );
});

export default AppTopbar;
