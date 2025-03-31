"use client";

import { Network, NetworkToChainId } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Alert, AlertIcon, Box, Heading } from "@chakra-ui/react";
import { Portfolio } from "../../components/Portfolio";
import { useKeylessAccount } from "@/context/KeylessAccountContext";
export default function Page() {
  return (
    <Box>
      <Heading margin={4} textAlign="center">
        My Portfolio
      </Heading>
      <PageContent />
    </Box>
  );
}

function PageContent() {
  const { connected, network, account } = useWallet();
  const { keylessAccount, setKeylessAccount } = useKeylessAccount();
  if (!keylessAccount) {
    return (
      <Alert status="warning" variant="left-accent" marginY={8}>
        <AlertIcon />
        Connect wallet to see your portfolio.
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

  return keylessAccount && <Portfolio address={keylessAccount.accountAddress.toString()} />;
}
