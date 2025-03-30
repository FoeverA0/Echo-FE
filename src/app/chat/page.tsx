"use client";

import { Box, Button, Flex, Input, Select, Text, VStack, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { ChatInput } from "../../components/ChatInput";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ user: string; llm: string }[]>([]);
  const [input, setInput] = useState("");
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState("");
  const [inputHeight, setInputHeight] = useState(60); // 初始高度为 60px

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // 模拟 LLM 回复
    const llmResponse = `这是对 "${input}" 的回复。`;
    
    // 更新消息列表
    setMessages((prev) => [...prev, { user: input, llm: llmResponse }]);

    // 清空输入框
    setInput("");
  };

  return (
    <Flex direction="column" height="100vh" bg="gray.50">
    {/* 聊天内容区域 */}
    <VStack
        flex={1} // 让聊天内容区域占据剩余空间
        overflowY="auto" // 启用垂直滚动
        spacing={4}
        p={4}
        align="stretch"
        bg="white"
        borderBottom="1px solid #E2E8F0"
    >
        {messages.map((message, index) => (
        <Flex key={index} direction="column" gap={2}>
            {/* 用户消息 */}
            <Flex justify="flex-end">
            <Box
                bg="cyan.100"
                color="gray.800"
                px={4}
                py={2}
                borderRadius="md"
                maxWidth="70%"
                textAlign="right"
            >
                {message.user}
            </Box>
            </Flex>
            {/* LLM 回复 */}
            <Flex justify="flex-start">
            <Box
                bg="gray.100"
                color="gray.800"
                px={4}
                py={2}
                borderRadius="md"
                maxWidth="70%"
                textAlign="left"
            >
                {message.llm}
            </Box>
            </Flex>
        </Flex>
        ))}
    </VStack>

    {/* 输入框区域 */}
    <ChatInput
        input={input}
        setInput={setInput}
        selectedKnowledgeBase={selectedKnowledgeBase}
        setSelectedKnowledgeBase={setSelectedKnowledgeBase}
        handleSendMessage={handleSendMessage}
      />
    </Flex>
  );
}