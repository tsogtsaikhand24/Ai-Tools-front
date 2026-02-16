"use client";

import StarIcon from "@/app/_icons/StarIcon";
import FileIcon from "../_icons/FileIcon";
import ReloadIcon from "../_icons/ReloadIcon";
import { BACK_END_URL } from "../_constants";
import axios from "axios";
import { useEffect, useState } from "react";

export default function IngredientRecognition() {
  const [text, setText] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [thinkingDots, setThinkingDots] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${BACK_END_URL}/ingredients`, {
        text: text,
      });
      setGeneratedText(data.ingredients);
    } catch (err) {
      console.error("Request failed:", err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDisplayedText("");
    if (!generatedText) return;

    let index = 0;
    const interval = setInterval(() => {
      const char = generatedText.charAt(index);
      if (!char) {
        clearInterval(interval);
        return;
      }
      setDisplayedText((prev) => prev + char);
      index++;
    }, 30);

    return () => clearInterval(interval);
  }, [generatedText]);

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
    <div className="flex gap-6 flex-col">
      <div className="gap-2 flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <StarIcon />
            <div className="text-[20px]">Ingredient recognition</div>
          </div>
          <div className="cursor-pointer w-12 h-10 border rounded-md flex justify-center items-center">
            <ReloadIcon />
          </div>
        </div>

        <div className="text-[#71717A]">
          Describe the food, and AI will detect the ingredients.
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Орц тодорхойлох"
          className="w-full py-2 px-3 border rounded-md min-h-31"
        />

        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading || !text.trim()}
            className="py-2 px-3 bg-black text-white rounded-md flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Generate"
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[20px] font-bold">
          <FileIcon />
          <div>Identified Ingredients</div>
        </div>

        <textarea
          disabled
          value={loading ? `Thinking${thinkingDots}` : displayedText}
          placeholder="First, enter your text to recognize ingredients."
          className="w-full py-2 px-3 rounded-md border resize-none min-h-24"
        />
      </div>
    </div>
  );
}
