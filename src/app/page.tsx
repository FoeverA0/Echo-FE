"use client";

import {
    Box,
    Button,
    Flex,
    Heading,
    Select,
    Textarea,
    useColorModeValue,
    useDisclosure,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Modal, Text,
    ButtonGroup,
    VStack,
    Checkbox, Stack, Icon
} from "@chakra-ui/react";
import React, {useState} from "react";
import {AllNfts} from "@/components/AllNfts";
import {useRouter} from "next/navigation";
import {motion} from "framer-motion";
import {FaArrowRight, FaSearch} from "react-icons/fa";
import {keyframes} from "@emotion/react";
import Link from "next/link";
import {FiArrowRight, FiZap} from "react-icons/fi";

// 动画定义
const pulse = keyframes`
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
`;

const MotionBox = motion(Box);

export default function Page() {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const router = useRouter();
    const [question, setQuestion] = useState("");
    const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState("");

    // 颜色模式相关变量
    const brandGradient = useColorModeValue(
        "linear(to-r, blue.600, purple.600)",
        "linear(to-r, blue.300, purple.300)"
    );

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
            p={{base: 4, md: 8}}
            //bg={useColorModeValue("gray.50", "gray.900")}
        >
            <MotionBox
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                w="full"
                maxW="4xl"
            >
                {/* 标题部分 */}
                <Heading
                    mb={8}
                    textAlign="center"
                    fontSize={{base: "3xl", md: "4xl"}}
                    fontWeight="extrabold"
                    bgGradient={brandGradient}
                    bgClip="text"
                >
                    Welcome to AptKnow
                    <Box as="span" display="block" fontSize="xl" mt={2}
                         color={useColorModeValue("gray.600", "gray.400")}>
                        AI-Powered Knowledge Network
                    </Box>
                </Heading>

                {/* 搜索区域 */}
                <MotionBox
                    whileHover={{scale: 1.02}}
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
                            placeholder="Search anything you want..."
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
                                placeholder="Smart Search"
                                value={selectedKnowledgeBase}
                                onChange={(e) => setSelectedKnowledgeBase(e.target.value)}
                                flex={1}
                                border="2px solid"
                                borderColor={borderColor}
                                _hover={{borderColor: focusBorderColor}}
                                _focus={{borderColor: focusBorderColor}}
                            >
                            </Select>
                            <Box
                                mx={4}
                                display="flex"
                                alignItems="center"
                                color="purple.600"
                                fontSize="md"
                                fontWeight="bold"
                                textShadow="0 1px 1px rgba(0,0,0,0.1)"
                                px={3}
                                py={1}
                                borderRadius="md"
                                bg="purple.50"
                            >
                                per search fee: 0.001APT
                            </Box>
                            <Button
                                colorScheme="blue"
                                rightIcon={<FaArrowRight/>}
                                px={8}
                                h="48px"
                                bgGradient="linear(to-r, blue.600, purple.600)"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onOpen();
                                }}
                                _hover={{
                                    animation: `${pulse} 1s ease infinite`,
                                    boxShadow: "2xl"
                                }}
                            >
                                Search
                            </Button>

                            <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
                                <ModalOverlay backdropFilter="blur(5px)" bg="blackAlpha.600"/>
                                <ModalContent
                                    bg="white"
                                    borderRadius="xl"
                                    boxShadow="dark-lg"
                                    mx={4}
                                >
                                    <ModalHeader display="flex" alignItems="center">
                                        <Icon as={FiZap} color="blue.500" boxSize={5} mr={2}/>
                                        <Text fontSize="xl" fontWeight="bold">Instant Access Confirmation</Text>
                                    </ModalHeader>
                                    <ModalCloseButton size="lg"/>

                                    <ModalBody py={4}>
                                        <VStack spacing={5} align="stretch">
                                            {/* 支付金额卡片 */}
                                            <Box
                                                bgGradient="linear(to-r, blue.50, purple.50)"
                                                p={4}
                                                borderRadius="lg"
                                                border="1px solid"
                                                borderColor="blue.100"
                                            >
                                                <Stack spacing={1}>
                                                    <Text fontSize="lg" fontWeight="600">
                                                        One-time payment of <Text as="span" color="blue.600"
                                                                                  fontSize="xl">0.001APT</Text>
                                                    </Text>
                                                    <Text fontSize="sm" color="gray.600">
                                                        You will be charged immediately via your keyless wallet.
                                                    </Text>
                                                </Stack>
                                            </Box>

                                            {/* 记住选择复选框 */}
                                            <Checkbox
                                                colorScheme="blue"
                                                size="md"
                                            >
                                                <Text fontSize="sm">
                                                    Do not show this again for future searches
                                                    <Text as="span" color="gray.500" ml={1}>(payment will
                                                        auto-process)</Text>
                                                </Text>
                                            </Checkbox>
                                        </VStack>
                                    </ModalBody>

                                    <ModalFooter borderTopWidth="1px" pt={5}>
                                        <ButtonGroup spacing={3} w="full">
                                            <Button
                                                flex={1}
                                                variant="outline"
                                                onClick={onClose}
                                                size="lg"
                                            >
                                                Cancel
                                            </Button>
                                            <Link href={`/chat?query=${encodeURIComponent(question)}`} passHref>
                                            <Button
                                                flex={1}
                                                bgGradient="linear(to-r, blue.600, purple.600)"
                                                color="white"
                                                _hover={{
                                                    bgGradient: "linear(to-r, blue.700, purple.700)",
                                                    transform: "translateY(-1px)"
                                                }}
                                                size="lg"
                                                rightIcon={<FiArrowRight/>}
                                            >
                                                Confirm & Continue
                                            </Button>
                                            </Link>
                                        </ButtonGroup>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
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
                    <Box width="100%" mb={6}>
                        <AllNfts limit={6}/>
                    </Box>

                    <Flex justify="center">
                        <Button
                            colorScheme="purple"
                            variant="outline"
                            rightIcon={<FaSearch/>}
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