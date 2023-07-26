import React from 'react'

interface BackdropProps {
    handleClick: () => void,
}

export const Backdrop = (props: BackdropProps) => {
    return (
        <div 
            className="absolute z-[10] top-0 w-[100%] h-[100%]" 
            onClick={() => props.handleClick()}
        />
    )
}
