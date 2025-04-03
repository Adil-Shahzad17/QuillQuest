import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { logout } from "../Store/quillAuthSlice"
import { clearUserData } from "../Store/quillUserSlice"
import authservice from '@/Appwrite/authService'
import { TailSpin } from 'react-loading-icons'
import { useMutation } from '@tanstack/react-query'

const LogOutPage = () => {

    const authdispatch = useDispatch()
    const userdispatch = useDispatch()
    const navigate = useNavigate()

    const { isPending, isSuccess, isError, error, mutateAsync } = useMutation({
        mutationFn: async () => {
            await authservice.logOut()
        },
        onSuccess: () => {
            authdispatch(logout())
            userdispatch(clearUserData())
            localStorage.clear()
        },
        onError: () => {
            throw new Error("Unable to LogOut user")
        }
    })

    if (isSuccess) navigate('/')

    return (
        <div className='flex flex-col gap-5 justify-center items-center h-screen'>

            {
                isError && <p className='my-3 font-heading text-xl text-red-600'>{error.message}</p>
            }

            <div className='mx-3 p-5 border border-white/20 rounded-xl sm:p-8'>
                <h1 className='font-heading font-bold text-lg text-center sm:text-xl'>Are you sure you want to sign out?</h1>

                <div className='w-full flex justify-around mt-3'>
                    <Link to="/">
                        <Button>
                            No
                        </Button>
                    </Link>
                    <Button onClick={mutateAsync}>
                        Yes
                    </Button>

                </div>
            </div>

            {
                isPending &&
                <>
                    <div className='flex items-center gap-5 font-body'>

                        <TailSpin height="50px" width="50px" />
                        Logging Out...
                    </div>
                </>

            }

        </div>
    )
}

export default LogOutPage