'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const HeadstarterChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
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
    <Card className="w-full  mx-auto my-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Danish's Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4" ref={scrollAreaRef}>
          
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              ref={index === messages.length - 1 ? latestMessageRef : null}
            >
              <div className={`flex items-start ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{message.role === 'user' ? 'U' : 'H'}</AvatarFallback>
                </Avatar>
                <div className={`mx-2 p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex items-center bg-gray-200 p-3 rounded-lg">
                <div className="dot-flashing"></div>
              </div>
            </div>
          )}
          <div ref={latestMessageRef} /> {/* Empty div for scrolling when a new message is being typed */}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Ask about Headstarter..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} disabled={isLoading}>Send</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default HeadstarterChatbot;