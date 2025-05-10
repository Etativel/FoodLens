export default async function compressImage(imageDataUrl) {
  try {
    const img = new Image();
    img.src = imageDataUrl;
    await new Promise((r, e) => {
      img.onload = r;
      img.onerror = e;
    });
    const maxDim = 1024;
    const canvas = document.createElement("canvas");
    let { width, height } = img;
    if (width > height && width > maxDim) {
      height = (height * maxDim) / width;
      width = maxDim;
    } else if (height > maxDim) {
      width = (width * maxDim) / height;
      height = maxDim;
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    const compressed = canvas.toDataURL("image/jpeg", 0.7);
    return compressed;
  } catch (err) {
    console.log(err);
  }
}
