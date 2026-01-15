import React, { useEffect, useState } from 'react'
import { MoreVertical, Search, Filter, Download } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'
import { toast } from 'react-hot-toast'

const ListBookings = () => {
    const { axios, getToken } = useAppContext()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchBookings = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/all-bookings', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setBookings(data.bookings)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to fetch bookings")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBookings()
    }, [])

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Recent Bookings</h2>
                    <p className="text-gray-400">Track ticket reservations</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium">
                    <Download size={16} />
                    Export CSV
                </button>
            </div>

            { }
            <div className="flex items-center gap-4 bg-[#1A1A1D] p-4 rounded-xl border border-white/5">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search bookings by ID..."
                        className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
                    />
                </div>
                <button className="p-2.5 bg-black/50 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-all">
                    <Filter size={20} />
                </button>
            </div>

            <div className="bg-[#1A1A1D] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">No bookings found.</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-[#27272A] text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Booking ID</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Movie</th>
                                <th className="px-6 py-4 font-semibold">Seats</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {bookings.map((booking, index) => (
                                <tr key={booking._id || index} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-primary truncate max-w-[100px]" title={booking._id}>
                                        {booking._id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white">
                                        <div className="flex flex-col">
                                            <span>
                                                {booking.user?.name?.replace('+ last_name', '').trim() || 'Unknown User'}
                                            </span>
                                            <span className="text-xs text-gray-500">{booking.user?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">
                                        {booking.show?.movie?.title || 'Unknown Movie'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 font-mono text-xs">
                                        {booking.bookedSeats?.join(', ') || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {formatDate(booking.show?.showDateTime)}
                                    </td>
                                    <td className="px-6 py-4 font-medium">₹{booking.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500">
                                            Confirmed
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default ListBookings
