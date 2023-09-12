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
      label: "Your Admin",
      items: [
        {
          label: "User",
          icon: "pi pi-fw pi-id-card",
          to: "/admin",
        },
      ],
    },
    {
      label: "Your Company",
      items: [
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
        {
          label: "Projects",
          icon: "pi pi-fw pi-list",
          to: "/management/project",
        },
      ],
    },
    // {
    //   label: "Support",
    //   items: [
    //     {
    //       label: "Need Help?",
    //       icon: "pi pi-fw pi-question",
    //       to: "/documentation",
    //     },
    //   ],
    // },
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
