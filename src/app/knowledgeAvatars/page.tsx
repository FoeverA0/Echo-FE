"use client";

import {
    Flex, Heading, Button, SlideFade, Text,
    HStack, useBreakpointValue, useColorModeValue
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { ListedNfts } from "@/components/ListedNfts";
import { AllNfts } from "@/components/AllNfts";

const MotionBox = motion(Flex);

export default function Page() {
    const [radioValue, setRadioValue] = useState<"All Knowledge" | "Knowledge Listings">("All Knowledge");
    const brandColor = useColorModeValue("blue.600", "blue.200");
    const activeBorderColor = useColorModeValue("blue.500", "blue.300");
    const buttonHoverBg = useColorModeValue("gray.100", "gray.700");

    // 响应式布局配置
    const stackDirection = useBreakpointValue({ base: "column", md: "row" }) as "row";

    return (
        <Flex
            direction="column"
            minH="100vh"
            p={{ base: 4, md: 8 }}
            //bg={useColorModeValue("gray.50", "gray.900")}
        >
            {/* 标题部分 */}
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                textAlign="center"
                mb={8}
                direction="column" // 设置为 column 以实现垂直排列
                alignItems="center" // 使子元素水平居中
            >
                <Heading
                    fontSize={{ base: "3xl", md: "4xl" }}
                    fontWeight="extrabold"
                    bgGradient={`linear(to-r, ${brandColor}, ${useColorModeValue("purple.600", "purple.300")})`}
                    bgClip="text"
                    lineHeight={1.2}
                >
                    Discover Knowledge Avatars
                </Heading>
                <Text
                    mt={4}
                    fontSize="lg"
                    color={useColorModeValue("gray.600", "gray.400")}
                    maxW="2xl"
                    mx="auto"
                >
                    Explore unique AI-powered knowledge NFTs and their marketplace listings
                </Text>
            </MotionBox>

            {/* 优化后的选项卡样式 */}
            <HStack
                justify="center"
                mb={8}
                spacing={4}
                borderBottom="2px solid"
                borderColor={useColorModeValue("gray.200", "gray.700")}
            >
                {["All Knowledge", "Knowledge Listings"].map((option) => (
                    <Button
                        key={option}
                        variant="unstyled"
                        px={6}
                        pb={2}
                        borderRadius="none"
                        borderBottom="3px solid"
                        borderColor={radioValue === option ? activeBorderColor : "transparent"}
                        _hover={{
                            color: brandColor,
                            bg: buttonHoverBg
                        }}
                        onClick={() => setRadioValue(option as typeof radioValue)}
                    >
                        {option}
                    </Button>
                ))}
            </HStack>

            {/* 内容区域优化 */}
            <MotionBox
                key={radioValue}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                w="full"
                justify="center"
                direction={stackDirection}
                gap={6}
                wrap="wrap"
            >
                {radioValue === "Knowledge Listings" ? (
                    <ListedNfts
                    />
                ) : (
                    <AllNfts
                    />
                )}
            </MotionBox>
        </Flex>
    );
}
