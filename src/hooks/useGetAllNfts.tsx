import { getAllAptogotchis, getAptogotchi } from "@/utils/aptos";
import { AptogotchiWithTraits } from "@/utils/types";
import { useEffect, useState } from "react";

export const useGetAllNfts = () => {
  const [nfts, setNfts] = useState<AptogotchiWithTraits[]>();
  useEffect(() => {
    getAllAptogotchis().then(async (res) => {
      const aptogotchiWithTraits = [];
      console.log(res);
      for (const aptogotchi of res) {
        const [name, traits, description, documents, change_log, whitelist, coin_type, owner] = await getAptogotchi(aptogotchi.address);
        aptogotchiWithTraits.push({
          name,
          address: aptogotchi.address,
          description,
          documents,
          change_log,
          whitelist,
          coin_type,
          owner,
          ...traits,
        });
      }
      setNfts(aptogotchiWithTraits);
    });
  }, []);
  return nfts;
};
