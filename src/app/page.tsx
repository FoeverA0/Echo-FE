"use client";

import { Box, Button, Flex, Heading, Select, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { AllNfts } from "@/components/AllNfts";
import { useRouter } from "next/navigation";
import { ChatInput } from "@/components/ChatInput";
export default function Page() {
  const [question, setQuestion] = useState("");
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState("");
  const router = useRouter();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 阻止默认的换行行为
      if (question.trim()) {
        // 跳转到 /chat 页面并传递查询内容
        router.push(`/chat?query=${encodeURIComponent(question)}`);
      }
    }
  };
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bg="white" // 设置背景为白色
      color="gray.800" // 设置字体颜色为深灰色
      p={4}
    >
      {/* 欢迎词 */}
      <Heading mb={6} textAlign="center" color="gray.800">
        Welcome to AptKnow Knowledge Network
      </Heading>

      {/* 输入框和选择框 */}
      <Box
        borderRadius="lg"
        boxShadow="lg"
        width="100%"
        maxWidth="800px"
        p={4}
        mb={6}
        bg="gray.50" // 设置输入框背景为浅灰色
      >
        <Textarea
          placeholder="Start asking questions here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          size="md"
          bg="white" // 输入框背景为白色
          color="gray.800" // 输入框字体颜色为深灰色
          border="1px solid gray.300" // 边框颜色为浅灰色
          resize="none"
          _focus={{ outline: "none", border: "1px solid cyan.400" }}
          mb={4}
        />
        <Select
          placeholder="Select a knowledge base"
          value={selectedKnowledgeBase}
          onChange={(e) => setSelectedKnowledgeBase(e.target.value)}
          bg="white" // 选择框背景为白色
          borderColor="gray.300" // 边框颜色为浅灰色
          color="gray.800" // 字体颜色为深灰色
          _hover={{ borderColor: "cyan.500" }}
          size="md"
        >
          <option value="knowledge-base-1">Phala</option>
        </Select>
      </Box>
      <Box width="100%" mb={4}>
        <Heading as="h2" size="md" color="gray.600" fontWeight="semibold" textAlign="left">
          Knowledge Avatars
        </Heading>
      </Box>
      {/* NFT 显示组件 */}
      <Box width="100%"  mb={6}>
        <AllNfts limit={6} />
      </Box>

      {/* 查看全部按钮 */}
      <Button
        colorScheme="cyan"
        onClick={() => router.push("/knowledgeAvatars")}
        bg="gray.800" // 按钮背景颜色
        color="white" // 按钮字体颜色
        _hover={{ bg: "cyan.600" }} // 按钮悬停效果
      >
        See all
      </Button>
    </Flex>
  );
}