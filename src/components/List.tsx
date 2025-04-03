import {
    APT,
    APT_UNIT,
    MARKETPLACE_CONTRACT_ADDRESS,
    aptos,
} from "@/utils/aptos";
import {useKeylessAccount} from "@/context/KeylessAccountContext";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    FormLabel,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Box,
} from "@chakra-ui/react";
import {useState} from "react";
import {getAptosClient} from "@/utils/aptosClient";

type Props = {
    nftTokenObjectAddr: string;
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

export const List = ({nftTokenObjectAddr}: Props) => {
    const {keylessAccount, setKeylessAccount} = useKeylessAccount();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [price, setPrice] = useState<string>();

    const onRefresh = () => {
        window.location.reload();
    };

    const onSubmit = async () => {
        if (!keylessAccount) {
            throw new Error("Wallet not connected");
        }
        if (!price) {
            throw new Error("Price not set");
        }
        const response = await signAndSubmitWithKeylessAccount(
            keylessAccount,
            `${MARKETPLACE_CONTRACT_ADDRESS}::token_marketplace::list_with_fixed_price` as `${string}::${string}::${string}`,
            [APT],
            [nftTokenObjectAddr, parseInt(price) * APT_UNIT],
        );
        await aptos
            .waitForTransaction({
                transactionHash: response.hash,
            })
            .then(() => {
                console.log("Listed");
                onClose();
                window.location.href = `/portfolio/${keylessAccount.accountAddress}`;
            });
    };

    return (
        <Box>
            <Button width={160} onClick={(event) => {
                event.stopPropagation(); // 阻止事件冒泡
                onOpen();
            }}>
                List
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>List on Marketplace</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Price in APT</FormLabel>
                            <NumberInput
                                onChange={(e) => {
                                    setPrice(e);
                                }}
                                min={1}
                            >
                                <NumberInputField/>
                                <NumberInputStepper>
                                    <NumberIncrementStepper/>
                                    <NumberDecrementStepper/>
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter gap={4}>
                        <Button onClick={onClose}>Close</Button>
                        <Button colorScheme="teal" onClick={onSubmit}>
                            List
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};
