'use client'
import {Music2Icon, Router} from "lucide-react"
import { signIn, useSession , signOut } from 'next-auth/react'

export default function Navbar() {

const session = useSession();

const HandleSignOut =async () => {
  await signOut();
}


  return (
    <div className='flex justify-between bg-[#0a0a0a] text-white p-2 items-center border-b-2'>
        
        <div className='ml-10 mt-2 flex items-center justify-center'>
            <Music2Icon className='mr-1'/>
            <h1 className='font-semibold text-2xl'>Harmony</h1>
        </div>

        <div className='flex justify-around w-80 items-center mt-2'>

        {session.data?.user && <button type='submit' onClick={HandleSignOut} className='bg-purple-500 text-white
         p-3 rounded-xl font-semibold text-l'>
        Logout
        </button>}

        {!session.data?.user && <button type='submit' onClick={ ()  => signIn() } className='bg-purple-500 text-white
         p-3 rounded-xl font-semibold text-l'>
        Sign UP
        </button>}

        </div>
        
    </div>
  )
}
