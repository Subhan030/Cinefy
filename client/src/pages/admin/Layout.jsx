import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSideBar from '../../components/admin/AdminSideBar'
import AdminNavBar from '../../components/admin/AdminNavBar'
import { useAppContext } from '../../context/AppContext'
import Loading from '../../components/Loading'

const Layout = () => {

    const { isAdmin, fetchIsAdmin } = useAppContext()

    useEffect(() => {
        fetchIsAdmin()
    }, [])

    return isAdmin ? (
        <div className='min-h-screen bg-black transition-colors duration-300'>
            <AdminSideBar />
            <AdminNavBar />
            <div className='ml-64 p-8 min-h-[calc(100vh-64px)]'>
                <Outlet />
            </div>
        </div>
    ) : <Loading />
}

export default Layout