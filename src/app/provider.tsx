"use client";

import { WalletProvider } from "@/context/WalletProvider";
import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import { KeylessAccountProvider } from "@/context/KeylessAccountContext";
import { RetrievedLinesProvider } from "@/context/RetrievedLinesContext"; // 引入 RetrievedLinesProvider

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider>
      <KeylessAccountProvider>
        <RetrievedLinesProvider> {/* 包裹整个应用 */}
          {children}
        </RetrievedLinesProvider>
      </KeylessAccountProvider>
    </ChakraProvider>
  );
}