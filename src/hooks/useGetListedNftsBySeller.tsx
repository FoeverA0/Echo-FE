import {
  getAllListingObjectAddresses,
  getAptogotchi,
  getListingObjectAndSeller,
  getListingObjectPrice,
} from "@/utils/aptos";
import { ListedAptogotchiWithTraits } from "@/utils/types";
import { useEffect, useState } from "react";

export const useGetListedNftsBySeller = (sellerAddr: string) => {
  const [nfts, setNfts] = useState<ListedAptogotchiWithTraits[]>();
  useEffect(() => {
    getAllListingObjectAddresses(sellerAddr).then(
      async (listingObjectAddresses) => {
        const aptogotchiWithTraits = [];
        for (const listingObjectAddress of listingObjectAddresses) {
          const [nftAddress, sellerAddress] = await getListingObjectAndSeller(
            listingObjectAddress
          );
          const price = await getListingObjectPrice(listingObjectAddress);
          const [name, traits, description, documents, change_log, whitelist, coin_type, owner, per_search_fee] = await getAptogotchi(nftAddress);
          aptogotchiWithTraits.push({
            name,
            address: nftAddress,
            description,
            documents,
            change_log,
            whitelist,
            coin_type,
            owner,
            per_search_fee,
            ...traits,
            listing_object_address: listingObjectAddress,
            seller_address: sellerAddress,
            price,
          });
        }
        setNfts(aptogotchiWithTraits);
      }
    );
  }, [sellerAddr]);
  return nfts;
};
