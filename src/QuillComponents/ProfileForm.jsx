import React from 'react'
import { Input } from './quillComponents'
import { useForm } from 'react-hook-form'
import user_service from '@/Appwrite/userService'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { user_data } from "../Store/quillUserSlice"
import { useMutation } from '@tanstack/react-query'

const ProfileForm = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const user_Id = useSelector((state) => state.quillquest.userData?.$id)

    const { register, handleSubmit, formState: { errors } } = useForm()

    const { isError, error, isPending, mutateAsync } = useMutation({
        mutationFn: async (data) => {
            try {
                const file = data.user_image[0]
                const uploadedFile = await user_service.uploadFile(file)

                if (uploadedFile instanceof Error) throw new Error('Failed to Upload Image');

                data.user_image = uploadedFile.$id
                const created = await user_service.createPost(user_Id, { ...data })

                if (created instanceof Error) throw new Error(created.message)

                dispatch(user_data({ userData: created }))

            } catch (error) {
                throw new Error("Something Went Wrong, Please try again.")
            }
        },
        onSuccess: () => navigate("/userpostsPage"),
    })


    return (
        <div className='pt-[100px]'>
            <div className='h-auto grid place-items-center py-3'>
                <h1 className='font-heading font-medium text-3xl'>Create New Profile</h1>

                {
                    isError && <p className="text-red-500 text-lg font-body">{error.message}</p>
                }

            </div>

            <form action="" method="post" onSubmit={handleSubmit(async (data) => await mutateAsync(data))}
                className='bg-black h-auto min-w-[280px] mx-4 rounded-lg py-4 flex flex-col gap-4'>

                {errors.user_name && (
                    <p className="text-red-500 text-lg font-body">{errors.user_name.message} *</p>
                )}

                <Input label='Name' type='text' placeholder='Name | upto 20 Characters...'
                    classname='border-lightColor max-w-[550px]'
                    maxLength={20}
                    {...register("user_name", { required: "Name is required" })} />

                {errors.user_bio && (
                    <p className="text-red-500 text-lg font-body">{errors.user_bio.message} *</p>
                )}

                <Input label='Bio' type='text' placeholder='Bio | upto 100 Characters...'
                    classname='border-lightColor max-w-[550px]'
                    maxLength={100}
                    {...register("user_bio", { required: "Bio is required" })} />

                {errors.user_image && (
                    <p className="text-red-500 text-lg font-body">{errors.user_image.message} *</p>
                )}

                <Input label='Choose Image' type='file'
                    classname='border-lightColor max-w-[300px] bg-white py-2 pl-2 rounded-lg'
                    accept="image/png, image/jpg, image/jpeg"
                    {...register("user_image", {
                        required: "Image is required",
                        validate: (fileList) => {
                            if (!fileList || fileList.length === 0) return "Image is required";
                            if (fileList[0].size > 2 * 1024 * 1024) return "File size must be less than 2MB";
                            return true;
                        },
                    })} />

                <Button type='submit'
                    className='bg-[#D73D3D] hover:bg-lightColor duration-300 max-w-[200px] h-14 text-lg  mt-3' >
                    {
                        isPending ? (
                            <>
                                Creating... <TailSpin height={40} width={40} />
                            </>
                        ) : (
                            "Create Profile"
                        )
                    }
                </Button>



            </form>
        </div>
    )
}

export default ProfileForm
