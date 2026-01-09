import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function HomeLayout() {
    return (
        <div className="entityDashboardBody">
            <Sidebar />
            <div className='entity_mainSection'>
                <Header />
                <div style={{ padding: "10px" }} >
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default HomeLayout
