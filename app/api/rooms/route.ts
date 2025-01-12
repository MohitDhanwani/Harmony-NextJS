import { NextRequest , NextResponse } from "next/server";
import prisma from "@/app/db";
import { auth } from "@/auth"

export async function POST(req: NextRequest){ 
    
    try {
        const session = await auth();

        if(!session || !session.user?.email){
            return NextResponse.json({error: "User not authenticated"} , {status: 401});
        }
        
        const {roomName , roomPassword , roomGenre} = await req.json();

        if(!roomName || !roomPassword || !roomGenre){
        return NextResponse.json({error: "All fields are required"} , {status: 400});
        }

        const roomCreator = await prisma.userDetails.findFirst({
            where:{
                userEmail: session.user.email,
            }
        })

        if(!roomCreator){
            return NextResponse.json({ error: "User not found" } , {status: 404});
        }

        const roomOwnerEmail = roomCreator.userEmail;


        const newRoomDbEntry = await prisma.roomDetails.create({
        data:{
            roomName: roomName,
            roomPassword: roomPassword,
            roomGenre: roomGenre,
            userID: roomCreator.id,
        }
    })

    return NextResponse.json({newRoomDbEntry , roomOwnerEmail} , {status: 201});

    } catch (error: any) {
        console.error("error creating room - " , error.message);
        return NextResponse.json({error: "Internal Server Error" , details: error.message} , {status: 500});
    }
}