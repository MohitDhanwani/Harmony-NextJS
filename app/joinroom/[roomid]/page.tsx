'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import YouTube from "react-youtube"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function page() {

  const session = useSession();
  const params = useParams();
  const router = useRouter();
  const storedRoomOwner = localStorage.getItem("roomOwner");

  const [url, setUrl] = useState<string>("");
  const [addToQueueStatus , setAddToQueueStatus] = useState(false);
  const [data, setData] = useState<string>('');
  const [videos, setVideo] = useState<videoDetails[]>([]);
  const [videoID, setVideoID] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userID, setUserID] = useState(null);

  interface videoDetails {
    videoName: string,
    videoURL: string,
    videoCreatedInsideRoom: string
    videoid: string
  }

  const currentLoggedInUser = session?.data?.user?.email;

  useEffect(() => {
    const list = async () => {
      try {
        const listVideos = await fetch("http://localhost:3000/api/getAllVideos", {
          method: "GET",
        });
        const res: videoDetails[] = await listVideos.json();

        const filteredVideos = res.filter(
          video => Number(video.videoCreatedInsideRoom) === Number(params.roomid)
        );

        const videoURLs = filteredVideos.map((vid) => vid.videoURL);
        const split = videoURLs.map(url => url.split("v=")[1]);

        setVideoID(split);
        setVideo(filteredVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    list();

    const intervalId = setInterval(list, 2000);
    return () => clearInterval(intervalId);

}, [params.roomid]);

useEffect(() => {
  if (!session?.data) {
    router.push("/");
  }
}, [session?.data, router]);

  const AddUrlToQueue = async () => {
    setAddToQueueStatus(true);

    const response = await fetch('http://localhost:3000/api/listvideo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ youtubeVideoURL: url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData || 'Error occurred while processing the video URL');
      setAddToQueueStatus(false); // Reset status on error
      return;
    }

    const data = await response.json();
    setData(data);

    if (!data) {
      alert("Please enter a valid YouTube URL");
      setAddToQueueStatus(false); // Reset status if invalid URL
      return;
    }

    const ytVideoDetailsResponse = await fetch("http://localhost:3000/api/ytapi", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!ytVideoDetailsResponse.ok) {
      const errorData = await ytVideoDetailsResponse.json();
      console.error(errorData || 'Error occurred while processing the video URL');
      setAddToQueueStatus(false); // Reset status on error
      return;
    }

    const info = await ytVideoDetailsResponse.json();

    const uploadVideoDetailsToDB = await fetch("http://localhost:3000/api/createSongsDbEntry", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ info, url, params }),
    });

    if (!uploadVideoDetailsToDB.ok) {
      const errorData = await uploadVideoDetailsToDB.json();
      console.error(errorData || 'Error occurred while uploading to DB');
      setAddToQueueStatus(false); // Reset status on error
      return;
    }

    const videoToPublish = await uploadVideoDetailsToDB.json();
    setUserID(videoToPublish.userID);

    setVideo((prevVideos) => [
      ...prevVideos,
      { videoName: info.videoTitle, videoURL: url, videoCreatedInsideRoom: String(params.roomid), videoid: info.videoId }
    ]);

    setAddToQueueStatus(false); // Reset status after successful video addition
    alert("Video added to Queue!");
  };

  const checkOwner = storedRoomOwner?.trim() === currentLoggedInUser?.trim();

  const opts = {
    playerVars: {
      autoplay: 1,
      controls: checkOwner ? 1 : 0
    }
  };

  const onEnd = (event: any) => {
    if (currentIndex < videoID.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const HandleDeleteRoom = async () => {
    const deleteApiReq = await fetch("http://localhost:3000/api/deleteroom", {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomid: params.roomid }),
    });

    if (!deleteApiReq.ok) {
      const errorData = await deleteApiReq.json();
      throw new Error(errorData.error || 'Failed to delete room');
    }

    router.push("/");

    alert('Room deleted successfully');
  };

  return (
    <div className='bg-black h-screen'>

      {storedRoomOwner?.trim() === currentLoggedInUser?.trim() ? (
        <button className='text-white bg-red-600 p-2 rounded-lg mt-6 ml-10 hover:bg-red-700'
          onClick={HandleDeleteRoom}>Delete Room</button>
      ) : ("")}

      <div className='flex flex-row justify-around'>

        <div className='pt-10'>
          <YouTube videoId={videoID[currentIndex]} opts={opts} onEnd={onEnd} />

          <div className='mt-8 flex flex-row'>
            <input
              type="text"
              placeholder='Enter the song you want to play...'
              className='w-[500px] p-2 rounded-xl'
              onChange={(e) => setUrl(e.target.value)} />

            <div>
              <button 
                className={`text-white ml-1 p-2 px-4 rounded-xl ${addToQueueStatus ? 'bg-gray-500' : 'bg-purple-600'}`}
                onClick={AddUrlToQueue} 
                disabled={addToQueueStatus}>
                {addToQueueStatus ? 'Adding...' : 'GO'}
              </button>
            </div>
          </div>
        </div>

        <div className='text-white pt-10 w-full max-w-[550px] bg-gray-700 mt-10 rounded-xl p-4 overflow-y-auto max-h-[480px]'>

          <h1 className='text-lg font-bold mb-4 border-b-2 border-gray-600 pb-2'>Video List</h1>
          {videos.length > 0 ? (
            videos.map((v, index) => (
              <div key={index} className='mb-4 border-b-2 border-gray-600 pb-2'>
                <h2 className='text-purple-400 text-lg font-semibold'>{v.videoName}</h2>
                <a href={v.videoURL} target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:underline'>
                  {v.videoURL}
                </a>
              </div>
            ))
          ) : (
            <p className='text-center text-gray-400'>No videos available</p>
          )}

        </div>

      </div>
    </div>
  )
}

export default page;
