import Header from './Header'
import Footer from './Footer'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react';
import Sidebard from './Sidebard';

function HomeLayout() {
  const [pageData, setPageData] = useState("");
  const [showsidebar, setShowsidebar] = useState(true);
  const path = useLocation();

  useEffect(() => {
    if (path.pathname === "/user/profile" || path.pathname === '/get-started') {
      setShowsidebar(false);
    } else {
      setShowsidebar(true);
    }
  }, [path.pathname]);



  return (
    <div className="home-layout">
      <Header />
      <div className="container-fluid col-12  py-3">
        {showsidebar && <div className="DashboardLayout">
          <Sidebard />
          <div className="entity_mainSection_user ">
            <Outlet context={{ pageData }} />
          </div>
        </div>}
        {!showsidebar &&
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <Outlet />
          </div>}
      </div>
      <Footer />
    </div>
  )
}

export default HomeLayout
