import React, { useState } from 'react'
import { Input } from './quillComponents'
import { useForm } from 'react-hook-form'
import { BadgePlus } from 'lucide-react'
import { TailSpin } from 'react-loading-icons'
import user_service from '@/Appwrite/userService'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'

const UpdateProfile = () => {

    const { user_Id } = useParams()
    const [edit, setEdit] = useState(false)
    const navigate = useNavigate()

    const { register, handleSubmit, setValue, formState: { errors } } = useForm()

    const PostsDataQuery = useQuery({
        queryKey: ["posts_data", user_Id],
        staleTime: Infinity,
        queryFn: async () => {
            const response = await user_service.getPost({ user_Id });
            if (response instanceof Error) throw new Error(response.message);
            return response
        }
    })

    React.useEffect(() => {
        if (PostsDataQuery.data) {
            setValue("user_name", PostsDataQuery.data.user_name);
            setValue("user_bio", PostsDataQuery.data.user_bio);
        }
    }, [PostsDataQuery.data, setValue]);

    const updateProfileMutation = useMutation({
        mutationFn: async (data) => {

            let post_Id = PostsDataQuery.data.$id

            if (!edit) {
                await user_service.updatePost(post_Id, { ...data })
                return
            }

            if (PostsDataQuery.data.user_image) {
                await user_service.deleteFile(PostsDataQuery.data.user_image)
            }

            const file = data.user_image[0]
            const uploadedFile = await user_service.uploadFile(file)

            if (uploadedFile) {
                data.user_image = uploadedFile.$id

                await user_service.updatePost(post_Id, { ...data })
                return
            }

        },
        onSuccess: () => navigate("/userpostsPage"),
        onError: () => { throw new Error("Something Went Wrong, Please try again.") }
    })


    return (
        <div className='pt-[100px]'>
            <div className='h-auto grid place-items-center py-3'>
                <h1 className='font-heading font-medium text-3xl'>Update Profile</h1>
                {
                    PostsDataQuery.isError && <p className="text-red-500 text-lg font-body">{PostsDataQuery.error.message}</p>
                }
                {
                    updateProfileMutation.isError && <p className="text-red-500 text-lg font-body">{updateProfileMutation.error.message}</p>
                }
            </div>

            {
                PostsDataQuery.isFetching && <TailSpin height="100px" width="100px" className='mx-auto my-3' stroke="#06a750" strokeOpacity={1.5} />
            }
            {
                PostsDataQuery.isSuccess &&

                <form action="" method="post" onSubmit={handleSubmit(async (data) => await updateProfileMutation.mutateAsync(data))}
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


                    {PostsDataQuery.data?.user_image && (
                        <div className="mb-4 flex flex-col gap-3">
                            <img
                                src={user_service.getFilePreview(PostsDataQuery.data?.user_image)}
                                alt={PostsDataQuery.data.title}
                                className="rounded-lg max-w-[300px] h-auto max-h-[500px]"
                            />
                        </div>
                    )}



                    {
                        edit && <div>
                            {errors.user_image && (
                                <p className="text-red-500 text-lg font-body">{errors.user_image.message} *</p>
                            )}
                            <Input label='Choose Image' type='file'
                                classname='border-lightColor max-w-[300px] bg-white py-2 pl-2 rounded-lg'
                                accept="image/png, image/jpg, image/jpeg, "
                                {...register("user_image", {
                                    required: "Image is required",
                                    validate: (fileList) => {
                                        if (!fileList || fileList.length === 0) return "Image is required";
                                        if (fileList[0].size > 2 * 1024 * 1024) return "File size must be less than 2MB";
                                        return true;
                                    },
                                })} />
                        </div>
                    }


                    <Button type='buttom' onClick={(e) => {
                        setEdit(!edit)
                        e.preventDefault()
                    }}
                        className='hover:bg-lightColor duration-300 max-w-[200px] h-14 text-lg mt-2' >
                        <BadgePlus /> Edit
                    </Button>


                    <Button type='submit'
                        className='bg-[#D73D3D] hover:bg-lightColor duration-300 max-w-[200px] h-14 text-lg  mt-3' >
                        {
                            updateProfileMutation.isPending ? (
                                <>
                                    Updating... <TailSpin height={40} width={40} />
                                </>
                            ) : (
                                <>
                                    <BadgePlus /> Update Post
                                </>
                            )
                        }
                    </Button>
                </form>
            }
        </div>

    )
}

export default UpdateProfile

