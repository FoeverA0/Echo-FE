import {useGetAllNfts} from "@/hooks/useGetAllNfts";
import {SimpleGrid, Box, Button} from "@chakra-ui/react";
import {NftCard} from "./NftCard";
import Loading from "./loading"; // 引入加载动画组件
import {useState, useEffect} from "react";
import Link from "next/link";

interface AllNftsProps {
    limit?: number; // 添加 limit 属性
}

export const AllNfts = ({limit}: AllNftsProps) => {
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
            <Loading/> {/* 显示加载动画 */}
        </Box>
    ) : (
        <SimpleGrid spacing={10} columns={2}>
            {displayedNfts.map((nft) => {
                return (
                    <NftCard nft={nft} key={nft.address}>
                        <Link href={{ pathname: '/chat', query: { id: nft.address, name: nft.name } }} passHref>
                            <Button mx={4}
                                    display="flex"
                                    alignItems="center"
                                    color="purple.600"
                                    fontSize="md"
                                    fontWeight="bold"
                                    textShadow="0 1px 1px rgba(0,0,0,0.1)"
                                    px={3}
                                    py={1}
                                    borderRadius="md"
                                    bg="purple.50"
                                    width={200}>
                                search
                            </Button>
                        </Link>
                    </NftCard>
                );
            })}
        </SimpleGrid>
    );
};