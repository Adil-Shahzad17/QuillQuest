import React, { forwardRef, useId } from 'react'

function Input({ label, type, classname = "", ...props }, ref) {

    const id = useId()

    return (
        <div className={`text-[#6b705c] flex flex-col`}>
            {label && <label
                className='inline-block mb-2 text-white font-heading font-medium text-xl'
                htmlFor={id}>
                {label}
            </label>
            }
            <input
                type={type}
                className={`px-3 py-2 rounded-lg text-black font-body outline-none focus:bg-gray-50 duration-200 border 
                     w-full ${classname}`}
                ref={ref}
                {...props}
                id={id}
            />

        </div>
    )
}

export default forwardRef(Input)