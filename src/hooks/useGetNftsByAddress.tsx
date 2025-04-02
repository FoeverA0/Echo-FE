import {getAptogotchi, getListingObjectPrice} from "@/utils/aptos";
import { AptogotchiWithTraits } from "@/utils/types";
import { useEffect, useState } from "react";

export const useGetNftsByAddress = (nftAddress: string) => {
  const [nft, setNft] = useState<AptogotchiWithTraits | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!nftAddress) return;

    const fetchNft = async () => {
      setLoading(true);
      try {
        const [name, traits, description, documents, change_log, whitelist, coin_type, owner] = await getAptogotchi(nftAddress);
        setNft({
          name: name || "Unnamed NFT", // 确保包含 name 属性
          address: nftAddress,
          description,
          documents,
          change_log,
          whitelist,
          coin_type,
          owner,
          ...traits,
        });
      } catch (error) {
        console.error("Failed to fetch NFT data:", error);
        setNft(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNft();
  }, [nftAddress]);

  return { nft, loading };
};