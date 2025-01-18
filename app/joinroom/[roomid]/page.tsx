'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import YouTube from "react-youtube"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

function Page() {
  const session = useSession();
  const params = useParams();
  const router = useRouter();
  const storedRoomOwner = localStorage.getItem("roomOwner");

  const [url, setUrl] = useState<string>("");
  const [addToQueueStatus, setAddToQueueStatus] = useState(false);
  const [videos, setVideo] = useState<videoDetails[]>([]);
  const [videoID, setVideoID] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
        const listVideos = await fetch("/api/getAllVideos", {
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

    const intervalId = setInterval(list, 10000);
    return () => clearInterval(intervalId);

  }, [params.roomid]);

  useEffect(() => {
    if (!session?.data) {
      router.push("/");
    }
  }, [session?.data, router]);

  const AddUrlToQueue = async () => {
    setAddToQueueStatus(true);

    const response = await fetch('/api/listvideo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ youtubeVideoURL: url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData || 'Error occurred while processing the video URL');
      setAddToQueueStatus(false);
      return;
    }

    const data = await response.json();

    if (!data) {
      alert("Please enter a valid YouTube URL");
      setAddToQueueStatus(false);
      return;
    }

    const ytVideoDetailsResponse = await fetch("/api/ytapi", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });

    if (!ytVideoDetailsResponse.ok) {
      const errorData = await ytVideoDetailsResponse.json();
      console.error(errorData || 'Error occurred while processing the video URL');
      setAddToQueueStatus(false);
      return;
    }

    const info = await ytVideoDetailsResponse.json();

    const uploadVideoDetailsToDB = await fetch("/api/createSongsDbEntry", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ info, url, params }),
    });

    if (!uploadVideoDetailsToDB.ok) {
      const errorData = await uploadVideoDetailsToDB.json();
      console.error(errorData || 'Error occurred while uploading to DB');
      setAddToQueueStatus(false);
      return;
    }

    setVideo((prevVideos) => [
      ...prevVideos,
      { videoName: info.videoTitle, videoURL: url, videoCreatedInsideRoom: String(params.roomid), videoid: info.videoId }
    ]);

    setAddToQueueStatus(false);
    alert("Video added to Queue!");
  };

  const checkOwner = storedRoomOwner?.trim() === currentLoggedInUser?.trim();

  const opts = {
    playerVars: {
      autoplay: 1,
      controls: checkOwner ? 1 : 0
    },
    width: '100%',
    height: '100%'
  };

  const onEnd = () => {
    if (currentIndex < videoID.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const HandleDeleteRoom = async () => {
    const deleteApiReq = await fetch("/api/deleteroom", {
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
    <div className='bg-black min-h-screen p-4'>
      {storedRoomOwner?.trim() === currentLoggedInUser?.trim() && (
        <button className='text-white bg-red-600 p-2 rounded-lg hover:bg-red-700 mb-4 w-full sm:w-auto'
          onClick={HandleDeleteRoom}>Delete Room</button>
      )}

      <div className='flex flex-col items-center pb-4 text-center px-4'>
        <h1 className="text-white font-bold text-lg">
          <span className="text-purple-500">Important:</span> Please ensure the video URL is in the format:
        </h1>
        <p className="text-blue-400 font-medium mt-2 mb-4">watch?v=abcdef</p>
        <h2 className="text-gray-400 text-sm mb-6">After pressing GO, please wait 10-15 seconds for the video to be added to the queue.</h2>
      </div>

      <div className='flex flex-col lg:flex-row gap-6 px-4'>
        <div className='w-full lg:w-3/5'>
          <div className='relative pt-[56.25%]'>
            <div className='absolute top-0 left-0 w-full h-full'>
              <YouTube videoId={videoID[currentIndex]} opts={opts} onEnd={onEnd} className='w-full h-full' />
            </div>
          </div>

          <div className='mt-4 flex flex-col sm:flex-row gap-2'>
            <input
              type="text"
              placeholder='Enter the song you want to play...'
              className='w-full sm:flex-1 p-2 rounded-xl'
              onChange={(e) => setUrl(e.target.value)}
            />
            <button 
              className={`text-white p-2 px-4 rounded-xl w-full sm:w-auto ${addToQueueStatus ? 'bg-gray-500' : 'bg-purple-600'}`}
              onClick={AddUrlToQueue} 
              disabled={addToQueueStatus}>
              {addToQueueStatus ? 'Adding...' : 'GO'}
            </button>
          </div>
        </div>

        <div className='text-white w-full lg:w-2/5 bg-gray-700 rounded-xl p-4 overflow-y-auto max-h-[480px]'>
          <h1 className='text-lg font-bold mb-4 border-b-2 border-gray-600 pb-2'>Video List</h1>
          {videos.length > 0 ? (
            videos.map((v, index) => (
              <div key={index} className='mb-4 border-b-2 border-gray-600 pb-2'>
                <h2 className='text-purple-400 text-lg font-semibold break-words'>{v.videoName}</h2>
                <a href={v.videoURL} target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:underline break-words'>
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

export default Page;