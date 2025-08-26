import {  Outlet } from "react-router"
import { Navbar } from "../../components/Layout/Navbar"
 import { ToastContainer } from 'react-toastify';
export const DashboardLayout = () => {


  return (
    <div className="flex flex-col min-h-screen">
        <Navbar/>
        <ToastContainer/>
        <main className="mt-10 mb-20 mx-4 md:mx-12">
          <Outlet/>
        </main>
    </div>
  )
}
