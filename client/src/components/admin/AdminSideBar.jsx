import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { LayoutDashboard, Film, Calendar, ClipboardList, PlusCircle } from 'lucide-react'

const AdminSideBar = () => {
    const location = useLocation()
    const isActive = (path) => location.pathname === path

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Movies', path: '/admin/list-movies', icon: Film },
        { name: 'Add Show', path: '/admin/add-show', icon: PlusCircle },
        { name: 'Shows', path: '/admin/list-shows', icon: Calendar },
        { name: 'Bookings', path: '/admin/list-bookings', icon: ClipboardList },
    ]

    return (
        <div className='w-64 h-screen bg-[#1A1A1D] border-r border-white/10 flex flex-col fixed left-0 top-0 z-50'>
            <div className='p-6 flex justify-center border-b border-white/10'>
                <img src={assets.logo} alt="Cinefy Logo" className='w-32 h-auto' />
            </div>
            <nav className='flex-1 py-6 space-y-2 px-4'>
                {menuItems.map((item) => {
                    const active = isActive(item.path)
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 group ${active
                                ? 'bg-primary text-white'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                            <span className='font-medium'>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
            <div className='p-4 border-t border-white/10 text-center text-xs text-gray-500'>
                &copy; 2025 Cinefy Admin
            </div>
        </div>
    )
}

export default AdminSideBar
