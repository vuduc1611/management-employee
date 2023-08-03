import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Menu } from "primereact/menu";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ProductService } from "../demo/service/ProductService";
import { LayoutContext } from "../layout/context/layoutcontext";
import { TimerDate } from "./TimerDate";

const Dashboard = () => {
  const [products, setProducts] = useState(null);
  const menu1 = useRef(null);
  const menu2 = useRef(null);
  const { layoutConfig } = useContext(LayoutContext);

  useEffect(() => {
    ProductService.getProductsSmall().then((data) => setProducts(data));
  }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <div className="grid">
      <div className="col-12 xl:col-8">
        <div className="card">
          <h5>Notifications</h5>
          <DataTable value={products} rows={7} paginator>
            <Column
              header="Date"
              body={(data) => (
                <img
                  className="shadow-2"
                  src={`/demo/images/product/${data.image}`}
                  alt={data.image}
                  width="50"
                />
              )}
            />
            <Column
              field="name"
              header="Description"
              sortable
              style={{ width: "60%" }}
            />
            <Column
              header="View"
              style={{ width: "15%" }}
              body={() => (
                <>
                  <Button icon="pi pi-search" type="button" text />
                </>
              )}
            />
          </DataTable>
        </div>
      </div>
      {/* abc */}
      <div className="col-12 xl:col-4">
        <div className="card">
          <h5>
            <TimerDate />
          </h5>
          <div></div>
          {/* <Chart type="line" data={lineData} options={lineOptions} /> */}
        </div>

        <div className="card">
          <div className="flex align-items-center justify-content-between mb-1">
            <h5>Your Memo</h5>
            <div>
              <Button
                type="button"
                icon="pi pi-ellipsis-v"
                className="p-button-rounded p-button-text p-button-plain"
                onClick={(event) => menu2.current.toggle(event)}
              />
              <Menu
                ref={menu2}
                popup
                model={[
                  { label: "Add New", icon: "pi pi-fw pi-plus" },
                  { label: "Remove", icon: "pi pi-fw pi-minus" },
                ]}
              />
            </div>
          </div>

          {/* <span className="block text-600 font-medium mb-3">TODAY</span>
          <ul className="p-0 mx-0 mt-0 mb-4 list-none">
            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
              <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                <i className="pi pi-dollar text-xl text-blue-500" />
              </div>
              <span className="text-900 line-height-3">
                Richard Jones
                <span className="text-700">
                  {" "}
                  has purchased a blue t-shirt for{" "}
                  <span className="text-blue-500">79$</span>
                </span>
              </span>
            </li>
            <li className="flex align-items-center py-2">
              <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                <i className="pi pi-download text-xl text-orange-500" />
              </div>
              <span className="text-700 line-height-3">
                Your request for withdrawal of{" "}
                <span className="text-blue-500 font-medium">2500$</span> has
                been initiated.
              </span>
            </li>
          </ul>

          <span className="block text-600 font-medium mb-3">YESTERDAY</span>
          <ul className="p-0 m-0 list-none">
            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
              <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                <i className="pi pi-dollar text-xl text-blue-500" />
              </div>
              <span className="text-900 line-height-3">
                Keyser Wick
                <span className="text-700">
                  {" "}
                  has purchased a black jacket for{" "}
                  <span className="text-blue-500">59$</span>
                </span>
              </span>
            </li>
            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
              <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0">
                <i className="pi pi-question text-xl text-pink-500" />
              </div>
              <span className="text-900 line-height-3">
                Jane Davis
                <span className="text-700">
                  {" "}
                  has posted a new questions about your product.
                </span>
              </span>
            </li>
          </ul> */}

          {/* start */}
          <span className="block text-600 font-medium mb-3">TODAY</span>
          <ul className="p-0 mx-0 mt-0 mb-4 list-none">
            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
              <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                <i className="pi pi-dollar text-xl text-blue-500" />
              </div>
              <span className="text-900 line-height-3">
                Richard Jones
                <span className="text-700">
                  {" "}
                  has purchased a blue t-shirt for{" "}
                  <span className="text-blue-500">79$</span>
                </span>
              </span>
            </li>
            <li className="flex align-items-center py-2">
              <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                <i className="pi pi-download text-xl text-orange-500" />
              </div>
              <span className="text-700 line-height-3">
                Your request for withdrawal of{" "}
                <span className="text-blue-500 font-medium">2500$</span> has
                been initiated.
              </span>
            </li>
          </ul>
          {/* End */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
