import PrimeReact from "primereact/api";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { RadioButton } from "primereact/radiobutton";
import { Sidebar } from "primereact/sidebar";
import { classNames } from "primereact/utils";
import React, { useContext, useEffect, useState } from "react";
import { LayoutContext } from "./context/layoutcontext";

const AppConfig = (props) => {
  const [scales] = useState([12, 13, 14, 15, 16]);
  const { layoutConfig, setLayoutConfig, layoutState, setLayoutState } =
    useContext(LayoutContext);

  const onConfigButtonClick = () => {
    setLayoutState((prevState) => ({
      ...prevState,
      configSidebarVisible: true,
    }));
  };

  const onConfigSidebarHide = () => {
    setLayoutState((prevState) => ({
      ...prevState,
      configSidebarVisible: false,
    }));
  };

  const changeTheme = (theme, colorScheme) => {
    PrimeReact.changeTheme(layoutConfig.theme, theme, "theme-css", () => {
      setLayoutConfig((prevState) => ({ ...prevState, theme, colorScheme }));
    });
  };

  return (
    <>
      <button
        className="layout-config-button p-link"
        type="button"
        onClick={onConfigButtonClick}
      >
        <i className="pi pi-cog"></i>
      </button>

      <Sidebar
        visible={layoutState.configSidebarVisible}
        onHide={onConfigSidebarHide}
        position="right"
        className="layout-config-sidebar w-20rem"
      >
        <h5>Bootstrap</h5>
        <div className="grid">
          <div className="col-3">
            <button
              className="p-link w-2rem h-2rem"
              onClick={() => changeTheme("bootstrap4-light-blue", "light")}
            >
              <img
                src="/layout/images/themes/bootstrap4-light-blue.svg"
                className="w-2rem h-2rem"
                alt="Bootstrap Light Blue"
              />
            </button>
          </div>

          <div className="col-3">
            <button
              className="p-link w-2rem h-2rem"
              onClick={() => changeTheme("bootstrap4-dark-blue", "dark")}
            >
              <img
                src="/layout/images/themes/bootstrap4-dark-blue.svg"
                className="w-2rem h-2rem"
                alt="Bootstrap Dark Blue"
              />
            </button>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default AppConfig;
