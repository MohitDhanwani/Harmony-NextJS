import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/db";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {

    try {
        const session = await auth();
        const videoDetails = await req.json();

        
        if(!videoDetails){
            console.error("Enter valid URL");
            return NextResponse.json({error: "Url error"});
        }

        const getUserID = await prisma.userDetails.findFirst({
            where:{
                userEmail: session?.user?.email ?? "",
            }
        })


        const videoDbEntry = await prisma.videoDetails.create({
            data:{
            videoName: videoDetails.info.videoTitle,
            videoURL: videoDetails.url,
            videoIdUser: getUserID?.id,
            videoCreatedInsideRoom: Number(videoDetails.params.roomid),
            }
        }) 
        return NextResponse.json({videoDbEntry: videoDbEntry, userID: getUserID});

    } catch (error : any) {
        console.error("some error in pushing data to db" , error.message);
        return NextResponse.json({error: "Inernal Server Error"});
    }

}