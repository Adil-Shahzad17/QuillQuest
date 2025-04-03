import React from 'react'
import post_service from '@/Appwrite/postService'
import user_service from '@/Appwrite/userService'
import { useParams } from 'react-router'
import credentials from '@/Appwrite/credentials'
import { TailSpin } from 'react-loading-icons'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'


const DisplayBlog = () => {

    const { post_Id } = useParams();
    const navigate = useNavigate()

    const { data, isError, error, isFetching, isSuccess } = useQuery({
        queryKey: ["postData", post_Id],
        enabled: !!post_Id,
        staleTime: Infinity,
        queryFn: async () => {
            try {
                const response = await post_service.getPost({ post_Id });
                if (!response) throw new Error("Failed to load post");

                const userInfo = await user_service.getPost({ user_Id: response.user_Id });
                if (!userInfo) throw new Error("Failed to load user info");

                const profileImage = user_service.getFilePreview(userInfo.user_image)?.href;

                const image = await post_service.getImage(response.post_image);
                if (!image) throw new Error("Failed to load image");

                return {
                    posts: response,
                    user: { profileImage, ...userInfo },
                    postImageUrl: `https://cloud.appwrite.io/v1/storage/buckets/${image.bucketId}/files/${image.$id}/view?project=${credentials.project_id}`
                };
            } catch (error) {
                throw new Error(error.message);
            }
        },

    });

    const lines = (words) => {
        const num = words.split(".");

        let list = [];

        for (let i = 0; i < num.length; i = i + 3) {
            if (num.length % 3 != 0) {
                num.push("");
            }
            list.push(num[i] + num[i + 1] + num[i + 2]);
        }
        return list;
    };

    return (
        <div className='pt-[85px] bg-white'>
            {
                isFetching && <TailSpin height="100px" width="100px" className='mx-auto my-3' stroke="#06a750" strokeOpacity={1.5} />}

            {
                isSuccess &&

                <div className='bg-white text-black rounded-lg h-auto px-5 min-w-[320px] max-w-[900px] mx-auto flex flex-col gap-3'>

                    {isError && (
                        <p className="text-red-500 text-lg font-body my-2">{error.message}*</p>
                    )}

                    <h1 className='text-white bg-primary w-auto py-1 capitalize rounded-lg text-center font-body font-bold tracking-wider text-lg sm:text-2xl'>
                        {data.posts?.title}
                    </h1>

                    <div className='flex justify-center items-center font-body'>
                        <img src={data.postImageUrl} alt={data.posts?.title}
                            className='w-full h-auto max-w-[900px] rounded-lg object-cover' />
                    </div>

                    <div className='mt-5 w-full h-auto'>

                        <h3 className='text-white bg-primary w-auto py-1 capitalize rounded-lg text-center font-body font-bold tracking-wider text-2xl'>
                            {data.posts?.category} Blog
                        </h3>

                        <h2 className='mt-3 pl-3 max-w-[800px] capitalize font-heading font-bold tracking-wider text-xl sm:text-2xl'>
                            {data.posts?.headline}.
                        </h2>

                        <div
                            className='outline-none w-full font-body h-auto rounded-lg mt-2 p-3 resize-none text-xl'>
                            {
                                data?.posts?.content ? lines(data.posts.content).map((line, index) => (
                                    <p key={index} className='py-3'>{line}.</p>
                                )) : null
                            }
                        </div>

                        <div className='my-3 h-14 flex items-center gap-3 hover:cursor-pointer'
                            onClick={() => navigate(`/userprofilePage/${data.posts?.user_Id}`)
                            }>

                            <div
                                className="w-14 h-14 rounded-full border border-black bg-cover bg-center"
                                style={{ backgroundImage: `url(${data?.user?.profileImage})` }}
                            ></div>


                            <p className='pl-3 font-heading font-bold tracking-wider sm:text-lg'>

                                {data?.user?.user_name}
                            </p>

                            <p className='font-body ml-3 sm:ml-10'>
                                {data?.posts?.$createdAt ? new Date(data.posts.$createdAt).toLocaleDateString() : ""}
                            </p>
                        </div>
                    </div>

                </div>
            }
        </div>

    )
}

export default DisplayBlog