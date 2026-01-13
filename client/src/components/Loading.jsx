import React from 'react'
import { Loader2 } from 'lucide-react'

const Loading = () => {
    return (
        <div className="flex-1 flex justify-center items-center min-h-screen bg-black">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
    )
}

export default Loading
