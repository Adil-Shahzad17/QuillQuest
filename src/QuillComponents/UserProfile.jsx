import React from 'react'
import "../index.css"
import { Card } from './quillComponents'
import post_service from '@/Appwrite/postService'
import { Query } from 'appwrite'
import { TailSpin } from 'react-loading-icons'
import user_service from '@/Appwrite/userService'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'


const UserProfile = () => {

    const { user_Id } = useParams()
    const userInfo = user_Id

    const UserInfoQuery = useQuery({
        queryKey: ['user_info', userInfo],
        staleTime: Infinity,
        queryFn: async () => {
            const response = await user_service.getPost({ user_Id: userInfo })

            if (response) return response
            throw new Error("Failed to Load User Info")
        }
    })

    const profileImg = UserInfoQuery.data?.user_image ? user_service.getFilePreview(UserInfoQuery.data.user_image) : null;

    const PostsQuery = useQuery({
        queryKey: ['user_posts', userInfo],
        staleTime: Infinity,
        queryFn: async () => {
            const response = await post_service.allPosts([Query.equal("user_Id", userInfo), Query.orderDesc("$createdAt")]);

            if (response.total) return response.documents;
            throw new Error("You don't have any posts yet, create some and get started!")
        },
    })

    return (
        <section className='min-h-screen h-auto min-w-[330px] pt-[70px] bg-white flex flex-col'>

            {
                PostsQuery.isError && <p className='font-heading text-red-600 my-3 text-center text-lg'>{PostsQuery.error.message}</p>
            }

            {
                PostsQuery.isFetching || UserInfoQuery.isFetching ? <TailSpin height="100px" width="100px" className='mx-auto mt-2' stroke="#06a750" strokeOpacity={1.5} />
                    :
                    <>
                        <div className='relative text-white bg-black border-b border-b-[#5AA42E] h-auto py-3 pl-3 flex flex-col gap-5'>
                            <div
                                className='w-24 h-24 box-content border-2 border-white bg-cover bg-center rounded-full'
                                style={{ backgroundImage: `url(${profileImg})` }}
                            ></div>

                            <div className='max-w-96 flex flex-col gap-1' >

                                <h1 className='font-heading font-semibold text-lg'>{UserInfoQuery.data?.user_name}</h1>
                                <h2 className='font-body font-medium text-base pr-3'>
                                    {UserInfoQuery.data?.user_bio}
                                </h2>
                            </div>
                        </div>

                        <div className='h-auto text-black p-6 gap-5 overflow-scroll hide-scrollbar 
             grid grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-3'>

                            {PostsQuery.data.map((post) => (
                                <div key={post.$id} className='p-2'>
                                    <Card props={post} show={false} className='max-w-[350px] sm:min-w-[280px] md:max-w-[500px] md:flex-col' />
                                </div>
                            ))}

                        </div>
                    </>
            }
        </section>
    )
}

export default UserProfile