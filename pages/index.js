import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect, useRef, useState } from "react";
import { LayoutContext } from "../layout/context/layoutcontext";
import departmentApi from "./api/departmentApi";
import employeeApi from "./api/employeeApi";
import projectApi from "./api/projectApi";

const Dashboard = () => {
  const [data, setData] = useState({});
  const [options, setOptions] = useState({});
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [avgValue, setAvgValue] = useState(0);
  const { layoutConfig } = useContext(LayoutContext);
  const [percentIncrement, setPercentIncrement] = useState(0);

  const color = [
    "blue",
    "bluegray",
    "red",
    "yellow",
    "green",
    "orange",
    "cyan",
  ];

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const departmentsList = await departmentApi.getAll().then((res) => res);
      const employeesList = await employeeApi.getAllData().then((res) => res);
      setEmployees(employeesList);
      const projectList = await projectApi.getAll().then((res) => res);
      setProjects(projectList);

      const response = await departmentsList.map((department) => ({
        name: department.name,
        count: employeesList.filter(
          (e) => e.departmentId === department.departmentId
        ).length,
      }));

      const totalValue = projectList.reduce((acc, cur) => {
        return acc + cur.value;
      }, 0);
      setAvgValue(totalValue / projectList.length);

      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color");
      const textColorSecondary = documentStyle.getPropertyValue(
        "--text-color-secondary"
      );
      const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
      const dataPie = await {
        labels: response.map((d) => d.name),
        datasets: [
          {
            data: response.map((d) => d.count),
            backgroundColor: response.map((d, index) =>
              documentStyle.getPropertyValue(`--${color[index]}-500`)
            ),
            hoverBackgroundColor: response.map((d, index) =>
              documentStyle.getPropertyValue(`--${color[index]}-400`)
            ),
          },
        ],
      };
      const optionsPie = await {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
            },
          },
        },
      };

      const newList = {};
      await projectList.forEach((item) => {
        const { completedAt, value } = item;
        const yearRaw = completedAt.split("-")[0];
        if (newList[yearRaw]) {
          newList[yearRaw] += value;
        } else {
          newList[yearRaw] = value;
        }
      });

      const result = await Object.keys(newList)
        .map((year) => ({
          year: parseInt(year),
          value: newList[year],
        }))
        .sort((a, b) => a.year - b.year);

      console.log("check result", result);

      let increment =
        result[result.length - 1].value / result[result.length - 2].value - 1;
      increment = increment.toFixed(4) * 100;
      setPercentIncrement(increment);
      const barData = await {
        labels: result.map((item) => item.year),
        datasets: [
          {
            label: "Value",
            backgroundColor: documentStyle.getPropertyValue("--primary-500"),
            borderColor: documentStyle.getPropertyValue("--primary-500"),
            data: result.map((item) => item.value),
          },
        ],
      };

      const barOptions = await {
        plugins: {
          legend: {
            labels: {
              fontColor: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500,
              },
            },
            grid: {
              display: false,
              drawBorder: false,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false,
            },
          },
        },
      };

      await setData({ dataPie, barData });
      await setOptions({ optionsPie, barOptions });
    };
    fetchData();
  }, [layoutConfig]);

  return (
    <>
      <div className="grid p-fluid">
        <div className="col-6 xl:col-3 h-12rem ">
          <div className="card card-container h-10rem ">
            <span className="block text-2xl mb-4 font-normal">
              Total Employees{" "}
            </span>
            <span className="block text-center text-2xl font-bold">
              {employees.length}
            </span>
          </div>
        </div>
        <div className="col-6 xl:col-3 h-12rem ">
          <div className="card card-container h-10rem ">
            <span className="block text-2xl mb-4 font-normal">
              Total Project{" "}
            </span>
            <span className="block text-center text-2xl font-bold">
              {projects.length}
            </span>
          </div>
        </div>
        <div className="col-6 xl:col-3 h-12rem ">
          <div className="card card-container h-10rem ">
            <span className="block text-2xl mb-4 font-normal">
              Average Value{" "}
            </span>
            <span className="block text-center text-2xl font-bold">
              {formatCurrency(avgValue)}
            </span>
          </div>
        </div>
        <div className="col-6 xl:col-3 h-12rem ">
          <div className="card card-container h-10rem ">
            <span className="block text-2xl font-normal">
              Rate Increment{" "}
              <span className="block text-base font-light">from last year</span>
            </span>

            <span className="block text-center text-2xl font-bold">
              {`${percentIncrement}%`}
            </span>
          </div>
        </div>
      </div>
      <div className="grid p-fluid">
        <div className="col-12 xl:col-6">
          <div className="card">
            <h5 className="text-left w-full">Project Value</h5>
            <Chart
              type="bar"
              data={data.barData}
              options={options.barOptions}
              className=" h-22rem"
            ></Chart>
          </div>
        </div>

        <div className="col-12 xl:col-6">
          <div className="card flex flex-column align-items-center">
            <h5 className="text-left w-full">Chart Department</h5>
            <Chart
              type="pie"
              data={data.dataPie}
              options={options.optionsPie}
              className=" h-22rem"
            ></Chart>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
