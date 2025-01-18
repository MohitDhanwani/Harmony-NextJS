'use client'
import { Music2Icon } from "lucide-react"
import { signIn, useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const session = useSession();

  const HandleSignOut = async () => {
    await signOut();
  }

  return (
    <div className='flex flex-wrap justify-between bg-[#0a0a0a] text-white p-2 items-center border-b-2'>
      <div className='flex items-center justify-center p-2 sm:ml-10'>
        <Music2Icon className='mr-1' />
        <h1 className='font-semibold text-xl sm:text-2xl'>Harmony</h1>
      </div>

      <div className='flex justify-center w-full sm:w-80 items-center p-2'>
        {session.data?.user ? (
          <button 
            type='submit' 
            onClick={HandleSignOut} 
            className='bg-purple-500 hover:bg-purple-600 text-white p-2 sm:p-3 rounded-xl font-semibold text-sm sm:text-base w-full sm:w-auto'
          >
            Logout
          </button>
        ) : (
          <button 
            type='submit' 
            onClick={() => signIn()} 
            className='bg-purple-500 hover:bg-purple-600 text-white p-2 sm:p-3 rounded-xl font-semibold text-sm sm:text-base w-full sm:w-auto'
          >
            Sign UP
          </button>
        )}
      </div>
    </div>
  )
}