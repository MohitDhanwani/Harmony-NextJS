import { NextResponse } from "next/server";
import prisma from "@/app/db";

export async function GET(){

    try {
        const allVideos = await prisma.videoDetails.findMany();
        return NextResponse.json(allVideos);
    } catch (error) {
        console.error("some error" , error);
        return NextResponse.json("internal server error");
    }
}