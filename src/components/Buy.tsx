import {APT, MARKETPLACE_CONTRACT_ADDRESS, aptos} from "@/utils/aptos";
import {Listing} from "@/utils/types";
import {useKeylessAccount} from "@/context/KeylessAccountContext";
import {Button, VStack, Text, HStack, Box} from "@chakra-ui/react";
import Link from "next/link";
import {getAptosClient} from "@/utils/aptosClient";

type Props = {
    listing: Listing;
};

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

export const Buy = ({listing}: Props) => {
    const {keylessAccount, setKeylessAccount} = useKeylessAccount();
    const onSubmit = async () => {
            if (!keylessAccount) {
                throw new Error("Wallet not connected");
            }
            const response = await signAndSubmitWithKeylessAccount(
                keylessAccount,
                `${MARKETPLACE_CONTRACT_ADDRESS}::token_marketplace::purchase` as `${string}::${string}::${string}`,
                [APT],
                [listing.listing_object_address]
            );
            await aptos
                .waitForTransaction({
                    transactionHash: response.hash,
                })
                .then(() => {
                    console.log("Bought");
                });
        }
    ;

    return (
        <HStack flexDirection="column">
            <Box display="flex" gap={2}>
                <Text>Price: </Text>
                <Text fontWeight="bold">{listing.price} APT</Text>
            </Box>
            <Button width={160} onClick={onSubmit}>
                Buy
            </Button>
            <Link
                href={`https://explorer.aptoslabs.com/account/${listing.seller_address}?network=testnet`}
                rel="noopener noreferrer"
                target="_blank"
            >
                <Text fontSize="xs" color="GrayText">
                    View seller on explorer
                </Text>
            </Link>
        </HStack>
    );
};
