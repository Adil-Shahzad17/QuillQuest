import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { TailSpin } from 'react-loading-icons'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { login } from "../Store/quillAuthSlice"
import authservice from '@/Appwrite/authService'
import user_service from '@/Appwrite/userService'
import { user_data } from "../Store/quillUserSlice"
import { Eye, EyeOff } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'


const Login = () => {

    const [showpassword, setShowPassword] = useState(false)

    const authdispatch = useDispatch()
    const userdispatch = useDispatch()
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const loginSubmit = async (data) => {
        logInUserMutation.mutateAsync(data)
    }

    const logInUserMutation = useMutation({
        mutationFn: async (data) => {
            try {
                const submission = await authservice.login(data);

                if (submission instanceof Error) throw new Error(submission.message)
                authdispatch(login({ userData: submission.userId }))

                const userProfile = await user_service.getPost({ user_Id: submission.userId })

                if (userProfile instanceof Error) throw new Error(userProfile.message)
                userdispatch(user_data({ userData: userProfile }))

                navigate("/")
            } catch (error) {
                throw new Error(error.message)
            }
        }
    })

    return (
        <div className="flex min-h-svh w-full items-center justify-center px-5 pt-[70px]">
            <div className="w-full min-w-[300px] max-w-sm flex flex-col gap-4">

                <form className={cn("flex flex-col gap-6")}
                    onSubmit={handleSubmit(loginSubmit)}>
                    <div className="flex flex-col items-start gap-2 text-center">
                        <h1 className="text-2xl font-bold">Login to your account</h1>
                        <p className="text-balance text-sm text-muted-foreground">
                            Enter your email below to login to your account
                        </p>

                        {logInUserMutation.isError && (
                            <p className="text-red-500 text-lg font-body my-2">{logInUserMutation.error.message} *</p>
                        )}
                    </div>
                    <div className="grid gap-3">
                        {errors.email && (
                            <p className="text-red-500 text-base font-body">{errors.email.message} *</p>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" autoComplete="email"
                                {...register("email", {
                                    required: "Email is required",
                                    validate: {
                                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                            "Email address must be a valid address",
                                    }
                                })} />
                        </div>

                        {errors.password && (
                            <p className="text-red-500 text-base font-body">{errors.password.message} *</p>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>

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

                        <Button type="submit" className="w-full">
                            {logInUserMutation.isPending ? <TailSpin /> : "LogIn"}
                        </Button>
                    </div>
                </form>

                <div className="grid gap-5">
                    <div className="text-center text-sm">
                        Don't have an account?{" "}
                        <Link to="/signupPage" className="underline underline-offset-4">
                            Sign Up
                        </Link>
                    </div>

                </div>

            </div>
        </div >

    )
}

export default Login