import { useNavigate } from "react-router-dom";
import { FaBowlFood } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";
import {
  CameraIcon,
  HomeIcon,
  CalculatorIcon,
  GalleryIcon,
  CheckIcon,
  GearIcon,
  XIcon,
} from "../../assets/icons";
import { variable } from "../../shared";

function Sidebar() {
  const currentPage = location.pathname.split("/").pop();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isCameraOpen || capturedImage) return;

    // reset camera ready state when opening camera
    setIsCameraReady(false);
    const ac = new AbortController();

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode }, signal: ac.signal })
      .then((stream) => {
        videoRef.current.srcObject = stream;

        // event listener to know when video is actually playing
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };

        // set camera ready once video is playing
        videoRef.current.onplaying = () => {
          setIsCameraReady(true);
          console.log("Camera is ready and playing");
        };
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          alert("Could not access camera.");
        }
      });

    return () => {
      // stop request & cleanup any tracks
      ac.abort();
      stopCameraStream();
      setIsCameraReady(false);
    };
  }, [isCameraOpen, capturedImage, facingMode]);

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
    stopCameraStream();

    setIsCameraOpen(true);
    setCapturedImage(null);

    console.log("Camera view opened");
  };

  async function predictImage(imageDataUrl) {
    try {
      const res = await fetch(imageDataUrl);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      const response = await fetch(`${variable.API_URL}/model/predict`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        setIsProcessing(false);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      navigate("/results", {
        state: { image: capturedImage, prediction: data },
      });
      return;
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
    setIsCameraReady(false);
  };

  const handleSaveImage = async () => {
    setIsProcessing(true);

    try {
      await predictImage(capturedImage);
    } catch (error) {
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

  // Navigation items configuration for easier management
  const navItems = [
    {
      name: "Camera",
      path: "camera",
      icon: <CameraIcon />,
      action: openCamera,
      highlight: true,
    },
    {
      name: "Home",
      path: "home",
      icon: <HomeIcon currentPage={currentPage} />,
    },
    {
      name: "Calories",
      path: "calories",
      icon: <CalculatorIcon currentPage={currentPage} />,
    },
    {
      name: "My Food",
      path: "my-food",
      icon: (
        <FaBowlFood
          className={`size-6 ${
            currentPage === "my-food" ? "text-[#2b7fff]" : "text-[#8e8e8e]"
          }`}
        />
      ),
    },
    {
      name: "Settings",
      path: "settings",
      icon: <GearIcon currentPage={currentPage} />,
    },
  ];

  return (
    <>
      {isProcessing ? (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center ">
          <div className="relative max-h-[80vh] w-auto">
            <img
              src={capturedImage}
              alt=""
              className="block max-h-full w-full"
            />

            {/* scanning overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="scan-line" />
            </div>
          </div>

          <div className="text-white text-sm mt-3 font-semibold">
            Processing...
          </div>
          <div className="mt-4 w-5 h-5 border-t-2 border-blue-500 rounded-full animate-spin" />
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
                  <div></div>
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className=" w-full h-auto
                 max-w-[100vw] max-h-[80vh] lg:max-w-[400px]"
                  />
                  <div className="flex gap-4 absolute bottom-0 bg-transparent w-full justify-center p-4">
                    <button
                      aria-label="close camera"
                      onClick={closeCamera}
                      className="bg-transparent text-[#cccccc] font-semibold py-2 px-6 z-50 rounded-full flex gap-1"
                    >
                      <XIcon stroke="oklch(64.5% 0.246 16.439)" size="6" />
                      Cancel
                    </button>
                    <button
                      aria-label="use photo"
                      onClick={handleSaveImage}
                      className="bg-transparent text-[#cccccc] py-2 px-6 rounded-full flex gap-1"
                    >
                      <CheckIcon stroke="oklch(72.3% 0.219 149.579)" />
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
                    className=" absolute top-0 right-0 z-50 bg-transparent text-white py-2 px-2 mr-2 mt-2 rounded-full"
                  >
                    <XIcon stroke="#cccccc" size="6" />
                  </button>
                  <video
                    ref={videoRef}
                    className="w-full max-h-[100vh] z-10"
                    autoPlay
                    playsInline
                    style={{ background: "#000" }}
                  />
                  <span className="text-white absolute z-20">
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
                  <div
                    className="flex gap-12 mt-4 absolute bottom-0 mb-4 z-20"
                    style={{
                      opacity: isCameraReady ? 1 : 0.1,
                    }}
                  >
                    <button
                      aria-label="upload photo"
                      disabled={!isCameraReady}
                      onClick={openFileUpload}
                      className="bg-transparent text-white py-2 px-6 rounded-full"
                    >
                      <GalleryIcon />
                    </button>
                    <button
                      aria-label="take photo"
                      disabled={!isCameraReady}
                      onClick={takePicture}
                      className="bg-white outline-3 outline-solid outline-offset-4 text-white size-14 py-3 px-3 rounded-full"
                    ></button>
                    <button
                      aria-label="change camera"
                      disabled={!isCameraReady}
                      onClick={() => {
                        setFacingMode((prev) =>
                          prev === "user" ? "environment" : "user"
                        );
                      }}
                      className="bg-transparent text-white py-2 px-6 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="#cccccc"
                        className="size-7"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                        />
                      </svg>
                    </button>
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
            <div className="hidden pt-10 lg:flex flex-col h-screen bg-neutral-800 w-64 fixed left-0 top-0 shadow-lg ">
              {navItems.map((item) => (
                <div key={item.path} className="flex flex-col w-full">
                  <button
                    aria-label={`${item.name} button`}
                    onClick={
                      item.action ? item.action : () => redirection(item.path)
                    }
                    className={`cursor-pointer p-4 my-3 flex items-center transition-all duration-200 ${
                      item.highlight ? "bg-blue-500 mx-3 rounded-md" : ""
                    } ${
                      currentPage === item.path && !item.highlight
                        ? "bg-neutral-700 mx-3 rounded-md"
                        : ""
                    }`}
                  >
                    <div className="text-2xl mr-4">{item.icon}</div>
                    <p
                      className={`text-base font-semibold ${
                        currentPage === item.path || item.highlight
                          ? "text-white"
                          : "text-[#8e8e8e]"
                      }`}
                    >
                      {item.name}
                    </p>
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Sidebar;
