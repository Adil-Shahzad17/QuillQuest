import React, { useRef } from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot, } from "@/components/ui/input-otp"
import { Button } from '@/components/ui/button'
import authservice from '@/Appwrite/authService'
import { useSelector, useDispatch } from 'react-redux'
import { login } from "../Store/quillAuthSlice"
import { useNavigate } from 'react-router'
import { TailSpin } from 'react-loading-icons'
import { useMutation } from '@tanstack/react-query'


const OTPinput = () => {

    const ref = useRef(null)
    const userInfo = useSelector((state) => state.quillquest)

    React.useEffect(() => {
        if (!userInfo.userData) navigate("/signupPage")
    }, [userInfo.userData])

    const authdispatch = useDispatch()
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()
        otpMutation.mutateAsync()
    };

    const otpMutation = useMutation({
        mutationFn: async () => {
            const otp = ref.current.value;

            if (otp.length !== 6) throw new Error("OTP code must be 6 digits.")

            const submission = await authservice.loginUsingOTP({ user_Id: userInfo.userData, otpToken: otp });

            if (submission instanceof Error) throw new Error("Invalid OTP Code")
            else {
                authdispatch(login({ userData: submission }));
                navigate("/");
            }
        }
    })

    return (
        <div className='bg-black flex flex-col gap-4 justify-center items-center h-screen'>

            <h1 className='px-3 text-center font-heading font-bold tracking-wider text-sm sm:text-xl'>
                Enter the 6 digit OTP code received in your email.</h1>

            {otpMutation.error && (
                <p className="text-red-500 text-lg font-body">{otpMutation.error.message}</p>
            )}

            <form onSubmit={handleSubmit} className='flex flex-col gap-4 justify-center items-center'>
                <InputOTP maxLength={6} pattern={/^[0-9]+$/} ref={ref}                >
                    <InputOTPGroup>
                        {[...Array(6)].map((_, index) => (
                            <InputOTPSlot key={index} index={index} />
                        ))}
                    </InputOTPGroup>
                </InputOTP>

                <Button type="submit" className="w-full">
                    {otpMutation.isPending ?
                        <>
                            Submitting <TailSpin height="50px" width="50px" />
                        </>
                        : "Submit"
                    }
                </Button>
            </form>

        </div>
    )
}

export default OTPinput