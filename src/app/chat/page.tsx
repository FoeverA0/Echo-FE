"use client";

import { Box, Button, Flex, Input, Select, Text, VStack, Textarea } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ChatInput } from "../../components/ChatInput";
import { useSearchParams } from "next/navigation";
import { searchQuery } from "@/utils/api";
import { useRetrievedLines } from "@/context/RetrievedLinesContext";
import { Suspense } from 'react'
import Loading from "@/components/loading"; // 引入加载动画组件

const QueryHandler = ({
  setQuery,
}: {
  setQuery: (query: string | null) => void;
}) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentQuery = searchParams.get("query");
    setQuery(currentQuery);
  }, [searchParams, setQuery]);

  return null; // 这个组件只负责处理逻辑，不渲染任何内容
};

export default function ChatPage() {
  const [messages, setMessages] = useState<{ user: string; llm: string }[]>([]);
  const [input, setInput] = useState("");
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState("");
  const { setRetrievedLines } = useRetrievedLines(); // 使用全局状态
  const [hasSentInitialQuery, setHasSentInitialQuery] = useState(false); // 添加状态
  const [query, setQuery] = useState<string | null>(null); // 独立的 query 状态
  useEffect(() => {
    // 禁用页面滚动
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // 清理样式
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (query && !hasSentInitialQuery) {
      handleSendMessage(query);
      setHasSentInitialQuery(true);
    }
  }, [query, hasSentInitialQuery]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // 添加用户消息到聊天记录
    setMessages((prev) => [...prev, { user: message, llm: "Loading..." }]);

    try {
      // 调用后端接口
      const response = await searchQuery(message, selectedKnowledgeBase);

      // 更新 LLM 回复
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1].llm = response.answer;
        return updatedMessages;
      });
      // 更新检索到的行到全局状态
      setRetrievedLines(response.retrieved_lines);
    } catch (error: any) {
      console.error("Error fetching LLM response:", error);
      setMessages((prev) => {
        const updatedMessages = [...prev];
        updatedMessages[updatedMessages.length - 1].llm =
          "Failed to fetch response. Please try again.";
        return updatedMessages;
      });
    }
  };

  return (
    <Flex direction="column" height="100vh" bg="white" overflow="hidden">
      <Suspense fallback={<Loading />}>
        <QueryHandler setQuery={setQuery} />
      </Suspense>
    {/* 聊天内容区域 */}
    <VStack
        flex={1} // 让聊天内容区域占据剩余空间
        overflowY="auto" // 启用垂直滚动
        spacing={4}
        p={4}
        pb={100}
        align="center"
        bg="white"
        // borderBottom="1px solid #E2E8F0"
        maxHeight={"calc(100vh - 230px)"} // 限制最大高度
        width={"100%"} // 设置宽度为 100%
    >
        {messages.map((message, index) => (
        <Flex key={index} direction="column" gap={2} width={"75%"}>
            {/* 用户消息 */}
            <Flex justify="flex-end">
            <Box
                bg="cyan.100"
                color="gray.800"
                px={5}
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
                maxWidth="100%"
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
        handleSendMessage={() => handleSendMessage(input)}
      />
    </Flex>
  );
}