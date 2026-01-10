import React from 'react'

const BlurCircle = ({ size = 'w-96 h-96', color = 'bg-primary', opacity = 'opacity-20', blur = 'blur-[120px]', className = '' }) => {
    return (
        <div
            className={`absolute rounded-full pointer-events-none -z-10 ${size} ${color} ${opacity} ${blur} ${className}`}
        ></div>
    )
}

export default BlurCircle
