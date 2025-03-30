import { useState, useEffect } from "react";
import { AptosClient } from "aptos";
import { Button, Box, VStack, Text } from "@chakra-ui/react";
import { FaWallet } from "react-icons/fa";

const APTOS_NODE_URL = "https://fullnode.mainnet.aptoslabs.com";
const client = new AptosClient(APTOS_NODE_URL);

declare global {
  interface Window {
    aptos?: any;
  }
}

export default function WalletButtons() {
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    if (window.aptos) {
      try {
        const response = await window.aptos.account();
        setAccount(response.address);
      } catch (error) {
        console.error("Not connected", error);
      }
    }
  }

  async function connectWallet() {
    if (!window.aptos) {
      alert("Please install a compatible Aptos wallet.");
      return;
    }
    setLoading(true);
    try {
      const response = await window.aptos.connect();
      setAccount(response.address);
    } catch (error) {
      console.error("Connection failed", error);
    }
    setLoading(false);
  }

  async function disconnectWallet() {
    if (window.aptos) {
      await window.aptos.disconnect();
      setAccount(null);
    }
  }

  return (
      <Box p={4} borderRadius="md" boxShadow="md" bg="gray.700" color="white" textAlign="center" w="full" maxW="sm">
        <VStack spacing={4}>
          <Text fontSize="lg" fontWeight="bold">
            {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Aptos Wallet"}
          </Text>
          {account ? (
              <Button onClick={disconnectWallet} colorScheme="red" leftIcon={<FaWallet />}>
                Disconnect
              </Button>
          ) : (
              <Button onClick={connectWallet} isLoading={loading} colorScheme="blue" leftIcon={<FaWallet />}>
                Connect Wallet
              </Button>
          )}
        </VStack>
      </Box>
  );
}