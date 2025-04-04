import Image from "next/image";
import { Box, Card, Text, HStack } from "@chakra-ui/react";
import { BASE_PATH, bodies, ears, faces } from "@/utils/constants";
import Link from "next/link";
import {
    AptogotchiWithTraits,
    ListedAptogotchiWithTraits,
} from "@/utils/types";
import { ReactNode } from "react";

type Props = {
    children?: ReactNode;
    nft: AptogotchiWithTraits | ListedAptogotchiWithTraits;
};

function shortenAddress(address: string, startLength = 8, endLength = 4) {
    return `${address.substring(0, startLength)}...${address.substring(
        address.length - endLength
    )}`;
}

export const NftCard = ({ nft, children }: Props) => {
    const bodyUrl = BASE_PATH + bodies[nft.body];
    const earUrl = BASE_PATH + ears[nft.ear];
    const faceUrl = BASE_PATH + faces[nft.face];

    const aptogotchiImage = (
        <Link href={`/nft/${nft.address}`} passHref>
            <Box position={"relative"} height="150px" width="150px" cursor="pointer">
                <Box position={"absolute"} top={"0px"} left={"0px"}>
                    <Image src={bodyUrl} alt="pet body" height="150" width="150" />
                </Box>
                <Box position={"absolute"} top={"0px"} left={"0px"}>
                    <Image src={faceUrl} alt="pet face" height="150" width="150" />
                </Box>
                <Box position={"absolute"} top={"0px"} left={"0px"}>
                    <Image src={earUrl} alt="pet ears" height="150" width="150" />
                </Box>
            </Box>
        </Link>
    );

    return (
        <Card
            sx={{
                transition: "transform 0.2s, box-shadow 0.2s",
                _hover: { boxShadow: "lg" },
            }}
            padding={4}
            minHeight="150px"
        >
            <HStack spacing={4} align="center">
                {/* 左侧：NFT 图片，点击跳转 */}
                {aptogotchiImage}

                {/* 右侧：名字和信息 */}
                <Box flex={1}>
                    <Text fontSize="xl" fontWeight="bold" marginBottom={2}>
                        {nft.name}
                    </Text>
                    <Text fontSize="sm" color="GrayText">
                        {nft.owner && (
                            <Link href={`/portfolio/${nft.owner}`} passHref legacyBehavior>
                                <Text
                                    as="a"
                                    onClick={(e) => e.stopPropagation()}
                                    fontSize="sm"
                                    color="gray.500"
                                    textDecoration="none"
                                    cursor="pointer"
                                    _hover={{
                                        color: "blue.500",
                                        textDecoration: "underline",
                                        textUnderlineOffset: "2px",
                                    }}
                                    transition="all 0.2s"
                                >
                                   Owner: {shortenAddress(nft.owner)}
                                </Text>
                            </Link>
                        )}
                    </Text>
                    <Text fontSize="md" color="GrayText">
                       Brief: {nft.description ? nft.description.substring(0, 47) : 'No description available'}</Text>
                    <Text fontSize="md" color="GrayText">
                       Per Search Fee: {nft.per_search_fee ? nft.per_search_fee/100000 : '0'} APT</Text>
                    <Box marginTop={4}>{children}</Box>
                </Box>
            </HStack>
        </Card>
    );
};