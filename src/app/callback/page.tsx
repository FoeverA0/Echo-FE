"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getLocalEphemeralKeyPair } from "@/hooks/useEphemeralKeyPair";
import { useRouter } from "next/navigation";
import { getAptosClient } from "@/utils/aptosClient";
import { EphemeralKeyPair } from "@aptos-labs/ts-sdk";
import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { toast } from "sonner";
import { Progress, Box, Text, VStack,Flex } from "@chakra-ui/react";

const parseJWTFromURL = (url: string): string | null => {
  const urlObject = new URL(url);
  const fragment = urlObject.hash.substring(1);
  const params = new URLSearchParams(fragment);
  return params.get("id_token");
};

function CallbackPage() {
  const { setKeylessAccount } = useKeylessAccount();
  const { push } = useRouter();
  const router = useRouter();
  const [progress, setProgress] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return currentProgress + 1;
      });
    }, 50);

    async function deriveAccount() {
        const jwt = parseJWTFromURL(window.location.href);

        if (!jwt) {
            setHasError(true);
            setProgress(100);
            toast.error("No JWT found in URL. Please try logging in again.");
            return;
        }

        const payload = jwtDecode<{ nonce: string }>(jwt);
        const jwtNonce = payload.nonce;

        const ephemeralKeyPair = getLocalEphemeralKeyPair(jwtNonce);

        if (!ephemeralKeyPair) {
            setHasError(true);
            setProgress(100);
            toast.error(
              "No ephemeral key pair found for the given nonce. Please try logging in again."
            );
            return;
          }

        await createKeylessAccount(jwt, ephemeralKeyPair);
        clearInterval(interval);
        setProgress(100);
        push("/");
    }

    deriveAccount();
  }, [router]);

  const createKeylessAccount = async (
    jwt: string,
    ephemeralKeyPair: EphemeralKeyPair
  ) => {
    const aptosClient = getAptosClient();
    const keylessAccount = await aptosClient.deriveKeylessAccount({
      jwt,
      ephemeralKeyPair,
    });

    const accountCoinsData = await aptosClient.getAccountCoinsData({
      accountAddress: keylessAccount?.accountAddress.toString(),
    });
    // account does not exist yet -> fund it
    if (accountCoinsData.length === 0) {
      try {
        await aptosClient.fundAccount({
          accountAddress: keylessAccount.accountAddress,
          amount: 200000000, // faucet 2 APT to create the account
        });
      } catch (error) {
        console.log("Error funding account: ", error);
        toast.error(
          "Failed to fund account. Please try logging in again or use another account."
        );
      }
    }

    console.log("Keyless Account: ", keylessAccount.accountAddress.toString());
    setKeylessAccount(keylessAccount);
  };

  return (
<div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    zIndex: 9999, // 确保页面在最顶层
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 半透明背景
    backdropFilter: "blur(10px)", // 模糊效果
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <Box
    bg="white"
    p={6}
    borderRadius="lg"
    boxShadow="lg"
    textAlign="center"
    maxWidth="400px"
    width="100%"
  >
    <Text fontSize="xl" fontWeight="bold" mb={4} color="gray.700">
      Loading your blockchain account...
    </Text>
    <VStack spacing={4}>
      <Progress
        value={progress}
        size="lg"
        colorScheme={hasError ? "red" : "blue"}
        width="100%"
        borderRadius="md"
      />
      {hasError && (
        <Text fontSize="sm" color="red.500">
          An error occurred. Please try again.
        </Text>
      )}
    </VStack>
  </Box>
</div>
  );
}

export default CallbackPage;