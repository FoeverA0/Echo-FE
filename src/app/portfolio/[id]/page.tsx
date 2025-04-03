"use client";

import {
    Alert,
    AlertIcon,
    Box,
    Heading,
    useColorModeValue,
    SlideFade,
    Flex,
    Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Portfolio } from "../../../components/Portfolio";
import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaWallet, FaAddressCard } from "react-icons/fa";

const MotionBox = motion(Box);

export default function Page() {
    const params = useParams();
    const [id, setId] = useState<string | null>(null);
    const brandGradient = useColorModeValue(
        "linear(to-r, blue.600, purple.600)",
        "linear(to-r, blue.300, purple.300)"
    );

    useEffect(() => {
        const address = Array.isArray(params.id) ? params.id[0] : params.id;
        setId(address || null);
    }, [params.id]);

    return (
        <Box maxW="6xl" mx="auto" p={8}>
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Heading
                    textAlign="center"
                    mb={8}
                    fontSize="3xl"
                    fontWeight="extrabold"
                    bgGradient={brandGradient}
                    bgClip="text"
                >
                    {id ? (
                        <>
                            <Text as="span" fontFamily="monospace">
                                {`${id.substring(0, 6)}...${id.substring(id.length - 4)}`} Knowledge Assets
                            </Text>
                        </>
                    ) : (
                        "Loading Portfolio..."
                    )}
                </Heading>
                <PageContent id={id} />
            </MotionBox>
        </Box>
    );
}

function PageContent({ id }: { id: string | null }) {
    const { keylessAccount } = useKeylessAccount();
    const alertBg = useColorModeValue("orange.50", "orange.900");
    const skeletonColor = useColorModeValue("gray.100", "gray.700");

    if (!keylessAccount) {
        return (
            <SlideFade in={true} offsetY={20}>
                <Alert
                    status="warning"
                    variant="subtle"
                    borderRadius="lg"
                    bg={alertBg}
                    maxW="600px"
                    mx="auto"
                    my={8}
                    p={6}
                >
                    <AlertIcon boxSize={6} mr={4} />
                    <Flex align="center">
                        <FaWallet style={{ marginRight: 12 }} />
                        <Text fontSize="lg">
                            Connect wallet to view personalized portfolio
                        </Text>
                    </Flex>
                </Alert>
            </SlideFade>
        );
    }

    if (!id) {
        return (
            <SlideFade in={true} offsetY={20}>
                <Alert
                    status="error"
                    variant="subtle"
                    borderRadius="lg"
                    maxW="600px"
                    mx="auto"
                    my={8}
                    p={6}
                >
                    <AlertIcon boxSize={6} mr={4} />
                    <Flex align="center">
                        <FaAddressCard style={{ marginRight: 12 }} />
                        <Text fontSize="lg">Invalid or missing wallet address</Text>
                    </Flex>
                </Alert>
            </SlideFade>
        );
    }

    return (
        <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Portfolio address={id} />
        </MotionBox>
    );
}