'use client'
import { signIn, useSession  } from 'next-auth/react'
import { useRouter } from 'next/navigation';

export default function Home() {

  const session = useSession();
  const router = useRouter();

  const handleCreateRoomFunction = async () => {

    if(!session.data?.user){
      alert("please sign in before creating room , redirecting you to sign in page shortly!");
      signIn('google');
      return;
    }
    else{
      router.push('/createRoom');
    }
  }

  const HandleJoinRoom = async () => {

    if(!session.data?.user?.email){
      await alert("Please signup before joining the room , redirecting you shortly!");
      await signIn('google');
    }
    else{
      router.push("/joinroom")
    }
  }

  return (

    <div className="bg-[#0a0a0a] h-screen text-white">


      <div className="flex justify-evenly">

      <div className="mt-40">
        <h1 className="text-4xl font-semibold text-purple-500">Vote & Vibe Together!</h1>
        
        <div className="text-2xl font-semibold text-white mt-4">Create rooms, and enjoy music with friends in real-time. <br />
        The ultimate platform for collaborative music listening.</div>

        <div className="mt-6">
        <button className="bg-white text-black text-l rounded-xl p-2 px-4 font-semibold " onClick={handleCreateRoomFunction}>Create Room</button>
        <button className="border rounded-xl p-2 font-semibold ml-5 px-4" onClick={HandleJoinRoom}>Join Room</button>
        </div>
      </div>

      <div className="mt-40">
        <img src="https://media.istockphoto.com/id/1806011581/photo/overjoyed-happy-young-people-dancing-jumping-and-singing-during-concert-of-favorite-group.jpg?s=612x612&w=0&k=20&c=cMFdhX403-yKneupEN-VWSfFdy6UWf1H0zqo6QBChP4=" 
        alt="" className="w-96 h-52 rounded-xl" />
      </div>
      </div>
     

    </div>
  );
}
