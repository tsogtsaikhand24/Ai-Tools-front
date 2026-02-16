"use client";

import { useEffect, useState } from "react";
import StarIcon from "@/app/_icons/StarIcon";
import FileIcon from "../_icons/FileIcon";
import ReloadIcon from "../_icons/ReloadIcon";
import TrashIcon from "../_icons/TrashIcon";
import axios from "axios";
import { BACK_END_URL } from "@/app/_constants";

export default function ImageAnalysis() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fullText, setFullText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinkingDots, setThinkingDots] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      setImageUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${BACK_END_URL}/image/analyze`,
        formData
      );
      setFullText(data.data.content);
      setDisplayText("");
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!fullText) return;

    let index = 0;

    const interval = setInterval(() => {
      index++;

      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [fullText]);

  function handleRemoveImage() {
    setImageUrl(null);
    setFile(null);
  }

  const handleReset = () => {
    setImageUrl(null);
    setFile(null);
    setFullText("");
    setDisplayText("");
  };

  useEffect(() => {
    if (!loading) {
      setThinkingDots("");
      return;
    }

    let count = 0;

    const interval = setInterval(() => {
      count = (count + 1) % 4;
      setThinkingDots(".".repeat(count));
    }, 400);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <StarIcon />
          <div className="text-[20px]">Image analysis</div>
        </div>
        <div
          onClick={handleReset}
          className="w-12 h-10 border rounded-md flex justify-center items-center cursor-pointer"
        >
          <ReloadIcon />
        </div>
      </div>

      <div className="text-[#71717A]">
        Upload a food photo, and AI will detect the ingredients.
      </div>

      {imageUrl === null ? (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full py-2 px-3 border rounded-md"
        />
      ) : (
        <div className="p-1 bg-white border border-gray-200 rounded-lg">
          <div
            className="min-w-50 min-h-33.25 rounded-md border bg-center bg-cover flex items-end justify-end p-4 "
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            <div
              onClick={handleRemoveImage}
              className="w-6 h-6 bg-white border rounded-sm flex justify-center items-center cursor-pointer"
            >
              <TrashIcon />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleGenerate}
          disabled={!file || loading}
          className="py-2 px-3 bg-black text-white rounded-md flex items-center justify-center cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Generate"
          )}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[20px] font-bold">
          <FileIcon />
          <div>Here is the summary</div>
        </div>

        <textarea
          disabled
          value={loading ? `Thinking${thinkingDots}` : displayText}
          placeholder="First, enter your image to recognize an ingredients."
          className="w-full py-2 px-3 rounded-md border resize-none min-h-24"
        />
      </div>
    </div>
  );
}
