import multer from "multer";
import { NextRequest, NextResponse } from "next/server";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

upload.single("file");
