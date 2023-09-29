import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import projectApi from "../../api/projectApi";
import employeeApi from "../../api/employeeApi";
import positionApi from "../../api/positionApi";
import departmentApi from "../../api/departmentApi";
import MembersDialog from "../../../demo/components/MembersDialog";
import { PickList } from "primereact/picklist";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Calendar } from "primereact/calendar";

const ProjectDashBoard = () => {
  let emptyProject = {
    id: null,
    name: "",
    description: "",
    createdAt: "",
    completedAt: "",
    membersId: [],
    idPM: null,
    value: null,
  };

  const [submitted, setSubmitted] = useState(false);
  const [departments, setDepartments] = useState(null);
  const [positions, setPositions] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const [memberDialog, setMemberDialog] = useState(false);
  const [pmDialog, setPmDialog] = useState(false);
  const [sourcePm, setSourcePm] = useState([]);
  const [targetPm, setTargetPm] = useState([]);
  //
  const [project, setProject] = useState(emptyProject);
  const [projects, setProjects] = useState(null);
  const [members, setMembers] = useState(null);
  const [pm, setPm] = useState([]);

  const [deleteProjectDialog, setDeleteProjectDialog] = useState(false);
  const [projectDialog, setProjectDialog] = useState(false);

  const [editMembersDialog, setEditMembersDialog] = useState(false);
  const [editPmDialog, setEditPmDialog] = useState(false);
  const [fullEmp, setFullEmp] = useState(null);
  const [source, setSource] = useState([]);
  const [targetMembers, setTargetMembers] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  const [filters, setFilters] = useState({
    id: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },

    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    createdAt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    completedAt: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    value: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchData = async () => {
      await projectApi.getAll().then((res) => setProjects(getProjects(res)));
      await positionApi.getAll().then((res) => setPositions(res));
      await departmentApi.getAll().then((res) => setDepartments(res));
      await employeeApi.getAllData().then((res) => setFullEmp(res));
    };
    fetchData();
  }, []);

  const getProjects = (data) => {
    return [...(data || [])].map((d) => {
      d.createdAt = new Date(d.createdAt);
      d.completedAt = new Date(d.completedAt);

      return d;
    });
  };
  const createdAtBodyTemplate = (rowData) => {
    return formatDate(rowData.createdAt);
  };
  const completedAtBodyTemplate = (rowData) => {
    return formatDate(rowData.completedAt);
  };

  const formatDate = (value) => {
    return value.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const openNew = () => {
    setProject(emptyProject);
    setSubmitted(false);
    setProjectDialog(true);
  };

  const hideDialog = () => {
    setMemberDialog(false);
    setSubmitted(false);
    setProjectDialog(false);
    setPmDialog(false);
  };

  const onChangeInput = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _project = { ...project };
    _project[`${name}`] = val;
    setProject(_project);
  };

  const hideDeleteProjectDialog = () => {
    setDeleteProjectDialog(false);
  };

  const saveProject = async () => {
    setSubmitted(true);
    console.log("check project", project);

    if (
      project.name.trim() ||
      project.completedAt === "" ||
      project.createdAt === "" ||
      project.value
    ) {
      let _projects = [...projects];
      let _project = { ...project };
      if (project.id) {
        const index = findIndexById(project.id);
        if (
          project.name.trim() &&
          project.completedAt === "" &&
          project.createdAt === "" &&
          project.value
        ) {
          return toast.current.show({
            severity: "error",
            summary: "Failed",
            detail: "All flied are mandatory",
            life: 3000,
          });
        }
        _projects[index] = _project;

        await projectApi.update(project).then((res) => res);
      } else {
        _project.id = createId();
        await projectApi.create(project).then((res) => res);
        _projects.push(_project);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Project Created",
          life: 3000,
        });
      }

      setProjects(_projects);
      setProjectDialog(false);
      setProject(emptyProject);
    }
  };

  const editProject = (project) => {
    setProject({ ...project });
    setProjectDialog(true);
  };

  const confirmDeleteProject = (project) => {
    setProject(project);
    setDeleteProjectDialog(true);
  };

  const deleteProject = async () => {
    await projectApi.deleteOne(project.id).then((res) => res);
    let _projects = projects.filter((val) => val.id !== project.id);
    setProjects(_projects);
    setDeleteProjectDialog(false);
    setProject(emptyProject);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Project Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    return projects.length + 1;
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _project = { ...project };
    _project[`${name}`] = val;

    setProject(_project);
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
        </div>
      </React.Fragment>
    );
  };

  const headerSmall = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Members</h5>
    </div>
  );

  const nameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.name}
      </>
    );
  };

  const priceBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Price</span>
        {formatCurrency(rowData.value)}
      </>
    );
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
      <>
        <span>{getDepartmentName(rowData.departmentId)}</span>
      </>
    );
  };

  // here
  const convertTime = (time) => {
    const arr = time.split("-").reverse();
    return arr.join("-");
  };

  // const createdAtBodyTemplate = (rowData) => {
  //   return <span>{convertTime(rowData.createdAt)}</span>;
  // };
  // const completedAtBodyTemplate = (rowData) => {
  //   return <span>{convertTime(rowData.completedAt)}</span>;
  // };
  //
  const handleDetailsMember = async (rowData) => {
    const membersCurrent = await employeeApi
      .findMany(rowData.membersId)
      .then((res) => res);
    setMembers(membersCurrent);
    return membersCurrent;
  };

  // here >>>
  const handleDetailsPm = async (rowData) => {
    const pmCurrent = await employeeApi.get(rowData.idPM).then((res) => res);
    setPm([pmCurrent]);
    return pmCurrent;
  };

  const membersBodyTemplate = (rowData) => {
    return (
      <Button
        label="Details"
        text
        severity="success"
        onClick={() => {
          setMemberDialog(true);
          handleDetailsMember(rowData);
        }}
      />
    );
  };
  const pmBodyTemplate = (rowData) => {
    return (
      <Button
        label="Details"
        text
        onClick={() => {
          setPmDialog(true);
          handleDetailsPm(rowData);
        }}
      />
    );
  };
  // 111111111111
  const handleActionEdit = async (rowData) => {
    editProject(rowData);
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
            handleActionEdit(rowData);
          }}
        />
        <Button
          icon="pi pi-trash"
          severity="warning"
          rounded
          onClick={() => confirmDeleteProject(rowData)}
        />
      </>
    );
  };

  const itemTemplate = (item) => {
    return (
      <div className="flex flex-wrap p-2 align-items-center gap-3 ">
        <div className="flex-1 flex flex-column gap-2 border-400">
          <span className="font-bold ">
            ID:<span className="text-sm font-normal"> {item.id}</span>
          </span>

          <span className="font-bold ">
            First Name:
            <span className="text-sm font-normal"> {item.fname}</span>
          </span>
          <span className="font-bold ">
            Last Name:
            <span className="text-sm font-normal"> {item.lname}</span>
          </span>
          <span className="font-bold ">
            Date of birth:
            <span className="text-sm font-normal">
              {" "}
              {convertTime(item.dob)}
            </span>
          </span>
          <span className="font-bold ">
            Gender:
            <span className="text-sm font-normal"> {item.gender}</span>
          </span>
          <span className="font-bold ">
            Email:
            <span className="text-sm font-normal"> {item.email}</span>
          </span>
          <span className="font-bold ">
            Position:
            <span className="text-sm font-normal">
              {" "}
              {getPositionName(item.positionId)}
            </span>
          </span>
          <span className="font-bold ">
            Department:
            <span className="text-sm font-normal">
              {" "}
              {getDepartmentName(item.departmentId)}
            </span>
          </span>
        </div>
      </div>
    );
  };
  const handleChangePickList = (event) => {
    setTargetMembers(event.target);
    setSource(event.source);
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Project</h5>
    </div>
  );

  const projectDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={saveProject} />
    </>
  );
  const deleteProjectDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteProjectDialog}
      />
      <Button label="Yes" icon="pi pi-check" text onClick={deleteProject} />
    </>
  );

  const dateFilterTemplate = (options) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        dateFormat="dd/mm/yy"
        placeholder="dd/mm/yyyy"
        mask="99/99/9999"
      />
    );
  };

  // 22222
  const handleChildEditMembers = async () => {
    // ok
    if (project.membersId.length != 0) {
      const mb = await employeeApi
        .findMany(project.membersId)
        .then((res) => res);
      let membersExceptionRest = await fullEmp.filter(
        (x) => !mb.some((cur) => x.id === cur.id)
      );
      setTargetMembers(mb);
      setSource(membersExceptionRest);
    } else {
      setTargetMembers([]);
      setSource(fullEmp);
    }
    setEditMembersDialog(true);
  };

  const handleChildEditPm = async () => {
    // ok
    if (project.idPM) {
      const pmCur = await employeeApi.get(project.idPM).then((res) => res);
      let pmExceptionRest = fullEmp.filter((x) => x.id !== project.idPM);
      setTargetPm([pmCur]);
      setSourcePm(pmExceptionRest);
    } else {
      setTargetPm([]);
      setSourcePm(fullEmp);
    }
    setEditPmDialog(true);
  };

  const hidePickListDialog = () => {
    setEditMembersDialog(false);
  };

  const hidePickListPmDialog = () => {
    setEditPmDialog(false);
  };

  const handleChangePickListPm = (event) => {
    setTargetPm(event.target);
    setSourcePm(event.source);
  };

  const handleListMemberEdit = () => {
    setProject({
      ...project,
      membersId: targetMembers.map((x) => x.id).toString(),
    });
    setEditMembersDialog(false);
  };
  const handlePmEdit = () => {
    if (targetPm.length === 1) {
      setProject({ ...project, idPM: targetPm[0].id });
      setEditPmDialog(false);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: "Manager only one",
        life: 3000,
      });
    }
  };
  const valueFilterTemplate = (options) => {
    return (
      <InputNumber
        value={options.value}
        onChange={(e) => options.filterCallback(e.value, options.index)}
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    );
  };

  const membersDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        onClick={hidePickListDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        text
        onClick={handleListMemberEdit}
      />
    </>
  );
  const pmDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        text
        onClick={hidePickListPmDialog}
      />
      <Button label="Save" icon="pi pi-check" text onClick={handlePmEdit} />
    </>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

          <DataTable
            ref={dt}
            value={projects}
            dataKey="id"
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25]}
            filterDisplay="menu"
            // filterDisplay="row"
            className="datatable-responsive"
            emptyMessage="No projects found."
            header={header}
            showGridlines
            filters={filters}
            selectionMode="checkbox"
            selection={selectedProjects}
            onSelectionChange={(e) => setSelectedProjects(e.value)}
            responsiveLayout="scroll"
          >
            <Column
              field="id"
              header="Id"
              filter
              // sortable
              // body={codeBodyTemplate}
              headerStyle={{ minWidth: "5rem" }}
            ></Column>
            <Column
              field="name"
              header="Name"
              filter
              body={nameBodyTemplate}
              headerStyle={{ minWidth: "15rem" }}
            ></Column>
            <Column
              field="description"
              header="Description"
              dataType="date"
              headerStyle={{ minWidth: "15rem" }}
            ></Column>
            <Column
              field="createdAt"
              header="Created At"
              dataType="date"
              body={createdAtBodyTemplate}
              // body={dateBodyTemplate}
              filter
              filterElement={dateFilterTemplate}
              headerStyle={{ minWidth: "10rem" }}
              // sortable
            ></Column>
            <Column
              field="completedAt"
              header="Completed At"
              filter
              filterElement={dateFilterTemplate}
              dataType="date"
              body={completedAtBodyTemplate}
              // body={dateBodyTemplate}
              headerStyle={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="membersId"
              header="Members"
              body={membersBodyTemplate}
            ></Column>
            <Column
              field="idPM"
              header="PM"
              body={pmBodyTemplate}
              headerStyle={{ minWidth: "8rem" }}
            ></Column>
            <Column
              field="value"
              header="Value"
              body={priceBodyTemplate}
              filter
              dataType="numeric"
              filterElement={valueFilterTemplate}
              // sortable
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
          </DataTable>

          <Dialog
            visible={projectDialog}
            style={{ width: "450px" }}
            header="Project Details"
            modal
            className="p-fluid"
            footer={projectDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="name">Name</label>
              <InputText
                id="name"
                value={project?.name}
                onChange={(e) => onInputChange(e, "name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid text-red-500": submitted && !project.name,
                })}
              />
              {submitted && !project.name && (
                <small className="p-invalid text-red-500">
                  Name is required.
                </small>
              )}
            </div>
            <div className="description">
              <label htmlFor="description">Description</label>
              <InputTextarea
                id="description"
                value={project.description}
                onChange={(e) => onInputChange(e, "description")}
                required
                rows={3}
                cols={20}
                className="mt-2"
              />
            </div>

            <div className="formgrid grid mt-2">
              <div className="field col">
                <label htmlFor="createdAt">Created At</label>
                <InputText
                  id="createdAt"
                  value={project.createdAt}
                  onChange={(e) => onChangeInput(e, "createdAt")}
                  min="1950-01-01"
                  max="2100-01-01"
                  type="date"
                  className={classNames({
                    "p-invalid text-red-500": submitted && !project.createdAt,
                  })}
                />
              </div>
              <div className="field col">
                <label htmlFor="completedAt">Completed At</label>
                <InputText
                  id="completedAt"
                  value={project.completedAt}
                  onChange={(e) => onChangeInput(e, "completedAt")}
                  min="1950-01-01"
                  max="2100-01-01"
                  type="date"
                  className={classNames({
                    "p-invalid text-red-500": submitted && !project.completedAt,
                  })}
                />
              </div>
            </div>
            <div className="field">
              <span>Value</span>
              <InputNumber
                id="value"
                value={project.value}
                onValueChange={(e) => {
                  onChangeInput(e, "value");
                }}
                mode="currency"
                currency="USD"
                locale="en-US"
                className="mt-2"
              />
              {submitted && !project.value && (
                <small className="p-invalid text-red-500">
                  Value is required.
                </small>
              )}
            </div>
            <div className="formgrid grid">
              <div className="field col">
                <span>Members</span>
                <Button
                  id="members"
                  label="Edit"
                  className="mt-2"
                  severity="success"
                  onClick={() => {
                    handleChildEditMembers();
                  }}
                />
              </div>

              <div className="field col">
                <span>Project Manager</span>
                <Button
                  id="pm"
                  label="Edit"
                  className="mt-2"
                  severity="success"
                  onClick={() => handleChildEditPm()}
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteProjectDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteProjectDialogFooter}
            onHide={hideDeleteProjectDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {project && (
                <span>
                  Are you sure you want to delete <b>{project.name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <MembersDialog
            members={members}
            departments={departments}
            positions={positions}
            memberDialog={memberDialog}
            setMemberDialog={setMemberDialog}
          />

          <MembersDialog
            members={pm}
            departments={departments}
            positions={positions}
            memberDialog={pmDialog}
            setMemberDialog={setPmDialog}
          />

          <Dialog
            modal
            visible={editMembersDialog}
            className="p-fluid"
            onHide={hidePickListDialog}
            footer={membersDialogFooter}
          >
            <PickList
              source={source}
              target={targetMembers}
              onChange={handleChangePickList}
              itemTemplate={itemTemplate}
              filter
              filterBy="fname,lname"
              breakpoint="1400px"
              sourceHeader="Available"
              targetHeader="Selected"
              sourceStyle={{ height: "30rem" }}
              targetStyle={{ height: "30rem" }}
              sourceFilterPlaceholder="Search by name"
              targetFilterPlaceholder="Search by name"
            />
          </Dialog>

          <Dialog
            modal
            visible={editPmDialog}
            className="p-fluid"
            onHide={hidePickListPmDialog}
            footer={pmDialogFooter}
          >
            <PickList
              source={sourcePm}
              target={targetPm}
              onChange={handleChangePickListPm}
              itemTemplate={itemTemplate}
              filter
              filterBy="fname,lname"
              breakpoint="1400px"
              sourceHeader="Available"
              targetHeader="Selected"
              sourceStyle={{ height: "30rem" }}
              targetStyle={{ height: "30rem" }}
              sourceFilterPlaceholder="Search by name"
              targetFilterPlaceholder="Search by name"
            />
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashBoard;
