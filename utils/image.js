const getImageFromUrl = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', reject);
    image.src = url;
  });

const getBlobFromCanvas = (canvas, file) =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        blob.name = file.name;
        blob.lastModified = file.lastModified;
        resolve(blob);
      } else {
        reject(new Error('Canvas is empty'));
      }
    }, file.type);
  });

const cropImage = async (imageUrl, file, crop) => {
  const boxWidth = 600,
    boxHeight = 600;
  const image = await getImageFromUrl(imageUrl),
    canvas = document.createElement('canvas'),
    scaleX = image.naturalWidth / boxWidth,
    scaleY = image.naturalHeight / boxHeight,
    ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleX;
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleX,
    crop.width * scaleX,
    crop.height * scaleX,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleX
  );

  const result = await getBlobFromCanvas(canvas, file);
  return result;
};

export { cropImage };
