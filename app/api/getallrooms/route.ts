import { NextRequest , NextResponse} from "next/server";
import prisma from "@/app/db";

export async function GET(req: NextRequest){

    try {
        const allRooms = await prisma.roomDetails.findMany();
        return NextResponse.json(allRooms , {status: 201})
    } catch (error: any) {
        console.error("error in get req " , error);
        return NextResponse.json({error: "Internal server error" , details: error.message} , {status: 500});
    }
}