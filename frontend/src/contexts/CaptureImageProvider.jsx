// PostContext.js
import { useState } from "react";
import PostContext from "./context-create/PostContext";

export const CapturedImageProvider = ({ children }) => {
  const [capturedImage, setCapturedImage] = useState(() => {
    const stored = localStorage.getItem("postToEdit");
    return stored ? JSON.parse(stored) : null;
  });

  // Keep localStorage in sync
  const setPostToEdit = (post) => {
    if (post) {
      localStorage.setItem("postToEdit", JSON.stringify(post));
    } else {
      localStorage.removeItem("postToEdit");
    }
    setCapturedImage(post);
  };

  return (
    <PostContext.Provider value={{ capturedImage, setPostToEdit }}>
      {children}
    </PostContext.Provider>
  );
};
