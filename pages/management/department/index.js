import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import departmentApi from "../../api/departmentApi";
import positionApi from "../../api/positionApi";
import { FilterOperator, FilterMatchMode } from "primereact/api";

const DepartmentDashBoard = () => {
  const emptyDepartment = {
    departmentId: null,
    name: "",
    description: "",
  };

  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const [fetchApi, setFetchApi] = useState(false);
  const [department, setDepartment] = useState(emptyDepartment);
  const [positions, setPositions] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [searchDepartment, setSearchDepartment] = useState(false);
  const [listQty, setListQty] = useState(null);

  const [departmentDialog, setDepartmentDialog] = useState(false);
  const [deleteDepartmentDialog, setDeleteDepartmentDialog] = useState(false);
  const [deleteDepartmentsDialog, setDeleteDepartmentsDialog] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState(null);
  const [filters, setFilters] = useState({
    departmentId: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },

    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    description: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchData = async () => {
      try {
        await positionApi.getAll().then((res) => setPositions(res));

        const resDept = await departmentApi.getAll().then((res) => res);
        setDepartments(resDept);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [fetchApi]);
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
        setFetchApi(!fetchApi);
      } else {
        _department.departmentId = createId();
        _departments.push(_department);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Department Created",
          life: 3000,
        });
        await departmentApi
          .create(_department)
          .then((res) => setDepartments(res));
      }
      setFetchApi(!fetchApi);

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
    await departmentApi.deleteOne(department.departmentId).then((res) => res);
    setFetchApi(!fetchApi);
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
      return !selectedDepartments.includes(val);
    });
    setDepartments(_departments);
    await departmentApi.deleteMany(ids).then((res) => res);
    setFetchApi(!fetchApi);
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
  const confirmSearchDepartment = async (rowData) => {
    const employeesInDept = await departmentApi
      .findByDept(rowData.departmentId)
      .then((res) => res);

    setListQty(
      positions.map((pos) => ({
        id: pos.id,
        name: pos.name,
        qty: employeesInDept.filter((e) => e.positionId === pos.id).length,
      }))
    );
    setDepartment(rowData);
    setSearchDepartment(true);
  };

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
  const hideSearch = () => {
    setSearchDepartment(false);
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
            paginator
            rows={5}
            filters={filters}
            rowsPerPageOptions={[5, 10, 25]}
            showGridlines
            className="datatable-responsive"
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
              filter
              body={idBodyTemplate}
              headerStyle={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="name"
              header="Name"
              filter
              // sortable
              body={nameBodyTemplate}
              headerStyle={{ minWidth: "8rem" }}
            ></Column>
            <Column
              field="description"
              header="Description"
              filter
              // sortable
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
          <Dialog
            visible={searchDepartment}
            style={{ width: "450px" }}
            // header="Confirm"
            header={`Bộ phận ${department.name}`}
            modal
            onHide={hideSearch}
          >
            {/* <div className="card"> */}
            <div>
              <DataTable value={listQty} tableStyle={{ minWidth: "20rem" }}>
                <Column field="id" header="Id"></Column>
                <Column field="name" header="Position"></Column>
                <Column field="qty" header="Quality"></Column>
              </DataTable>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashBoard;
