"use client";
import React, { useEffect } from "react";
import {
    Box, Flex, VStack, Text, Divider, Icon,
    useColorModeValue, Link, SlideFade
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FiBook, FiUploadCloud, FiFolder, FiChevronRight } from "react-icons/fi";
import WalletButtons from "./WalletButtons";
import { useRouter, usePathname } from "next/navigation";
import { useRetrievedLines } from "@/context/RetrievedLinesContext";
import { useKeylessAccount } from "@/context/KeylessAccountContext";

export const NavBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { retrievedLines, setRetrievedLines } = useRetrievedLines();
    const { keylessAccount } = useKeylessAccount();
    const MAX_LINES = 5;
    const isChatPage = pathname === "/chat";

    // 颜色模式相关样式
    const navBg = useColorModeValue("white", "gray.800");
    const menuHoverBg = useColorModeValue("blue.50", "blue.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const brandGradient = useColorModeValue(
        "linear(to-r, blue.600, purple.600)",
        "linear(to-r, blue.300, purple.300)"
    );

    useEffect(() => {
        if (!isChatPage) {
            setRetrievedLines([]);
        }
    }, [pathname, isChatPage, setRetrievedLines]);

    // 导航菜单项配置
    const navItems = [
        {
            href: "/knowledgeAvatars",
            label: "Knowledge Avatars",
            icon: FiBook
        },
        {
            href: "/mint",
            label: "Publish Avatar",
            icon: FiUploadCloud
        },
        {
            href: `/portfolio/${keylessAccount?.accountAddress.toString()}`,
            label: "My Portfolio",
            icon: FiFolder
        }
    ];

    return (
        <Flex
            as="nav"
            direction="column"
            bg={navBg}
            color={useColorModeValue("gray.800", "white")}
            px={6}
            py={8}
            position="fixed"
            top={0}
            left={0}
            height="100vh"
            width="280px"
            justifyContent="space-between"
            borderRight="1px solid"
            borderColor={borderColor}
            boxShadow="xl"
            zIndex="sticky"
        >
            {/* Logo 区域 */}
            <Box
                as="button"
                onClick={() => router.push("/")}
                cursor="pointer"
                mb={8}
                position="relative"
                _hover={{ transform: "scale(1.02)" }}
                transition="transform 0.2s"
            >
                <Flex align="center">
                    <Box
                        width="50px"
                        height="50px"
                        bgGradient={brandGradient}
                        borderRadius="lg"
                        p={2}
                        boxShadow="md"
                    >
                        <img
                            src="/echo_logo.PNG"
                            alt="AptKnow Logo"
                            style={{
                                width: "100%",
                                height: "100%",
                                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                            }}
                        />
                    </Box>
                    <Text
                        fontSize="2xl"
                        fontWeight="extrabold"
                        ml={3}
                        bgGradient={brandGradient}
                        bgClip="text"
                    >
                        AptKnow
                    </Text>
                </Flex>
            </Box>

            {/* 主内容区域 */}
            <VStack
                align="stretch"
                spacing={6}
                flex={1}
                overflow="hidden"
            >
                {isChatPage ? (
                    <SlideFade in={true} offsetY={20}>
                        <Box>
                            <Text
                                fontSize="lg"
                                fontWeight="bold"
                                mb={4}
                                color={useColorModeValue("gray.600", "gray.300")}
                            >
                                📌 Retrieved Context
                            </Text>
                            <Divider mb={4} borderColor={borderColor} />
                            <Box
                                overflowY="auto"
                                pr={2}
                                css={{
                                    '&::-webkit-scrollbar': { width: '6px' },
                                    '&::-webkit-scrollbar-track': { bg: 'transparent' },
                                    '&::-webkit-scrollbar-thumb': {
                                        bg: useColorModeValue('rgba(66,153,225,0.5)', 'rgba(128,90,213,0.5)'),
                                        borderRadius: '3px'
                                    }
                                }}
                            >
                                {retrievedLines.slice(0, MAX_LINES).map((line, index) => (
                                    <Box
                                        key={index}
                                        mb={4}
                                        p={4}
                                        bg={useColorModeValue("blue.50", "blue.900")}
                                        borderRadius="lg"
                                        boxShadow="sm"
                                        border="1px solid"
                                        borderColor={useColorModeValue("blue.100", "blue.800")}
                                        _hover={{
                                            transform: "translateY(-2px)",
                                            boxShadow: "md"
                                        }}
                                        transition="all 0.2s"
                                    >
                                        <Text
                                            fontSize="sm"
                                            color={useColorModeValue("gray.700", "gray.200")}
                                            fontWeight="medium"
                                            mb={2}
                                            noOfLines={4}
                                        >
                                            {line.text}
                                        </Text>
                                        <Flex justify="space-between" align="center">
                                            <Text fontSize="xs" color={useColorModeValue("blue.600", "blue.200")}>
                                                Similarity: <strong>{line.distance.toFixed(2)}</strong>
                                            </Text>
                                            <Icon
                                                as={FiChevronRight}
                                                color={useColorModeValue("blue.500", "blue.300")}
                                                boxSize={4}
                                            />
                                        </Flex>
                                    </Box>
                                ))}
                                {retrievedLines.length > MAX_LINES && (
                                    <Link
                                        fontSize="sm"
                                        color={useColorModeValue("blue.600", "blue.200")}
                                        fontWeight="semibold"
                                        onClick={() => router.push("/details")}
                                        _hover={{ textDecoration: "underline" }}
                                        display="flex"
                                        align="center"
                                    >
                                        View More Results
                                        <Icon as={FiChevronRight} ml={1} />
                                    </Link>
                                )}
                            </Box>
                        </Box>
                    </SlideFade>
                ) : (
                    <VStack
                        align="stretch"
                        spacing={2}
                        flex={1}
                    >
                        {navItems.map((item, index) => (
                            <NextLink key={index} href={item.href} passHref>
                                <Flex
                                    align="center"
                                    p={3}
                                    borderRadius="lg"
                                    _hover={{
                                        bg: menuHoverBg,
                                        transform: "translateX(4px)"
                                    }}
                                    transition="all 0.2s"
                                    cursor="pointer"
                                >
                                    <Icon
                                        as={item.icon}
                                        boxSize={5}
                                        mr={3}
                                        color={useColorModeValue("gray.600", "gray.300")}
                                    />
                                    <Text
                                        fontSize="md"
                                        fontWeight="semibold"
                                        color={useColorModeValue("gray.700", "gray.200")}
                                    >
                                        {item.label}
                                    </Text>
                                </Flex>
                            </NextLink>
                        ))}
                    </VStack>
                )}
            </VStack>

            {/* 钱包按钮区域 */}
            <Box mt={8}>
                <WalletButtons />
            </Box>
        </Flex>
    );
};