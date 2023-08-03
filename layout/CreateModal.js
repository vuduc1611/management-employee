import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

export const CreateModal = () => {
  return (
    <>
      <div className="card">
        <Dialog
          header="Dialog"
          //   visible={displayBasic}
          style={{ width: "30vw" }}
          modal
          //   footer={basicDialogFooter}
          onHide={true}
        >
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </Dialog>
        <div className="grid">
          <div className="col-12">
            <Button
              type="button"
              label="Show"
              icon="pi pi-external-link"
              //   onClick={() => setDisplayBasic(true)}
            />
          </div>
        </div>
      </div>
    </>
  );
};
