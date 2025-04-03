import React from 'react'

const Error404 = () => {
    return (
        <div className='w-full h-screen bg-black'>

            <div className='w-full h-full flex justify-center items-center gap-3'>
                <h1 className='text-white font-bold font-heading text-2xl'>404</h1>

                <div className='border-l border-l-[#7e7e7e] p-4'>

                    <p className='text-lg font-body'>Oops, page not found</p>
                </div>

            </div>
        </div >
    )
}

export default Error404