import { useNavigate } from "react-router-dom";
import { FaBowlFood } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";

import {
  CameraIcon,
  HomeIcon,
  CalculatorIcon,
  SquareIcon,
  GalleryIcon,
} from "../../assets/icons";
import XIcon from "../../assets/icons/XIcon";

function BottomNavigation() {
  const currentPage = location.pathname.split("/").pop();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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
  }, [isCameraOpen, capturedImage]);

  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => {
        track.stop();
        console.log("Camera track stopped:", track.kind);
      });
      videoRef.current.srcObject = null;
    }
  };

  const openCamera = () => {
    // first stop any existing stream
    stopCameraStream();

    // set camera open state first
    setIsCameraOpen(true);
    setCapturedImage(null);

    // initialize camera in useEffect instead of here
    console.log("Camera view opened");
  };

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
        setIsProcessing(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Navigate first, then clean up camera state
      navigate("/results", {
        state: { image: capturedImage, prediction: data },
      });

      // Only clean up after navigation is triggered
      setIsProcessing(false);
      console.log("Prediction result:", data);
    } catch (error) {
      setIsProcessing(false);
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
        setCapturedImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const closeCamera = () => {
    stopCameraStream();
    setIsCameraOpen(false);
    setCapturedImage(null);
  };

  const handleSaveImage = async () => {
    // Set processing flag first to show loading state
    setIsProcessing(true);

    try {
      // Don't call closeCamera() here - keep the camera UI open during processing
      await predictImage(capturedImage);
      // Navigation happens in predictImage() before we clean up
      // The closeCamera() call was moved inside the predictImage function
      // after navigation is triggered
    } catch (error) {
      // If there's an error, we should close the camera and reset processing state
      console.log(error);
      setIsProcessing(false);
      closeCamera();
    }
  };

  const openFileUpload = () => {
    fileInputRef.current.click();
  };

  function redirection(target) {
    navigate(`/${target}`);
  }

  return (
    <>
      {isProcessing ? (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center">
          <div className="text-white text-xl">Processing...</div>
          <div className="mt-4 w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {isCameraOpen ? (
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
                      onClick={closeCamera}
                      className="bg-red-500 text-white py-2 px-6 rounded-full"
                    >
                      Cancel
                    </button>
                    <button
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
                      onClick={openFileUpload}
                      className="bg-transparent text-white py-2 px-6 rounded-full"
                    >
                      <GalleryIcon />
                    </button>
                    <button
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
          ) : (
            <div className="flex rounded-t-3xl shadow h-20 justify-center gap-5 z-50 pt-2 absolute bottom-0 bg-neutral-800 w-full">
              <div>
                <button
                  onClick={() => redirection("home")}
                  className="p-2 w-13 pt-4 flex flex-col items-center"
                >
                  <HomeIcon currentPage={currentPage} />
                  <p
                    className={`text-sm font-semibold ${
                      currentPage === "home"
                        ? "text-[#2b7fff]"
                        : "text-[#8e8e8e]"
                    }`}
                  >
                    Home
                  </p>
                </button>
              </div>
              <div>
                <button
                  onClick={() => redirection("calories")}
                  className="p-2 w-13 pt-4 flex flex-col items-center"
                >
                  <CalculatorIcon currentPage={currentPage} />
                  <p
                    className={`text-sm font-semibold ${
                      currentPage === "calories"
                        ? "text-[#2b7fff]"
                        : "text-[#8e8e8e]"
                    }`}
                  >
                    Calories
                  </p>
                </button>
              </div>
              <div>
                <button
                  onClick={openCamera}
                  className="p-4 border-0 rounded-full bg-blue-500"
                >
                  <CameraIcon />
                </button>
              </div>
              <div>
                <button
                  onClick={() => redirection("my-food")}
                  className="p-2 w-13 pt-4 flex flex-col items-center"
                >
                  <FaBowlFood
                    className={`size-6 ${
                      currentPage === "my-food"
                        ? "text-[#2b7fff]"
                        : "text-[#8e8e8e]"
                    }`}
                  />
                  <p
                    className={`whitespace-nowrap text-sm font-semibold ${
                      currentPage === "my-food"
                        ? "text-[#2b7fff]"
                        : "text-[#8e8e8e]"
                    }`}
                  >
                    My Food
                  </p>
                </button>
              </div>
              <div>
                <button
                  onClick={() => redirection("more")}
                  className="p-2 w-13 pt-4 flex flex-col items-center"
                >
                  <SquareIcon currentPage={currentPage} />

                  <p
                    className={`text-sm font-semibold ${
                      currentPage === "more"
                        ? "text-[#2b7fff]"
                        : "text-[#8e8e8e]"
                    }`}
                  >
                    More
                  </p>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default BottomNavigation;
