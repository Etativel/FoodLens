import { useRef, useEffect } from "react";

import { GaleryIcon, XIcon } from "../../assets/icons";

export default function Camera({
  stopCameraStream,
  videoRef,
  setIsCameraOpen,
  setCapturedImage,
  isCameraOpen,
  capturedImage,
}) {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize camera when isCameraOpen changes
  useEffect(() => {
    if (!isCameraOpen || capturedImage) return;

    const ac = new AbortController();

    navigator.mediaDevices
      .getUserMedia({ video: true, signal: ac.signal })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          alert("Could not access camera.");
        }
      });

    return () => {
      // stop request & cleanup any tracks that made it through
      ac.abort();
      stopCameraStream();
    };
  }, [isCameraOpen, capturedImage, stopCameraStream, videoRef]);

  async function predictImage(imageDataUrl) {
    try {
      // Convert base64 to Blob
      const res = await fetch(imageDataUrl);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Prediction result:", data);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  }

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      // set canvas dimensions to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // draw the current video frame to the canvas
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      // convert canvas to image data URL
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageDataUrl);
      // stop the camera stream after capturing
      predictImage(capturedImage);
      stopCameraStream();
      console.log("Picture captured");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      stopCameraStream();
      const reader = new FileReader();
      reader.onload = (event) => {
        // setCapturedImage(event.target.result);
        // setIsCameraOpen(true);
        setCapturedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const closeCamera = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        // 1) Stop every track
        stream.getTracks().forEach((track) => {
          track.stop();
          console.log("Stopped track:", track.kind);
        });
        // 2) Remove the srcObject and pause playback
        videoRef.current.srcObject = null;
        videoRef.current.pause();
      }
    }
    // Now hide the UI
    setIsCameraOpen(false);
    setCapturedImage(null);
  };

  const handleSaveImage = () => {
    // console.log("Saving image:", capturedImage);
    predictImage(capturedImage);
    closeCamera();
  };

  const openFileUpload = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
      {/* hidden canvas for capturing images */}
      <canvas ref={canvasRef} className="hidden"></canvas>

      {capturedImage ? (
        // show captured image
        <div className="w-full h-full flex flex-col items-center justify-center">
          <img
            src={capturedImage}
            alt="Captured"
            className=" w-full h-auto
                     max-w-[100vw] max-h-[80vh] lg:max-w-[400px]"
          />
          <div className="flex gap-4 mt-4">
            <button
              aria-label="close camera"
              onClick={closeCamera}
              className="bg-red-500 text-white py-2 px-6 rounded-full"
            >
              Cancel
            </button>
            <button
              aria-label="use photo"
              onClick={handleSaveImage}
              className="bg-green-500 text-white py-2 px-6 rounded-full"
            >
              Use Photo
            </button>
          </div>
        </div>
      ) : (
        // show camera view
        <div className="w-full h-full flex flex-col items-center justify-center">
          <button
            aria-label="close camera"
            onClick={closeCamera}
            className=" absolute top-0 right-0 bg-transparent text-white py-2 px-2 mr-2 mt-2 rounded-full"
          >
            <XIcon />
          </button>
          <video
            ref={videoRef}
            className="w-full max-h-[100vh]"
            autoPlay
            playsInline
            style={{ background: "#000" }}
          />
          <span className="text-white absolute">
            <div className="relative p-6 h-60 flex justify-center items-center">
              <span className="absolute top-0 left-0 w-10 h-10 border-t-4 rounded-tl-2xl  border-l-4 border-gray-200 "></span>

              <span className="absolute border-gray-200  top-0 right-0 w-10 h-10 rounded-tr-2xl border-t-4 border-r-4 "></span>

              <span className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 rounded-bl-2xl border-gray-200 "></span>

              <span className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 rounded-br-2xl border-gray-200 "></span>

              <p className="mt-2 mx-6 font-semibold text-gray-200">
                Place the food in focus
              </p>
            </div>
          </span>
          <div className="flex gap-12 mt-4 absolute bottom-0 mb-4">
            <button
              aria-label="upload photo"
              onClick={openFileUpload}
              className="bg-transparent text-white py-2 px-6 rounded-full"
            >
              <GaleryIcon />
            </button>
            <button
              aria-label="take picture"
              onClick={takePicture}
              className="bg-white outline-3 outline-solid outline-offset-4 text-white size-14 py-3 px-3 rounded-full"
            ></button>
            <div className="size-15"></div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
}
