import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

console.log(process.env.AWS_BUCKET_NAME)


export default async function uploadFile(
  file: Express.Multer.File
): Promise<string> {
  const fileExtension = file.originalname.split(".").pop();
  const key = `${uuidv4()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: "food-app-image-bucket",
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  const getCommand = new GetObjectCommand({
    Bucket: "food-app-image-bucket",
    Key: key,
  });

  // Generate a singed URL valid for 1hour
  const signedUrl = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });

  return signedUrl;
}
