import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);

  const model = [
    {
      label: "Home",
      items: [{ label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" }],
    },
    {
      label: "Your Apps",
      items: [
        {
          label: "Profiles",
          icon: "pi pi-fw pi-id-card",
          to: "/management/department",
        },
        {
          label: "Payroll",
          icon: "pi pi-fw pi-check-square",
          to: "/management/input",
        },
        {
          label: "Qualifications",
          icon: "pi pi-fw pi-check-square",
          to: "/management/list",
        },
      ],
    },
    {
      label: "Your Company",
      items: [
        // {
        //   label: "Organization",
        //   icon: "pi pi-fw  pi-table",
        //   to: "/management/organization",
        // },

        {
          label: "Organization",
          icon: "pi pi-fw pi-check-square",
          to: "/management/orgchart",
        },
        {
          label: "Department",
          icon: "pi pi-fw  pi-table",
          to: "/management/department",
        },
        {
          label: "Employee",
          icon: "pi pi-fw pi-user",
          to: "/management/employee",
        },
        { label: "Projects", icon: "pi pi-fw pi-list", to: "/management/list" },
      ],
    },
    {
      label: "Support",
      items: [
        {
          label: "Need Help?",
          icon: "pi pi-fw pi-question",
          to: "/documentation",
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
