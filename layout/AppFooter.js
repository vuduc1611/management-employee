import React, { useContext } from "react";
// import { LayoutContext } from "./context/layoutcontext";

const AppFooter = () => {
  //   const { layoutConfig } = useContext(LayoutContext);

  return (
    <div className="layout-footer">
      {/* <img
        src={`/layout/images/logo-${
          layoutConfig.colorScheme === "light" ? "dark" : "white"
        }.svg`}
        alt="Logo"
        height="20"
        className="mr-2"
      /> */}

      <a
        className="font-large ml-2 text-xl text-red-400"
        href="https://viettel.vn/"
        target="_blank"
      >
        Viettel Networks
      </a>
    </div>
  );
};

export default AppFooter;
