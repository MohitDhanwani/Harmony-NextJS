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
                const response = await fetch('/api/getallrooms', {
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
        <div className="bg-[#0a0a0a] min-h-screen flex flex-col items-center px-4 py-6">
            <div className="w-full max-w-3xl">
                <input type="text" placeholder="Search room name..." className="w-full p-4 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            <div className="mt-10 w-full max-w-4xl">
                {rooms.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-xs uppercase bg-gray-800 text-gray-400">
                                <tr>
                                    <th scope="col" className="p-4">Room No</th>
                                    <th scope="col" className="p-4">Room Name</th>
                                    <th scope="col" className="p-4">Room Genre</th>
                                    <th scope="col" className="p-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((roomInfo) => (
                                    <tr key={roomInfo.roomID} className="bg-gray-900 border-b border-gray-700">
                                        <td className="p-4 text-purple-400 font-semibold">{roomInfo.roomID}</td>
                                        <td className="p-4 text-purple-400 font-semibold">{roomInfo.roomName}</td>
                                        <td className="p-4 text-purple-400 font-semibold">{roomInfo.roomGenre}</td>
                                        <td className="p-4 text-center">
                                            <button className="py-2 px-4 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition duration-300"
                                            onClick={() => JoinByRedirecting(roomInfo.roomID)}>Join now</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-white text-center">No rooms available || Fetching rooms...</p>
                )}
            </div>
        </div>
    );
}

export default Page;