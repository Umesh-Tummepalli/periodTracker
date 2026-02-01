import React from 'react'
import { Outlet } from 'react-router-dom'

const Quora = () => {
  return (
    <div>
      <h1>Quora</h1>
      <Outlet/>
    </div>
  )
}

export default Quora