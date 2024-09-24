"use client"
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useTheme } from "next-themes";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const validAssistantNames = [
  "assistant",
  "coding",
  "qna",
  "fitness",
  "nutrition",
  "healthnwellness",
  "emotion"
];

/**
 * Component for rendering a chatbot page.
 */
const HeadstarterChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  const params = useSearchParams();
  const assistantName = params.get("assistantName") || "assistant";
  const { theme } = useTheme();

  useEffect(() => {
    if (!validAssistantNames.includes(assistantName)) {
      notFound();
    }
  }, [assistantName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
//sending the message to the chatbot
  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`api/chat?assistantName=${assistantName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: "user", content: input }]),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let botMessage: Message = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, botMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        botMessage.content += chunk;
        setMessages(prev => [...prev.slice(0, -1), { ...botMessage }]);
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl dark:bg-gray-800 dark:text-white">
      <CardContent>
        <ScrollArea className="h-[500px] pt-4 overflow-y-auto" ref={scrollAreaRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}
              ref={index === messages.length - 1 ? latestMessageRef : null}
            >
              <div className={`flex items-start ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{message.role === 'user' ? 'U' : 'A'}</AvatarFallback>
                </Avatar>
                <div className={`mx-2 p-3 rounded-lg transition-all duration-300 ease-in-out ${message.role === 'user' ? 'bg-blue-500 text-white dark:bg-blue-600' : 'bg-gray-200 text-black dark:bg-gray-700 dark:text-white'
                  } hover:shadow-md`}>
                  <p className="whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4 animate-pulse">
              <div className="flex items-center bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                <div className="dot-flashing"></div>
              </div>
            </div>
          )}
          <div ref={latestMessageRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t dark:border-gray-700">
        <div className="flex w-full items-center space-x-2 mt-4">
          <Input
            type="text"
            placeholder="Ask about Customer Support..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-grow transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading}
            className="transition-all duration-300 ease-in-out bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Send
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default HeadstarterChatbot;