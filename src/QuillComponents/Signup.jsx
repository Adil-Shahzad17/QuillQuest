import React, { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from 'react-hook-form'
import authservice from '@/Appwrite/authService'
import { useDispatch } from 'react-redux'
import { draftLogin } from "../Store/quillAuthSlice"
import { TailSpin } from 'react-loading-icons'
import { Link, useNavigate } from 'react-router'
import { Eye, EyeOff } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'

const Signup = () => {

    const [showpassword, setShowPassword] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const signUpSubmit = async (data, e) => {
        e.preventDefault();
        signInUser.mutateAsync(data)
    };

    const signInUser = useMutation({
        mutationFn: async (data) => {
            if (data.password !== data.Confirm_Password) {
                throw new Error("Passwords do not match")
            }
            return await authservice.createAccount(data);
        },
        onSuccess: (submission) => {
            dispatch(draftLogin({ userData: submission.userId }))
            navigate("/otpPage")
        }
    })

    return (

        <div className="flex min-h-screen py-[80px] pb-5 w-full justify-center items-center px-5">
            <div className="w-full min-w-[300px] max-w-sm flex flex-col gap-2">

                <form className={cn("flex flex-col gap-6")}
                    onSubmit={handleSubmit(signUpSubmit)}>
                    <div className="flex flex-col items-start gap-2 text-center">
                        <h1 className="text-2xl font-bold">Create an Account</h1>
                        <p className="text-balance text-left text-sm text-muted-foreground">
                            Enter your email, password below to create your account.
                        </p>

                        {signInUser.isError && (
                            <p className='text-[#ff3a37]'>
                                {signInUser.error.code == "409" ? "User Already Exists." : signInUser.error.message}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-6">

                        {errors.email && (
                            <p className="text-red-500 text-lg font-body">{errors.email.message} *</p>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="email" >Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" autoComplete="email"
                                className='outline-none focus:bg-none'
                                {...register("email", {
                                    required: "Email is required",
                                    validate: {
                                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                            "Email address must be a valid address",
                                    }
                                })} />
                        </div>



                        {errors.password && (
                            <p className="text-red-500 text-lg font-body">{errors.password.message} *</p>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="password" >Password</Label>

                            <div className='flex items-center border border-input bg-transparent rounded-md relative'>

                                <Input id="password" type={showpassword ? "text" : "password"} placeholder="P@ssw0rd123!" autoComplete="current-password"
                                    className='border-0 outline-none focus:bg-none'
                                    {...register("password", {
                                        required: "Password is required",
                                        validate: {
                                            minLength: (value) =>
                                                value.length >= 8 || "Password must be at least 8 characters long",
                                            hasNumber: (value) =>
                                                /\d/.test(value) || "Password must contain at least one number",
                                            hasCharacter: (value) =>
                                                /[a-zA-Z]/.test(value) || "Password must contain at least one letter",
                                        },
                                    })} />
                                <div onClick={() => setShowPassword(!showpassword)}
                                    className='absolute right-1'>
                                    {
                                        showpassword ? <Eye className='mr-2 hover:cursor-pointer text-white' /> : <EyeOff className='mr-2 hover:cursor-pointer text-white' />
                                    }
                                </div>
                            </div>

                        </div>
                        <div className="grid gap-2">

                            <Label htmlFor="Confirm_Password">Confirm Password</Label>

                            <Input id="Confirm_Password" type={showpassword ? "text" : "password"} placeholder="P@ssw0rd123!"
                                className='outline-none focus:bg-none'

                                {...register("Confirm_Password", { required: "Confirm Password is required" })} />

                        </div>

                        <Button type="submit" className="w-full">{
                            signInUser.isPending ?
                                <TailSpin height="50px" width="50px" /> : " Sign In"
                        }
                        </Button>
                    </div>
                </form>

                <div className="grid gap-6">


                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/loginPage" className="underline underline-offset-4">
                            Login
                        </Link>
                    </div>
                </div>

            </div>
        </div >
    )
}

export default Signup