'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

function Page() {

  const router = useRouter();

    const [roomName , setRoomName] = useState('');
    const [roomPassword , setRoomPassword] = useState('');
    const [roomGenre , setRoomGenre] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      try {
        const response = await fetch("/api/rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomName: roomName,
            roomPassword: roomPassword,
            roomGenre: roomGenre,
          }),
        });
    
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create room");
        }
    
        const data = await response.json();
        localStorage.setItem("roomOwner", data.roomOwnerEmail);
        alert("Your room has been created Successfully! <3")
    
        setRoomName("");
        setRoomPassword("");
        setRoomGenre("");

        router.push(`/joinroom/${data.newRoomDbEntry.roomID}`)
        
      } catch (error) {
        console.error("Error creating room:", error);
      }
    };
    

  return (
    <div className="bg-[#0a0a0a] h-screen">

      <div className="h-auto p-2">

        <div className="mt-10 p-4 flex justify-center items-center flex-col">
          <h1 className="text-white text-2xl font-semibold">Create a Room</h1>
          <h2 className="text-white text-xl font-semibold mt-3">
            Set up your music room and start sharing your favorite tracks
          </h2>
        </div>

        <div className="flex justify-center items-center">
          <div className="mt-10 w-6/12">
            <form
              onSubmit={handleSubmit}
              className="text-white flex flex-col border border-gray-700 p-8 rounded-2xl bg-[#121212] shadow-lg"
            >
              <label htmlFor="" className="text-gray-400">
                Room Name
              </label>
              <input
                type="text"
                name=""
                id=""
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter Room Name..."
                className="mt-1 rounded-xl p-2 bg-[#1e1e1e] font-medium text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <label htmlFor="" className="mt-3 text-gray-400">
                Room Password
              </label>
              <input
                type="text"
                name=""
                id=""
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                placeholder="Enter Room Password"
                className="mt-1 rounded-xl p-2 bg-[#1e1e1e] font-medium text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <label htmlFor="" className="mt-3 text-gray-400">
                Room Description
              </label>
              <input
                type="text"
                name=""
                id=""
                value={roomGenre}
                onChange={(e) => setRoomGenre(e.target.value)}
                placeholder="Describe Room type / Genre etc.."
                className="mt-1 rounded-xl p-2 bg-[#1e1e1e] font-medium text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button className="mt-6 bg-purple-600 hover:bg-purple-700 font-semibold p-2 rounded-lg px-4 transition duration-300 text-white"
              >
                Create Room
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;