import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSideBar from '../../components/admin/AdminSideBar'
import AdminNavBar from '../../components/admin/AdminNavBar'

const Layout = () => {
    return (
        <div className='min-h-screen bg-black transition-colors duration-300'>
            <AdminSideBar />
            <AdminNavBar />
            <div className='ml-64 p-8 min-h-[calc(100vh-64px)]'>
                <Outlet />
            </div>
        </div>
    )
}

export default Layout