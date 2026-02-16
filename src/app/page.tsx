"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageAnalysis from "./_components/ImageAnalysis";
import IngredientRecognition from "./_components/IngredientRecognition";
import ImageCreator from "./_components/ImageCreator";
import MessageIcon from "./_icons/MessageIcon";
import { useState } from "react";
import ChatBot from "./_components/ChatBot";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);

  const toggleChat = () => setChatOpen(!chatOpen);
  return (
    <div className="relative">
      <div className="text-black font-sans text-[16px] font-bold py-4 px-12 flex justify-start flex-col border border-gray-500">
        AI tools
      </div>
      <div className="bg-white flex items-center flex-col">
        <Tabs defaultValue="analysis" className="w-145 flex py-6 gap-6">
          <TabsList>
            <TabsTrigger value="analysis" className="cursor-pointer">
              Image analysis
            </TabsTrigger>
            <TabsTrigger value="recognition" className="cursor-pointer">
              Ingredient recognition
            </TabsTrigger>
            <TabsTrigger value="creator" className="cursor-pointer">
              Image creator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <ImageAnalysis />
          </TabsContent>

          <TabsContent value="recognition">
            <IngredientRecognition />
          </TabsContent>

          <TabsContent value="creator">
            <ImageCreator />
          </TabsContent>
        </Tabs>
      </div>
      <div
        onClick={toggleChat}
        className="fixed bottom-20 right-20 cursor-pointer"
      >
        <MessageIcon />
      </div>
      {chatOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setChatOpen(false)}
          />

          <div
            className="fixed bottom-20 right-20 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <ChatBot onClose={() => setChatOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
