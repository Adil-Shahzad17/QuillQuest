import React from 'react'
import { Header } from "./QuillComponents/quillComponents"
import { Outlet } from 'react-router'
import authservice from '@/Appwrite/authService'
import user_service from './Appwrite/userService'
import { useDispatch } from 'react-redux'
import { login, logout } from "./Store/quillAuthSlice"
import { user_data } from "./Store/quillUserSlice"
import { FirstPage } from './Pages/pages'
import { useQuery } from '@tanstack/react-query'

const App = () => {
  const authdispatch = useDispatch();
  const userdispatch = useDispatch();

  const checkingUser = async () => {
    try {
      const userdata = await authservice.getCurrentUser()

      if (userdata) {
        authdispatch(login({ userData: userdata }))

        const checkProfile = await user_service.getPost({ user_Id: userdata.$id })

        if (checkProfile) {
          userdispatch(user_data({ userData: checkProfile }))
        }
      } else {
        authdispatch(logout());
      }
      return userdata
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const getCurrentUser = useQuery({
    queryKey: ["getUser"], queryFn: checkingUser, enabled: false, staleTime: 1000 * 60 * 10,
  });

  React.useEffect(() => {
    if (localStorage.getItem("cookieFallback") === '[]' || localStorage.getItem("cookieFallback") === null) {
      return
    }
    else {
      getCurrentUser.refetch()
    }
  }, []);


  return getCurrentUser.isFetching ? (
    <FirstPage />
  ) : (
    <div className="max-w-[1500px] mx-auto h-full">
      <Header />
      <Outlet />
    </div>
  );
};


export default App