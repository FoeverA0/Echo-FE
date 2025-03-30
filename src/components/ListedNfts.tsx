import { useGetAllListedNfts } from "@/hooks/useGetAllListedNfts";
import { SimpleGrid, Box } from "@chakra-ui/react";
import { NftCard } from "./NftCard";
import { Buy } from "./Buy";
import Loading from "./loading"; // 引入加载动画组件
import { useState, useEffect } from "react";

export const ListedNfts = () => {
  const [isLoading, setIsLoading] = useState(true); // 添加加载状态
  const listedNfts = useGetAllListedNfts();

  useEffect(() => {
    if (listedNfts) {
      setIsLoading(false); // 数据加载完成后停止加载
    }
  }, [listedNfts]);

  return isLoading ? (
      <Box textAlign="center" py={10}>
        <Loading /> {/* 显示加载动画 */}
      </Box>
  ) : listedNfts ? (
      <SimpleGrid spacing={10} columns={3}>
        {listedNfts.map((nft) => {
          return (
              <NftCard key={nft.address} nft={nft}>
                <Buy listing={nft} />
              </NftCard>
          );
        })}
      </SimpleGrid>
  ) : (
      <></>
  );
};