import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import QuillStore from './Store/quillStore'
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import { HomePage, PostFormPage, UpdateFormPage, DisplayBlogPage, LoginPage, SignUpPage, Error404Page, OTPinputPage, UserPostsPage, FirstPage, LogOutPage, ProfileFormPage, UpdateProfilePage, UserProfilePage } from './Pages/pages'
import ProtectedRoutes from './Pages/ProtectedRoutes'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="*" element={<Error404Page />} />

      <Route path="/" element={<App />}>
        <Route path="/" element={<HomePage />} />
        <Route path="loading" element={<FirstPage />} />
        <Route path="loginPage" element={<LoginPage />} />
        <Route path="signupPage" element={<SignUpPage />} />
        <Route path="otpPage" element={<OTPinputPage />} />
        <Route path="displayblogPage/:post_Id" element={<DisplayBlogPage />} />
        <Route path="userprofilePage/:user_Id" element={<UserProfilePage />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route path="postformPage" element={<PostFormPage />} />
        <Route path="updateformPage/:post_Id" element={<UpdateFormPage />} />
        <Route path="userpostsPage" element={<UserPostsPage />} />
        <Route path="logoutPage" element={<LogOutPage />} />
        <Route path="profileformPage" element={<ProfileFormPage />} />
        <Route path="updateprofilePage/:user_Id" element={<UpdateProfilePage />} />
      </Route>
    </>

  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={QuillStore}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>

  </Provider>
)
