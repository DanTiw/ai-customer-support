import React from 'react';
import { SignInButton } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const LandingPage = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">Welcome to Danish's Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center mb-6">
          Get instant answers and assistance with our AI-powered chatbot. Whether you have questions about Headstarter or need general information, we're here to help!
        </p>
        <div className="flex justify-center">
          <img src="/api/placeholder/400/300" alt="Chatbot illustration" className="rounded-lg" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <SignInButton mode="modal">
          <Button size="lg">
            Sign In to Chat
          </Button>
        </SignInButton>
      </CardFooter>
    </Card>
  );
};

export default LandingPage;