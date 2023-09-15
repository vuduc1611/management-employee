import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);

  const model = [
    {
      label: "Home",
      items: [{ label: "Home", icon: "pi pi-fw pi-home", to: "/" }],
    },
    {
      label: "Your Admin",
      items: [
        {
          label: "User",
          icon: "pi pi-fw pi-users",
          to: "/admin",
        },

        // {
        //   label: "Position",
        //   icon: "pi pi-fw  pi-bars",
        //   to: "/management/position",
        // },
      ],
    },
    {
      label: "Your Company",
      items: [
        {
          label: "Organization",
          icon: "pi pi-fw pi-sitemap",
          to: "/management/orgchart",
        },
        {
          label: "Department",
          icon: "pi pi-fw  pi-table",
          to: "/management/department",
        },
        {
          label: "Position",
          icon: "pi pi-fw  pi-bars",
          to: "/management/position",
        },
        {
          label: "Employee",
          icon: "pi pi-fw pi-user",
          to: "/management/employee",
        },
        {
          label: "Projects",
          icon: "pi pi-fw pi-list",
          to: "/management/project",
        },
      ],
    },
  ];

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) => {
          return !item.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator"></li>
          );
        })}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
