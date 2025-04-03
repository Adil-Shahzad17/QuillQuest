import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import post_service from '@/Appwrite/postService'
import { useNavigate } from 'react-router'
import { TailSpin } from 'react-loading-icons'
import { useMutation } from '@tanstack/react-query'

const Card = ({ props, className, show }) => {


    const [deletebox, setDeleteBox] = useState(false)
    const navigate = useNavigate()

    const imagePreview = post_service.getFilePreview(props.post_image)
    const dop = new Date(props.$createdAt).toLocaleDateString()


    const { error, isError, isPending, mutateAsync } = useMutation({
        mutationFn: async () => {
            try {
                const deleteImg = await post_service.deleteFile(props.post_image);
                if (deleteImg) {
                    await post_service.deletePost({ post_Id: props.$id });
                }
            } catch (error) {
                throw new Error("Failed to delete post");
            }
        },
        onSuccess: () => {
            navigate("/");
        },
    })


    return (
        <div
            className={`${className} min-w-[320px] w-[400px] h-[500px] mx-3 bg-white rounded-lg shadow-sm relative border border-black flex flex-col sm:w-[300px] md:w-[360px] md:flex-row lg:w-[310px] xl:w-[400px]`}>
            <div className="bg-[#212121] flex justify-center items-center w-auto rounded-md relative">
                <div
                    className='w-full aspect-[4/3] bg-cover bg-center rounded-t-lg'
                    style={{ backgroundImage: `url(${imagePreview})` }}
                ></div>

                {
                    deletebox && <div className='bg-black text-white flex flex-col gap-2 justify-center items-center h-full w-full absolute'>

                        <div className='rounded-xl h-full flex flex-col justify-center items-center'>
                            <h1 className='font-heading font-bold text-lg text-center sm:text-xl'>Are you sure you want to delete?</h1>

                            <div className='w-full flex justify-around mt-3'>
                                <Button onClick={() => setDeleteBox(false)}>
                                    No
                                </Button>
                                <Button onClick={() => mutateAsync()}>
                                    Yes
                                </Button>

                            </div>
                        </div>

                        {
                            isPending && <div className='mx-auto absolute w-full h-full bg-black grid place-items-center'>
                                <TailSpin height="50px" width="50px" />
                            </div>
                        }

                        {
                            isError &&
                            <p className="text-red-500 text-lg font-body my-2">{error.message} *</p>
                        }

                    </div>
                }
            </div>

            <div className='absolute w-full flex justify-between py-3 px-2'>
                <p className=" px-4 py-1 text-sm text-white bg-[#7A8588] capitalize rounded-3xl font-body tracking-wide ">
                    {props.category}
                </p>
            </div>

            <div className="p-3 relative h-full">
                <h5 className="mb-2 text-xl font-bold text-gray-900 font-heading tracking-wide">
                    {props.title}
                </h5>

                <p className="mb-2 font-body text-base text-black">
                    {props.headline}
                </p>



                <div className='absolute bottom-3 h-[45px] flex items-center justify-between gap-3 text-black'>
                    <Button className='bg-lightColor duration-300'
                        onClick={() =>
                            navigate(`/displayblogPage/${props.$id}`)
                        }>
                        Read More
                    </Button>

                    <p className='font-body'>
                        {dop}
                    </p>

                </div>
            </div>

            {
                show &&
                <div className='absolute bottom-2 right-2'>
                    <DropdownMenu>
                        <DropdownMenuTrigger> <ChevronDown size={28} color='black'
                        /> </DropdownMenuTrigger>
                        <DropdownMenuContent className='bg-black border-0 text-white font-body font-medium'>
                            <DropdownMenuItem
                                onClick={() => navigate(`/updateformPage/${props.$id}`)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setDeleteBox(true)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            }
        </div>
    )
}

export default Card