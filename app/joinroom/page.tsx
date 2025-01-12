'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function Page() {

    const router = useRouter();
    const session = useSession();

    interface Room {
        roomID: number;
        roomName: string;
        roomGenre: string;
    }

    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/getallrooms', {
                    method: 'GET',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setRooms(data);

            } catch (error) {
                console.error('Error from frontend:', error);
            }
        };

        fetchRooms();
    }, []);

    const JoinByRedirecting = (roomid : number) => {
        if(!session.data?.user){
            alert("Please sign in before continuing!");
            router.push("/");
            return;
        }
        router.push(`/joinroom/${roomid}`);
    }

    return (
        <div className="bg-[#0a0a0a] h-screen">

            <div className="h-16 pt-20 flex w-full justify-center">
                <input type="text" placeholder="Search room name..." className="p-5 bg-gray-700 text-white rounded-2xl w-5/12" />
            </div>

            <div className="mt-32">
                {rooms.length > 0 ? (

                    <div className="flex justify-center items-center w-full">

                        <div className="overflow-y-scroll no-scrollbar max-h-[400px]">
                            <table className="w-[650px]">
                                <thead className="text-white">
                                    <tr>
                                        <th className="p-2">RoomNo</th>
                                        <th className="p-2">Room Name</th>
                                        <th className="p-2">Room Genre</th>
                                        <th className="p-2">Action</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {rooms.map((roomInfo, index) => (

                                        <tr key={index} className="text-center">
                                            <td className="p-4 text-purple-400 border-b-2 font-semibold">{roomInfo.roomID}</td>
                                            <td className="p-4 text-purple-400 border-b-2 font-semibold">{roomInfo.roomName}</td>
                                            <td className="p-4 text-purple-400 border-b-2 font-semibold">{roomInfo.roomGenre}</td>
                                            <td className="p-4 border-b-2">
                                                <button className="p-2 px-4 rounded-2xl bg-green-500 font-semibold hover:bg-purple-400 transition duration-300"
                                                onClick={() => JoinByRedirecting(roomInfo.roomID)}>Join now</button>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>

                            </table>
                        </div>

                    </div>
                ) : (
                    <p className="text-white text-center mt-10">No rooms available || Fetching rooms....</p>
                )}
            </div>
        </div>
    );
}

export default Page;
