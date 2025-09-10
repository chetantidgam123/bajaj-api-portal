import Header from './Header'
import Footer from './Footer'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useEffect, useState } from 'react';
import Sidebard from './Sidebard';

function HomeLayout() {
    const [pageData, setPageData] = useState('');
    const [showsidebar, setShowsidebar] = useState(true)
    const path = useLocation()

    useEffect(() => {
        if (path.pathname == '/user/profile') {
            setShowsidebar(false)
        }
        else {
            setShowsidebar(true)
        }
    }, [path.pathname])

    return (
        <div className="home-layout pt-2">
            <Header />
            <div className="container-fluid col-12 mt-2">
                {showsidebar && <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 col-xs-12">
                        {/* <Sidebar setPageData={setPageData} /> */}
                        <Sidebard />
                    </div>
                    <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12 col-xs-12">
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
