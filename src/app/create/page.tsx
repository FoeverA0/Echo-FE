// import { isAptosConnectWallet, useWallet } from "@aptos-labs/wallet-adapter-react";
// import { Link as RouterLink, useNavigate } from "react-router-dom";
// import { useRef, useState } from "react";
// import {
//   Alert,
//   AlertIcon,
//   AlertTitle,
//   AlertDescription,
//   Box,
//   Button,
//   Card,
//   CardBody,
//   CardHeader,
//   FormControl,
//   FormLabel,
//   Heading,
//   Image,
//   Input,
//   Spinner,
//   Text,
//   Tooltip,
//   useDisclosure,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
// } from "@chakra-ui/react";
// // Internal utils
// import { checkIfFund, uploadFile } from "@/utils/Irys";
// import { aptosClient } from "@/utils/aptosClient";
// // Entry functions
// import { createAsset } from "@/entry-functions/create_asset";
// // Example of a custom Header component in Chakra (optional)
// import { Header } from "@/components/Navbar";

// export function CreateFungibleAsset() {
//   // Wallet Adapter provider
//   const aptosWallet = useWallet();
//   const { account, wallet, signAndSubmitTransaction } = useWallet();

//   // If we are on Production mode, redirect to the public mint page
//   const navigate = useNavigate();

//   // Collection data entered by the user on UI
//   const [name, setName] = useState<string>("");
//   const [symbol, setSymbol] = useState<string>("");
//   const [maxSupply, setMaxSupply] = useState<string>();
//   const [maxMintPerAccount, setMaxMintPerAccount] = useState<number>();
//   const [decimal, setDecimal] = useState<string>();
//   const [image, setImage] = useState<File | null>(null);
//   const [projectURL, setProjectURL] = useState<string>("");
//   const [mintFeePerFA, setMintFeePerFA] = useState<number>();
//   const [mintForMyself, setMintForMyself] = useState<number>();

//   // Internal state
//   const [isUploading, setIsUploading] = useState(false);

//   // Local Ref
//   const inputRef = useRef<HTMLInputElement>(null);

//   // Chakra modal disclosure for an extra confirmation step
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   const disableCreateAssetButton =
//     !name ||
//     !symbol ||
//     !maxSupply ||
//     !decimal ||
//     !projectURL ||
//     !maxMintPerAccount ||
//     !account ||
//     isUploading;

//   // The actual creation logic
//   const onCreateAsset = async () => {
//     try {
//       if (!account) throw new Error("Connect wallet first");
//       if (!image) throw new Error("Select image first");

//       setIsUploading(true);

//       // Check an Irys node has enough funds
//       const funded = await checkIfFund(aptosWallet, image.size);
//       if (!funded) {
//         throw new Error("Current account balance is not enough to fund a decentralized asset node");
//       }

//       // Upload asset file to Irys
//       const iconURL = await uploadFile(aptosWallet, image);

//       // Submit a create_fa entry function transaction
//       const response = await signAndSubmitTransaction(
//         createAsset({
//           maxSupply: Number(maxSupply),
//           name,
//           symbol,
//           decimal: Number(decimal),
//           iconURL,
//           projectURL,
//           mintFeePerFA,
//           mintForMyself,
//           maxMintPerAccount,
//         })
//       );

//       // Wait for the transaction to be committed
//       const committedTransactionResponse = await aptosClient().waitForTransaction({
//         transactionHash: response.hash,
//       });

//       // If all good, navigate away
//       if (committedTransactionResponse.success) {
//         navigate(`/`, { replace: true });
//       }
//     } catch (error: any) {
//       alert(error?.message ?? "Error creating asset");
//     } finally {
//       setIsUploading(false);
//       onClose();
//     }
//   };

//   // We prompt the user for a second confirmation – up to you if you need this step
//   const handleConfirmCreate = () => {
//     onClose();
//     onCreateAsset();
//   };

//   return (
//     <>
//       <Header />
//       <Box
//         maxW="7xl"
//         mx="auto"
//         px={4}
//         py={2}
//         display="flex"
//         flexDirection={{ base: "column", md: "row" }}
//         alignItems="start"
//         justifyContent="space-between"
//         gap={4}
//       >
//         <Box w={{ base: "100%", md: "66%" }}>
//           {/* If the user's wallet is a Google-based wallet, show a warning */}
//           {wallet && isAptosConnectWallet(wallet) && (
//             <Alert status="warning" mb={4}>
//               <AlertIcon />
//               <Box>
//                 <AlertTitle>Wallet not supported</AlertTitle>
//                 <AlertDescription>
//                   Google account is not supported when creating a Token. Please use a different wallet.
//                 </AlertDescription>
//               </Box>
//             </Alert>
//           )}

//           {/* Show a spinner when uploading */}
//           {isUploading && (
//             <Box display="flex" alignItems="center" gap={2} mb={4}>
//               <Spinner />
//               <Text>Uploading data. Please wait...</Text>
//             </Box>
//           )}

//           <Card mb={4}>
//             <CardHeader>
//               <Heading size="md">Asset Image</Heading>
//               <Text color="gray.500" fontSize="sm">
//                 Uploads asset to a decentralized storage
//               </Text>
//             </CardHeader>
//             <CardBody>
//               <Box display="flex" flexDirection="column" alignItems="flex-start" gap={2}>
//                 {!image && (
//                   <Button
//                     as="label"
//                     variant="outline"
//                     cursor="pointer"
//                     htmlFor="upload"
//                     isDisabled={isUploading || !account || !wallet || isAptosConnectWallet(wallet)}
//                   >
//                     Choose Image
//                   </Button>
//                 )}
//                 {/* Hidden file input */}
//                 <Input
//                   type="file"
//                   id="upload"
//                   ref={inputRef}
//                   onChange={(e) => setImage(e.target.files?.[0] ?? null)}
//                   display="none"
//                 />

