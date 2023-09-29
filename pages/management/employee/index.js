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
import { FilterMatchMode } from "primereact/api";
import employeeApi from "../../api/employeeApi";
import positionApi from "../../api/positionApi";
import departmentApi from "../../api/departmentApi";
import { ProgressBar } from "primereact/progressbar";
import { Image } from "primereact/image";

const EmployeeDashBoard = () => {
  const emptyEmployee = {
    id: null,
    fname: "",
    lname: "",
    gender: false,
    dob: "",
    address: "",
    email: "",
    phone: "",
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
  const fileUploadRef = useRef(null);

  const [employee, setEmployee] = useState(emptyEmployee);
  const [departments, setDepartments] = useState(null);
  const [positions, setPositions] = useState(null);
  const [employees, setEmployees] = useState(null);
  const [eventUpdate, setEventUpdate] = useState(false);

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

  const [size, setSize] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);
  const [lazyParams, setLazyParams] = useState(initFilterParams);

  const [showDialogImport, setShowDialogImport] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  // const auth = useSelector((state) => state.auth);
  // const dispatch = useDispatch();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchData = async () => {
      try {
        // const token = localStorage.getItem("token");
        // const token = "";
        const resEmp = await employeeApi.getAllPaginator(lazyParams);

        setEmployees(resEmp.content);
        setTotalRecords(resEmp.totalElements);
        setSize(resEmp.size);

        const resPos = await positionApi.getAll();
        setPositions(resPos);

        const resDept = await departmentApi.getAll();
        setDepartments(resDept);

        //
      } catch (error) {
        console.log("error");
        console.log(error);
      }
    };
    fetchData();
  }, [lazyParams, eventUpdate]);

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
      id: { value: null, matchMode: FilterMatchMode.EQUALS },
      fname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      lname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      positionId: { value: null, matchMode: FilterMatchMode.IN },
      departmentId: { value: null, matchMode: FilterMatchMode.IN },
    });
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
        style={{ minWidth: "10rem" }}
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
        style={{ minWidth: "10rem" }}
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
      employee.positionId &&
      employee.gender &&
      employee.address &&
      employee.phone &&
      employee.dob &&
      employee.email &&
      validateEmail(employee.email)
    ) {
      let _employees = [...employees];
      let _employee = { ...employee };
      if (employee.id) {
        const index = findIndexById(employee.id);
        _employees[index] = _employee;
        try {
          await employeeApi.update(_employee).then((res) => {
            setEmployees(res.content);
          });
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Employee Updated",
            life: 3000,
          });
          setEmployeeDialog(false);
          setEventUpdate(!eventUpdate);
        } catch (error) {
          console.log("error", error);
          toast.current.show({
            severity: "error",
            summary: "Failed",
            detail: "Error",
            life: 3000,
          });
        }
      } else {
        _employee.id = createId();
        _employees.push(_employee);
        try {
          await employeeApi.create(_employee).then((res) => {
            setEmployees(res.content);
          });
          setEmployees(_employees);
          setEmployee(emptyEmployee);
          setEmployeeDialog(false);
          setEventUpdate(!eventUpdate);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Product Created",
            life: 3000,
          });
        } catch (error) {
          toast.current.show({
            severity: "error",
            summary: "Failed",
            detail: "Error",
            life: 3000,
          });
          console.log("error", error);
        }
      }
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
      setEventUpdate(!eventUpdate);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Employee Deleted",
        life: 3000,
      });
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: "File Uploaded",
      });
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
    const index = totalRecords + 1;
    return index;
  };

  // const exportCSV = () => {
  //   dt.current.exportCSV();
  // };

  const exportExcel = async () => {
    const employeeDataAll = await employeeApi.getAllData().then((res) => res);
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(employeeDataAll);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, "employees");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
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
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: "File Uploaded",
      });
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

  const onTemplateSelect = (e) => {
    let _totalSize = totalSize;
    let files = e.files;
    _totalSize = files[0].size || 0;

    setTotalSize(_totalSize);
  };

  const onTemplateUpload = async (event) => {
    if (event.files[0].name.split(".")[1] !== "xlsx") {
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: "File Uploaded",
      });
      return null;
    }
    var formData = new FormData();
    formData.append("file", event.files[0]);
    await employeeApi
      .importExcel(formData)
      .then((res) => res)
      .then((success) => {
        toast.current.show({
          severity: "info",
          summary: "Success",
          detail: "File Uploaded",
        });
        // console.log(success);
        // setShowDialogImport(false);
        event.options.clear();
      })
      .catch((error) => {
        // console.log(error);
        toast.current.show({
          severity: "error",
          summary: "Failed",
          detail: "File Uploaded",
        });
      });
    setEventUpdate(!eventUpdate);
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 100000;

    console.log("check totalSize", totalSize);
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 10 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          ></ProgressBar>
        </div>
      </div>
    );
  };

  const itemTemplate = (file) => {
    const dotPath = file.name.split(".")[1];
    let imageSelectSrc;

    if (dotPath === "xlsx") {
      imageSelectSrc = "/demo/images/microsoft/excel-image.jpg";
    } else if (dotPath === "docx") {
      imageSelectSrc = "/demo/images/microsoft/word-icon.jpg";
    } else {
      imageSelectSrc = "/demo/images/microsoft/images-png.jpg";
    }

    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center">
          <div className="flex flex-column text-left ml-3 p-2 ">
            <Image src={imageSelectSrc} alt="}Icon" width="70" />
            <span className="mb-1">{file.name}</span>
          </div>
        </div>
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-file mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Drag and Drop File Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-file",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className:
      "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  const openImport = () => {
    setShowDialogImport(true);
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="Import"
          type="button"
          icon="pi pi-upload"
          severity="warning"
          className="mr-2"
          outlined
          onClick={openImport}
        />
        <Button
          label="Export"
          icon="pi pi-upload"
          severity="help"
          outlined
          onClick={exportExcel}
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
    const departmentIdSelected = e.filters.departmentId.value?.map(
      (item) => item.departmentId
    );
    const positionIdSelected = e.filters.positionId.value?.map(
      (item) => item.id
    );
    setLazyParams({
      ...lazyParams,
      id: e.filters?.id.value,
      fname: e.filters?.fname.value,
      lname: e.filters?.lname.value,
      positionIds: positionIdSelected,
      departmentIds: departmentIdSelected,
    });
  };

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
  const validateEmail = (mail) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
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
            rowsPerPageOptions={[5, 10, 15]}
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
              header="No."
              headerStyle={{ width: "4rem" }}
              body={(data, options) => options.rowIndex + 1}
            ></Column>

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
              headerStyle={{ minWidth: "5rem" }}
            />

            <Column
              field="dob"
              header="Date of Birth"
              body={dobBodyTemplate}
              headerStyle={{ minWidth: "9rem" }}
            />

            <Column
              field="email"
              header="Email"
              body={emailBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            />

            <Column
              header="Position"
              filterField="positionId"
              showFilterMenu={false}
              filterMenuStyle={{ minWidth: "8rem" }}
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
              filterMenuStyle={{ minWidth: "8rem" }}
              style={{ minWidth: "10rem" }}
              body={departmentBodyTemplate}
              filter
              filterElement={deptFilterTemplate}
            />

            <Column
              header="Action"
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "9rem" }}
            />
          </DataTable>
          {/* <EditOrNewEm
            employee={employee}
            positions={positions}
            departments={departments}
            employeeDialog={employeeDialog}
            setEmployeeDialog={setEmployeeDialog}
            employees={employees}
            // toast={toast}
          /> */}
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
                  id="fname"
                  value={employee.fname}
                  onChange={(e) => onChangeInput(e, "fname")}
                  required
                  autoFocus
                  className={classNames({
                    "p-invalid": submitted && !employee.fname,
                  })}
                />
                {submitted && !employee.fname && (
                  <small className="p-invalid text-red-500">
                    First name is required.
                  </small>
                )}
              </div>
              <div className="field col">
                <label htmlFor="lname">Last Name</label>
                <InputText
                  id="lname"
                  value={employee.lname}
                  onChange={(e) => onChangeInput(e, "lname")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !employee.lname,
                  })}
                />
                {submitted && !employee.lname && (
                  <small className="p-invalid text-red-500">
                    Last name is required.
                  </small>
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
                  "p-invalid text-red-500": submitted && !employee.email,
                })}
              />
              {submitted && !validateEmail(employee.email) && (
                <small className="p-invalid text-red-500">
                  Email is invalid.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <InputText
                id="phone"
                value={employee.phone}
                onChange={(e) => onChangeInput(e, "phone")}
                required
                className={classNames({
                  "p-invalid text-red-500": submitted && !employee.phone,
                })}
              />
              {submitted && !employee.fname && (
                <small className="p-invalid text-red-500">
                  Phone is required.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="address">Address</label>
              <InputText
                id="phone"
                value={employee.address}
                onChange={(e) => onChangeInput(e, "address")}
                required
                className={classNames({
                  "p-invalid text-red-500": submitted && !employee.address,
                })}
              />
              {submitted && !employee.address && (
                <small className="p-invalid text-red-500">
                  Address is required.
                </small>
              )}
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
                  className={classNames({
                    "p-invalid text-red-500": submitted && !employee.dob,
                  })}
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
                  className={classNames({
                    "p-invalid text-red-500": submitted && !employee.gender,
                  })}
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
                  className={classNames({
                    "p-invalid text-red-500": submitted && !employee.positionId,
                  })}
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
                  className={classNames({
                    "p-invalid text-red-500":
                      submitted && !employee.departmentId,
                  })}
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

          <Dialog
            visible={showDialogImport}
            style={{ width: "600px" }}
            header="Import"
            modal
            onHide={() => setShowDialogImport(false)}
          >
            <div className="flex align-items-center justify-content-center">
              <Toast ref={toast}></Toast>
              <FileUpload
                ref={fileUploadRef}
                name="file"
                mode="advanced"
                url="http://localhost:8080/api/excel/upload"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                chooseLabel="Import"
                maxFileSize={10000000}
                className="mr-2 inline-block w-10"
                onUpload={onTemplateUpload}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                emptyTemplate={emptyTemplate}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                chooseOptions={chooseOptions}
                uploadOptions={uploadOptions}
                cancelOptions={cancelOptions}
                customUpload={true}
                uploadHandler={onTemplateUpload}
              />
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashBoard;
