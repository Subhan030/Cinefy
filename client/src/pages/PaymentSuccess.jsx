import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams()
    const sessionId = searchParams.get('session_id')
    const navigate = useNavigate()
    const { axios, getToken } = useAppContext()
    const [status, setStatus] = useState('processing') 

    useEffect(() => {
        const verify = async () => {
            if (!sessionId) {
                setStatus('failed')
                return
            }
            try {
                const token = await getToken()
                const { data } = await axios.post('/api/booking/verify-payment',
                    { sessionId },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                if (data.success) {
                    setStatus('success')
                    toast.success('Payment verified! Booking confirmed.')
                    setTimeout(() => navigate('/my-bookings'), 3000)
                } else {
                    setStatus('failed')
                    toast.error(data.message || 'Payment verification failed')
                }
            } catch (error) {
                console.error(error)
                setStatus('failed')
                toast.error('Error verifying payment')
            }
        }
        verify()
    }, [sessionId, axios, getToken, navigate])

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
            <div className="max-w-md w-full bg-[#1A1A1D] border border-white/10 rounded-2xl p-8 text-center">
                {status === 'processing' && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                        <h2 className="text-xl font-bold">Verifying Payment...</h2>
                        <p className="text-gray-400">Please do not close this window.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4 animate-scale-in">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                            <Check size={32} strokeWidth={3} />
                        </div>
                        <h2 className="text-xl font-bold">Booking Confirmed!</h2>
                        <p className="text-gray-400">Your tickets have been sent to your account.</p>
                        <button
                            onClick={() => navigate('/my-bookings')}
                            className="mt-4 px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            View Bookings
                        </button>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="flex flex-col items-center gap-4 animate-scale-in">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                            <X size={32} strokeWidth={3} />
                        </div>
                        <h2 className="text-xl font-bold">Payment Failed</h2>
                        <p className="text-gray-400">We couldn't verify your payment. Please contact support if you were charged.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-4 px-6 py-2 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors"
                        >
                            Go Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PaymentSuccess
