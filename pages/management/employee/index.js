import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { EmployeeService } from "../../../demo/service/EmployeeService";
import { Dropdown } from "primereact/dropdown";
import { DepartmentService } from "../../../demo/service/DepartmentService";
import { PositionService } from "../../../demo/service/PositionService";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Tag } from "primereact/tag";

const Crud = () => {
  const emptyEmployee = {
    id: null,
    fname: "",
    lname: "",
    gender: false,
    dob: "",
    address: "",
    email: "",
    phone: "",
    password: "",
    positionId: null,
    departmentId: null,
  };
  const genderList = [
    {
      id: 0,
      name: "Female",
    },
    {
      id: 1,
      name: "Male",
    },
  ];

  const initFilterParams = {
    sort: {
      sortBy: "id",
      sortDir: "ASC",
    },
    filter: {
      id: null,
      fname: "",
      lname: "",
      departmentId: null,
      positionId: null,
    },
    page: {
      pageNum: 0,
      size: 5,
    },
  };

  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const [employee, setEmployee] = useState(emptyEmployee);
  const [departments, setDepartments] = useState(null);
  const [positions, setPositions] = useState(null);
  const [employees, setEmployees] = useState(null);

  const [employeeDialog, setEmployeeDialog] = useState(false);
  const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState(false);
  const [deleteEmployeesDialog, setDeleteEmployeesDialog] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState(null);
  const [eventBtnDelete, setEventBtnDelete] = useState(false);

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [size, setSize] = useState(0);
  const [filterParams, setFilterParams] = useState(initFilterParams);

  const [totalRecords, setTotalRecords] = useState(0);
  useEffect(() => {
    PositionService.getPositions().then((res) => {
      setPositions(res.data);
    });

    DepartmentService.getDepartments().then((res) => {
      setDepartments(res.data);
    });

    EmployeeService.getEmployees().then((res) => {
      setTotalRecords(res.data.totalElements);
      setSize(res.data.size);
      setEmployees(res.data.content);
    });
    initFilters();
  }, []);

  const openNew = () => {
    setEmployee(emptyEmployee);
    setSubmitted(false);
    setEmployeeDialog(true);
  };
  const clearFilter = () => {
    initFilters();
  };
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      // id: { value: null, matchMode: FilterMatchMode.EQUALS },
      id: {
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      fname: {
        // operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      lname: {
        // operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      departmentId: { value: null, matchMode: FilterMatchMode.EQUALS },
      positionId: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  };

  const deptItem = (option) => {
    return (
      <div className="flex align-items-center gap-2">
        <span>{option.name}</span>
      </div>
    );
  };

  const deptFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={departments}
        itemTemplate={deptItem}
        onChange={(e) => {
          options.filterApplyCallback(e.value);
        }}
        optionValue="departmentId"
        optionLabel="name"
        placeholder="Select One"
        className="p-column-filter"
        style={{ minWidth: "12rem" }}
      />
    );
  };

  const positionItem = (option) => {
    return (
      <div className="flex align-items-center gap-2">
        <span>{option.name}</span>
      </div>
    );
  };

  const positionFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={positions}
        itemTemplate={positionItem}
        onChange={(e) => {
          options.filterApplyCallback(e.value);
        }}
        optionValue="id"
        optionLabel="name"
        placeholder="Select One"
        className="p-column-filter"
        style={{ minWidth: "12rem" }}
      />
    );
  };

  const hideDialog = () => {
    setSubmitted(false);
    setEmployeeDialog(false);
  };

  const hideDeleteEmployeeDialog = () => {
    setDeleteEmployeeDialog(false);
  };

  const hideDeleteEmployeesDialog = () => {
    setDeleteEmployeesDialog(false);
  };

  const saveEmployee = () => {
    setSubmitted(true);

    if (
      employee.fname.trim() &&
      employee.lname.trim() &&
      employee.departmentId &&
      employee.positionId
    ) {
      let _employees = [...employees];
      let _employee = { ...employee };
      if (employee.id) {
        const index = findIndexById(employee.id);

        _employees[index] = _employee;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Employee Updated",
          life: 3000,
        });
        EmployeeService.updateEmployee(_employee).then((data) => {
          setEmployee(data.data);
        });
      } else {
        _employee.id = createId();
        _employee.password = createPass();
        _employees.push(_employee);

        // console.log("check here>>>>>", _employees);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
        EmployeeService.createEmployee(_employee).then((data) => {
          setEmployee(data.data);
        });
      }

      setEmployees(_employees);
      setEmployee(emptyEmployee);
      setEmployeeDialog(false);
    }
  };

  const editEmployee = (employee) => {
    setEmployee({ ...employee });
    setEmployeeDialog(true);
  };

  // here
  const confirmDeleteEmployee = (employee) => {
    setEmployee(employee);
    setDeleteEmployeeDialog(true);
  };

  const deleteEmployee = () => {
    let _employees = employees.filter((val) => val.id !== employee.id);
    EmployeeService.deleteEmployee(employee.id);
    setEmployees(_employees);
    setDeleteEmployeeDialog(false);
    setEmployee(emptyEmployee);
    setEventBtnDelete(true);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Employee Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < employees.length; i++) {
      if (employees[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const createId = () => {
    const index = employees[employees.length - 1].id + 1;
    return index;
  };
  const createPass = () => {
    const passRaw = employee.fname.concat(employee.lname);
    const pass = passRaw.replace(/ /g, "");
    // console.log("Pass >>>>>>>", pass);
    return pass;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteEmployeesDialog(true);
  };

  const deleteSelectedEmployees = () => {
    let ids = [];
    let _employees = employees.filter((val) => {
      return !selectedEmployees.includes(val);
    });

    selectedEmployees.forEach((item) => ids.push(item.id));
    setEmployees(_employees);
    // console.log("check employees", employees);
    EmployeeService.deleteManyEmp(ids);
    setDeleteEmployeesDialog(false);
    setSelectedEmployees(null);

    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
      life: 3000,
    });
  };

  const onChangeInput = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _employee = { ...employee };
    _employee[`${name}`] = val;
    setEmployee(_employee);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="New"
            icon="pi pi-plus"
            severity="success"
            className="mr-2"
            onClick={openNew}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            onClick={confirmDeleteSelected}
            disabled={
              !selectedEmployees || !selectedEmployees.length || eventBtnDelete
            }
          />
        </div>
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload
          mode="basic"
          accept="image/*"
          maxFileSize={1000000}
          label="Import"
          chooseLabel="Import"
          className="mr-2 inline-block"
        />
        <Button
          label="Export"
          icon="pi pi-upload"
          severity="help"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };

  const hideEmployeeDialog = () => {
    setSubmitted(false);
    setEmployeeDialog(false);
  };

  const genderBodyTemplate = (rowData) => {
    return <>{rowData.gender}</>;
  };

  const getPositionName = (positionId) => {
    return positions.find((p) => p.id === positionId)?.name;
  };

  const positionBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Position</span>
        {getPositionName(rowData.positionId)}
      </>
    );
  };

  const getDepartmentName = (departmentId) => {
    return departments.find((d) => d.departmentId === departmentId)?.name;
  };

  const departmentBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Department</span>
        {getDepartmentName(rowData.departmentId)}
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Employees</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  const employeeDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={saveEmployee} />
    </>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          severity="success"
          rounded
          className="mr-2"
          onClick={() => {
            editEmployee(rowData);
          }}
        />
        <Button
          icon="pi pi-trash"
          severity="warning"
          rounded
          onClick={() => confirmDeleteEmployee(rowData)}
        />
      </>
    );
  };

  const deleteEmployeeDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteEmployeeDialog}
      />
      <Button label="Yes" icon="pi pi-check" text onClick={deleteEmployee} />
    </>
  );

  const deleteEmployeesDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteEmployeesDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        text
        onClick={deleteSelectedEmployees}
      />
    </>
  );
  const getDob = (dob) => {
    const arr = dob.split("-").reverse();
    return arr.join("-");
  };

  const dobBodyTemplate = (rowData) => {
    return <>{getDob(rowData.dob)}</>;
  };

  const idBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Id</span>
        {rowData.id}
      </>
    );
  };
  const fnameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">First Name</span>
        {rowData.fname}
      </>
    );
  };
  const lnameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Last Name</span>
        {rowData.lname}
      </>
    );
  };

  const emailBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Email</span>
        {rowData.email}
      </>
    );
  };

  const getUpdate = (e) => {
    console.log(e);
    setFilterParams({
      sort: {
        sortBy: e.sortField,
        sortDir: e.sortOrder,
      },
      filter: {
        id: e.filters.id.constraints[0].value,
        fname: e.filters.fname.constraints[0].value,
        lname: e.filters.lname.constraints[0].value,
        departmentId: e.filters.positionId.value,
        positionId: e.filters.departmentId.value,
      },
      page: {
        pageNum: e.first,
        size: e.rows,
      },
    });
  };
  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          {/* Table start */}

          <DataTable
            ref={dt}
            value={employees}
            selection={selectedEmployees}
            onSelectionChange={(e) => {
              setEventBtnDelete(false);
              setSelectedEmployees(e.value);
            }}
            dataKey="id"
            lazy
            paginator
            totalRecords={totalRecords}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
            rows={size}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            globalFilter={globalFilter}
            //
            onFilter={(e) => getUpdate(e)}
            onSort={(e) => getUpdate(e)}
            sortMode="single"
            onPage={(e) => getUpdate(e)}
            showGridlines
            filters={filters}
            emptyMessage="No employees found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "4rem" }}
            ></Column>
            <Column
              field="id"
              header="Id"
              filter
              sortable
              body={idBodyTemplate}
              headerStyle={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="fname"
              header="First name"
              filter
              sortable
              body={fnameBodyTemplate}
              headerStyle={{ minWidth: "8rem" }}
            ></Column>
            <Column
              field="lname"
              header="Last name"
              filter
              sortable
              body={lnameBodyTemplate}
              headerStyle={{ minWidth: "8rem" }}
            ></Column>

            <Column
              field="gender"
              header="Gender"
              body={genderBodyTemplate}
              headerStyle={{ minWidth: "8rem" }}
              // sortable
            ></Column>

            <Column
              field="dob"
              header="Date of Birth"
              body={dobBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
              // sortable
            ></Column>

            <Column
              field="email"
              header="Email"
              // sortable
              body={emailBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>

            <Column
              field="positionId"
              header="Position"
              filterMenuStyle={{ width: "14rem" }}
              style={{ minWidth: "12rem" }}
              body={positionBodyTemplate}
              filter
              filterElement={positionFilterTemplate}
            />

            <Column
              field="departmentId"
              header="Department"
              filterMenuStyle={{ width: "14rem" }}
              style={{ minWidth: "12rem" }}
              body={departmentBodyTemplate}
              filter
              // showFilterMenu={false}
              filterElement={deptFilterTemplate}
            ></Column>

            <Column
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
          </DataTable>

          {/* Table end */}

          {/* Edit and create employee Start*/}
          <Dialog
            visible={employeeDialog}
            style={{ width: "650px" }}
            header="Employee"
            modal
            className="p-fluid"
            footer={employeeDialogFooter}
            onHide={hideEmployeeDialog}
          >
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="fname">First Name</label>
                <InputText
                  id="name"
                  value={employee.fname}
                  onChange={(e) => onChangeInput(e, "fname")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !employee.fname,
                  })}
                />
                {submitted && !employee.fname && (
                  <small className="p-invalid">First name is required.</small>
                )}
              </div>
              <div className="field col">
                <label htmlFor="lname">Last Name</label>
                <InputText
                  id="name"
                  value={employee.lname}
                  onChange={(e) => onChangeInput(e, "lname")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !employee.lname,
                  })}
                />
                {submitted && !employee.lname && (
                  <small className="p-invalid">Last name is required.</small>
                )}
              </div>
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <InputText
                id="email"
                value={employee.email}
                onChange={(e) => onChangeInput(e, "email")}
                required
                className={classNames({
                  "p-invalid": submitted && !employee.email,
                })}
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <InputText
                id="phone"
                value={employee.phone}
                onChange={(e) => onChangeInput(e, "phone")}
                required
                className={classNames({
                  "p-invalid": submitted && !employee.phone,
                })}
              />
            </div>
            <div className="field">
              <label htmlFor="address">Address</label>
              <InputText
                id="phone"
                value={employee.address}
                onChange={(e) => onChangeInput(e, "address")}
                required
                className={classNames({
                  "p-invalid": submitted && !employee.address,
                })}
              />
            </div>

            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="dob">Day of Birth</label>
                <InputText
                  id="dob"
                  value={employee.dob}
                  onChange={(e) => onChangeInput(e, "dob")}
                  min="1950-01-01"
                  max="2100-01-01"
                  type="date"
                />
              </div>

              <div className="field col">
                <label htmlFor="gender">Gender</label>
                <Dropdown
                  inputId="gender"
                  value={employee.gender}
                  onChange={(e) => onChangeInput(e, "gender")}
                  options={genderList}
                  optionLabel="name"
                  optionValue="name"
                  placeholder="Select one"
                />
              </div>
            </div>

            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="position">Position</label>
                <Dropdown
                  inputId="position"
                  value={employee.positionId}
                  onChange={(e) => onChangeInput(e, "positionId")}
                  placeholder="Select a position"
                  options={positions}
                  optionLabel="name"
                  optionValue="id"
                />
              </div>

              <div className="field col">
                <label htmlFor="department">Department</label>
                <Dropdown
                  inputId="department"
                  placeholder="Select a department"
                  value={employee.departmentId}
                  onChange={(e) => onChangeInput(e, "departmentId")}
                  options={departments}
                  optionLabel="name"
                  optionValue="departmentId"
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteEmployeeDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteEmployeeDialogFooter}
            onHide={hideDeleteEmployeeDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {employee && (
                <span>
                  Are you sure you want to delete <b>{employee.name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteEmployeesDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteEmployeesDialogFooter}
            onHide={hideDeleteEmployeesDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {employee && (
                <span>
                  Are you sure you want to delete the selected employees?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Crud;
