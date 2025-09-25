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
      <div className="card-body card-bg p-4">
            <h5 className="color-blue font-size-24">
              <img alt='Na' style={{width : '50px',height : '50px'}} src="/assets/img/hello.png" />
                  Greetings, {fullName.split(" ")[0]}!
              </h5>
         
        <p>Welcome to the Admin Dashboard. Here you can Manage APIs & Users, View Reports, and Configure Settings.
          <br></br>
          Innovation thrives where APIs open doors to new possibilities.
        </p>
       
      </div>
       {/* Total APIs, Total Users, and other statistics can be displayed here in the future. */}
        <div className="row hovEffect mt-5">
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
            <div className="card-dash">
              <div className="row">
                <div className="col-2">
                  <div className="box-inner">
                    <img src="/assets/img/Profile.png" className="w-100" alt="" />
                  </div>
                </div>
                <div className="col-10">
                 <h3>20</h3>
                 <h6>Total Users</h6>
                </div>
              </div>
              <p className="card-text mt-3 font-18">Manage and view all users.</p>
            </div>
          </div>
            <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
            <div className="card-dash">
              <div className="row">
                <div className="col-2">
                  <div className="box-inner">
                    <img src="/assets/img/api 1.png" className="w-100" alt="" />
                  </div>
                </div>
                <div className="col-10">
                 <h3>103</h3>
                 <h6>Total APIs</h6>
                </div>
              </div>
              <p className="card-text mt-3 font-18">Create, update, and delete APIs.</p>
            </div>
          </div>
           <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
         <div className="card-dash">
              <div className="row">
                <div className="col-2">
                  <div className="box-inner">
                    <img src="/assets/img/api 2.png" className="w-100" alt="" />
                  </div>
                </div>
                <div className="col-10">
                 <h3>17</h3>
                 <h6>Total Reports</h6>
                </div>
              </div>
              <p className="card-text mt-3 font-18">View usage statistics and reports.</p>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Dashboard;
