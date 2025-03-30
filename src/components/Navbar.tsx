"use client";
import React from "react";
import {Box, Flex, VStack, Link, Text} from "@chakra-ui/react";
import NextLink from "next/link";
import WalletButtons from "./WalletButtons";
import {useRouter} from "next/navigation";

export const NavBar = () => {
    const router = useRouter();
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
                <NextLink href="/knowledgeAvatars" passHref>
                    <Link
                        px={4}
                        py={4}
                        rounded="none"
                        fontWeight={"bold"}
                        display="block"
                        width="100%"
                        _hover={{textDecoration: "none", bg: "gray.100"}}
                    >
                        Knowledge Avators
                    </Link>
                </NextLink>
                <NextLink href="/mint" passHref>
                    <Link
                        px={4}
                        py={4}
                        rounded="none"
                        fontWeight={"bold"}
                        display="block"
                        width="100%"
                        _hover={{textDecoration: "none", bg: "gray.100"}}
                    >
                        Publish Avator
                    </Link>
                </NextLink>
                <NextLink href="/portfolio" passHref>
                    <Link
                        px={4}
                        py={4}
                        rounded="none"
                        fontWeight={"bold"}
                        display="block"
                        width="100%"
                        _hover={{textDecoration: "none", bg: "gray.100"}}
                    >
                        My Portfolio
                    </Link>
                </NextLink>
            </VStack>
            <WalletButtons/>
        </Flex>
    );
};
