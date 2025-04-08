import { NextRequest } from "next/server";

import fs from "fs";
import path from "path";


export async function uploadPDF(file: File, uploadDir: string = 'public/uploads'): Promise<{ fileName: string; error: string | null }> {
  try {
    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${file.name.split(".")[0]}-${Date.now()}.pdf`
    // Define the path where the file will be saved
    const filePath = path.join(process.cwd(), uploadDir, fileName);

    // Ensure the upload directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Save the file to the filesystem
    fs.writeFileSync(filePath, buffer);

    return { fileName, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { fileName: '', error: 'Failed to upload file' };
  }
}