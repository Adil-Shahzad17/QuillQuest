import React from 'react'
import { TailSpin } from 'react-loading-icons'

const FirstPage = () => {



    return (
        <div className='h-screen flex flex-col justify-center items-center gap-10'>

            <TailSpin height="150px" width="150px" />

            <p className='text-white font-logoFont font-bold tracking-[1px] text-2xl md:text-3xl'>
                Quill Quest
            </p>

        </div>
    )
}

export default FirstPage