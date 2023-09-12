import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";

const UserProfile = (props) => {
  const { visible, setVisible, curInfo } = props;
  return (
    <Dialog
      header="Header"
      visible={visible}
      className="p-fluid"
      style={{ width: "50vw" }}
      onHide={() => setVisible(false)}
    >
      <div className="formgrid grid">
        <div className="field col">
          <label htmlFor="fname">First Name</label>
          <InputText id="fname" value={curInfo.fname} />
        </div>
        <div className="field col">
          <label htmlFor="lname">Last Name</label>
          <InputText id="lname" value={curInfo.lname} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <InputText id="email" value={curInfo.email} />
      </div>
      <div className="field">
        <label htmlFor="phone">Phone</label>
        <InputText id="phone" value={curInfo.phone} />
      </div>
      <div className="field">
        <label htmlFor="address">Address</label>
        <InputText id="address" value={curInfo.address} />
      </div>

      <div className="formgrid grid">
        <div className="field col">
          <label htmlFor="dob">Day of Birth</label>
          <InputText id="dob" value={curInfo.dob} />
        </div>

        <div className="field col">
          <label htmlFor="gender">Gender</label>
          <InputText id="gender" value={curInfo.gender} />
        </div>
      </div>

      <div className="formgrid grid">
        <div className="field col">
          <label htmlFor="position">Position</label>
          <InputText id="position" value={curInfo.positionId} />
        </div>

        <div className="field col">
          <label htmlFor="department">Department</label>
          <InputText id="department" value={curInfo.departmentId} />
        </div>
      </div>
    </Dialog>
  );
};

export default UserProfile;
