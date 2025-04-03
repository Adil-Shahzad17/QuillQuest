import React from 'react'
import { Input } from './quillComponents'
import { useForm } from 'react-hook-form'
import post_service from '../Appwrite/postService'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { TailSpin } from 'react-loading-icons'

const PostForm = () => {

    const navigate = useNavigate()
    const user_info = useSelector((state) => state.quillquest.userData)
    const user_Id = user_info?.$id || user_info


    const categories = ["Health", "Sports", "Fashion", "Business", "Travel"];
    const { register, handleSubmit, formState: { errors } } = useForm()

    const { isError, error, isPending, mutateAsync } = useMutation({
        mutationFn: async (data) => {
            try {
                const file = data.post_image[0]
                const uploadedFile = await post_service.uploadFile(file)

                if (uploadedFile instanceof Error) {
                    throw new Error("Faild to Upload Image")
                }
                data.post_image = uploadedFile.$id
                await post_service.createPost({ user_Id, ...data })
            } catch (error) {
                throw new Error("Failed to Creat Post")
            }
        },
        onSuccess: () => navigate("/userpostsPage")
    })

    return (

        <div className='pt-[75px]'>
            <div className='h-auto grid place-items-center py-3'>
                <h1 className='font-heading font-medium text-3xl'>Create New Blog</h1>
                {
                    isError && <p className="text-red-500 text-lg font-body">{error.message}</p>
                }
            </div>

            <form action="" method="post" onSubmit={handleSubmit(async (data) => await mutateAsync(data))}
                className='bg-black h-auto min-w-[280px] mx-4 rounded-lg py-4 flex flex-col gap-4'>

                {errors.title && (
                    <p className="text-red-500 text-lg font-body">{errors.title.message} *</p>
                )}

                <Input label='Title' type='text' placeholder='Title | upto 50 Characters...'
                    classname='border-lightColor max-w-[550px]'
                    maxLength={50}
                    {...register("title", { required: "Title is required" })}
                />

                <div className='flex flex-col gap-2'>
                    <p className='inline-block font-heading font-medium text-xl'>Choose Category</p>

                    <select className="outline-none font-body text-black max-w-[450px] p-2 rounded-lg"
                        {...register("category", { required: true })}>
                        {categories.map((category, index) => (
                            <option key={index} value={category.toLowerCase()}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>


                {errors.headline && (
                    <p className="text-red-500 text-lg font-body">{errors.headline.message} *</p>
                )}

                <Input label='Headline' type='text' placeholder='Headline | upto 100 Characters...'
                    classname='border-lightColor max-w-[550px]'
                    maxLength={100}
                    {...register("headline", { required: "Headline is required" })} />

                <div className='flex flex-col gap-2'>
                    {errors.content && (
                        <p className="text-red-500 text-lg font-body">{errors.content.message} *</p>
                    )}
                    <p className='inline-block font-heading font-medium text-xl'>Content</p>

                    <textarea name="" id="" placeholder='Wrtie your content here | upto 3500 Characters...'
                        maxLength={3000}
                        className='border border-lightColor outline-none font-body max-w-[800px] h-[500px] text-black rounded-lg p-3 resize-none'
                        {...register("content", { required: "Content is required" })} />
                </div>

                {errors.post_image && (
                    <p className="text-red-500 text-lg font-body">{errors.post_image.message} *</p>
                )}

                <Input label='Choose Image' type='file'
                    className='border-lightColor max-w-[300px] bg-white py-2 pl-2 rounded-lg'
                    accept="image/png, image/jpg, image/jpeg"
                    {...register("post_image", {
                        required: "Image is required",
                        validate: (fileList) => {
                            if (!fileList || fileList.length === 0) return "Image is required";
                            if (fileList[0].size > 2 * 1024 * 1024 * 1024) return "File size must be less than 3MB";
                            return true;
                        },
                    })} />

                <Button type='submit'
                    className='bg-[#D73D3D] hover:bg-lightColor duration-300 max-w-[250px] h-14 text-lg mt-3' >
                    {
                        isPending ? (
                            <>
                                Creating... <TailSpin height={40} width={40} />
                            </>
                        ) : (
                            "Create Post"
                        )
                    }
                </Button>

            </form>
        </div>
    )
}

export default PostForm