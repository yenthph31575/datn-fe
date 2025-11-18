'use client';

import { getProductRecommendations } from '@/api/ai-agent/requests';
import StreamText from '@/components/StreamText';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HStack, VStack } from '@/components/utilities';
import { formatNumber } from '@/libs/utils';
import { useMutation } from '@tanstack/react-query';
import { MessageCircle, Send, X } from 'lucide-react';
import React, { useRef, useState } from 'react';

type Message = {
  id: string;
  content: string;
  isUser: boolean;
};

const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', content: 'Xin chào đến với kiddie kingdom shop, bạn cần giúp đỡ gì?', isUser: false },
  ]);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const { mutate, isLoading } = useMutation(getProductRecommendations);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatHistory((prev) => [...prev, prompt]);

    setTimeout(scrollToBottom, 100);
    setPrompt('');

    mutate(
      { prompt, limit: 3, chatHistory },
      {
        onSuccess: ({ responseText, isProductRecommendation, items }) => {
          let newMessage: any;
          const messageId = Date.now().toString();
          setStreamingMessageId(messageId);
          setChatHistory((prev) => [...prev, responseText]);

          if (!isProductRecommendation) {
            newMessage = {
              id: messageId,
              content: responseText,
              isUser: false,
            };
          } else {
            const listProductHtml = items
              .map(
                (item) => `
                <a href="/products/${item.slug}" target="_blank">
                  <div class="flex items-center space-x-2 py-1">
                    <img src="${item.images[0]}" alt="${item.name}" class="h-10 w-10 rounded-md object-cover" />
                    <div>
                      <p class="font-medium">${item.name}</p>
                      <p class="text-xs text-gray-500">${formatNumber(item.currentPrice)} vnđ</p>
                    </div>
                  </div>
                </a>
                <hr/>
              `
              )
              .join('');

            const text = responseText + '<br/><br/>' + listProductHtml;

            newMessage = {
              id: messageId,
              content: text,
              isUser: false,
            };
          }
          setMessages((prev) => [...prev, newMessage]);

          setTimeout(
            () => {
              setStreamingMessageId(null);
              setTimeout(scrollToBottom, 100);
            },
            responseText.length * 10 + 500
          );
        },
        onError: () => {
          setMessages((prev) => [...prev, { id: Date.now().toString(), content: 'Có lỗi xảy ra, vui lòng thử lại!', isUser: false }]);
        },
      }
    );

    // Scroll to bottom after adding user message
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button className="h-12 w-12 rounded-full bg-primary-500 p-1 shadow-lg hover:bg-primary-600" onClick={() => setIsOpen(true)}>
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 rounded-xl border-none p-0 shadow-xl sm:w-96" align="end" side="top" sideOffset={16}>
          <div className="flex h-full max-h-[440px] min-h-[300px] flex-col overflow-hidden rounded-xl text-xs">
            {/* Header */}
            <HStack className="bg-primary-500 p-2 text-white" pos="apart">
              <h3 className="font-semibold">Kiddie Kingdom Chat Bot Với AI</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-white hover:bg-primary-600"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </HStack>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              <VStack spacing={12}>
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-2 ${
                        message.isUser ? 'rounded-tr-none bg-primary-500 text-white' : 'rounded-tl-none border bg-white shadow-sm'
                      }`}
                    >
                      {message.isUser ? (
                        <div dangerouslySetInnerHTML={{ __html: message.content }}></div>
                      ) : (
                        <StreamText
                          className="leading-5"
                          content={message.content}
                          isComplete={streamingMessageId !== message.id}
                          speed={15}
                          htmlMode
                        />
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg rounded-tl-none border bg-white p-3 shadow-sm">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: '0ms' }}></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: '150ms' }}></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </VStack>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t bg-white p-3">
              <HStack spacing={8}>
                <div className="flex-1">
                  <Input
                    ref={inputRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Hỏi tôi bất kỳ điều gì..."
                    className="h-9 flex-1"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
                <Button type="submit" size="icon" className="h-9 w-9 rounded-full" disabled={isLoading || !prompt.trim()}>
                  <Send className="h-5 w-5" />
                </Button>
              </HStack>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AIChatAssistant;
