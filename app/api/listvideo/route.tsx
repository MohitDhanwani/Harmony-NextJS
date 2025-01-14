import { NextRequest , NextResponse } from "next/server";
const YT_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/

export async function POST(req: NextRequest){

    try {
    const data = await req.json();
    const { youtubeVideoURL } = data;

    const urlResult = YT_REGEX.test(youtubeVideoURL);
    const videoID = youtubeVideoURL.split("v=")[1];

    if(urlResult){
        return NextResponse.json(videoID , {status:200});
    }

    return NextResponse.json({error: "Enter valid youtube url"});

    } catch (error) {
        console.error("error from server" , error);
        return NextResponse.json({error: "Internal server Error"} , {status: 500});
    }
}