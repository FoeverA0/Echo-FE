"use client";
import React, { useEffect } from "react";
import {Box, Flex, VStack, Link, Text, Divider} from "@chakra-ui/react";
import NextLink from "next/link";
import WalletButtons from "./WalletButtons";
import {useRouter, usePathname} from "next/navigation";
import { useRetrievedLines } from "@/context/RetrievedLinesContext";
export const NavBar = () => {
    const router = useRouter();
    const pathname = usePathname(); // 获取当前路径
    const { retrievedLines, setRetrievedLines } = useRetrievedLines(); // 获取和设置检索到的行
    const MAX_LINES = 3;
    const isChatPage = pathname === "/chat"; // 判断是否为 chat 页面
      // 清空检索到的行，当路径不为 /chat 时
    useEffect(() => {
        if (!isChatPage) {
        setRetrievedLines([]); // 清空检索到的行
        }
    }, [pathname, isChatPage, setRetrievedLines]);
    return (
        <Flex
            as="nav"
            direction="column" // 垂直排列
            bg="white" // 背景颜色改为白色
            color="gray.800" // 字体颜色改为深灰色
            px={4}
            py={8}
            position="fixed" // 固定在左侧
            top={0}
            left={0}
            height="100vh" // 占满整个视口高度
            width="250px" // 设置导航栏宽度
            justifyContent="space-between"
            borderRight="1px solid #E2E8F0" // 添加右侧灰色边界
            boxShadow="md" // 添加轻微阴影以提升视觉效果
        >

            <VStack align="stretch" spacing={3}>
                <Box
                    as="button"
                    onClick={() => router.push("/")}
                    cursor="pointer"
                    textAlign="left"
                    alignItems="center"
                    display="flex" // 使用 Flex 布局
                >
                    {/* Logo 图片 */}
                    <Box width="40px" height="40px">
                        <img src="/echo_logo.PNG" alt="Echo Logo" style={{width: "100%", height: "100%"}}/>
                    </Box>
                    <Text fontSize="3xl" fontWeight="bold">
                        Echo
                    </Text>
                </Box>
                {/* 如果是 chat 页面，只显示检索到的行 */}
                {isChatPage ? (
                    <Box mt={4}>
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                        Retrieved Lines
                    </Text>
                    <Box mt={4} maxHeight="1000px" overflowY="auto">
                    <Divider mb={2}/>
                    {retrievedLines.slice(0, MAX_LINES).map((line, index) => (
                        <Box
                        key={index}
                        mb={4}
                        p={3}
                        bg="gray.50"
                        borderRadius="md"
                        boxShadow="sm"
                        border="1px solid #E2E8F0"
                        >
                        <Text
                            fontSize="sm"
                            color="gray.700"
                            fontWeight="medium"
                            mb={2}
                            noOfLines={2} // 限制每行显示的最大行数
                        >
                            {line.text}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                            Distance: <strong>{line.distance.toFixed(2)}</strong>
                        </Text>
                        </Box>
                    ))}
                    {retrievedLines.length > MAX_LINES && (
                        <Text
                        fontSize="sm"
                        color="blue.500"
                        cursor="pointer"
                        onClick={() => router.push("/details")}
                        >
                        View More
                        </Text>
                    )}
                    </Box>
                    </Box>
                ) : (
                    // 如果不是 chat 页面，显示完整的导航栏
                    <VStack align="stretch" spacing={3}>
                    <NextLink href="/knowledgeAvatars" passHref>
                        <Text
                        px={4}
                        py={4}
                        rounded="none"
                        fontWeight={"bold"}
                        display="block"
                        width="100%"
                        _hover={{ textDecoration: "none", bg: "gray.100" }}
                        >
                        Knowledge Avatars
                        </Text>
                    </NextLink>
                    <NextLink href="/mint" passHref>
                        <Text
                        px={4}
                        py={4}
                        rounded="none"
                        fontWeight={"bold"}
                        display="block"
                        width="100%"
                        _hover={{ textDecoration: "none", bg: "gray.100" }}
                        >
                        Publish Avatar
                        </Text>
                    </NextLink>
                    <NextLink href="/portfolio" passHref>
                        <Text
                        px={4}
                        py={4}
                        rounded="none"
                        fontWeight={"bold"}
                        display="block"
                        width="100%"
                        _hover={{ textDecoration: "none", bg: "gray.100" }}
                        >
                        My Portfolio
                        </Text>
                    </NextLink>
                    </VStack>
                    
                )}
            </VStack>

            <WalletButtons/>
        </Flex>
    );
};
