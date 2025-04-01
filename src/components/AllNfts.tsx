import { useGetAllNfts } from "@/hooks/useGetAllNfts";
import { SimpleGrid, Box } from "@chakra-ui/react";
import { NftCard } from "./NftCard";
import Loading from "./loading"; // 引入加载动画组件
import { useState, useEffect } from "react";
interface AllNftsProps {
  limit?: number; // 添加 limit 属性
}

export const AllNfts = ({ limit }: AllNftsProps) => {
  const [isLoading, setIsLoading] = useState(true); // 添加加载状态
  const allNfts = useGetAllNfts() || [];
  const displayedNfts = limit ? allNfts.slice(0, limit) : allNfts; // 根据 limit 限制显示数量

  // 模拟加载完成
  useEffect(() => {
    if (allNfts.length > 0) {
      setIsLoading(false); // 数据加载完成后停止加载
    }
  }, [allNfts]);
  return isLoading ? (
    <Box textAlign="center" py={10}>
      <Loading /> {/* 显示加载动画 */}
    </Box>
  ) : (
    <SimpleGrid spacing={10} columns={3}>
      {displayedNfts.map((nft) => {
        return <NftCard nft={nft} key={nft.address} />;
      })}
    </SimpleGrid>
  );
};