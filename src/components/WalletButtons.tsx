"use client";

import GoogleLogo from "./GoogleLogo";
import useEphemeralKeyPair from "@/hooks/useEphemeralKeyPair";
import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { collapseAddress } from "@/utils/address";
import { toast } from "sonner";
import { Button, Box, Text, Flex } from "@chakra-ui/react";


const buttonStyles =
  "nes-btn flex items-center justify-center md:gap-4 py-2 flex-nowrap whitespace-nowrap";

export default function WalletButtons() {
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    throw new Error("Google Client ID is not set in env");
  }

  const { keylessAccount, setKeylessAccount } = useKeylessAccount();
  const ephemeralKeyPair = useEphemeralKeyPair();

  const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  const searchParams = new URLSearchParams({
    /**
     * Replace with your own client ID
     */
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    /**
     * The redirect_uri must be registered in the Google Developer Console. This callback page
     * parses the id_token from the URL fragment and combines it with the ephemeral key pair to
     * derive the keyless account.
     */
    redirect_uri:
      typeof window !== "undefined"
        ? `${window.location.origin}/callback`
        : (process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process.env.NEXT_PUBLIC_VERCEL_URL) + "/callback",
    /**
     * This uses the OpenID Connect implicit flow to return an id_token. This is recommended
     * for SPAs (single-page applications) as it does not require a backend server.
     */
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
    <Flex
      // justify="center"
      // align="center"
      // position="fixed" // 固定位置
      // bottom="0" // 放置在页面底部
      // left="0"
      // width="100%" // 占满宽度
      // bg="white" // 背景颜色
      // p={3} // 内边距
      zIndex="1000" // 确保在最顶层
    >
      {keylessAccount ? (
        <Button
          onClick={disconnect}
          title="Disconnect Wallet"
          bg="gray.700"
          color="white"
          _hover={{ bg: "gray.600" }}
          leftIcon={<GoogleLogo />}
          borderRadius="md"
          px={10}
          py={4}
          boxShadow="0 -2px 5px rgba(0, 0, 0, 0.1)" // 添加顶部阴影
        >
          <Text isTruncated title={keylessAccount.accountAddress.toString()}>
            {collapseAddress(keylessAccount.accountAddress.toString())}
          </Text>
        </Button>
      ) : (
        <a href={redirectUrl.toString()} style={{ textDecoration: "none" }}>
          <Button
            bg="gray.700"
            color="white"
            _hover={{ bg: "cyan.600" }}
            leftIcon={<GoogleLogo />}
            borderRadius="md"
            px={5}
            py={4}
            boxShadow="0 -2px 5px rgba(0, 0, 0, 0.1)" // 添加顶部阴影
          >
            <Text>Sign in with Google</Text>
          </Button>
        </a>
      )}
    </Flex>
  );
}