'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Maximize2, X, HelpCircle, ThumbsUp, ThumbsDown } from 'lucide-react'

const initialQuestions = [
  "What types of 3D printers do you offer?",
  "How much does a basic 3D printer cost?",
  "Do you provide training for beginners?",
  "What materials can your 3D printers use?",
  "Do you offer customer support?"
]

const botResponses = [
  "Our 3D printers range from entry-level desktop models to industrial-grade machines. We offer FDM, SLA, and SLS technologies to suit various needs.",
  "Our basic 3D printer models start at $299 for hobbyists, while professional-grade printers can range from $2,000 to $10,000+.",
  "Yes, we provide comprehensive training for beginners. This includes online tutorials, live webinars, and in-person workshops at select locations.",
  "Our 3D printers support a wide range of materials including PLA, ABS, PETG, TPU, nylon, and various composite filaments. Some high-end models also work with metal powders.",
  "We offer 24/7 customer support via phone, email, and live chat. Our team of experts is always ready to assist you with any questions or issues."
]

interface Message {
    id: number; // Unique identifier for the message
    sender: string; // Sender of the message
    text: string; // Message text content
    options?: string[]; // Optional: Array of options related to the message
    optionSelected?: boolean; // Optional: Whether an option has been selected
    isHelpful?: boolean; // Optional: Indicates if the message is marked as helpful
    helpfulnessSelected?: boolean; // Optional: Whether helpfulness has been selected
}

export default function Component() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'bot', text: "Welcome to Jone Jones 3D Printers! How can I assist you today?" },
    { id: 2, sender: 'bot', text: "Here are some questions you might be interested in:", options: initialQuestions, optionSelected: false }
  ])
  const [input, setInput] = useState('')

  const handleSend = useCallback((text: string) => {
    if (text.trim()) {
      setMessages(prev => [...prev, { id: prev.length + 1, sender: 'user', text }])
      setInput('')
      
      // Simulated bot response
      setTimeout(() => {
        const responseIndex = Math.floor(Math.random() * botResponses.length)
        setMessages(prev => [
          ...prev, 
          { id: prev.length + 1, sender: 'bot', text: botResponses[responseIndex] },
          { id: prev.length + 2, sender: 'bot', text: "Was this response helpful?", isHelpful: true, helpfulnessSelected: false }
        ])
      }, 1000)
    }
  }, [])

  const handleOptionClick = useCallback((option: string) => {
    setMessages(prev => prev.map(msg => 
      msg.options ? { ...msg, optionSelected: true } : msg
    ))
    handleSend(option)
  }, [handleSend])

  const handleHelpfulResponse = useCallback((isHelpful: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.isHelpful ? { ...msg, helpfulnessSelected: true } : msg
    ));
    const followUpQuestions = isHelpful
      ? [
          "Can you tell me more about the print quality of your 3D printers?",
          "What software is compatible with your 3D printers?",
          "How long does it typically take to print a small object?"
        ]
      : [
          "Can you explain the difference between FDM and SLA printers?",
          "What are the maintenance requirements for your 3D printers?",
          "Do you offer any bundle deals for beginners?"
        ];

    setMessages(prev => [
      ...prev, 
      { id: prev.length + 1, sender: 'user', text: isHelpful ? "Yes, that was helpful" : "No, I need more information" },
      { id: prev.length + 2, sender: 'bot', text: "Here are some follow-up questions:", options: followUpQuestions, optionSelected: false }
    ]);
  }, []);

  useEffect(() => {
    const scrollArea = document.querySelector('.scroll-area')
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }, [messages])

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl h-full max-h-[600px] flex flex-col rounded-lg overflow-hidden bg-white shadow-xl border relative">
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <button className="p-2 rounded hover:bg-gray-100">
            <Maximize2 className="w-5 h-5 text-[#00838f]" />
          </button>
          <button className="p-2 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-[#00838f]" />
          </button>
        </div>
        <ScrollArea className="flex-grow p-4 scroll-area">
          {messages.map((message, index) => (
            <div key={message.id} className="mb-4">
              <div
                className={`p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-[#00838f] text-white ml-auto'
                    : 'bg-gray-200 text-gray-800'
                } ${message.sender === 'user' ? 'max-w-[80%] ml-auto' : 'max-w-[80%]'}`}
              >
                {message.text}
                {message.options && (
                  <div className="mt-2 space-y-2">
                    {message.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="relative">
                        <div className="absolute inset-0 bg-white rounded-lg"></div>
                        <Button
                          variant="outline"
                          className="relative w-full h-fit text-left justify-start bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:text-gray-800 whitespace-normal disabled:opacity-50 disabled:hover:bg-white"
                          onClick={() => handleOptionClick(option)}
                          disabled={index !== messages.length - 1}
                        >
                          {message.id === 2 && <HelpCircle className="mr-2 h-4 w-4 flex-shrink-0" />}
                          <span>{option}</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {message.isHelpful && (
                  <div className="mt-2 space-y-2">
                    <div className="relative">
                      <div className="absolute inset-0 bg-white rounded-lg"></div>
                      <Button
                        variant="outline"
                        className="relative w-full text-left justify-start bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:text-gray-800 whitespace-normal disabled:opacity-50 disabled:hover:bg-white"
                        onClick={() => handleHelpfulResponse(true)}
                        disabled={index !== messages.length - 1}
                      >
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Yes
                      </Button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 bg-white rounded-lg"></div>
                      <Button
                        variant="outline"
                        className="relative w-full text-left justify-start bg-white text-gray-800 border-gray-300 hover:bg-gray-100 hover:text-gray-800 whitespace-normal disabled:opacity-50 disabled:hover:bg-white"
                        onClick={() => handleHelpfulResponse(false)}
                        disabled={index !== messages.length - 1}
                      >
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        No
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
              className="flex-grow bg-white text-gray-800 border-gray-300"
            />
            <Button onClick={() => handleSend(input)} className="bg-[#00838f] text-white hover:bg-[#006064]">
              <Send className="h-4 w-4 mr-2" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}