"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Select,
  Textarea,
  useColorModeValue,
  Grid
} from "@chakra-ui/react";
import { useState } from "react";
import { AllNfts } from "@/components/AllNfts";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import {keyframes} from "@emotion/react";

// 动画定义
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const MotionBox = motion(Box);

export default function Page() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState("");

  // 颜色模式相关变量
  const brandGradient = useColorModeValue(
      "linear(to-r, blue.600, purple.600)",
      "linear(to-r, blue.300, purple.300)"
  );
  const inputBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const focusBorderColor = useColorModeValue("blue.500", "blue.300");
  const cardBg = useColorModeValue("white", "gray.700");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (question.trim()) {
        router.push(`/chat?query=${encodeURIComponent(question)}`);
      }
    }
  };

  return (
      <Flex
          direction="column"
          align="center"
          minH="100vh"
          p={{ base: 4, md: 8 }}
          bg={useColorModeValue("gray.50", "gray.900")}
      >
        <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            w="full"
            maxW="4xl"
        >
          {/* 标题部分 */}
          <Heading
              mb={8}
              textAlign="center"
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="extrabold"
              bgGradient={brandGradient}
              bgClip="text"
          >
            Welcome to AptKnow
            <Box as="span" display="block" fontSize="xl" mt={2} color={useColorModeValue("gray.600", "gray.400")}>
              AI-Powered Knowledge Network
            </Box>
          </Heading>

          {/* 搜索区域 */}
          <MotionBox
              whileHover={{ scale: 1.02 }}
              mb={12}
              w="full"
          >
            <Box
                borderRadius="2xl"
                boxShadow="xl"
                p={6}
                bg={cardBg}
            >
              <Textarea
                  placeholder="Ask anything about Web3 knowledge..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleKeyDown}
                  minH="120px"
                  fontSize="lg"
                  border="2px solid"
                  borderColor={borderColor}
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: `0 0 0 3px ${focusBorderColor}30`
                  }}
                  resize="none"
                  mb={4}
              />
              <Flex gap={4} align="center">
                <Select
                    placeholder="Select Knowledge Base"
                    value={selectedKnowledgeBase}
                    onChange={(e) => setSelectedKnowledgeBase(e.target.value)}
                    flex={1}
                    border="2px solid"
                    borderColor={borderColor}
                    _hover={{ borderColor: focusBorderColor }}
                    _focus={{ borderColor: focusBorderColor }}
                >
                  <option value="knowledge-base-1">Phala Network</option>
                  <option value="knowledge-base-2">Aptos Ecosystem</option>
                </Select>
                <Button
                    colorScheme="blue"
                    rightIcon={<FaArrowRight />}
                    px={8}
                    h="48px"
                    onClick={() => question.trim() && router.push(`/chat?query=${encodeURIComponent(question)}`)}
                    _hover={{
                      animation: `${pulse} 1s ease infinite`,
                      boxShadow: "2xl"
                    }}
                >
                  Search
                </Button>
              </Flex>
            </Box>
          </MotionBox>

          {/* 知识头像部分 */}
          <Box w="full">
            <Heading
                as="h2"
                size="lg"
                mb={6}
                color={useColorModeValue("gray.700", "gray.300")}
            >
              Featured Knowledge Avatars
            </Heading>

            {/* NFT 显示组件 */}
            <Box width="100%"  mb={6}>
              <AllNfts limit={6} />
            </Box>

            <Flex justify="center">
              <Button
                  colorScheme="purple"
                  variant="outline"
                  rightIcon={<FaSearch />}
                  onClick={() => router.push("/knowledgeAvatars")}
                  size="lg"
                  borderWidth="2px"
                  _hover={{
                    bg: useColorModeValue("purple.50", "purple.900"),
                    transform: "translateY(-2px)"
                  }}
              >
                Explore All Avatars
              </Button>
            </Flex>
          </Box>
        </MotionBox>
      </Flex>
  );
}