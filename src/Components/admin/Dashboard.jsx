import { useEffect } from "react";
import { getTokenData } from "../../Utils";
import { useState } from "react";

function Dashboard() {
  const [fullName, setFullName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [userProfile, setUserImage] = useState("");

  useEffect(() => {
    let token = getTokenData();
    setFullName(token?.fullname || "");
    setEmailId(token?.emailid || "");
    setUserImage(token?.userImage || "");
  }, []);

  return (
    <div className="center-content">
      <div className="card-body card-bg">
        <div className="row g-0 align-items-center">
            <div className="col-1">
                 <img alt='Na'className="w-50" src="/assets/img/hello.png" /> 
          </div>
          <div className="col-11">
            <h5 className="profileHeaders font-size-24">
                  Greetings, {fullName.split(" ")[0]}!
              </h5>
          </div>
        </div>
        <div className="justify-content-center d-flex flex-column align-items-center">
          <hr style={{ width: "90%", alignItems: "center" }} />
        </div>
        {/* Total APIs, Total Users, and other statistics can be displayed here in the future. */}
        <div className="card-4 px-3 pb-3 hovEffect">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Users - 20</h5>
              <p className="card-text">Manage and view all users.</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total APIs - 103</h5>
              <p className="card-text">Create, update, and delete APIs.</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Reports - 17</h5>
              <p className="card-text">
                View usage statistics and reports.
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Settings</h5>
              <p className="card-text">Configure application settings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
