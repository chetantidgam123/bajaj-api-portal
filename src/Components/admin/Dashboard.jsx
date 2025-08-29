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
    <div className="card gifDivAdmi">
      <div className="card-body p-0">
        <div className="row g-0">
          <div className="col-12 px-3 py-2 px-4 d-flex">
            <img className="profileImage m-2" alt='Na' src={userProfile || "/assets/img/userdummy.png"} />
            <div className="d-flex flex-column justify-content-center ms-3">
              <h5 className="profileHeaders font-size-24 text-white">
                Greetings, {fullName.split(" ")[0]}!
              </h5>
              <span className="">
                Welcome to the Admin Dashboard. Here you can Manage APIs & Users,
                View Reports, and Configure Settings.
              </span>
              <div className="newsline-container">
                <p className="newsline-text">Innovation thrives where APIs open doors to new possibilities.</p>
              </div>
            </div>
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
