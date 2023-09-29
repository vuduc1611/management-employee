import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import positionApi from "../../api/positionApi";
import { FilterOperator, FilterMatchMode } from "primereact/api";

const PositionDashBoard = () => {
  const emptyPosition = {
    id: null,
    name: "",
  };
  const [fetchApi, setFetchApi] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const [position, setPosition] = useState(emptyPosition);
  const [positions, setPositions] = useState(null);
  const [positionDialog, setPositionDialog] = useState(false);
  const [deletePositionDialog, setDeletePositionDialog] = useState(false);
  const [deletePositionsDialog, setDeletePositionsDialog] = useState(false);
  const [selectedPositions, setSelectedPositions] = useState(null);

  const [filters, setFilters] = useState({
    id: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },

    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchData = async () => {
      try {
        await positionApi.getAll().then((res) => setPositions(res));
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [fetchApi]);
  const openNew = () => {
    setPosition(emptyPosition);
    setSubmitted(false);
    setPositionDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setPositionDialog(false);
  };

  const hideDeletePositionDialog = () => {
    setDeletePositionDialog(false);
  };

  const hideDeletePositionsDialog = () => {
    setDeletePositionsDialog(false);
  };

  const savePosition = async () => {
    setSubmitted(true);

    if (position.name) {
      let _positions = [...positions];
      let _position = { ...position };
      if (position.id) {
        const index = findIndexById(position.id);

        _positions[index] = _position;
        await positionApi.update(_position).then((res) => {
          setPositions(res);
        });
        setFetchApi(!fetchApi);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Position Updated",
          life: 3000,
        });
      } else {
        _position.id = createId();
        _positions.push(_position);
        await positionApi.create(_position).then((res) => setPositions(res));
        setFetchApi(!fetchApi);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Position Created",
          life: 3000,
        });
      }

      setPositions(_positions);
      setPosition(emptyPosition);
      setPositionDialog(false);
    }
  };

  const editPosition = (position) => {
    setPosition({ ...position });
    setPositionDialog(true);
  };
  const confirmDeletePosition = (position) => {
    setPosition(position);
    setDeletePositionDialog(true);
  };

  const deletePosition = async () => {
    let _positions = positions.filter((val) => val.id !== position.id);
    await positionApi.deleteOne(position.id).then((res) => res);
    setFetchApi(!fetchApi);
    setPositions(_positions);
    setDeletePositionDialog(false);
    setPosition(emptyPosition);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Position Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < positions.length; i++) {
      if (positions[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const createId = () => {
    const index = positions[positions.length - 1].id + 1;
    return index;
  };

  const confirmDeleteSelected = () => {
    setDeletePositionsDialog(true);
  };

  const deleteSelectedPositions = async () => {
    let ids = [];
    selectedPositions.forEach((item) => ids.push(item.id));
    let _positions = positions.filter((val) => {
      return !selectedPositions.includes(val);
    });
    setPositions(_positions);
    await positionApi.deleteMany(ids).then((res) => res);
    setFetchApi(!fetchApi);
    setDeletePositionsDialog(false);
    setSelectedPositions(null);

    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Positions Deleted",
      life: 3000,
    });
  };

  const onChangeInput = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _position = { ...position };
    _position[`${name}`] = val;
    setPosition(_position);
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
            disabled={!selectedPositions || !selectedPositions.length}
          />
        </div>
      </React.Fragment>
    );
  };

  const hidePositionDialog = () => {
    setSubmitted(false);
    setPositionDialog(false);
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Positions</h5>
    </div>
  );

  const positionDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" text onClick={savePosition} />
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
            editPosition(rowData);
          }}
        />
        <Button
          icon="pi pi-trash"
          severity="warning"
          rounded
          className="mr-2"
          onClick={() => confirmDeletePosition(rowData)}
        />
      </>
    );
  };

  const deletePositionDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeletePositionDialog}
      />
      <Button label="Yes" icon="pi pi-check" text onClick={deletePosition} />
    </>
  );

  const deletePositionsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeletePositionsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        text
        onClick={deleteSelectedPositions}
      />
    </>
  );

  const idBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Id</span>
        <span>{rowData.id}</span>
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

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" start={leftToolbarTemplate}></Toolbar>

          <DataTable
            value={positions}
            selection={selectedPositions}
            onSelectionChange={(e) => setSelectedPositions(e.value)}
            dataKey="id"
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25]}
            filters={filters}
            showGridlines
            className="datatable-responsive"
            emptyMessage="No position found."
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
              body={idBodyTemplate}
              headerStyle={{ minWidth: "4rem" }}
            ></Column>
            <Column
              field="name"
              header="Name"
              filter
              body={nameBodyTemplate}
              headerStyle={{ minWidth: "8rem" }}
            ></Column>
            <Column
              header="Action"
              body={actionBodyTemplate}
              headerStyle={{ minWidth: "10rem" }}
            ></Column>
          </DataTable>

          <Dialog
            visible={positionDialog}
            style={{ width: "400px" }}
            header="Position"
            modal
            className="p-fluid"
            footer={positionDialogFooter}
            onHide={hidePositionDialog}
          >
            <div className="field">
              <label htmlFor="name1">Name</label>
              <InputText
                id="name1"
                value={position.name}
                onChange={(e) => onChangeInput(e, "name")}
                required
                className={classNames({
                  "p-invalid": submitted && !position.name,
                })}
              />
            </div>
          </Dialog>

          <Dialog
            visible={deletePositionDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deletePositionDialogFooter}
            onHide={hideDeletePositionDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {position && (
                <span>
                  Are you sure you want to delete <b>{position.name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deletePositionsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deletePositionsDialogFooter}
            onHide={hideDeletePositionsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {position && (
                <span>
                  Are you sure you want to delete the selected positions?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default PositionDashBoard;
