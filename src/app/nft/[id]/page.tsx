"use client";
import { useParams } from "next/navigation";
import { Box, Text, Image, Button, VStack, HStack } from "@chakra-ui/react";
import Loading from "@/components/loading";
import { useGetNftsByAddress } from "@/hooks/useGetNftsByAddress";
import { BASE_PATH, bodies, ears, faces } from "@/utils/constants";

const NftDetails = () => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { nft, loading } = useGetNftsByAddress(id || "");
  // 模拟加载 NFT 数据（可以替换为实际的 API 调用）
  const nftData = {
    id,
    name: "Example NFT",
    description: "This is an example NFT description.",
  };

  if (!id) {
    return <Loading />; // 路由参数未加载时显示
  }

  if (!nft) {
    return <Loading />; // 如果 nft 为 null，显示错误信息
  }
  const headUrl = BASE_PATH + "head.png";
  const bodyUrl = BASE_PATH + bodies[nft.body];
  const earUrl = BASE_PATH + ears[nft.ear];
  const faceUrl = BASE_PATH + faces[nft.face];

  const aptogotchiImage = (
    <Box position={"relative"} height="100px" width="100px">
      <Box position={"absolute"} top={"0px"} left={"0px"}>
        <Image src={headUrl} alt="pet head" height="100" width="100" />
      </Box>
      <Box position={"absolute"} top={"0px"} left={"0px"}>
        <Image src={bodyUrl} alt="pet body" height="100" width="100" />
      </Box>
      <Box position={"absolute"} top={"0px"} left={"0px"}>
        <Image src={earUrl} alt="pet ears" height="100" width="100" />
      </Box>
      <Box position={"absolute"} top={"0px"} left={"0px"}>
        <Image src={faceUrl} alt="pet face" height="100" width="100" />
      </Box>
    </Box>
  );
  return (
    <HStack
      spacing={8}
      align="flex-start"
      padding={8}
      bg="gray.50"
      borderRadius="md"
      boxShadow="lg"
    >
      {/* 左侧：NFT 图片和描述 */}
      <VStack
        spacing={4}
        align="flex-start"
        bg="white"
        padding={6}
        borderRadius="md"
        boxShadow="md"
        width="50%"
      >
        {aptogotchiImage}
        <Box>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            {nft.name}
          </Text>
          <Text fontSize="md" color="gray.600">
            {"No description available"}
          </Text>
        </Box>
      </VStack>

      {/* 右侧：NFT 拥有者和购买按钮 */}
      <VStack
        spacing={6}
        align="flex-start"
        bg="white"
        padding={6}
        borderRadius="md"
        boxShadow="md"
        width="40%"
      >
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={1}>
            Owner
          </Text>
          <Text fontSize="md" color="gray.600">
            {"Unknown Owner"}
          </Text>
        </Box>
        <Button
          colorScheme="blue"
          size="lg"
          width="full"
          onClick={() => alert("Purchase functionality coming soon!")}
        >
          Buy Now
        </Button>
      </VStack>
    </HStack>
  );
};

export default NftDetails;