import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest){

    const {roomid} = await req.json();

    if(!roomid){
        return NextResponse.json({ error: 'Room ID is required' });
    }

    try {
        const deletedRoom = await prisma.roomDetails.delete({
            where:{
                roomID : Number(roomid),
            }
        });
        
        return NextResponse.json(deletedRoom);

    } catch (error) {
        console.error('Error deleting room:', error);
        return NextResponse.json({ error: 'Error deleting the room' });
    }
}