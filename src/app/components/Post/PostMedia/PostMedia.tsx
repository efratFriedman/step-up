"use client";

import Slider from "../Slider/Slider";

interface PostMediaProps {
  files: File[];
}

export default function PostMedia({ files }: PostMediaProps) {
  if (files.length === 0) return null;

  const items = files.map((file) => ({
    url: URL.createObjectURL(file),
    type: file.type.startsWith("video") ? "video" : "image",
  }));

  return (
    // <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
    //   {files.map((file, index) => {
    //     const url = URL.createObjectURL(file);

    //     if (file.type.startsWith("image/")) {
    //       return (
    //         <img
    //           key={index}
    //           src={url}
    //           alt="preview"
    //           style={{ width: "100px", height: "100px", objectFit: "cover" }}
    //         />
    //       );
    //     } else if (file.type.startsWith("video/")) {
    //       return (
    //         <video
    //           key={index}
    //           src={url}
    //           controls
    //           style={{ width: "150px", height: "100px", objectFit: "cover" }}
    //         />
    //       );
    //     } else {
    //       return null;
    //     }
    //   })}
    // </div>
    <Slider items={items} />
  );
}
