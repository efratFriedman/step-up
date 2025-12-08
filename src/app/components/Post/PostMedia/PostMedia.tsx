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
    <Slider items={items} />
  );
}