//                 {image && (
//                   <>
//                     <Image
//                       src={URL.createObjectURL(image)}
//                       alt="Selected asset image"
//                       maxH="200px"
//                       borderRadius="md"
//                     />
//                     <Text fontSize="sm">
//                       {image.name}{" "}
//                       <Button
//                         variant="link"
//                         colorScheme="red"
//                         onClick={() => {
//                           setImage(null);
//                           if (inputRef.current) {
//                             inputRef.current.value = "";
//                           }
//                         }}
//                       >
//                         Clear
//                       </Button>
//                     </Text>
//                   </>
//                 )}
//               </Box>
//             </CardBody>
//           </Card>

//           {/* Name */}
//           <FormControl isRequired mb={4}>
//             <FormLabel htmlFor="asset-name">Asset Name</FormLabel>
//             <Tooltip label="The name of the asset, e.g. Bitcoin, Ethereum, etc.">
//               <Input
//                 id="asset-name"
//                 type="text"
//                 onChange={(e) => setName(e.target.value)}
//                 isDisabled={isUploading || !account}
//               />
//             </Tooltip>
//           </FormControl>

//           {/* Symbol */}
//           <FormControl isRequired mb={4}>
//             <FormLabel htmlFor="asset-symbol">Asset Symbol</FormLabel>
//             <Tooltip label="The symbol of the asset, e.g. BTC, ETH, etc.">
//               <Input
//                 id="asset-symbol"
//                 type="text"
//                 onChange={(e) => setSymbol(e.target.value)}
//                 isDisabled={isUploading || !account}
//               />
//             </Tooltip>
//           </FormControl>

//           {/* Max Supply */}
//           <FormControl isRequired mb={4}>
//             <FormLabel htmlFor="max-supply">Max Supply</FormLabel>
//             <Tooltip label="The total amount of the asset in full unit that can be minted.">
//               <Input
//                 id="max-supply"
//                 type="number"
//                 onChange={(e) => setMaxSupply(e.target.value)}
//                 isDisabled={isUploading || !account}
//               />
//             </Tooltip>
//           </FormControl>

//           {/* Max Mint per Account */}
//           <FormControl isRequired mb={4}>
//             <FormLabel htmlFor="max-mint">Max amount an address can mint</FormLabel>
//             <Tooltip label="The maximum amount in full unit that any single individual address can mint">
//               <Input
//                 id="max-mint"
//                 type="number"
//                 onChange={(e) => setMaxMintPerAccount(Number(e.target.value))}
//                 isDisabled={isUploading || !account}
//               />
//             </Tooltip>
//           </FormControl>

//           {/* Decimal */}
//           <FormControl isRequired mb={4}>
//             <FormLabel htmlFor="decimal">Decimal</FormLabel>
//             <Tooltip label="How many 0's constitute one full unit of the asset. For example, APT has 8.">
//               <Input
//                 id="decimal"
//                 type="number"
//                 onChange={(e) => setDecimal(e.target.value)}
//                 isDisabled={isUploading || !account}
//               />
//             </Tooltip>
//           </FormControl>

//           {/* Project URL */}
//           <FormControl isRequired mb={4}>
//             <FormLabel htmlFor="project-url">Project URL</FormLabel>
//             <Tooltip label="Your website address">
//               <Input
//                 id="project-url"
//                 type="text"
//                 onChange={(e) => setProjectURL(e.target.value)}
//                 isDisabled={isUploading || !account}
//               />
//             </Tooltip>
//           </FormControl>

//           {/* Mint Fee per FA */}
//           <FormControl mb={4}>
//             <FormLabel htmlFor="mint-fee">
//               Mint fee per fungible asset in APT
//             </FormLabel>
//             <Tooltip label="The fee cost for the minter to pay to mint one full unit of an asset, denominated in APT. If a user mints 10 assets in a single transaction, they are charged 10x the mint fee.">
//               <Input
//                 id="mint-fee"
//                 type="number"
//                 onChange={(e) => setMintFeePerFA(Number(e.target.value))}
//                 isDisabled={isUploading || !account}
//               />
//             </Tooltip>
//           </FormControl>

//           {/* Mint for Myself */}
//           <FormControl mb={4}>
//             <FormLabel htmlFor="for-myself">Mint for myself</FormLabel>
//             <Tooltip label="How many assets in full unit to mint right away and send to your address.">
//               <Input
//                 id="for-myself"
//                 type="number"
//                 onChange={(e) => setMintForMyself(Number(e.target.value))}
//                 isDisabled={isUploading || !account}
//               />
//             </Tooltip>
//           </FormControl>

//           {/* "Create Asset" Button */}
//           <Button
//             colorScheme="blue"
//             onClick={onOpen} // open a confirmation modal
//             isDisabled={disableCreateAssetButton}
//           >
//             Create Asset
//           </Button>
//         </Box>
//       </Box>

//       {/* Confirmation Modal */}
//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Confirm Creation</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <Text mb={2}>
//               The upload process requires signing at least 1 transaction to upload the asset image to Irys.
//             </Text>
//             <Text>
//               If additional funding is needed on Irys, you may also see a transfer transaction request.
//             </Text>
//           </ModalBody>
//           <ModalFooter>
//             <Button variant="ghost" mr={3} onClick={onClose}>
//               Cancel
//             </Button>
//             <Button colorScheme="blue" onClick={handleConfirmCreate}>
//               Confirm
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// }
