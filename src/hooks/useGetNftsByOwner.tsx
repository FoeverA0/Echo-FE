import {getAptogotchi, getUserOwnedAptogotchis} from "@/utils/aptos";
import {AptogotchiWithTraits} from "@/utils/types";
import {useEffect, useState} from "react";

export const useGetNftsByOwner = (ownerAddr: string) => {
    const [nfts, setNfts] = useState<AptogotchiWithTraits[]>();
    useEffect(() => {
        getUserOwnedAptogotchis(ownerAddr).then(async (res) => {
            const aptogotchiWithTraits = [];
            for (const aptogotchi of res) {
                const [_, traits, description, documents, change_log, whitelist, coin_type, owner, per_search_fee] = await getAptogotchi(aptogotchi.token_data_id);
                aptogotchiWithTraits.push({
                    name: aptogotchi.current_token_data?.token_name || "no name",
                    address: aptogotchi.token_data_id,
                    description,
                    documents,
                    change_log,
                    whitelist,
                    coin_type,
                    owner,
                    per_search_fee,
                    ...traits,
                });
            }
            setNfts(aptogotchiWithTraits);
        });
    }, [ownerAddr]);
    return nfts;
};
