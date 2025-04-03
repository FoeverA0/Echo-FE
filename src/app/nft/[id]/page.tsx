"use client";
import { useParams } from "next/navigation";
import {
    Box, Text, Image, Button, VStack, Grid, GridItem, Tabs,
    TabList, Tab, TabPanels, TabPanel, Badge, Tag, Avatar,
    Divider, HStack, Icon, Flex, useColorModeValue
} from "@chakra-ui/react";
import { FaEthereum, FaClock, FaFileContract, FaShare } from "react-icons/fa";
import Loading from "@/components/loading";
import { useGetNftsByAddress } from "@/hooks/useGetNftsByAddress";
import { BASE_PATH, bodies, ears, faces } from "@/utils/constants";
import { useEffect, useState } from "react";

const NftDetails = () => {
    // Hooks必须放在最顶部
    const bgGradient = useColorModeValue(
        "linear(to-r, blue.50, purple.50)",
        "linear(to-r, gray.800, purple.900)"
    );
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const { nft } = useGetNftsByAddress(id || "");
    const [price, setNftPrice] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const storedNftPrice = localStorage.getItem(`nftPrice_${id}`);
            if (storedNftPrice) {
                setNftPrice(storedNftPrice);
            }
        }
    }, [id]);

    if (!id || !nft) {
        return <Loading />;
    }

    const bodyUrl = BASE_PATH + bodies[nft.body];
    const earUrl = BASE_PATH + ears[nft.ear];
    const faceUrl = BASE_PATH + faces[nft.face];

    // 修复图片显示问题
    const aptogotchiImage = (
        <Box
            position="relative"
            w="300px"
            h="300px"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="xl"
            transition="transform 0.3s ease"
            _hover={{ transform: "rotate(-2deg) scale(1.02)" }}
        >
            {/* 动画背景层 */}
            <Box
                position="absolute"
                inset={0}
                bgGradient="radial(blue.100 10%, transparent 80%)"
                opacity={0.3}
                _hover={{ opacity: 0.5 }}
                transition="opacity 0.3s"
                zIndex={0}
            />

            {/* 身体部位图片（调整zIndex层级） */}
            <Box position="absolute" top="0" left="0" w="100%" h="100%" zIndex={1}>
                <Image src={bodyUrl} alt="pet body" objectFit="contain" w="100%" h="100%" />
            </Box>
            <Box position="absolute" top="0" left="0" w="100%" h="100%" zIndex={2}>
                <Image src={faceUrl} alt="pet face" objectFit="contain" w="100%" h="100%" />
            </Box>
            <Box position="absolute" top="0" left="0" w="100%" h="100%" zIndex={3}>
                <Image src={earUrl} alt="pet ears" objectFit="contain" w="100%" h="100%" />
            </Box>
        </Box>
    );

    return (
        <Box p={8} bg={bgGradient} minH="100vh">
            <Grid
                templateColumns={{ base: "1fr", md: "1.2fr 0.8fr" }}
                gap={8}
                maxW="1400px"
                mx="auto"
            >
                {/* 左侧内容区 */}
                <GridItem>
                    <VStack spacing={8} align="stretch">
                        {/* 主展示区 */}
                        <Box
                            bg="white"
                            borderRadius="2xl"
                            p={8}
                            boxShadow="xl"
                            position="relative"
                            _before={{
                                content: '""',
                                position: "absolute",
                                top: -4,
                                left: -4,
                                right: -4,
                                bottom: -4,
                                bg: "whiteAlpha.400",
                                borderRadius: "2xl",
                                zIndex: -1,
                                filter: "blur(20px)"
                            }}
                        >
                            <Flex justify="space-between" align="flex-start" mb={6}>
                                <Box>
                                    <Text fontSize="4xl" fontWeight="900" lineHeight={1}>
                                        {nft.name}
                                    </Text>
                                    <HStack mt={2} spacing={3}>
                                        <Tag colorScheme="purple" borderRadius="full">APTOS</Tag>
                                        <Badge colorScheme="green" variant="subtle" px={3} py={1}>
                                            {price ? "ON SALE" : "NOT LISTED"}
                                        </Badge>
                                    </HStack>
                                </Box>
                            </Flex>

                            {aptogotchiImage}

                            <Box mt={4}>
                                <Text fontSize="sm" color="gray.500">Owner Address</Text>
                                <Text
                                    fontFamily="monospace"
                                    fontSize="md"
                                    color="gray.700"
                                    bg="gray.50"
                                    p={2}
                                    borderRadius="md"
                                    mt={1}
                                >
                                    {nft.owner}
                                </Text>
                            </Box>

                            <HStack mt={6} spacing={4}>
                                <Button
                                    leftIcon={<Icon as={FaShare} />}
                                    variant="outline"
                                    colorScheme="blue"
                                    px={8}
                                    borderRadius="full"
                                >
                                    Share
                                </Button>
                                <Button
                                    leftIcon={<Icon as={FaFileContract} />}
                                    variant="outline"
                                    colorScheme="purple"
                                    px={8}
                                    borderRadius="full"
                                >
                                    View Contract
                                </Button>

                            </HStack>
                        </Box>

                        {/* 信息标签页 */}
                        <Tabs
                            variant="soft-rounded"
                            colorScheme="purple"
                            isLazy
                            borderRadius="xl"
                            bg="white"
                            boxShadow="md"
                        >
                            <TabList px={6} pt={6}>
                                <Tab _selected={{ bg: "purple.100", color: "purple.600" }}>Details</Tab>
                                <Tab _selected={{ bg: "blue.100", color: "blue.600" }}>History</Tab>
                                <Tab _selected={{ bg: "pink.100", color: "pink.600" }}>Documents</Tab>
                            </TabList>

                            <TabPanels p={6}>
                                <TabPanel>
                                    <Text fontSize="xl" fontWeight="600" mb={4}>
                                        🎨 About
                                    </Text>
                                    <Text
                                        fontSize="lg"
                                        color="gray.600"
                                        lineHeight="tall"
                                        whiteSpace="pre-line"
                                    >
                                        {nft.description || "No description available"}
                                    </Text>
                                </TabPanel>

                                <TabPanel>
                                    <VStack align="stretch" spacing={4}>
                                        {nft.change_log.map((log, index) => (
                                            <Box
                                                key={index}
                                                p={4}
                                                bg="gray.50"
                                                borderRadius="lg"
                                                borderLeft="4px solid"
                                                borderColor={
                                                    log.action === 1 ? "green.400" :
                                                        log.action === 2 ? "red.400" : "gray.400"
                                                }
                                            >
                                                <Flex justify="space-between">
                                                    <Box>
                                                        <Text fontWeight="600">
                                                            {log.action === 1 ? "Document Added" : "Document Removed"}
                                                        </Text>
                                                        <Text fontSize="sm" color="gray.500">
                                                            {log.doc_info.name}
                                                        </Text>
                                                    </Box>
                                                    <HStack spacing={3}>
                                                        <Icon as={FaClock} color="gray.400" />
                                                        <Text fontSize="sm" color="gray.500">
                                                            {new Date(log.timestamp * 1000).toLocaleDateString()}
                                                        </Text>
                                                    </HStack>
                                                </Flex>
                                            </Box>
                                        ))}
                                    </VStack>
                                </TabPanel>

                                <TabPanel>
                                    <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
                                        {nft.documents.map((doc, index) => (
                                            <Box
                                                key={index}
                                                p={4}
                                                bg="gray.50"
                                                borderRadius="lg"
                                                _hover={{ transform: "translateY(-2px)" }}
                                                transition="all 0.2s"
                                            >
                                                <Text fontWeight="600">{doc.name}</Text>
                                                <HStack mt={2} spacing={2}>
                                                    <Tag colorScheme="blue" size="sm">{doc.size} bytes</Tag>
                                                    <Tag colorScheme="gray" size="sm">{doc.hash.slice(0, 6)}...</Tag>
                                                </HStack>
                                            </Box>
                                        ))}
                                    </Grid>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </VStack>
                </GridItem>

                {/* 右侧操作区 - 修复宽度问题 */}
                <GridItem>
                    <VStack spacing={6} position="sticky" top="6" width="100%">
                        {/* 价格区块 */}
                        <Box
                            width="100%"
                            bg="white"
                            p={6}
                            borderRadius="2xl"
                            boxShadow="xl"
                            border="1px solid"
                            borderColor={borderColor}
                        >
                            <VStack spacing={5}>
                                <HStack w="100%" justify="space-between">
                                    <Text fontSize="lg" color="gray.500">Current Price</Text>
                                </HStack>

                                <Text
                                    fontSize="3xl"
                                    fontWeight="900"
                                    bgGradient="linear(to-r, blue.500, purple.600)"
                                    bgClip="text"
                                >
                                    {price || "—"} APT
                                </Text>

                                <VStack w="100%" spacing={3}>
                                    <Button
                                        colorScheme="purple"
                                        size="lg"
                                        w="100%"
                                        borderRadius="full"
                                        height="60px"
                                        fontSize="xl"
                                        boxShadow="0px 8px 24px -6px rgba(128, 90, 213, 0.4)"
                                        _hover={{ transform: "translateY(-2px)" }}
                                        _active={{ transform: "none" }}
                                    >
                                        Buy Now
                                    </Button>

                                    <Button
                                        variant="outline"
                                        colorScheme="blue"
                                        size="lg"
                                        w="100%"
                                        borderRadius="full"
                                        height="50px"
                                    >
                                        Make Offer
                                    </Button>
                                </VStack>

                                <Divider my={4} />

                                <VStack align="start" w="100%">
                                    <HStack justify="space-between" w="100%">
                                        <Text color="gray.500">Creator Royalties</Text>
                                        <Text fontWeight="600">5%</Text>
                                    </HStack>
                                    <HStack justify="space-between" w="100%">
                                        <Text color="gray.500">Last Sale</Text>
                                        <Text fontWeight="600">—</Text>
                                    </HStack>
                                </VStack>
                            </VStack>
                        </Box>

                        {/* 白名单区块 */}
                        <Box
                            width="100%"
                            bg="white"
                            p={6}
                            borderRadius="2xl"
                            boxShadow="xl"
                        >
                            <Text fontSize="xl" fontWeight="700" mb={4}>
                                🛡️ Whitelist Access
                            </Text>

                            {nft.whitelist.length > 0 ? (
                                <VStack
                                    align="stretch"
                                    spacing={3}
                                    maxH="400px"
                                    overflowY="auto"
                                    pr={2}
                                    css={{
                                        '&::-webkit-scrollbar': { width: '6px' },
                                        '&::-webkit-scrollbar-track': { bg: 'transparent' },
                                        '&::-webkit-scrollbar-thumb': {
                                            bg: 'rgba(128, 90, 213, 0.4)',
                                            borderRadius: '3px'
                                        }
                                    }}
                                >
                                    {nft.whitelist.map((address, index) => (
                                        <HStack
                                            key={index}
                                            p={3}
                                            bg="gray.50"
                                            borderRadius="lg"
                                            justify="space-between"
                                        >
                                            <Text
                                                fontFamily="monospace"
                                                fontSize="sm"
                                                color="gray.600"
                                            >
                                                {address.slice(0, 6)}...{address.slice(-4)}
                                            </Text>
                                            <Tag colorScheme="green" size="sm">Verified</Tag>
                                        </HStack>
                                    ))}
                                </VStack>
                            ) : (
                                <Box
                                    p={6}
                                    bg="gray.50"
                                    borderRadius="lg"
                                    textAlign="center"
                                >
                                    <Text color="gray.500" fontStyle="italic">
                                        No whitelist restrictions
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    </VStack>
                </GridItem>
            </Grid>
        </Box>
    );
};

export default NftDetails;