import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import userApi from "../api/userApi";
import { InputTextarea } from "primereact/inputtextarea";
import { ListBox } from "primereact/listbox";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";

const AdminDashBoard = () => {
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
  const [searchDepartment, setSearchDepartment] = useState(false);
  const [listQty, setListQty] = useState(null);

  const [userDialog, setUserDialog] = useState(false);
  const [deleteDepartmentDialog, setDeleteDepartmentDialog] = useState(false);
  const [deleteDepartmentsDialog, setDeleteDepartmentsDialog] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState(null);
  const [filters, setFilters] = useState({
    id: { value: null, matchMode: FilterMatchMode.EQUALS },
    username: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    firstname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    lastname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    roles: { value: null, matchMode: FilterMatchMode.IN },
  });

  const [deleteUserDialog, setDeleteUserDialog] = useState(false);

  const emptyUser = {
    id: null,
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    roles: [],
  };

  const sampleRoles = [
    {
      id: 1,
      name: "ROLE_ADMIN",
    },
    {
      id: 2,
      name: "ROLE_PM",
    },
    {
      id: 3,
      name: "ROLE_USER",
    },
  ];

  const [user, setUser] = useState(emptyUser);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchData = async () => {
      try {
        const a = await userApi.getAll().then((res) => setUsers(res));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  const openNew = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  // const hideDeleteDepartmentsDialog = () => {
  //   setDeleteDepartmentsDialog(false);
  // };

  const saveUser = async () => {
    setSubmitted(true);

    if (user.username) {
      let _users = [...users];
      let _user = { ...user };
      if (user.id) {
        const index = findIndexById(user.id);

        _users[index] = _user;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "User Updated",
          life: 3000,
        });

        await userApi.update(_user).then((res) => {
          setUsers(res);
        });
      } else {
        _user.id = createId();
        _users.push(_user);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
        await userApi.signup(_user).then((res) => setUsers(res));
      }

      setUsers(_users);
      setUser(emptyUser);
      setUserDialog(false);
    }
  };

  const editUser = (user) => {
    setUser({ ...user });
    setUserDialog(true);
  };
  const confirmDeleteUser = (user) => {
    setUser(user);
    setDeleteUserDialog(true);
  };

  const deleteUser = async () => {
    let _users = users.filter((val) => val.id !== user.id);
    await userApi.deleteOne(user.id).then((res) => res);
    setUsers(_users);
    setDeleteUserDialog(false);
    setUser(emptyUser);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "User Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const createId = () => {
    return users.length + 1;
  };

  const confirmDeleteSelected = () => {
    setDeleteDepartmentsDialog(true);
  };

  // const deleteSelectedDepartments = async () => {
  //   let ids = [];
  //   selectedDepartments.forEach((item) => ids.push(item.departmentId));
  //   let _departments = departments.filter((val) => {
  //     return !selectedDepartments.includes(val);
  //   });
  //   console.log("check _departments", _departments);
  //   setDepartments(_departments);
  //   await departmentApi.deleteMany(ids);
  //   setDeleteDepartmentsDialog(false);
  //   setSelectedDepartments(null);

  //   toast.current.show({
  //     severity: "success",
  //     summary: "Successful",
  //     detail: "Products Deleted",
  //     life: 3000,
  //   });
  // };

  const onChangeInput = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _user = { ...user };
    _user[`${name}`] = val;
    setUser(_user);
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
          {/* <Button
            label="Delete"
            icon="pi pi-trash"
            severity="danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedDepartments || !selectedDepartments.length}
          /> */}
        </div>
      </React.Fragment>
    );
  };

  const hideUserDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Users</h5>
    </div>
  );

  const userDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={saveUser} />
    </>
  );
  // const confirmSearchDepartment = async (rowData) => {
  //   const employeesInDept = await departmentApi
  //     .findByDept(rowData.departmentId)
  //     .then((res) => res);

  //   setListQty(
  //     positions.map((pos) => ({
  //       id: pos.id,
  //       name: pos.name,
  //       qty: employeesInDept.filter((e) => e.positionId === pos.id).length,
  //     }))
  //   );
  //   setDepartment(rowData);
  //   setSearchDepartment(true);
  // };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          severity="success"
          rounded
          className="mr-2"
          onClick={() => {
            editUser(rowData);
          }}
        />
        <Button
          icon="pi pi-trash"
          severity="warning"
          rounded
          className="mr-2"
          onClick={() => confirmDeleteUser(rowData)}
        />
        {/* <Button
          icon="pi pi-search"
          severity="info"
          rounded
          onClick={() => confirmSearchDepartment(rowData)}
        /> */}
      </>
    );
  };

  const deleteUserDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteUserDialog}
      />
      <Button label="Yes" icon="pi pi-check" text onClick={deleteUser} />
    </>
  );

  // const deleteDepartmentsDialogFooter = (
  //   <>
  //     <Button
  //       label="No"
  //       icon="pi pi-times"
  //       text
  //       onClick={hideDeleteDepartmentsDialog}
  //     />
  //     <Button
  //       label="Yes"
  //       icon="pi pi-check"
  //       text
  //       onClick={deleteSelectedDepartments}
  //     />
  //   </>
  // );

  const idBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Id</span>
        <span>{rowData.id}</span>
      </>
    );
  };
  const usernameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Username</span>
        <span>{rowData.username}</span>
      </>
    );
  };

  const passwordBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Password</span>
        <span>{rowData.password}</span>
      </>
    );
  };

  const fnameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        <span>{rowData.firstname}</span>
      </>
    );
  };

  const lnameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        <span>{rowData.lastname}</span>
      </>
    );
  };

  const emailBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Email</span>
        <span>{rowData.email}</span>
      </>
    );
  };

  const rolesBodyTemplate = (rowData) => {
    const rolesName = rowData.roles.map((role) => role.name);
    let roleStr = rolesName.join(", ");
    return (
      <>
        <span className="p-column-title">Roles</span>
        <span>{roleStr}</span>
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
            value={users}
            filters={filters}
            dataKey="id"
            filterDisplay="row"
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25]}
            showGridlines
            className="datatable-responsive"
            emptyMessage="No user found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              field="id"
              header="Id"
              sortable
              filter
              showFilterMenu={false}
              body={idBodyTemplate}
              headerStyle={{ minWidth: "8rem" }}
            ></Column>
            <Column
              field="username"
              header="Username"
              filter
              showFilterMenu={false}
              sortable
              body={usernameBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
            <Column
              field="password"
              header="Password"
              body={passwordBodyTemplate}
              headerStyle={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="firstname"
              header="Fisrt Name"
              filter
              showFilterMenu={false}
              sortable
              body={fnameBodyTemplate}
              headerStyle={{ minWidth: "8rem" }}
            ></Column>
            <Column
              field="lastname"
              header="Last Name"
              sortable
              filter
              showFilterMenu={false}
              body={lnameBodyTemplate}
              headerStyle={{ minWidth: "8rem" }}
            ></Column>
            <Column
              field="email"
              header="Email"
              sortable
              filter
              showFilterMenu={false}
              body={emailBodyTemplate}
              headerStyle={{ minWidth: "8rem" }}
            ></Column>
            <Column
              header="Roles"
              body={rolesBodyTemplate}
              headerStyle={{ minWidth: "8rem" }}
            ></Column>
            <Column
              header="Action"
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
          </DataTable>

          <Dialog
            visible={userDialog}
            style={{ width: "650px" }}
            header="User"
            modal
            className="p-fluid"
            footer={userDialogFooter}
            onHide={hideUserDialog}
          >
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="firstname">First Name</label>
                <InputText
                  id="firstname"
                  value={user.firstname}
                  onChange={(e) => onChangeInput(e, "firstname")}
                  required
                  // autoFocus
                  className={classNames({
                    "p-invalid": submitted && !user.firstname,
                  })}
                />
                {submitted && !user.firstname && (
                  <small className="p-invalid text-red-500">
                    First Name is required.
                  </small>
                )}
              </div>
              <div className="field col">
                <label htmlFor="lastname">Last Name</label>
                <InputText
                  id="lastname"
                  value={user.lastname}
                  onChange={(e) => onChangeInput(e, "lastname")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !user.lastname,
                  })}
                />
                {submitted && !user.lastname && (
                  <small className="p-invalid text-red-500">
                    Last Name is required.
                  </small>
                )}
              </div>
            </div>
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="username">Username</label>
                <InputText
                  id="username"
                  value={user.username}
                  onChange={(e) => onChangeInput(e, "username")}
                  required
                  // autoFocus
                  className={classNames({
                    "p-invalid": submitted && !user.username,
                  })}
                />
                {submitted && !user.username && (
                  <small className="p-invalid text-red-500">
                    Username is required.
                  </small>
                )}
              </div>
              <div className="field col">
                <label htmlFor="email">Email</label>
                <InputText
                  id="email"
                  value={user.email}
                  onChange={(e) => onChangeInput(e, "email")}
                  required
                  className={classNames({
                    "p-invalid": submitted && !user.email,
                  })}
                />
                {submitted && !user.email && (
                  <small className="p-invalid text-red-500">
                    Email is required.
                  </small>
                )}
              </div>
            </div>
            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="password">Password</label>
                <InputTextarea
                  id="password"
                  value={user.password}
                  onChange={(e) => onChangeInput(e, "password")}
                  rows={6}
                  cols={10}
                />
              </div>
              <div className="field col">
                <label htmlFor="roles">Roles</label>

                <ListBox
                  id="roles"
                  multiple
                  value={user.roles}
                  onChange={(e) => {
                    onChangeInput(e, "roles");
                  }}
                  options={sampleRoles}
                  optionLabel="name"
                  className="w-full h-10rem"
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteUserDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteUserDialogFooter}
            onHide={hideDeleteUserDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {department && (
                <span>
                  Are you sure you want to delete <b>{user.username}</b>?
                </span>
              )}
            </div>
          </Dialog>

          {/* <Dialog
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
          </Dialog> */}
          <Dialog
            visible={searchDepartment}
            style={{ width: "450px" }}
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

export default AdminDashBoard;
