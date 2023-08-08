import React, { useState, useEffect } from "react";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import employeeApi from "../../api/employeeApi";
import departmentApi from "../../api/departmentApi";
import positionApi from "../../api/positionApi";

const DepartmentTree = () => {
  const [treeNodes, setTreeNodes] = useState([]);
  const [selectedTreeNodeKeys, setSelectedTreeNodeKeys] = useState(null);
  const [treeTableNodes, setTreeTableNodes] = useState([]);
  const [selectedTreeTableNodeKeys, setSelectedTreeTableNodeKeys] = useState(
    []
  );
  const [nodeDept, setNodeDept] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectId, setSelectedId] = useState(null);

  //   const fetchData = async () => {
  //     await employeeApi.getAll(lazyParams).then((data) => {
  //       setEmployees(data);
  //     });
  //     await positionApi.getAll().then((data) => setPositions(data));
  //   };
  const fetchData = async () => {
    await departmentApi.getAll().then((data) => {
      setDepartments(data);
    });
    // await departmentApi.findByDept(selectId).then((data) => setNodeDept(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  //   const idBodyTemplate = (rowData) => {
  //     return <span>{rowData.departmentId}</span>;
  //   };

  const nameBodyTemplate = (rowData) => {
    return <span className="p-column-title">{rowData.name}</span>;
  };

  const descriptionBodyTemplate = (rowData) => {
    return <span className="p-column-title">{rowData.description}</span>;
  };
  const customData = (selectId) => {};

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>TreeTable</h5>
          <TreeTable
            value={departments}
            header="OrtChart"
            // selectionMode="checkbox"
            selectionKeys={selectedTreeTableNodeKeys}
            expandedKeys={expandedKeys}
            onSelectionChange={(e) => setSelectedTreeTableNodeKeys(e.value)}
          >
            {/* <Column
              field="departmentId"
              header="Id"
              body={idBodyTemplate}
              expander
            /> */}
            <Column
              field="name"
              header="Name"
              body={nameBodyTemplate}
              expander
            />
            <Column
              field="description"
              header="Description"
              body={descriptionBodyTemplate}
            />
          </TreeTable>
        </div>
      </div>
    </div>
  );
};

export default DepartmentTree;
