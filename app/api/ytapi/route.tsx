import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const youtubeVideoID = await req.json();
        const { data } = youtubeVideoID;

        const apiKey = process.env.YT_APIKEY;
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${data}&key=${apiKey}`;

        const urlResponse = await fetch(url);
        const jsonresponse = await urlResponse.json();
        return NextResponse.json({videoTitle : jsonresponse.items[0].snippet.title , videoBy : jsonresponse.items[0].snippet.channelTitle} , {status: 200});

    } catch (error) {
        console.error("some error ", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}