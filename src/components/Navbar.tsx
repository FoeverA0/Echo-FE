"use client";
import React, {useEffect} from "react";
import {
    Box, Flex, VStack, Text, Divider, Icon,
    useColorModeValue, Link, SlideFade, Tooltip
} from "@chakra-ui/react";
import NextLink from "next/link";
import {FiBook, FiUploadCloud, FiFolder, FiChevronRight, FiInfo} from "react-icons/fi";
import WalletButtons from "./WalletButtons";
import {useRouter, usePathname} from "next/navigation";
import {useRetrievedLines} from "@/context/RetrievedLinesContext";
import {useKeylessAccount} from "@/context/KeylessAccountContext";

export const NavBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const {retrievedLines, setRetrievedLines} = useRetrievedLines();
    const {keylessAccount} = useKeylessAccount();
    const MAX_LINES = 5;
    const isChatPage = pathname === "/chat";

    // 颜色模式变量
    const navBg = useColorModeValue("white", "gray.800");
    const menuHoverBg = useColorModeValue("blue.50", "blue.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const brandGradient = useColorModeValue(
        "linear(to-r, blue.600, purple.600)",
        "linear(to-r, blue.300, purple.300)"
    );
    const textColor = useColorModeValue("gray.800", "white");
    const retrievedTextColor = useColorModeValue("gray.700", "gray.200");
    const retrievedBorderColor = useColorModeValue("blue.100", "blue.800");
    const retrievedBoxBg = useColorModeValue("blue.50", "blue.900");
    const linkColor = useColorModeValue("blue.600", "blue.200");
    const linkHoverColor = useColorModeValue("blue.500", "blue.300");
    const scrollbarThumbColor = useColorModeValue('rgba(66,153,225,0.5)', 'rgba(128,90,213,0.5)');
    const metadataColor = useColorModeValue("gray.600", "gray.400");

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

    // 元数据展示组件
    const MetadataItem = ({label, value}) => (
        <Flex align="center" fontSize="xs" color={metadataColor}>
            <Text fontWeight="semibold" mr={1}>{label}:</Text>
            <Tooltip label={value} placement="top" hasArrow>
                <Text
                    fontFamily="monospace"
                    noOfLines={1}
                    cursor="help"
                    _hover={{textDecoration: "underline dotted"}}
                >
                    {value}
                </Text>
            </Tooltip>
        </Flex>
    );

    return (
        <Flex
            as="nav"
            direction="column"
            bg={navBg}
            color={textColor}
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
                _hover={{transform: "scale(1.02)"}}
                transition="transform 0.2s"
            >
                <Flex align="center">
                    <Box
                        width="50px"
                        height="50px"
                        //bgGradient={brandGradient}
                        //borderRadius="lg"
                        p={2}
                        //boxShadow="md"
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
            <VStack align="stretch" spacing={6} flex={1} overflow="hidden">
                {isChatPage ? (
                    <SlideFade in={true} offsetY={20}>
                        <Box>
                            <Flex align="center" mb={4}>
                                <Text fontSize="lg" fontWeight="bold" color={retrievedTextColor}>
                                    📌 Retrieved Context
                                </Text>
                                <Tooltip
                                    label="Verified blockchain metadata"
                                    placement="top"
                                    hasArrow
                                >
                                    <span>
                                        <Icon as={FiInfo} ml={2} boxSize={4} color={metadataColor}/>
                                    </span>
                                </Tooltip>
                            </Flex>
                            <Divider mb={4} borderColor={borderColor}/>
                            <Box
                                overflowY="auto"
                                pr={2}
                                css={{
                                    '&::-webkit-scrollbar': {width: '6px'},
                                    '&::-webkit-scrollbar-track': {bg: 'transparent'},
                                    '&::-webkit-scrollbar-thumb': {
                                        bg: scrollbarThumbColor,
                                        borderRadius: '3px'
                                    }
                                }}
                            >
                                {retrievedLines.slice(0, MAX_LINES).map((line, index) => (
                                    <Link key={index} href={`/nft/0x${line.collection}`} target="_blank"
                                          rel="noopener noreferrer">
                                        <Box
                                            key={index}
                                            mb={4}
                                            p={4}
                                            bg={retrievedBoxBg}
                                            borderRadius="lg"
                                            boxShadow="sm"
                                            border="1px solid"
                                            borderColor={retrievedBorderColor}
                                            _hover={{
                                                transform: "translateY(-2px)",
                                                boxShadow: "md"
                                            }}
                                            transition="all 0.2s"
                                        >
                                            <Text
                                                fontSize="sm"
                                                color={retrievedTextColor}
                                                fontWeight="medium"
                                                mb={3}
                                                noOfLines={4}
                                            >
                                                {line.text}
                                            </Text>

                                            {/* 元数据区块 */}
                                            <VStack spacing={1} align="stretch" mb={3}>
                                                <MetadataItem
                                                    label="Knowledge Avatar"
                                                    value={`0x${line.collection}`}
                                                />
                                                <MetadataItem
                                                    label="Contributor"
                                                    value={`0x${line.contributor_address}`}
                                                />
                                                <MetadataItem
                                                    label="Source ID"
                                                    value={line.source_id}
                                                />
                                            </VStack>

                                            <Flex justify="space-between" align="center">
                                                <Text fontSize="xs" color={linkColor}>
                                                    Similarity: <strong>{line.distance.toFixed(2)}</strong>
                                                </Text>
                                                <Icon as={FiChevronRight} color={linkHoverColor} boxSize={4}/>
                                            </Flex>
                                        </Box>
                                    </Link>
                                ))}
                                {retrievedLines.length > MAX_LINES && (
                                    <Link
                                        fontSize="sm"
                                        color={linkColor}
                                        fontWeight="semibold"
                                        onClick={() => router.push("/details")}
                                        _hover={{textDecoration: "underline"}}
                                        display="flex"
                                    >
                                        View More Results
                                        <Icon as={FiChevronRight} ml={1}/>
                                    </Link>
                                )}
                            </Box>
                        </Box>
                    </SlideFade>
                ) : (
                    <VStack align="stretch" spacing={2} flex={1}>
                        {navItems.map((item, index) => (
                            <NextLink key={index} href={item.href} passHref>
                                <Flex
                                    align="center"
                                    p={3}
                                    borderRadius="lg"
                                    _hover={{bg: menuHoverBg, transform: "translateX(4px)"}}
                                    transition="all 0.2s"
                                    cursor="pointer"
                                >
                                    <Icon as={item.icon} boxSize={5} mr={3} color={retrievedTextColor}/>
                                    <Text fontSize="md" fontWeight="semibold" color={retrievedTextColor}>
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
                <WalletButtons/>
            </Box>
        </Flex>
    );
};