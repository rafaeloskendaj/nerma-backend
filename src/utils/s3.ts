import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME } = process.env;

const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

export async function uploadImageToS3(imageBuffer, mimeType, folder = "") {
    const fileExtension = mimeType.split("/")[1];
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = folder ? `${folder}/${fileName}` : fileName;

    const command = new PutObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: key,
        Body: imageBuffer,
        ContentType: mimeType,
        // ACL: "public-read",
    });

    await s3.send(command);

    return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
};
