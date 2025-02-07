// src/app/api/upload/route.js
import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const result = await uploadImage(file);
    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
