"use client";

import {useKeylessAccount} from "@/context/KeylessAccountContext";
import {getAptosClient} from "@/utils/aptosClient";
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
    Text,
    VStack,
    useToast,
    Image,
    Progress,
    Icon, useColorModeValue,
} from "@chakra-ui/react";
import {useState, useRef, ChangeEvent} from "react";
import {APTOGOTCHI_CONTRACT_ADDRESS, aptos} from "@/utils/aptos";
import { FiUploadCloud } from "react-icons/fi";

export default function Page() {
    const brandColor = useColorModeValue("blue.600", "blue.200");
    return (
        <Box maxW="container.lg" mx="auto" px={4} py={8}>
            <VStack spacing={6} align="stretch">
                <Heading fontSize={{ base: "3xl", md: "4xl" }}
                         fontWeight="extrabold"
                         bgGradient={`linear(to-r, ${brandColor}, ${useColorModeValue("purple.600", "purple.300")})`}
                         bgClip="text"
                         lineHeight={1.2}
                textAlign="center">
                    Create Your Unique AptKnow NFT
                </Heading>
                <PageContent/>
            </VStack>
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
    const {keylessAccount, setKeylessAccount} = useKeylessAccount();
    if (!keylessAccount) {
        return (
            <Alert status="warning" variant="left-accent" borderRadius="md">
                <AlertIcon/>
                Please connect your wallet to create your AptKnow NFT.
            </Alert>
        );
    }

    return <Mint/>;
}

function Mint() {
    const [name, setName] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [fileName, setFileName] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();
    const {keylessAccount} = useKeylessAccount();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFileName(file.name);

            // Simulate upload progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                }
                setUploadProgress(progress);
            }, 200);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const onSubmit = async () => {
        if (!keylessAccount) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your wallet first",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        if (!name) {
            toast({
                title: "Name required",
                description: "Please enter a name for your AptKnow",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        const body = Math.floor(Math.random() * 4) + 1;
        const ear = Math.floor(Math.random() * 5) + 1;
        const face = Math.floor(Math.random() * 3) + 1;
        try {
            await signAndSubmitWithKeylessAccount(
                keylessAccount,
                `${APTOGOTCHI_CONTRACT_ADDRESS}::main::create_echo` as `${string}::${string}::${string}`,
                [],
                [name, body.toString(), ear.toString(), face.toString(), "0x0926fce9c184d27a0ccca7330a91db9787cbf2f052d79997bfc273682e69a129", desc]
            );

            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 5000);
        } catch (error) {
            console.error("Minting failed:", error);
            toast({
                title: "Minting failed",
                description: "There was an error creating your AptKnow NFT",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (showAlert) {
        return (
            <Alert status="success" variant="subtle" borderRadius="md">
                <AlertIcon />
                Your AptKnow NFT has been successfully created! You can view it in your portfolio.
            </Alert>
        );
    }

    return (
        <Box bg="white" borderRadius="xl" boxShadow="md" p={8}>
            <VStack spacing={6} align="stretch">
                {/* Name Field */}
                <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">
                        AptKnow Name
                    </FormLabel>
                    <Input
                        size="lg"
                        placeholder="Give your AptKnow a unique name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        focusBorderColor="purple.500"
                    />
                </FormControl>

                {/* Description Field */}
                <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">
                        Description
                    </FormLabel>
                    <Input
                        size="lg"
                        placeholder="Tell us about your AptKnow's description"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        focusBorderColor="purple.500"
                    />
                </FormControl>

                {/* File Upload Field */}
                <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">
                        Upload File
                    </FormLabel>
                    <Box
                        border="2px dashed"
                        borderColor="gray.200"
                        borderRadius="lg"
                        p={6}
                        textAlign="center"
                        cursor="pointer"
                        _hover={{ borderColor: "purple.300", bg: "purple.50" }}
                        transition="all 0.2s"
                        onClick={triggerFileInput}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <VStack spacing={3}>
                            <Icon as={FiUploadCloud} w={10} h={10} color="purple.500" />
                            <Text fontWeight="medium" color="gray.600">
                                {fileName || "Click to upload a file"}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                Max file size: 100MB
                            </Text>
                        </VStack>
                    </Box>
                    {fileName && (
                        <Box mt={3}>
                            <Text fontSize="sm" mb={1}>
                                Uploading: {fileName}
                            </Text>
                            <Progress
                                value={uploadProgress}
                                size="sm"
                                colorScheme="purple"
                                borderRadius="full"
                                hasStripe={uploadProgress < 100}
                            />
                            {uploadProgress === 100 && (
                                <Text fontSize="sm" color="green.500" mt={1}>
                                    Upload complete!
                                </Text>
                            )}
                        </Box>
                    )}
                </FormControl>

                <Button
                    bgGradient="linear(to-r, blue.600, purple.600)"
                    size="lg"
                    colorScheme="purple"
                    onClick={onSubmit}
                    isLoading={isLoading}
                    loadingText="Creating..."
                    mt={4}
                >
                    Create AptKnow NFT
                </Button>
            </VStack>
        </Box>
    );
}