import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import employeeApi from "../../api/employeeApi";
import departmentApi from "../../api/departmentApi";
import positionApi from "../../api/positionApi";

const Crud = () => {
  const emptyDepartment = {
    departmentId: null,
    name: "",
    description: "",
  };

  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);

  const [department, setDepartment] = useState(emptyDepartment);
  const [positions, setPositions] = useState(null);
  const [employees, setEmployees] = useState(null);
  const [departments, setDepartments] = useState(null);

  const [departmentDialog, setDepartmentDialog] = useState(false);
  const [deleteDepartmentDialog, setDeleteDepartmentDialog] = useState(false);
  const [deleteDepartmentsDialog, setDeleteDepartmentsDialog] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState(null);

  const fetchData = async () => {
    try {
      const resPos = await positionApi.getAll();
      setPositions(resPos);

      const resDept = await departmentApi.getAll();
      console.log("check resDEpt", resDept);
      setDepartments(resDept);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const openNew = () => {
    setDepartment(emptyDepartment);
    setSubmitted(false);
    setDepartmentDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setDepartmentDialog(false);
  };

  const hideDeleteDepartmentDialog = () => {
    setDeleteDepartmentDialog(false);
  };

  const hideDeleteDepartmentsDialog = () => {
    setDeleteDepartmentsDialog(false);
  };

  const saveDepartment = async () => {
    setSubmitted(true);

    if (department.name) {
      let _departments = [...departments];
      let _department = { ...department };
      if (department.departmentId) {
        const index = findIndexById(department.departmentId);

        _departments[index] = _department;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Department Updated",
          life: 3000,
        });

        await departmentApi.update(_department).then((res) => {
          setDepartments(res);
        });
      } else {
        _department.departmentId = createId();
        _departments.push(_department);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
        await departmentApi
          .create(_department)
          .then((res) => setDepartments(res));
      }

      setDepartments(_departments);
      setDepartment(emptyDepartment);
      setDepartmentDialog(false);
    }
  };

  const editDepartment = (department) => {
    setDepartment({ ...department });
    setDepartmentDialog(true);
  };
  const confirmDeleteDepartment = (department) => {
    setDepartment(department);
    setDeleteDepartmentDialog(true);
  };

  const deleteDepartment = async () => {
    let _departments = departments.filter(
      (val) => val.departmentId !== department.departmentId
    );
    await departmentApi.deleteOne(department.departmentId);
    // DepartmentService.deleteDepartment(department.departmentId);
    setDepartments(_departments);
    setDeleteDepartmentDialog(false);
    setDepartment(emptyDepartment);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Department Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < departments.length; i++) {
      if (departments[i].departmentId === id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const createId = () => {
    const index = departments[departments.length - 1].departmentId + 1;
    return index;
  };

  const confirmDeleteSelected = () => {
    setDeleteDepartmentsDialog(true);
  };

  const deleteSelectedDepartments = async () => {
    let ids = [];
    selectedDepartments.forEach((item) => ids.push(item.departmentId));
    let _departments = departments.filter((val) => {
      // return !ids.includes(val.departmentId);
      return !selectedDepartments.includes(val);
    });
    console.log("check _departments", _departments);
    setDepartments(_departments);
    await departmentApi.deleteMany(ids);
    // DepartmentService.deleteDepartments(ids);
    setDeleteDepartmentsDialog(false);
    setSelectedDepartments(null);

    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
      life: 3000,
    });
  };

  const onChangeInput = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _department = { ...department };
    _department[`${name}`] = val;
    setDepartment(_department);
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
            disabled={!selectedDepartments || !selectedDepartments.length}
          />
        </div>
      </React.Fragment>
    );
  };

  // const rightToolbarTemplate = () => {
  //   return (
  //     <React.Fragment>
  //       <FileUpload
  //         mode="basic"
  //         accept="image/*"
  //         maxFileSize={1000000}
  //         label="Import"
  //         chooseLabel="Import"
  //         className="mr-2 inline-block"
  //       />
  //       <Button label="Export" icon="pi pi-upload" severity="help" />
  //     </React.Fragment>
  //   );
  // };

  const hideDepartmentDialog = () => {
    setSubmitted(false);
    setDepartmentDialog(false);
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Department</h5>
    </div>
  );

  const departmentDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={saveDepartment} />
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
            editDepartment(rowData);
          }}
        />
        <Button
          icon="pi pi-trash"
          severity="warning"
          rounded
          className="mr-2"
          onClick={() => confirmDeleteDepartment(rowData)}
        />
        <Button
          icon="pi pi-search"
          severity="info"
          rounded
          onClick={() => confirmSearchDepartment(rowData)}
        />
      </>
    );
  };

  const deleteDepartmentDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteDepartmentDialog}
      />
      <Button label="Yes" icon="pi pi-check" text onClick={deleteDepartment} />
    </>
  );

  const deleteDepartmentsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteDepartmentsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        text
        onClick={deleteSelectedDepartments}
      />
    </>
  );

  const idBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Id</span>
        <span>{rowData.departmentId}</span>
      </>
    );
  };

  const nameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        <span>{rowData.name}</span>
      </>
    );
  };

  const descriptionBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Description</span>
        <span>{rowData.description}</span>
      </>
    );
  };

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar
            className="mb-4"
            start={leftToolbarTemplate}
            // right={rightToolbarTemplate}
          ></Toolbar>

          {/* Table start */}

          <DataTable
            value={departments}
            selection={selectedDepartments}
            onSelectionChange={(e) => setSelectedDepartments(e.value)}
            dataKey="departmentId"
            rows={5}
            showGridlines
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            // globalFilter={globalFilter}
            emptyMessage="No department found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "4rem" }}
            ></Column>
            <Column
              field="departmentId"
              header="Id"
              sortable
              body={idBodyTemplate}
              headerStyle={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="name"
              header="Name"
              sortable
              body={nameBodyTemplate}
              headerStyle={{ minWidth: "8rem" }}
            ></Column>
            <Column
              field="description"
              header="Description"
              sortable
              body={descriptionBodyTemplate}
              headerStyle={{ minWidth: "8rem" }}
            ></Column>
            <Column
              header="Action"
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
          </DataTable>

          <Dialog
            visible={departmentDialog}
            style={{ width: "650px" }}
            header="Department"
            modal
            className="p-fluid"
            footer={departmentDialogFooter}
            onHide={hideDepartmentDialog}
          >
            <div className="field">
              <label htmlFor="name">Name</label>
              <InputText
                id="name"
                value={department.name}
                onChange={(e) => onChangeInput(e, "name")}
                required
                className={classNames({
                  "p-invalid": submitted && !department.name,
                })}
              />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <InputText
                id="description"
                value={department.description}
                onChange={(e) => onChangeInput(e, "description")}
                required
                className={classNames({
                  "p-invalid": submitted && !department.description,
                })}
              />
            </div>
          </Dialog>

          <Dialog
            visible={deleteDepartmentDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteDepartmentDialogFooter}
            onHide={hideDeleteDepartmentDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {department && (
                <span>
                  Are you sure you want to delete <b>{department.name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteDepartmentsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteDepartmentsDialogFooter}
            onHide={hideDeleteDepartmentsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {department && (
                <span>
                  Are you sure you want to delete the selected departments?
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
