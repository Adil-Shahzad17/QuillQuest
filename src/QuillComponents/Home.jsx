import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowBigDownDash } from "lucide-react"
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

const Home = () => {

    const auth = useSelector((state) => state.quillquest.status)

    return (
        <div className='pt-[110px] mx-auto md:pt-[130px] flex flex-col pb-5 lg:pb-10'>
            <div className='h-1/2 gap-4 flex justify-center items-center flex-col text-center px-5'>
                <h1 className=' text-2xl capitalize font-heading font-bold tracking-wider sm:text-4xl lg:text-5x 
                    sm:px-6 md:px-10 lg:w-[1000px] lg:px-0 '>
                    Welcome to the arena of heavyweight content.
                </h1>

                <h2 className='max-w-[700px] text-base capitalize font-body font-normal sm:text-lg'>
                    where words hit hard and content never taps out <span className='text-lightColor'>|</span> Get the hottest takes, deep dives, and undisputed blogs <span className='text-lightColor'>|</span> all in one place.
                </h2>

                {
                    !auth && <Link to="/signupPage">
                        <Button className='w-[120px] bg-lightColor border-0 md:w-[150px]' variant='outline'>
                            Get Started
                        </Button>
                    </Link>
                }
                <ArrowBigDownDash size={46} />

            </div>

        </div>
    )
}

export default Home