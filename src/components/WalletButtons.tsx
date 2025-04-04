"use client";

import GoogleLogo from "./GoogleLogo";
import useEphemeralKeyPair from "@/hooks/useEphemeralKeyPair";
import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { collapseAddress } from "@/utils/address";
import { toast } from "sonner";
import { Button, Box, Text, Flex } from "@chakra-ui/react";

function shortenAddress(address: string, startLength = 4, endLength = 4) {
    return `${address.substring(0, startLength)}...${address.substring(
        address.length - endLength
    )}`;
}

export default function WalletButtons() {
    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        throw new Error("Google Client ID is not set in env");
    }

    const { keylessAccount, setKeylessAccount } = useKeylessAccount();
    const ephemeralKeyPair = useEphemeralKeyPair();

    const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    const searchParams = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        redirect_uri:
            typeof window !== "undefined"
                ? `${window.location.origin}/callback`
                : (process.env.NODE_ENV === "development"
                ? "http://localhost:3000"
                : process.env.NEXT_PUBLIC_VERCEL_URL) + "/callback",
        response_type: "id_token",
        scope: "openid email profile",
        nonce: ephemeralKeyPair.nonce,
    });
    redirectUrl.search = searchParams.toString();

    const disconnect = () => {
        setKeylessAccount(null);
        toast.success("Successfully disconnected account");
    };

    return (
        <Flex justify="center" align="center" width="100%" p={4}>
            {keylessAccount ? (
                <Button
                    onClick={disconnect}
                    title="Disconnect Wallet"
                    bgGradient="linear(to-r, blue.600, purple.600)"
                    color="white"
                    _hover={{ bgGradient: "linear(to-r, blue.300, purple.300)" }}
                    leftIcon={<GoogleLogo />}
                    borderRadius="full"
                    px={8}
                    py={4}
                    boxShadow="xl"
                    transition="all 0.3s ease"
                >
                    <Text isTruncated title={keylessAccount.accountAddress.toString()}>
                        {shortenAddress(keylessAccount.accountAddress.toString())}
                    </Text>
                </Button>
            ) : (
                <a href={redirectUrl.toString()} style={{ textDecoration: "none" }}>
                    <Button
                        bgGradient="linear(to-r, gray.800, gray.600)"
                        color="white"
                        _hover={{ bgGradient: "linear(to-r, gray.700, gray.500)", transform: "scale(1.05)" }}
                        leftIcon={<GoogleLogo />}
                        borderRadius="full"
                        px={8}
                        py={4}
                        boxShadow="2xl"
                        transition="all 0.3s ease"
                    >
                        <Text fontWeight="bold">Sign in with Google</Text>
                    </Button>
                </a>
            )}
        </Flex>
    );
}
