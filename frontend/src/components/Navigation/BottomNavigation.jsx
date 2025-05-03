import { useNavigate } from "react-router-dom";
import { FaBowlFood } from "react-icons/fa6";
import { useState, useRef, useEffect } from "react";

function BottomNavigation() {
  const currentPage = location.pathname.split("/").pop();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
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
    stopCameraStream();
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

  function redirection(target) {
    navigate(`/${target}`);
  }

  return (
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="#cccccc"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
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
                  className="bg-tranparent text-white py-2 px-6 rounded-full"
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
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={currentPage === "home" ? "#2b7fff" : "#8e8e8e"}
                className="size-6"
              >
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>

              <p
                className={`text-sm font-semibold ${
                  currentPage === "home" ? "text-[#2b7fff]" : "text-[#8e8e8e]"
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={currentPage === "calories" ? "#2b7fff" : "#8e8e8e"}
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M6.32 1.827a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V19.5a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3V4.757c0-1.47 1.073-2.756 2.57-2.93ZM7.5 11.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H8.25a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H8.25Zm-.75 3a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H8.25a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-.75-.75H8.25Zm1.748-6a.75.75 0 0 1 .75-.75h.007a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.007a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.335.75.75.75h.007a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-.007Zm-.75 3a.75.75 0 0 1 .75-.75h.007a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.007a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.335.75.75.75h.007a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-.75-.75h-.007Zm1.754-6a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-.008Zm-.75 3a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V18a.75.75 0 0 0-.75-.75h-.008Zm1.748-6a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 1.5a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75h-.008Zm-8.25-6A.75.75 0 0 1 8.25 6h7.5a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75v-.75Zm9 9a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-2.25Z"
                  clipRule="evenodd"
                />
              </svg>

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={currentPage === "more" ? "#2b7fff" : "#8e8e8e"}
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
                  clipRule="evenodd"
                />
              </svg>

              <p
                className={`text-sm font-semibold ${
                  currentPage === "more" ? "text-[#2b7fff]" : "text-[#8e8e8e]"
                }`}
              >
                More
              </p>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default BottomNavigation;
