import React, { useState, useEffect, useRef } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { EmployeeService } from "../../../demo/service/EmployeeService";

import { InputText } from "primereact/inputtext";
import { CreateModal } from "../../../layout/CreateModal";

const TableDemo = () => {
  const [filters1, setFilters1] = useState(null);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [employee, setEmployee] = useState([]);
  const [createBtnStatus, setCreateBtnStatus] = useState(false);
  const [deleteBtnStatus, setDeleteBtnStatus] = useState(false);

  const clearFilter1 = () => {
    initFilters1();
  };

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };
  //

  const createHandle = (employee) => {
    setCreateBtnStatus(true);
  };

  const deleteHandle = () => {};

  const renderHeader1 = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          onClick={clearFilter1}
        />
        <div>
          <Button
            label="Create"
            severity="success"
            value={createBtnStatus}
            onClick={createHandle}
          />
          {/* <CreateModal /> */}
          <Button
            label="Delete"
            severity="danger"
            className="mx-2"
            value={deleteBtnStatus}
            onClick={deleteHandle}
          />

          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue1}
              onChange={onGlobalFilterChange1}
              placeholder="Keyword Search"
            />
          </span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    EmployeeService.getEmployees().then((data) => {
      data.data.forEach((emp) =>
        emp.gender ? (emp.gender = "Nam") : (emp.gender = "Nữ")
      );
      setEmployee(data.data);
    });
  }, []);

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      empId: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      fname: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      lname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      gender: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      empEmail: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      "position.name": { value: null, matchMode: FilterMatchMode.BETWEEN },
      "role.department.name": {
        value: null,
        matchMode: FilterMatchMode.EQUALS,
      },
    });
    setGlobalFilterValue1("");
  };
  const header1 = renderHeader1();
  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>Filter Menu</h5>
          <DataTable
            value={employee}
            paginator
            className="p-datatable-gridlines"
            showGridlines
            rows={10}
            dataKey="empId"
            //
            // chay func cua thang input text filter
            filters={filters1}
            //
            filterDisplay="menu"
            emptyMessage="No customers found."
            header={header1}
          >
            <Column field="empId" header="Id" filter></Column>
            <Column field="fname" header="First name" filter></Column>
            <Column field="lname" header="Last Name" filter></Column>
            <Column field="gender" header="Gender" filter></Column>
            <Column field="empEmail" header="Email" filter></Column>
            <Column field="position.name" header="Position" filter></Column>
            <Column
              field="role.department.name"
              header="Department"
              filter
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default TableDemo;
