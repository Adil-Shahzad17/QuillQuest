import React, { useState } from 'react'
import { Input } from './quillComponents'
import { useForm } from 'react-hook-form'
import { BadgePlus } from 'lucide-react'
import { TailSpin } from 'react-loading-icons'
import post_service from '../Appwrite/postService'
import { Button } from '@/components/ui/button'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'


const UpdateForm = () => {

    const [edit, setEdit] = useState(false)

    const { post_Id } = useParams();
    const navigate = useNavigate()

    const categories = ["Health", "Sports", "Fashion", "Business", "Travel"];
    const { register, handleSubmit, setValue, formState: { errors } } = useForm()

    const getPostsQuery = useQuery({
        queryKey: ['edit_posts_data', post_Id],
        queryFn: async () => {
            try {
                const response = await post_service.getPost({ post_Id });
                if (response instanceof Error) throw new Error(response.message);

                return response

            } catch (error) {
                throw new Error("Failed to load Post Data.")
            }
        },
        staleTime: Infinity,
        enabled: !!post_Id,
    })

    React.useEffect(() => {
        if (getPostsQuery.data) {
            setValue("title", getPostsQuery.data.title);
            setValue("category", getPostsQuery.data.category);
            setValue("headline", getPostsQuery.data.headline);
            setValue("content", getPostsQuery.data.content);
        }
    }, [getPostsQuery.data, setValue]);

    const updatePostMutation = useMutation({
        mutationFn: async (data) => {
            let post_Id = getPostsQuery.data.$id

            if (!edit) {
                data.post_image = getPostsQuery.data.post_image
                await post_service.updatePost(post_Id, { ...data })


            } else {
                if (getPostsQuery.data.post_image) await deleteImg()
                const file = data.post_image[0]
                const uploadedFile = await post_service.uploadFile(file)

                if (uploadedFile) {
                    data.post_image = uploadedFile.$id
                    await post_service.updatePost(post_Id, { ...data })
                }
            }
        },
        onSuccess: () => navigate("/userpostsPage"),
        onError: () => { throw new Error("Something Went Wrong, Please try again.") }
    })


    const deleteImg = async () => {
        try {
            return await post_service.deleteFile(getPostsQuery.data.post_image)
        } catch (error) {
            throw new Error("Failed to Delete Image")
        }
    }

    return (

        <div className='pt-[70px]'>
            <div className='h-20 grid place-items-center'>
                <h1 className='font-heading font-medium text-3xl'>Update Blog</h1>

                {
                    getPostsQuery.isError && <p className="text-red-500 text-lg font-body">{getPostsQuery.error.message}</p>
                }
                {
                    updatePostMutation.isError && <p className="text-red-500 text-lg font-body">{updatePostMutation.error.message}</p>
                }
            </div>

            {
                getPostsQuery.isFetching && <TailSpin height="100px" width="100px" className='mx-auto my-3' stroke="#06a750" strokeOpacity={1.5} />

            }

            {
                getPostsQuery.isSuccess &&
                <form action="" method="post" onSubmit={handleSubmit(async (data) => await updatePostMutation.mutateAsync(data))}

                    className='h-auto min-w-[300px] mx-4 rounded-lg p-4 flex flex-col gap-4'>

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
                        <p className='inline-block font-heading font-medium text-xl'>Content</p>
                        {errors.content && (
                            <p className="text-red-500 text-lg font-body">{errors.content.message} *</p>
                        )}

                        <textarea name="" id="" placeholder='Wrtie your content here | upto 1000 Characters...'
                            maxLength={2500}
                            className='border border-lightColor outline-none font-body max-w-[800px] h-[500px] text-black rounded-lg p-3 resize-none'
                            {...register("content", { required: "Content is required" })} />
                    </div>


                    {getPostsQuery.data?.post_image && (
                        <div className="max-w-[500px] mb-4 flex flex-col gap-3">
                            <img
                                src={post_service.getFilePreview(getPostsQuery.data?.post_image)}
                                alt={getPostsQuery.data.title}
                                className="rounded-lg"
                            />
                        </div>
                    )}



                    {
                        edit && <div>
                            {errors.post_image && (
                                <p className="text-red-500 text-lg font-body">{errors.post_image.message} *</p>
                            )}
                            <Input label='Change Image' type='file'
                                classname='border-lightColor max-w-[300px] bg-white py-2 pl-2 rounded-lg'
                                accept="image/png, image/jpg, image/jpeg"
                                {...register("post_image", {
                                    required: "Image is required",
                                    validate: (fileList) => {
                                        if (!fileList || fileList.length === 0) return "Image is required";
                                        if (fileList[0].size > 2 * 1024 * 1024) return "File size must be less than 2MB";
                                        return true;
                                    },
                                },

                                )} />
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
                        className='bg-[#D73D3D] hover:bg-lightColor duration-300 max-w-[200px] h-14 text-lg mt-2' >


                        {
                            updatePostMutation.isPending ? (
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

export default UpdateForm