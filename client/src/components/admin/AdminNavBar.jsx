import React from 'react'
import { UserButton } from '@clerk/clerk-react'

const AdminNavBar = () => {
    return (
        <div className='h-16 bg-[#1A1A1D] border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-40 ml-64'>
            <h1 className='text-xl font-semibold text-white'>Admin Panel</h1>
            <div className='flex items-center gap-4'>
                <div className='text-right hidden sm:block'>
                    <p className='text-sm text-white font-medium'>Administrator</p>
                    <p className='text-xs text-gray-500'>admin@cinefy.com</p>
                </div>
                <UserButton />
            </div>
        </div>
    )
}

export default AdminNavBar
