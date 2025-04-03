import React, { useState } from 'react'
import Q_Logo from "../Assets/Images/Q_Logo.png"
import { Menu, ArrowLeftFromLine, House, CircleUserRound, BadgePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router'

const Header = () => {

    const [nav, setNav] = useState(true)
    const auth = useSelector((state) => state.quillquest.status)
    const userProfile = useSelector((state) => state.user.userData)

    return (
        <nav className='bg-black w-full max-w-[1500px] h-[70px] mx-auto fixed flex justify-between items-center z-50 px-2 border-b border-b-white/10'>
            <Link to="/" className="h-full w-auto flex items-center gap-2 hover:cursor-pointer lg:justify-center lg:pl-0">
                <img src={Q_Logo} alt="Raptor" className='w-[40px] h-auto sm:w-[45px] md:w-[50px] lg:w-[52px]' />
                <p className='text-white font-logoFont font-bold tracking-[1px] text-2xl md:text-3xl'>
                    Quill Quest
                </p>
            </Link>

            <ul className='gap-5 hidden md:flex flex-row items-center justify-center h-full pr-4 text-black'>

                <li >
                    <NavLink to="/"
                        className={({ isActive }) => `font-body font-medium tracking-[0.5px] hover:cursor-pointer flex items-center gap-3 ${isActive ? "text-[#8ace24]" : "text-white"}`}>
                        <House className='hover:text-lightColor duration-300' /> Home
                    </NavLink>
                </li>

                {
                    (userProfile && auth) && <li>
                        <NavLink to="/userpostsPage"
                            className={({ isActive }) => `font-body font-medium tracking-[0.5px] hover:cursor-pointer flex items-center gap-3 ${isActive ? "text-[#8ace24]" : "text-white"}`}>
                            <CircleUserRound className='hover:text-lightColor duration-300' /> Profile
                        </NavLink>
                    </li>
                }

                {
                    userProfile && <Link to="/postformPage">
                        <Button className='bg-[#D73D3D] hover:bg-lightColor duration-300' ><BadgePlus /> Create Post</Button>
                    </Link>
                }

                {(!userProfile && auth) && (
                    <Link to="/profileformPage">
                        <Button className='bg-[#D73D3D] hover:bg-lightColor duration-300'>
                            <BadgePlus /> Create Profile
                        </Button>
                    </Link>
                )}



                {
                    !auth && <Link to="/signupPage">
                        <Button className='bg-lightColor border-0 text-white duration-300' variant='outline'>Sign up</Button>
                    </Link>
                }

                {
                    !auth && <Link to="/loginPage">
                        <Button className='bg-lightColor border-0 text-white duration-300' variant='outline'>Log in</Button>
                    </Link>
                }

                {
                    auth && <Link to="/logoutPage">
                        <Button className='border-0 text-black duration-300' variant='outline'>Log out</Button>
                    </Link>
                }
            </ul>

            <div onClick={() => setNav(!nav)} className='text-black grid place-content-center hover:cursor-pointer md:hidden'>
                <Menu size={26} color='#8ace24' />
            </div>

            <div className={nav ? 'bg-black border-r border-r-lightColor w-[250px] h-screen absolute left-[-180%] top-[70px] ease-in-out duration-1000 '
                : 'bg-black border-r border-r-lightColor/20 w-[250px] h-screen absolute left-0 top-[70px] ease-in-out duration-1000'}>
                <ul className='flex flex-col justify-center pt-5 gap-5'
                    onClick={() => setNav(!nav)}>

                    <li>
                        <NavLink to="/" className={({ isActive }) => `font-body font-medium tracking-[0.5px] hover:cursor-pointer border-b border-b-darkColor/40 pl-6 pb-4 flex items-center gap-3
                    ${isActive ? "text-[#8ace24]" : "text-white"}`}>
                            <House /> Home
                        </NavLink>
                    </li>

                    {
                        auth && <li>
                            <NavLink to="/userpostsPage" className={({ isActive }) => `font-body font-medium tracking-[0.5px] hover:cursor-pointer border-b border-b-darkColor/40 pl-6 pb-4 flex items-center gap-3
                    ${isActive ? "text-[#8ace24]" : "text-white"}`}>
                                <CircleUserRound /> Profile
                            </NavLink>
                        </li>
                    }
                    {
                        userProfile && <li className='border-b border-b-darkColor/40 pl-6 pb-4'>
                            <Link to="/postformPage">
                                <Button className='bg-[#D73D3D] hover:bg-lightColor w-1/2'><BadgePlus /> Create Post</Button>
                            </Link>
                        </li>
                    }
                    {(!userProfile && auth) && <li className='border-b border-b-darkColor/40 pl-6 pb-4'>
                        <Link to="/profileformPage">
                            <Button className='bg-[#D73D3D] hover:bg-lightColor w-[55%]'><BadgePlus /> Create Profile</Button>
                        </Link>
                    </li>
                    }

                    {
                        !auth && <li className='border-b border-b-darkColor/40 pl-6 pb-4'>
                            <Link to="/signupPage">
                                <Button className='bg-lightColor w-1/2'>Sign up</Button>
                            </Link>
                        </li>
                    }

                    {
                        !auth && <li className='border-b border-b-darkColor/40 pl-6 pb-4'>
                            <Link to="/loginPage">
                                <Button className='bg-lightColor w-1/2'>Log in</Button>
                            </Link>
                        </li>
                    }

                    {
                        auth && <li className='border-b border-b-darkColor/40 pl-6 pb-4'>
                            <Link to="/logoutPage">
                                <Button className='bg-lightColor w-1/2'>Log out</Button>
                            </Link>
                        </li>
                    }

                    <li className='pl-6 pb-4'>
                        <ArrowLeftFromLine onClick={() => setNav(!nav)} />
                    </li>

                </ul>
            </div>
        </nav>
    )
}

export default Header


