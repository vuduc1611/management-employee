import React, { useState, useEffect } from "react";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import employeeApi from "../../api/employeeApi";
import departmentApi from "../../api/departmentApi";
import positionApi from "../../api/positionApi";

const DepartmentTree = () => {
  const [departments, setDepartments] = useState([]);
  const [selectId, setSelectedId] = useState(null);
  const [empFromDept, setEmpFromDept] = useState([]);
  const [customValue, setCustomValue] = useState({});
  const [expandedKeys, setExpandedKeys] = useState(null);
  const fetchData = async () => {
    await departmentApi.getAll().then((data) => {
      setDepartments(
        data.map((d, index) => ({
          key: index,
          departmentId: d.departmentId,
          name: d.name,
          description: d.description,
          children: [
            {
              id: 0,
              name: "ABC",
              description: "ABCBCBCB",
            },
            {
              id: 0,
              name: "A",
              description: "ABCBCBCB",
            },
          ],
        }))
      );
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const nameBodyTemplate = (rowData) => {
    return <span className="p-column-title">{rowData.name}</span>;
  };

  const descriptionBodyTemplate = (rowData) => {
    return <span className="p-column-title">{rowData.description}</span>;
  };
  // const customData = (id, raws) => {
  //   // await employeeApi.findByDept(selectId).then((data) => setEmpFromDept(data));
  //   const custom = [];
  //   const customChild = [];
  //   custom.push({
  //     key: id,
  //     data: {
  //       name: departments.find((dept) => dept.departmentId === id).name,
  //       description: departments.find((dept) => dept.departmentId === id)
  //         .description,
  //     },
  //     children: raws.forEach((value, index) => {
  //       customChild.push({
  //         key: id + "-" + index,
  //         data: {
  //           id: value.id,
  //           firstname: value.fname,
  //           lastname: value.lname,
  //           gender: value.gender,
  //           position: positionApi.find((p) => (p = value.positionId)).name,
  //         },
  //       });
  //     }),
  //   });

  //   setCustomValue(custom);

  //   console.log("check custom: ", custom);
  // };

  const handleExpand = (e) => {
    return <span>{`aaaaaaaaaa + ${e.id}`}</span>;
  };

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>OrtChart</h5>
          <TreeTable
            value={departments}
            expandedKeys={expandedKeys}
            onExpand={(e) => handleExpand(e.node.children)}
          >
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
