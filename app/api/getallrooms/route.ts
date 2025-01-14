import {NextResponse} from "next/server";
import prisma from "@/app/db";

export async function GET(){

    try {
        const allRooms = await prisma.roomDetails.findMany();
        return NextResponse.json(allRooms , {status: 201})
    } catch (error) {
        console.error("error in get req " , error);
        return NextResponse.json({error: "Internal server error" , details: error} , {status: 500});
    }
}