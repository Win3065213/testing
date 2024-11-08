"use client";
import React, { useState, useCallback, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"

const randomResponses = [
  "That's an interesting question about our 3D printers!",
  "I'd be happy to provide more information about our product line.",
  "Our 3D printers are known for their high quality and reliability.",
  "We offer a range of 3D printers suitable for both beginners and professionals.",
  "Jone Jones 3D Printers are at the forefront of additive manufacturing technology.",
  "Our customer support team is always ready to assist with any queries.",
  "We have models that are perfect for home use and others for industrial applications.",
  "3D printing opens up a world of creative possibilities!",
  "Our printers come with user-friendly software for easy operation.",
  "We offer comprehensive training and support for all our 3D printer models."
]

const multipleChoiceOptions = [
  "Tell me about your most popular 3D printer model.",
  "What materials can your 3D printers use?",
  "Do you offer any discounts for educational institutions?",
  "Can you explain the difference between FDM and SLA printers?",
  "What kind of customer support do you provide?"
]

export default function Component() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Welcome to Jone Jones 3D Printers! How can I assist you today?" },
    { id: 2, sender: 'user', text: "Hi, I'm interested in your 3D printers." },
  ])
  const [input, setInput] = useState('')
  const [showOptions, setShowOptions] = useState(false)

  const getRandomResponses = useCallback(() => {
    const shuffled = [...randomResponses].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 2)
  }, [])

  const getRandomOptions = useCallback(() => {
    const shuffled = [...multipleChoiceOptions].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  }, [])

  const handleSend = useCallback((text: string) => {
    if (text.trim()) {
      setMessages(prev => [...prev, { id: prev.length + 1, sender: 'user', text }])
      setInput('')
      setShowOptions(false)
      
      // Send 2 random messages and then show options
      getRandomResponses().forEach((response, index) => {
        setTimeout(() => {
          setMessages(prev => [...prev, { id: prev.length + 1, sender: 'bot', text: response }])
          if (index === 1) {
            setShowOptions(true)
          }
        }, (index + 1) * 1000) // Stagger responses by 1 second each
      })
    }
  }, [getRandomResponses])

  const handleOptionClick = useCallback((option: string) => {
    handleSend(option)
  }, [handleSend])

  useEffect(() => {
    const scrollArea = document.querySelector('.scroll-area')
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }, [messages])

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl h-full max-h-[600px] flex flex-col rounded-lg overflow-hidden bg-white shadow-xl">
        <div className="bg-blue-600 text-white p-4">
          <h1 className="text-xl font-bold">Jone Jones 3D Printers Chat</h1>
        </div>
        <ScrollArea className="flex-grow p-4 scroll-area bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800 border border-gray-300'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {showOptions && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Choose an option or type your own question:</p>
              {getRandomOptions().map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 w-full text-left justify-start bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-4 bg-gray-100 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
              className="flex-grow bg-white text-gray-800 border-gray-300"
            />
            <Button onClick={() => handleSend(input)} className="bg-blue-500 text-white hover:bg-blue-600">
              <Send className="h-4 w-4 mr-2" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}