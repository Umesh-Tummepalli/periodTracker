import React from 'react'
import router from './routes/routes'
import {RouterProvider} from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName={() => "relative flex p-5 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer bg-pink-100 border border-pink-200 shadow-lg mb-4 text-black"}
        bodyClassName={() => "text-md font-medium text-black block p-5 flex items-center"}
        progressClassName="!bg-gradient-to-r !from-pink-500 !to-rose-500"
      />
    </>
  )
}

export default App