import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function HomeLayout() {
    return (
        <div>
            <div className="entityDashboardBody">
                <Sidebar />
                <div className='entity_mainSection'>
                    <Header />
                    <div style={{ padding: "10px" }}>
                        <Outlet />
                    </div>
                    {/* <Footer /> */}
                </div>
            </div>
        </div>
    )
}

export default HomeLayout
