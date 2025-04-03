import React from 'react'
import { Outlet, Navigate } from 'react-router'
import { useSelector } from 'react-redux'

const ProtectedRoutes = () => {

    const auth = useSelector((state) => state.quillquest.status)

    return auth ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoutes