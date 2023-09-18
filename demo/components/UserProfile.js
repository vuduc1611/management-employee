import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
// import { Image } from "primereact/image";
const UserProfile = (props) => {
  const { visible, setVisible, curInfo } = props;
  return (
    <>
      <Dialog
        header="Profile"
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
      {/* <Dialog
        // header="Profile"
        visible={visible}
        className="p-fluid"
        style={{ width: "40vw" }}
        onHide={() => setVisible(false)}
      >
        <div className="inline-block w-full">
          <div className="flex flex-column profile-name-position">
            <span className="text-3xl font-bold mb-2">
              {curInfo.fname} {curInfo.lname}
            </span>
            <span className="text-xl">ID: {curInfo.id}</span>
          </div>

          <Image
            className="img-profile"
            src="/demo/images/profile/anh1.png"
            alt="Image"
            width="100"
          />
        </div>
        <div className="form">
          <div className="flex  h-3rem align-items-center justify-content-left border-bottom">
            <span className="w-2 text-orange-500">Email:</span>
            <div>{curInfo.email}</div>
          </div>
          <div className="flex  h-3rem align-items-center justify-content-left border-bottom">
            <span className="w-2 text-orange-500">Phone:</span>
            <div>{curInfo.phone}</div>
          </div>
          <div className="flex  h-3rem align-items-center justify-content-left border-bottom">
            <span className="w-2 text-orange-500">Address:</span>
            <div>{curInfo.address}</div>
          </div>

          <div className="flex  h-3rem align-items-center justify-content-left border-bottom">
            <span className="w-2 text-orange-500">Day of Birth:</span>
            <div>{curInfo.dob}</div>
          </div>

          <div className="flex  h-3rem align-items-center justify-content-left border-bottom">
            <span className="w-2 text-orange-500">Gender:</span>
            <div>{curInfo.gender}</div>
          </div>

          <div className="flex  h-3rem align-items-center justify-content-left border-bottom">
            <span className="w-2 text-orange-500">Position:</span>
            <div>{curInfo.positionId}</div>
          </div>

          <div className="flex  h-3rem align-items-center justify-content-left border-bottom">
            <span className="w-2 text-orange-500">Department:</span>
            <div>{curInfo.departmentId}</div>
          </div>
        </div>
      </Dialog> */}
    </>
  );
};

export default UserProfile;
