import React from 'react'
import "../index.css"
import { Card } from './quillComponents'
import post_service from '@/Appwrite/postService'
import { Query } from 'appwrite'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { TailSpin } from 'react-loading-icons'
import { Button } from '@/components/ui/button'
import { PencilLine } from 'lucide-react'
import user_service from '@/Appwrite/userService'
import { useInfiniteQuery } from '@tanstack/react-query'

const UserPosts = () => {
    const navigate = useNavigate()

    const userInfo = useSelector((state) => state.quillquest.userData?.$id)
    const userProfile = useSelector((state) => state.user.userData)

    const profileImg = userProfile ? user_service.getFilePreview(userProfile?.user_image) : null

    const loadPosts = async () => {
        return await post_service.allPosts([Query.equal("user_Id", userInfo), Query.orderDesc("$createdAt")]);
    };

    const {
        data,
        isError,
        isFetching,
        isSuccess,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['user_posts', userInfo],
        queryFn: loadPosts,
        staleTime: Infinity,
        enabled: !!userInfo,
        getNextPageParam: (lastPage) => {
            const docs = lastPage?.documents || [];
            return docs.length < 6 ? undefined : docs[docs.length - 1].$id;
        },
    });

    return (
        <section className='min-h-screen h-auto min-w-[330px] pt-[70px] bg-white flex flex-col'>


            <div className='relative text-white bg-black border-b border-b-[#5AA42E] h-auto py-3 pl-3 flex flex-col gap-5'>
                <div
                    className='w-24 h-24 box-content border-2 border-white bg-cover bg-center rounded-full'
                    style={{ backgroundImage: `url(${profileImg})` }}
                ></div>

                <div className='max-w-96 flex flex-col gap-1' >

                    <h1 className='font-heading font-semibold text-lg'>{userProfile?.user_name}</h1>
                    <h2 className='font-body font-medium text-base pr-3'>
                        {userProfile?.user_bio}
                    </h2>
                </div>

                <div className='absolute right-3 top-3 flex flex-col gap-3'>

                    <Button onClick={() => navigate(`/updateprofilePage/${userProfile.$id}`)} >
                        Edit Profile <PencilLine size={32} />
                    </Button>
                </div>
            </div>


            {
                isError && <p className='font-heading text-red-600 my-3 text-center text-lg'>
                    Something went wrong, please try again later.
                </p>
            }

            {
                isFetching || isFetchingNextPage ? <TailSpin height="100px" width="100px" className='mx-auto mt-2' stroke="#06a750" strokeOpacity={1.5} />
                    :

                    <div className='h-auto text-black p-6 gap-5 overflow-scroll hide-scrollbar 
             grid grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-3'>

                        {
                            isSuccess ? (data.pages.map((group, i) => (
                                <React.Fragment key={i}>
                                    {group.documents.map((post) => (
                                        <div key={post.$id} className='p-2'>
                                            <Card props={post} show={true} className='max-w-[350px] sm:min-w-[280px] md:max-w-[500px] md:flex-col' />
                                        </div>
                                    ))}
                                </React.Fragment>
                            )))
                                : null
                        }
                    </div>
            }

            {
                isSuccess &&

                <div className='flex justify-center items-center gap-7 pt-10 pb-20 text-black'                >
                    <Button variant="outline" className="hover:bg-lightColor focus:bg-lightColor focus:text-white hover:text-white duration-300"
                        onClick={() => fetchNextPage()}
                        disabled={!hasNextPage || isFetchingNextPage}
                    >
                        {isFetchingNextPage
                            ? 'Loading more...'
                            : hasNextPage
                                ? 'Load More'
                                : 'Nothing more to load'}
                    </Button>
                </div>
            }
        </section>
    )
}

export default UserPosts