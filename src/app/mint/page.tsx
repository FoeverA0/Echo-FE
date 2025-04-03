"use client";

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
    useColorModeValue,
    SlideFade,
    VStack,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { APTOGOTCHI_CONTRACT_ADDRESS, aptos } from "@/utils/aptos";
import { motion } from "framer-motion";
import { FaMagic, FaCoins, FaCommentDots } from "react-icons/fa";

const MotionBox = motion(Box);

export default function Page() {
    const brandGradient = useColorModeValue(
        "linear(to-r, blue.600, purple.600)",
        "linear(to-r, blue.300, purple.300)"
    );

    return (
        <Box maxW="6xl" mx="auto" p={8}>
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Heading
                    textAlign="center"
                    mb={8}
                    fontSize="4xl"
                    fontWeight="extrabold"
                    bgGradient={brandGradient}
                    bgClip="text"
                >
                    Create Your Knowledge Avatar
                </Heading>
                <PageContent />
            </MotionBox>
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
    const { keylessAccount } = useKeylessAccount();
    const alertBg = useColorModeValue("blue.50", "blue.900");

    if (!keylessAccount) {
        return (
            <Alert
                status="warning"
                variant="subtle"
                borderRadius="lg"
                bg={alertBg}
                maxW="600px"
                mx="auto"
                my={8}
            >
                <AlertIcon />
                <Text>Connect wallet to create your Knowledge Avatar</Text>
            </Alert>
        );
    }

    return <Mint />;
}

function Mint() {
    const [name, setName] = useState<string>("");
    const [coin, setCoin] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [showAlert, setShowAlert] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { keylessAccount } = useKeylessAccount();

    // 颜色模式相关变量
    const inputBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const focusBorderColor = useColorModeValue("blue.500", "blue.300");
    const buttonGradient = useColorModeValue(
        "linear(to-r, blue.500, purple.500)",
        "linear(to-r, blue.300, purple.300)"
    );

    const FormField = ({
                           label,
                           icon,
                           value,
                           onChange,
                           placeholder
                       }: {
        label: string;
        icon: React.ReactElement;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        placeholder: string;
    }) => (
        <MotionBox
            w="100%"
            maxW="600px"
            mb={6}
            whileHover={{ scale: 1.02 }}
        >
            <FormControl>
                <Flex align="center" gap={4}>
                    <Box color="blue.500" fontSize="xl">
                        {icon}
                    </Box>
                    <Input
                        bg={inputBg}
                        border="2px solid"
                        borderColor={borderColor}
                        _focus={{
                            borderColor: focusBorderColor,
                            boxShadow: `0 0 0 1px ${focusBorderColor}`
                        }}
                        borderRadius="lg"
                        p={6}
                        fontSize="lg"
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        transition="all 0.2s"
                    />
                </Flex>
            </FormControl>
        </MotionBox>
    );

    const onSubmit = async () => {
        if (!keylessAccount) return;

        try {
            setIsLoading(true);
            const body = Math.floor(Math.random() * 4) + 1;
            const ear = Math.floor(Math.random() * 5) + 1;
            const face = Math.floor(Math.random() * 3) + 1;

            await signAndSubmitWithKeylessAccount(
                keylessAccount,
                `${APTOGOTCHI_CONTRACT_ADDRESS}::main::create_echo` as const,
                [],
                [name, body.toString(), ear.toString(), face.toString(), coin, desc]
            );

            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        } catch (error) {
            console.error("Minting failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box w="100%">
            {showAlert && (
                <SlideFade in={showAlert} offsetY={-20}>
                    <Alert
                        status="success"
                        variant="solid"
                        borderRadius="lg"
                        boxShadow="xl"
                        maxW="600px"
                        mx="auto"
                        mb={8}
                    >
                        <AlertIcon boxSize={6} />
                        <VStack align="start" spacing={1}>
                            <Text fontWeight="bold">Creation Successful!</Text>
                            <Text>Your Knowledge Avatar is now available in Portfolio</Text>
                        </VStack>
                    </Alert>
                </SlideFade>
            )}

            <VStack spacing={8} w="100%">
                <FormField
                    label="Name"
                    icon={<FaMagic />}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Unique Avatar Name (e.g. AI Expert)"
                />

                <FormField
                    label="Coin Address"
                    icon={<FaCoins />}
                    value={coin}
                    onChange={(e) => setCoin(e.target.value)}
                    placeholder="APT Coin Address (0x...)"
                />

                <FormField
                    label="Description"
                    icon={<FaCommentDots />}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Specialized Knowledge Description"
                />

                <MotionBox
                    w="100%"
                    maxW="600px"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        w="100%"
                        size="lg"
                        height="60px"
                        bgGradient={buttonGradient}
                        color="white"
                        fontSize="xl"
                        fontWeight="bold"
                        borderRadius="xl"
                        isLoading={isLoading}
                        loadingText="Creating..."
                        _hover={{
                            boxShadow: "2xl"
                        }}
                        onClick={onSubmit}
                        rightIcon={<FaMagic />}
                    >
                        Create Knowledge Avatar
                    </Button>
                </MotionBox>
            </VStack>
        </Box>
    );
}