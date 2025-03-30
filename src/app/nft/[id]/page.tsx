"use client";
import {useParams} from "next/navigation";
import {Box, Text, Image, Button, VStack, Grid, GridItem} from "@chakra-ui/react";
import Loading from "@/components/loading";
import {useGetNftsByAddress} from "@/hooks/useGetNftsByAddress";
import {BASE_PATH, bodies, ears, faces} from "@/utils/constants";
import {useEffect, useState} from "react";

const NftDetails = () => {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const {nft, loading} = useGetNftsByAddress(id || "");
    const [price, setNftPrice] = useState<string | null>(null);
    const nftData = {
        id,
        name: "Example NFT",
        description: "This is an example NFT description.",
    };

    // 从 localStorage 中获取 nftPrice
    useEffect(() => {
        if (id) {
            const storedNftPrice = localStorage.getItem(`nftPrice_${id}`);
            if (storedNftPrice) {
                setNftPrice(storedNftPrice);
            }
        }
    }, [id]);

    if (!id) {
        return <Loading/>; // 路由参数未加载时显示
    }

    if (!nft) {
        return <Loading/>; // 如果 nft 为 null，显示错误信息
    }
    const headUrl = BASE_PATH + "head.png";
    const bodyUrl = BASE_PATH + bodies[nft.body];
    const earUrl = BASE_PATH + ears[nft.ear];
    const faceUrl = BASE_PATH + faces[nft.face];

    const aptogotchiImage = (
        <Box position={"relative"} height="100px" width="100px">
            <Box position={"absolute"} top={"0px"} left={"0px"}>
                <Image src={headUrl} alt="pet head" height="100" width="100"/>
            </Box>
            <Box position={"absolute"} top={"0px"} left={"0px"}>
                <Image src={bodyUrl} alt="pet body" height="100" width="100"/>
            </Box>
            <Box position={"absolute"} top={"0px"} left={"0px"}>
                <Image src={earUrl} alt="pet ears" height="100" width="100"/>
            </Box>
            <Box position={"absolute"} top={"0px"} left={"0px"}>
                <Image src={faceUrl} alt="pet face" height="100" width="100"/>
            </Box>
        </Box>
    );
    return (
        <Box padding={8} bg="gray.50" borderRadius="md" boxShadow="lg">
            <Grid templateColumns={{base: "1fr", md: "60% 40%"}} gap={8}>
                {/* 左侧大列 - 占60% */}
                <GridItem colSpan={1}>
                    <VStack spacing={8} align="stretch">
                        {/* NFT 图片和描述 */}
                        <VStack
                            spacing={4}
                            align="flex-start"
                            bg="white"
                            p={6}
                            borderRadius="md"
                            boxShadow="md"
                        >
                            {aptogotchiImage}
                            <Box>
                                <Text fontSize="2xl" fontWeight="bold" mb={2}>
                                    {nft.name}
                                </Text>
                                <Text fontSize="md" color="gray.600">
                                    {"No description available"}
                                </Text>
                            </Box>
                        </VStack>

                        {/* NFT 简介 */}
                        <VStack
                            spacing={6}
                            align="flex-start"
                            bg="white"
                            p={6}
                            borderRadius="md"
                            boxShadow="md"
                        >
                            <Text fontSize="3xl" fontWeight="bold">
                                About
                            </Text>
                            <Text fontSize="lg">
                                {nftData.description || "No description available"}
                            </Text>
                        </VStack>
                    </VStack>
                </GridItem>

                {/* 右侧小列 - 占40% */}
                <GridItem colSpan={1}>
                    <VStack spacing={8} align="stretch">
                        {/* NFT 拥有者 */}
                        <VStack
                            spacing={6}
                            align="flex-start"
                            bg="white"
                            p={6}
                            borderRadius="md"
                            boxShadow="md"
                        >
                            <Box>
                                <Text fontSize="lg" fontWeight="bold" mb={1}>
                                    Owner
                                </Text>
                                <Text fontSize="md" color="gray.600">
                                    {"Unknown Owner"}
                                </Text>
                            </Box>
                        </VStack>

                        {/* NFT 价格和购买按钮 */}
                        <VStack
                            align="stretch"
                            spacing={4}
                            p={6}
                            bg="white"
                            borderRadius="md"
                            boxShadow="md"
                        >
                            <Box>
                                <Text fontSize="sm" color="gray.500" mb={1}>
                                    Current price
                                </Text>
                                <VStack align="flex-start" spacing={0}>
                                    <Text fontSize="xl" fontWeight="bold">
                                        {price !== null ? `${price} APT` : "NOT FOR SALE"}
                                    </Text>
                                </VStack>
                            </Box>
                            <VStack spacing={3} pt={2}>
                                <Button colorScheme="blue" size="lg" width="full">
                                    Buy now
                                </Button>
                                <Button variant="outline" size="lg" width="full">
                                    Make offer
                                </Button>
                            </VStack>
                            <Text fontSize="sm" color="gray.500">
                                Supports creator This listing is paying the collection creator their suggested creator
                                earnings.
                            </Text>
                        </VStack>
                    </VStack>
                </GridItem>
            </Grid>
        </Box>
    );
};

export default NftDetails;