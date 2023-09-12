import React from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const MembersDialog = (props) => {
  const { members, departments, positions, memberDialog, setMemberDialog } =
    props;

  const hideDialog = () => {
    setMemberDialog(false);
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
  const priceBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Price</span>
        {formatCurrency(rowData.value)}
      </>
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

  return (
    <Dialog
      visible={memberDialog}
      modal
      className="p-fluid"
      onHide={hideDialog}
    >
      <DataTable
        value={members}
        selectionMode="single"
        paginator
        className="p-fluid"
        rows={5}
        header="Members"
      >
        <Column
          field="id"
          header="Id"
          filter
          showFilterMenu={false}
          sortable
          headerStyle={{ minWidth: "8rem" }}
        />
        <Column
          field="fname"
          header="First name"
          filter
          showFilterMenu={false}
          sortable
          headerStyle={{ minWidth: "10rem" }}
        />
        <Column
          field="lname"
          header="Last name"
          filter
          showFilterMenu={false}
          sortable
          headerStyle={{ minWidth: "10rem" }}
        />

        <Column
          field="gender"
          header="Gender"
          headerStyle={{ minWidth: "5rem" }}
        />

        <Column
          field="dob"
          header="Date of Birth"
          headerStyle={{ minWidth: "9rem" }}
        />

        <Column
          field="email"
          header="Email"
          headerStyle={{ minWidth: "10rem" }}
        />

        <Column
          field="positionId"
          header="Position"
          body={positionBodyTemplate}
          filterMenuStyle={{ minWidth: "8rem" }}
          style={{ minWidth: "10rem" }}
        />

        <Column
          field="departmentId"
          header="Department"
          filterField="departmentId"
          showFilterMenu={false}
          body={departmentBodyTemplate}
          filterMenuStyle={{ minWidth: "8rem" }}
          style={{ minWidth: "10rem" }}
        />
      </DataTable>
    </Dialog>
  );
};

export default MembersDialog;
