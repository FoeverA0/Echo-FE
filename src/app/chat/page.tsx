"use client";

import {Box, Flex, Text, VStack, useColorModeValue} from "@chakra-ui/react";
import {keyframes} from "@emotion/react";
import {useState, useEffect} from "react";
import {ChatInput} from "../../components/ChatInput";
import {useSearchParams} from "next/navigation";
import {searchQuery} from "@/utils/api";
import {useRetrievedLines} from "@/context/RetrievedLinesContext";
import {Suspense} from 'react';
import Loading from "@/components/loading";

// 加载动画定义
const pulse = keyframes`
    0% {
        transform: scale(0.95);
        opacity: 0.6;
    }
    50% {
        transform: scale(1.05);
        opacity: 1;
    }
    100% {
        transform: scale(0.95);
        opacity: 0.6;
    }
`;

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const QueryHandler = ({setQuery}: { setQuery: (query: string | null) => void }) => {
    const searchParams = useSearchParams();
    useEffect(() => {
        const currentQuery = searchParams.get("query");
        setQuery(currentQuery);
    }, [searchParams, setQuery]);
    return null;
};

export default function ChatPage() {
    const [messages, setMessages] = useState<{ user: string; llm: string }[]>([]);
    const [input, setInput] = useState("");
    const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState("phala");
    const {setRetrievedLines} = useRetrievedLines();
    const [hasSentInitialQuery, setHasSentInitialQuery] = useState(false);
    const [query, setQuery] = useState<string | null>(null);
    const inputBg = useColorModeValue("white", "gray.800");

    // 动态颜色值
    const bgColor = useColorModeValue("gray.50", "gray.800");
    const messageBg = useColorModeValue("white", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const aiTextColor = useColorModeValue("gray.700", "gray.100");
    const loadingTextColor = useColorModeValue("gray.500", "gray.400");
    // 禁用页面滚动
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    // 处理初始查询
    useEffect(() => {
        if (query && !hasSentInitialQuery) {
            handleSendMessage(query);
            setHasSentInitialQuery(true);
        }
    }, [query, hasSentInitialQuery]);

    // 发送消息处理
    const handleSendMessage = async (message: string) => {
        if (!message.trim()) return;

        setMessages((prev) => [...prev, {user: message, llm: "Loading..."}]);

        try {
            const response = await searchQuery(message, selectedKnowledgeBase);
            setMessages((prev) => {
                const updatedMessages = [...prev];
                updatedMessages[updatedMessages.length - 1].llm = response.answer;
                return updatedMessages;
            });
            setRetrievedLines(response.retrieved_lines);
        } catch (error) {
            console.error("Error fetching response:", error);
            setMessages((prev) => {
                const updatedMessages = [...prev];
                updatedMessages[updatedMessages.length - 1].llm = "Failed to fetch response. Please try again.";
                return updatedMessages;
            });
        }
    };

    return (
        <Flex
            direction="column"
            height="100vh"
            bg={"white"}
            position="relative"
            overflow="hidden"
        >
            <Suspense fallback={<Loading/>}>
                <QueryHandler setQuery={setQuery}/>
            </Suspense>

            {/* 聊天内容区域 */}
            <VStack
                flex={1}
                overflowY="auto"
                spacing={6}
                p={6}
                pb={{base: 32, md: 28}} // 响应式底部间距
                align="stretch"
                css={{
                    "&::-webkit-scrollbar": {
                        width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                        background: "rgba(0, 0, 0, 0.05)",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "rgba(0, 0, 0, 0.2)",
                        borderRadius: "4px",
                    },
                }}
            >
                {messages.map((message, index) => (
                    <Flex
                        key={index}
                        direction="column"
                        gap={3}
                        px={4}
                        animation={`${fadeIn} 0.3s ease-out`}
                    >
                        {/* 用户消息 */}
                        <Flex justify="flex-end">
                            <Box
                                bgGradient="linear(to-br, blue.400, blue.500)"
                                color="white"
                                px={4}
                                py={3}
                                borderRadius="xl"
                                maxWidth={{base: "90%", md: "55%"}}
                                boxShadow="lg"
                                transition="all 0.2s"
                                _hover={{transform: "translateY(-2px)"}}
                            >
                                <Text fontSize="md" lineHeight="tall" whiteSpace="pre-wrap">
                                    {message.user}
                                </Text>
                            </Box>
                        </Flex>

                        {/* AI回复 */}
                        <Flex justify="flex-start">
                            <Box
                                bg={messageBg}
                                color={aiTextColor}
                                px={4}
                                py={3}
                                borderRadius="xl"
                                maxWidth={{base: "90%", md: "65%"}}
                                boxShadow="md"
                                borderWidth="1px"
                                borderColor={borderColor}
                                position="relative"
                                _before={{
                                    content: '""',
                                    position: "absolute",
                                    left: "-8px",
                                    top: "12px",
                                    width: 0,
                                    height: 0,
                                    borderTop: "8px solid transparent",
                                    borderBottom: "8px solid transparent",
                                    borderRight: `8px solid ${messageBg}`,
                                }}
                            >
                                {message.llm === "Loading..." ? (
                                    <Flex align="center" gap={2}>
                                        <Box
                                            w="12px"
                                            h="12px"
                                            bg="blue.500"
                                            borderRadius="full"
                                            animation={`${pulse} 1.5s infinite`}
                                        />
                                        <Text color={loadingTextColor}>
                                            Generating response...
                                        </Text>
                                    </Flex>
                                ) : (
                                    <Text fontSize="md" lineHeight="tall" whiteSpace="pre-wrap">
                                        {message.llm}
                                    </Text>
                                )}
                            </Box>
                        </Flex>
                    </Flex>
                ))}
            </VStack>

            {/* 输入框区域 - 完美定位方案 */}
            <Box
                position="sticky"
                bottom={10}
                width="full"
                bg={inputBg}
                borderTopWidth="1px"
                borderTopColor={borderColor}
                zIndex={10}
                pt={4}
                pb={{base: 4, md: 6}} // 响应式内边距
                px={{base: 4, md: 6}}
                boxShadow="0 -4px 12px rgba(0, 0, 0, 0.05)"
            >
                <ChatInput
                    input={input}
                    setInput={setInput}
                    selectedKnowledgeBase={selectedKnowledgeBase}
                    setSelectedKnowledgeBase={setSelectedKnowledgeBase}
                    handleSendMessage={() => handleSendMessage(input)}
                />
            </Box>
        </Flex>
    );
}