"use client";

import { Network, NetworkToChainId } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useKeylessAccount } from "@/context/KeylessAccountContext";
import { getAptosClient } from "@/utils/aptosClient";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { APTOGOTCHI_CONTRACT_ADDRESS, aptos } from "@/utils/aptos";

export default function Page() {
  return (
    <Box>
      <Heading margin={4} textAlign="center">
        Mint a Aptogotchi NFT
      </Heading>
      <PageContent />
    </Box>
  );
}

async function signAndSubmitWithKeylessAccount(
  keylessAccount: any,
  functionName: `${string}::${string}::${string}`,
  typeArguments: string[],
  arguments_: any[]
) {
  if (!keylessAccount) {
    throw new Error("Keyless account is not available");
  }

  const aptosClient = getAptosClient();

  // 1. 构建交易
  const transaction = await aptosClient.transaction.build.simple({
    sender: keylessAccount.accountAddress,
    data: {
      function: functionName,
      functionArguments: arguments_,
      typeArguments: typeArguments,
    },
  });

  console.log("Built the transaction!");

  // 2. 模拟交易（可选）
  console.log("\n=== Simulating transaction ===\n");
  const [simulationResult] = await aptosClient.transaction.simulate.simple({
    signerPublicKey: keylessAccount.publicKey,
    transaction,
  });
  console.log("Simulation result:", simulationResult);

  // 3. 签名交易
  console.log("\n=== Signing transaction ===\n");
  const senderAuthenticator = aptosClient.transaction.sign({
    signer: keylessAccount,
    transaction,
  });
  console.log("Signed the transaction!");

  // 4. 提交交易
  console.log("\n=== Submitting transaction ===\n");
  const submittedTransaction = await aptosClient.transaction.submit.simple({
    transaction,
    senderAuthenticator,
  });

  console.log(`Submitted transaction hash: ${submittedTransaction.hash}`);

  // 5. 等待交易完成
  console.log("\n=== Waiting for transaction result ===\n");
  const executedTransaction = await aptosClient.waitForTransaction({
    transactionHash: submittedTransaction.hash,
  });

  console.log("Transaction executed:", executedTransaction);

  return executedTransaction;
}

function PageContent() {
  const { connected, network } = useWallet();
  const { keylessAccount, setKeylessAccount } = useKeylessAccount();
  if (!keylessAccount) {
    return (
      <Alert status="warning" variant="left-accent" marginY={8}>
        <AlertIcon />
        Connect wallet to mint your Aptogotchi NFT.
      </Alert>
    );
  }

  // if (network?.chainId != NetworkToChainId[Network.TESTNET].toString()) {
  //   return (
  //     <Alert status="info" variant="left-accent" marginY={8}>
  //       <AlertIcon />
  //       Please Connect to Testnet.
  //     </Alert>
  //   );
  // }

  return <Mint />;
}

function Mint() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [name, setName] = useState<string>();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const { keylessAccount, setKeylessAccount } = useKeylessAccount();

  const onShowAlert = () => {
    setShowAlert(true);
    setInterval(() => {
      setShowAlert(false);
    }, 5000);
  };

  const onSubmit = async () => {
    if (!keylessAccount) {
      throw new Error("Wallet not connected");
    }
    const body = Math.floor(Math.random() * 4) + 1;
    const ear = Math.floor(Math.random() * 5) + 1;
    const face = Math.floor(Math.random() * 3) + 1;
    try {
      const response = await signAndSubmitWithKeylessAccount(
        keylessAccount,
        `${APTOGOTCHI_CONTRACT_ADDRESS}::main::create_aptogotchi` as `${string}::${string}::${string}`,
        [],
        [name, body.toString(), ear.toString(), face.toString()]
      );

      console.log("Minted successfully:", response);
    } catch (error) {
      console.error("Minting failed:", error);
    }
  };

  if (showAlert) {
    return (
      <Alert status="success" variant="left-accent">
        <AlertIcon />
        Minted successfully! Go to My Portfolio to see your Aptogotchi.
      </Alert>
    );
  }

  return (
    <Box>
      <Flex flexDirection="column" alignItems="center" marginTop={12}>
        <FormControl
          marginBottom={8}
          display="flex"
          alignItems="center"
          width={480}
          gap={4}
        >
          <FormLabel>Aptogotchi Name</FormLabel>
          <Input
            width={320}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </FormControl>
        <Button width={480} onClick={onSubmit} margin={0}>
          Mint
        </Button>
      </Flex>
    </Box>
  );
}
