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
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import employeeApi from "../../api/employeeApi";
import positionApi from "../../api/positionApi";
import departmentApi from "../../api/departmentApi";

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
    sortBy: null,
    sortDir: null,

    id: null,
    fname: null,
    lname: null,
    departmentId: null,
    positionId: null,

    page: null,
    size: null,
  };

  const [submitted, setSubmitted] = useState(false);
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
  const [filters, setFilters] = useState({
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
    fname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    lname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    positionId: { value: null, matchMode: FilterMatchMode.IN },
    departmentId: { value: null, matchMode: FilterMatchMode.IN },
  });
  // const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [size, setSize] = useState(0);
  const [selectedDepartments, setSelectedDepartments] = useState(null);

  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);

  const [lazyParams, setLazyParams] = useState(initFilterParams);

  const fetchData = async () => {
    try {
      const resEmp = await employeeApi.getAll(lazyParams);
      setEmployees(resEmp.content);
      setTotalRecords(resEmp.totalElements);
      setSize(resEmp.size);

      const resPos = await positionApi.getAll();
      setPositions(resPos);

      const resDept = await departmentApi.getAll();
      setDepartments(resDept);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [lazyParams]);

  const openNew = () => {
    setEmployee(emptyEmployee);
    setSubmitted(false);
    setEmployeeDialog(true);
  };
  const clearFilter = () => {
    initFilters();
  };

  const initFilters = () => {
    setFirst(0);
    setLazyParams(initFilterParams);
    setFilters({
      id: { value: null },
      fname: { value: null },
      lname: { value: null },
      positionIds: { value: null },
      departmentIds: { value: null },
    });
  };

  const deptItem = (option) => {
    return (
      <div className="flex align-items-center gap-2">
        <span>{option.name}</span>
      </div>
    );
  };
  // const handleFilterDepartments = (e) => {
  //   const departmentSelects = e.map((item) => item.departmentId);
  //   console.log("check departmentSelects", departmentSelects);
  //   setLazyParams({ ...lazyParams, departmentIds: departmentSelects });
  // };

  const deptFilterTemplate = (options) => {
    return (
      // <React.Fragment>
      //   <Dropdown
      //     value={options.value}
      //     options={departments}
      //     itemTemplate={deptItem}
      //     onChange={(e) => {
      //       options.filterApplyCallback(e.value);
      //     }}
      //     optionValue="departmentId"
      //     optionLabel="name"
      //     placeholder="Select One"
      //     className="p-column-filter"
      //     style={{ minWidth: "12rem" }}
      //   />
      // </React.Fragment>
      <MultiSelect
        value={options.value}
        options={departments}
        optionLabel="name"
        itemTemplate={deptItem}
        onChange={(e) => {
          options.filterApplyCallback(e.value);
        }}
        maxSelectedLabels={1}
        placeholder="Select"
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
      // <React.Fragment>
      //   <Dropdown
      //     value={options.value}
      //     options={positions}
      //     itemTemplate={positionItem}
      //     onChange={(e) => {
      //       options.filterApplyCallback(e.value);
      //     }}
      //     optionValue="id"
      //     optionLabel="name"
      //     placeholder="Select One"
      //     className="p-column-filter"
      //     style={{ minWidth: "12rem" }}
      //   />
      // </React.Fragment>

      <MultiSelect
        value={options.value}
        options={positions}
        optionLabel="name"
        itemTemplate={positionItem}
        onChange={(e) => {
          options.filterApplyCallback(e.value);
        }}
        maxSelectedLabels={1}
        placeholder="Select"
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

  const saveEmployee = async () => {
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
        await employeeApi.update(_employee).then((res) => {
          setEmployees(res.content);
        });
      } else {
        _employee.id = createId();
        _employee.password = createPass();
        _employees.push(_employee);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
        await employeeApi.create(_employee).then((res) => {
          setEmployees(res.content);
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
  const confirmDeleteEmployee = (employee) => {
    setEmployee(employee);
    setDeleteEmployeeDialog(true);
  };

  const deleteEmployee = async () => {
    try {
      let _employees = employees.filter((val) => val.id !== employee.id);
      await employeeApi.deleteOne(employee.id);
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
    } catch (error) {
      console.log(error);
    }
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
    return pass;
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteEmployeesDialog(true);
  };

  const deleteSelectedEmployees = async () => {
    try {
      let ids = [];
      let _employees = employees.filter((val) => {
        return !selectedEmployees.includes(val);
      });
      selectedEmployees.forEach((item) => ids.push(item.id));
      setEmployees(_employees);
      await employeeApi.deleteMany(ids);
      setDeleteEmployeesDialog(false);
      setSelectedEmployees(null);

      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Products Deleted",
        life: 3000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeInput = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _employee = { ...employee };
    _employee[`${name}`] = val;
    setEmployee(_employee);
  };

  const leftToolbarTemplate = () => {
    return (
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
    return <span>{rowData.gender}</span>;
  };

  const getPositionName = (positionId) => {
    const curPos = positions?.find((p) => p.id === positionId);
    if (curPos) {
      return curPos.name;
    }
  };

  const positionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Position</span>
        <span>{getPositionName(rowData.positionId)}</span>
      </React.Fragment>
    );
  };

  const getDepartmentName = (departmentId) => {
    const curDept = departments?.find((p) => p.departmentId === departmentId);
    if (curDept) {
      return curDept.name;
    }
  };

  const departmentBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {/* <span className="p-column-title">Department</span> */}
        <span>{getDepartmentName(rowData.departmentId)}</span>
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Employees</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          onClick={clearFilter}
          className="mr-2 w-7rem"
        />
      </span>
    </div>
  );

  const employeeDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={saveEmployee} />
    </React.Fragment>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };

  const deleteEmployeeDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteEmployeeDialog}
      />
      <Button label="Yes" icon="pi pi-check" text onClick={deleteEmployee} />
    </React.Fragment>
  );

  const deleteEmployeesDialogFooter = (
    <React.Fragment>
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
    </React.Fragment>
  );
  const getDob = (dob) => {
    const arr = dob.split("-").reverse();
    return arr.join("-");
  };

  const dobBodyTemplate = (rowData) => {
    return <span>{getDob(rowData.dob)}</span>;
  };

  const idBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {/* <span className="p-column-title">Id </span> */}
        <span>{rowData.id}</span>
      </React.Fragment>
    );
  };
  const fnameBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">First Name</span>
        <span>{rowData.fname}</span>
      </React.Fragment>
    );
  };
  const lnameBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Last Name</span>
        <span>{rowData.lname}</span>
      </React.Fragment>
    );
  };

  const emailBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span className="p-column-title">Email</span>
        <span>{rowData.email}</span>
      </React.Fragment>
    );
  };

  //Handle Page
  const handleOnPage = (e) => {
    setFirst(e.first);
    setLazyParams({ ...lazyParams, page: e.page, size: e.rows });
  };

  // Handle Filter
  const handleOnFilter = (e) => {
    console.log("check e", e.filters);
    const departmentIdSelected = e.filters.departmentId.value?.map(
      (item) => item.departmentId
    );
    const positionIdSelected = e.filters.positionId.value?.map(
      (item) => item.id
    );
    // console.log("check departmentIdSelected", departmentIdSelected);
    setLazyParams({
      ...lazyParams,
      id: e.filters?.id.value,
      fname: e.filters?.fname.value,
      lname: e.filters?.lname.value,
      positionIds: positionIdSelected,
      // departmentId: e.filters?.departmentId.value,
      departmentIds: departmentIdSelected,
    });
  };

  // Handle Sort:
  const handleOnSort = (e) => {
    if (e.sortField === "id" && lazyParams.sortBy === null) {
      setLazyParams({
        ...lazyParams,
        sortBy: e.sortField,
        sortDir: "DESC",
      });
    } else if (
      (e.sortField !== "id" && lazyParams.sortBy === null) ||
      e.sortField !== lazyParams.sortBy
    ) {
      setLazyParams({
        ...lazyParams,
        sortBy: e.sortField,
        sortDir: "ASC",
      });
    } else if (e.sortField === lazyParams.sortBy) {
      setLazyParams({
        ...lazyParams,
        sortBy: e.sortField,
        sortDir: lazyParams.sortDir === "ASC" ? "DESC" : "ASC",
      });
    }
  };

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar
            className="mb-4"
            start={leftToolbarTemplate}
            end={rightToolbarTemplate}
          />
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
            filters={filters}
            filterDisplay="row"
            first={first}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
            rows={size}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            onFilter={(e) => {
              handleOnFilter(e);
            }}
            onSort={(e) => {
              handleOnSort(e);
            }}
            sortMode="single"
            onPage={(e) => {
              handleOnPage(e);
            }}
            showGridlines
            emptyMessage="No employees found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column selectionMode="multiple" />
            <Column
              field="id"
              header="Id"
              filter
              showFilterMenu={false}
              sortable
              body={idBodyTemplate}
              headerStyle={{ minWidth: "8rem" }}
            />
            <Column
              field="fname"
              header="First name"
              filter
              showFilterMenu={false}
              sortable
              body={fnameBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            />
            <Column
              field="lname"
              header="Last name"
              filter
              showFilterMenu={false}
              sortable
              body={lnameBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            />

            <Column
              field="gender"
              header="Gender"
              body={genderBodyTemplate}
              headerStyle={{ minWidth: "8rem" }}
            />

            <Column
              field="dob"
              header="Date of Birth"
              body={dobBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            />

            <Column
              field="email"
              header="Email"
              body={emailBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            />

            <Column
              // field="positionId"
              header="Position"
              filterField="positionId"
              showFilterMenu={false}
              filterMenuStyle={{ width: "10rem" }}
              style={{ minWidth: "10rem" }}
              body={positionBodyTemplate}
              filter
              filterElement={positionFilterTemplate}
            />

            <Column
              // field="departmentId"
              header="Department"
              filterField="departmentId"
              showFilterMenu={false}
              filterMenuStyle={{ width: "8rem" }}
              style={{ minWidth: "8rem" }}
              body={departmentBodyTemplate}
              filter
              filterElement={deptFilterTemplate}
            />

            {/* <Column
              header="Agent"
              filterField="representative"
              showFilterMenu={false}
              filterMenuStyle={{ width: "14rem" }}
              style={{ minWidth: "14rem" }}
              body={representativeBodyTemplate}
              filter
              filterElement={representativeRowFilterTemplate}
            /> */}

            <Column
              header="Action"
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            />
          </DataTable>
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
