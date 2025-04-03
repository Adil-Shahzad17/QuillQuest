import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import "../index.css"
import { Card } from './quillComponents'
import { Query } from 'appwrite'
import post_service from '@/Appwrite/postService'
import { TailSpin } from 'react-loading-icons'
import { useInfiniteQuery } from '@tanstack/react-query'

const Blogs = () => {

    const [category, setCategory] = useState('All')

    const loadPosts = async ({ pageParam = null }) => {
        const params = [
            Query.limit(6),
            Query.orderDesc("$createdAt")
            ,
            ...(pageParam ? [Query.cursorAfter(pageParam)] : []),
        ];

        if (category !== 'All') {
            params.unshift(Query.equal('category', category));
        }

        return await post_service.allPosts(params);
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
        queryKey: ['blogs_posts', category],
        queryFn: loadPosts,
        staleTime: 1000 * 60,
        getNextPageParam: (lastPage) => {
            const docs = lastPage?.documents || [];
            return docs.length < 6 ? undefined : docs[docs.length - 1].$id;
        },
    });

    return (
        <div className='bg-white min-h-screen'>
            <div className='h-auto py-4 text-black border-b border-b-black/30 sm:pl-4'>
                <h1 className='font-heading font-semibold text-2xl text-center sm:text-4xl sm:text-left sm:px-2'>Blogs</h1>
                <p className='mt-2 px-3 font-body text-base text-center sm:text-lg sm:text-left'>Here, we share travel tips, fashion guides, business ideas and much more. </p>

                <div className="mt-2 px-2 gap-2 overflow-scroll hide-scrollbar flex flex-col md:gap-4 lg:gap-6">
                    <div className="flex gap-2 md:gap-4 lg:gap-6"
                        onClick={(e) => {
                            if (e.target.tagName === "BUTTON") {
                                setCategory(e.target.textContent);
                            }
                        }}>
                        <Button variant="outline" className="hover:bg-lightColor focus:bg-lightColor focus:text-white hover:text-white duration-300">All</Button>
                        <Button variant="outline" className="hover:bg-lightColor focus:bg-lightColor focus:text-white hover:text-white duration-300">Health</Button>
                        <Button variant="outline" className="hover:bg-lightColor focus:bg-lightColor focus:text-white hover:text-white duration-300">Sports</Button>
                        <Button variant="outline" className="hover:bg-lightColor focus:bg-lightColor focus:text-white hover:text-white duration-300">Business</Button>
                        <Button variant="outline" className="hover:bg-lightColor focus:bg-lightColor focus:text-white hover:text-white duration-300 mr-4">Fashion</Button>
                        <Button variant="outline" className="hover:bg-lightColor focus:bg-lightColor focus:text-white hover:text-white duration-300 mr-4">Travel</Button>
                    </div>
                </div>

                {
                    isError && <p className='my-3 font-heading text-xl text-red-600'>Something went wrong, try refreshing the page.</p>
                }
            </div>

            {isSuccess && data?.pages?.length ? (
                <div className='h-auto text-black p-6 gap-5 overflow-scroll hide-scrollbar 
    grid grid-cols-1 place-items-center sm:grid-cols-2 lg:grid-cols-3'>

                    {data.pages.map((group, i) => (
                        <React.Fragment key={i}>
                            {group?.documents?.length > 0 ? (
                                group.documents.map((post) => (
                                    <div key={post.$id} className='p-2'>
                                        <Card
                                            props={post}
                                            show={false}
                                            className='max-w-[350px] sm:min-w-[280px] md:max-w-[500px] md:flex-col'
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>No documents available</p>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            ) : null}


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

            {
                isFetching && !isFetchingNextPage ? <TailSpin className='mx-auto my-2 mt-6' height="100px" width="100px" stroke="#06a750" strokeOpacity={1.5} /> : null}


        </div>
    )
}

export default Blogs