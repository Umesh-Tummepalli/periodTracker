import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Home, PlusCircle } from 'lucide-react'

const Quora = () => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center w-full px-5 py-3 rounded-xl transition-all duration-300 font-semibold text-sm gap-3 ` +
    (isActive
      ? 'bg-[#E91E63] text-white shadow-lg shadow-pink-500/30 scale-[1.02]'
      : 'text-gray-600 hover:bg-pink-50 hover:text-[#E91E63] hover:scale-[1.01]');

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50/60 via-white to-pink-50/40">
      <div className='max-w-7xl mx-auto px-4 py-8 flex gap-8'>
        {/* Sidebar */}
        <div className='w-64 shrink-0 sticky top-8 h-fit'>
          <div className="bg-white rounded-2xl shadow-lg shadow-pink-100/50 border border-pink-100/60 p-5 space-y-2">
            <h1 className="text-xl font-bold text-[#E91E63] px-2 mb-4 tracking-tight">Community</h1>

            <NavLink to="/quora/" end className={navLinkClass}>
              <Home className="w-4 h-4" />
              Feed
            </NavLink>

            <NavLink to="/quora/new" className={navLinkClass}>
              <PlusCircle className="w-4 h-4" />
              New Question
            </NavLink>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Quora