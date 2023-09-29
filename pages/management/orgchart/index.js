import React, { useEffect, useState, useLayoutEffect } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import departmentApi from "../../api/departmentApi";
import positionApi from "../../api/positionApi";
import employeeApi from "../../api/employeeApi";
import MembersDialog from "../../../demo/components/MembersDialog";
export default function OrgChart() {
  const getBgColor = (signal) => {
    switch (signal) {
      case "company":
        return "bg-red-400";
      case "departmentIT":
        return "bg-orange-300";
      case "departmentHR":
        return "bg-cyan-300";
      case "departmentFinance":
        return "bg-pink-300";
      case "departmentSales":
        return "bg-indigo-300";
      case "departmentMarketting":
        return "bg-purple-300";
      default:
        break;
    }
  };

  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectionItem, setSelectionItem] = useState(null);
  const [employees, setEmployees] = useState(null);
  const [employeeDialog, setEmployeeDialog] = useState(false);
  const [dataCustom, setDataCustom] = useState([
    {
      label: "Company",
      name: "Viettel Network",
      className: "p-0 ",
      style: { borderRadius: "0.25rem" },
      type: getBgColor(`company`),
      expanded: true,
      children: [],
    },
  ]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchData = async () => {
      await positionApi.getAll().then((res) => setPositions(res));
      await departmentApi.getAll().then((res) => setDepartments(res));
      // await employeeApi.getAllData().then((res) => setEmployees(res));
      await departmentApi.getAll().then((response) => {
        const resCustom = response.map((value) => ({
          id: value.departmentId,
          className: "p-0",
          style: { borderRadius: "0.25rem" },
          name: value.name,
          label: "Department",
          type: getBgColor(`department${value.name}`),
          expanded: true,
          children: [],
        }));
        const copyDataCustom = [...dataCustom];
        copyDataCustom[0].children = resCustom;
        setDataCustom(copyDataCustom);
      });
    };
    fetchData();
  }, []);

  // remove Duplicate pos in Dept
  const removeDuplicate = (arr) => {
    const findArr = arr.reduce((acc, cur) => {
      if (!acc.includes(cur)) acc.push(cur);
      return acc;
    }, []);
    return findArr;
  };

  // get employee from Pos
  const getEmpFromPos = async (id) => {
    const response = await departmentApi.findByDept(id).then((res) => res);
    return response;
  };

  // childrenPos: get employee from Pos
  const fillEmployeeFromPos = async (idDept, idPos) => {
    const employeesFromDept = await getEmpFromPos(idDept);
    const employeesFromPos = employeesFromDept.filter(
      (employee) => employee.positionId === idPos
    );
    const employeesFromPosCustom = employeesFromPos.map((value) => ({
      id: value.id,
      className: "p-0 ",
      style: { borderRadius: "0.25rem" },
      label: "Employee",
      type: getBgColor(
        `department${departments.find((d) => d.departmentId === idDept).name}`
      ),
      name: value.fname + " " + value.lname,
    }));
    return employeesFromPosCustom;
  };

  // get pos in Dept
  const filterPosByDept = async (idDept) => {
    // receive from API
    const employeesFromDept = await getEmpFromPos(idDept);
    // sort
    const posExist = employeesFromDept.map((res) => res.positionId);
    // remove Duplicate
    const posArr = removeDuplicate(posExist.sort((a, b) => a - b));
    const nameDept = departments.find((d) => d.departmentId === idDept).name;
    //list Pos By Depts
    const childrenDept = posArr.map((pos) => ({
      id: pos,
      label: "Position",
      className: "p-0",
      style: { borderRadius: "0.25rem" },
      expanded: true,
      type: getBgColor(`department${nameDept}`),
      name: positions.find((position) => position.id === pos).name,
      parent: {
        id: idDept,
        label: "Department",
      },
      children: [],
    }));

    return childrenDept;
  };

  const nodeTemplate = (node) => {
    return (
      <div className={`flex flex-column align-items-center w-10rem`}>
        <div
          className={`font-sm text-base text-white p-2  border-round-top-xs ${node.type} w-full`}
        >
          {node.label}
        </div>
        <div className="font-medium text-base text-blue-400 p-2 border-round-top-xs w-full mt-auto">
          {node.name}
        </div>
      </div>
    );
  };
  const handleSelect = async (e) => {
    let { id, label, parent } = e.node;
    if (label === "Department") {
      // setEmployeeDialog(false);
      const response = await filterPosByDept(id).then((res) => res);
      e.node.children = response;
    }
    if (label === "Position") {
      // setEmployeeDialog(false);
      const response = await fillEmployeeFromPos(parent.id, id);
      e.node.children = response;
    }
    if (label === "Employee") {
      const employee = await employeeApi.get(e.node.id);
      setEmployees([{ ...employee }]);
      setEmployeeDialog(true);
    }
    setDataCustom([...dataCustom]);
  };

  const handleUnselect = (e) => {
    if (e.node.label !== "Company") {
      e.node.children = [];
      setDataCustom([...dataCustom]);
    }
  };

  return (
    <React.Fragment>
      <div className="card">
        <h5>Organization Chart:</h5>
      </div>
      <div className="card overflow-x-auto">
        <OrganizationChart
          value={dataCustom}
          nodeTemplate={nodeTemplate}
          selectionMode="multiple"
          selection={selectionItem}
          onNodeSelect={(e) => {
            handleSelect(e);
          }}
          onNodeUnselect={(e) => handleUnselect(e)}
          onSelectionChange={(event) => {
            setSelectionItem(event.data);
          }}
        />
      </div>
      <MembersDialog
        members={employees}
        departments={departments}
        positions={positions}
        memberDialog={employeeDialog}
        setMemberDialog={setEmployeeDialog}
      />
    </React.Fragment>
  );
}
