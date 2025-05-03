import { useState, useRef, useEffect } from "react";

function CameraTest() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deviceList, setDeviceList] = useState([]);
  const videoRef = useRef(null);

  // List available media devices
  useEffect(() => {
    async function listDevices() {
      try {
        // First request permission to get labeled devices
        await navigator.mediaDevices
          .getUserMedia({ audio: false, video: true })
          .then((stream) => {
            // Stop the stream immediately, we just needed it for permissions
            stream.getTracks().forEach((track) => track.stop());
          })
          .catch((err) => {
            console.error(
              "Permission to access media devices was denied:",
              err
            );
            setErrorMessage(
              "Camera permission denied. Please check your browser settings."
            );
          });

        // Now list the devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setDeviceList(videoDevices);
        console.log("Available video devices:", videoDevices);
      } catch (err) {
        console.error("Error listing media devices:", err);
        setErrorMessage("Failed to list camera devices: " + err.message);
      }
    }

    listDevices();
  }, []);

  // Start camera with specific debug information
  const startCamera = async (deviceId = null) => {
    try {
      setErrorMessage("");
      console.log("Starting camera...");

      // Create constraints object
      const constraints = {
        audio: false,
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: "environment" },
      };

      console.log("Using constraints:", constraints);

      // Get the stream
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Stream obtained:", stream);
      console.log("Stream tracks:", stream.getTracks());

      // Check if we have valid video tracks
      const videoTracks = stream.getVideoTracks();
      if (videoTracks.length === 0) {
        throw new Error("No video tracks found in media stream");
      }

      console.log("Video track settings:", videoTracks[0].getSettings());

      // Assign to video element
      if (videoRef.current) {
        console.log("Attaching stream to video element");
        videoRef.current.srcObject = stream;

        // Setup event listeners for debugging
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
        };

        videoRef.current.oncanplay = () => {
          console.log("Video can play now");
        };

        videoRef.current.onplaying = () => {
          console.log("Video is playing");
          setIsCameraActive(true);
        };

        videoRef.current.onerror = (err) => {
          console.error("Video element error:", err);
          setErrorMessage(
            `Video element error: ${videoRef.current.error.message}`
          );
        };

        // Try to play the video
        try {
          console.log("Attempting to play video");
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log("Video playback started successfully");
              })
              .catch((err) => {
                console.error("Error playing video:", err);
                setErrorMessage(`Failed to play video: ${err.message}`);
              });
          }
        } catch (err) {
          console.error("Exception during video.play():", err);
          setErrorMessage(`Exception during video.play(): ${err.message}`);
        }
      } else {
        console.error("Video reference not available");
        setErrorMessage("Video reference not available");
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setErrorMessage(`Camera access error: ${err.message}`);
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      console.log("Camera stopped");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Camera Test</h1>

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={isCameraActive ? stopCamera : startCamera}
          className={`px-4 py-2 rounded ${
            isCameraActive ? "bg-red-500" : "bg-blue-500"
          } text-white`}
        >
          {isCameraActive ? "Stop Camera" : "Start Camera"}
        </button>
      </div>

      {deviceList.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Available Cameras:</h2>
          <ul className="space-y-2">
            {deviceList.map((device) => (
              <li key={device.deviceId} className="flex items-center">
                <button
                  onClick={() => startCamera(device.deviceId)}
                  className="px-2 py-1 bg-gray-200 rounded mr-2"
                >
                  Use
                </button>
                <span>
                  {device.label || `Camera ${device.deviceId.substr(0, 5)}...`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-64 object-cover"
          autoPlay
          playsInline
          muted
        />
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-bold mb-2">Debug Info:</h2>
        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
          {`Camera Active: ${isCameraActive}
Available Devices: ${deviceList.length}
Browser: ${navigator.userAgent}`}
        </pre>
      </div>
    </div>
  );
}

export default CameraTest;
