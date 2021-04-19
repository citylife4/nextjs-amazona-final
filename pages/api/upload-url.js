import S3 from 'aws-sdk/clients/s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
};

const s3 = new S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_ID_KEY,
  secretAccessKey: process.env.AWS_KEY_SECRET,
  signatureVersion: 'v4',
});

const storageS3 = multerS3({
  s3,
  bucket: 'slccart',
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
});

const uploadS3 = multer({ storage: storageS3 });
export default async (req, res) => {
  await runMiddleware(req, res, uploadS3.single('image'), cors());
  const { type, name } = JSON.parse(req.body);
  const fileParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: name,
    Expires: 600,
    ContentType: type,
    ACL: 'public-read',
  };

  const url = await s3.getSignedUrlPromise('putObject', fileParams);

  res.statusCode = 200;
  res.json({ url });
};
