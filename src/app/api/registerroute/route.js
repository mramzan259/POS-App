import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/database/db_connection";
import User from "@/lib/model/user";

export async function POST(req) {
  try {
    // Parse form data from the request
    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const file = formData.get("image");

    console.log(formData);

    // Validate required fields
    if (!name || !email || !password || !file) {
      return NextResponse.json(
        { message: "All fields including image are required." },
        { status: 400 }
      );
    }

    // Validate image type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "Only JPEG and PNG images are allowed." },
        { status: 400 }
      );
    }

    // Validate image size (less than 2MB)
    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return NextResponse.json(
        { message: "Image size should be less than 2MB." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      image: {
        data: buffer,
        contentType: file.type,
      },
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully!", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in registration:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
