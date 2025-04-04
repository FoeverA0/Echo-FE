import {Aptos, AptosConfig, Network, Account} from "@aptos-labs/ts-sdk";
import {Aptogotchi, AptogotchiTraits, ChangeLog, DocumentInfo} from "./types";

export const APTOGOTCHI_CONTRACT_ADDRESS =
    "0x7b919dba2e8a3427095d970d8631261696b6d88263c309a20d3e9eb44c394812";
export const COLLECTION_ID =
    "0xd6903ce40606a9a75a142353db1d96b8f304548747eb59c6fbb699f8ad4a03d9";
export const COLLECTION_CREATOR_ADDRESS =
    "0x33da18517290047803e4508d64b09e769ce1648fb880501b352d14931d78ab6a";
export const COLLECTION_NAME = "Aptogotchi Collection";
export const MARKETPLACE_CONTRACT_ADDRESS =
    "0x7b919dba2e8a3427095d970d8631261696b6d88263c309a20d3e9eb44c394812";
export const APT = "0x1::aptos_coin::AptosCoin";
export const APT_UNIT = 100_000_000;

const config = new AptosConfig({
    network: Network.TESTNET,
});
export const aptos = new Aptos(config);

export const getAptogotchi = async (
    aptogotchiObjectAddr: string
): Promise<[string, AptogotchiTraits, string, DocumentInfo[], ChangeLog[], Array<string>, string, string, number]> => {
    //console.log("aptogotchiObjectAddr", aptogotchiObjectAddr);
    const aptogotchi = await aptos.view({
        payload: {
            function: `${APTOGOTCHI_CONTRACT_ADDRESS}::main::get_echo`,
            typeArguments: [],
            functionArguments: [aptogotchiObjectAddr],
        },
    });
    //console.log(aptogotchi);
    return [aptogotchi[0] as string,
        aptogotchi[1] as AptogotchiTraits,
        aptogotchi[2] as string,
        aptogotchi[3] as DocumentInfo[],
        aptogotchi[4] as ChangeLog[],
        aptogotchi[5] as string[],
        aptogotchi[6] as string,
        aptogotchi[7] as string,
        aptogotchi[8] as number
    ];
};

export const mintAptogotchi = async (
    sender: Account,
    name: string,
    body: number,
    ear: number,
    face: number
) => {
    const rawTxn = await aptos.transaction.build.simple({
        sender: sender.accountAddress,
        data: {
            function: `${APTOGOTCHI_CONTRACT_ADDRESS}::main::create_echo`,
            functionArguments: [name, body, ear, face],
        },
    });
    const pendingTxn = await aptos.signAndSubmitTransaction({
        signer: sender,
        transaction: rawTxn,
    });
    const response = await aptos.waitForTransaction({
        transactionHash: pendingTxn.hash,
    });
    //console.log("minted aptogotchi. - ", response.hash);
};

export const getAptBalance = async (addr: string) => {
    const result = await aptos.getAccountCoinAmount({
        accountAddress: addr,
        coinType: APT,
    });

    //console.log("APT balance", result);
    return result;
};

export const getCollection = async () => {
    // const collection = await aptos.getCollectionDataByCollectionId({
    //   collectionId: COLLECTION_ID,
    // });
    const collection = await aptos.getCollectionData({
        collectionName: COLLECTION_NAME,
        creatorAddress: COLLECTION_CREATOR_ADDRESS,
    });
    //console.log("collection", collection);
    return collection;
};

export const getUserOwnedAptogotchis = async (ownerAddr: string) => {
    const result = await aptos.getAccountOwnedTokensFromCollectionAddress({
        accountAddress: ownerAddr,
        collectionAddress: COLLECTION_ID,
    });

    //console.log("my aptogotchis", result);
    return result;
};

export const getAllAptogotchis = async () => {
    const result: {
        current_token_datas_v2: Aptogotchi[];
    } = await aptos.queryIndexer({
        query: {
            query: `
        query MyQuery($collectionId: String) {
          current_token_datas_v2(
            where: {collection_id: {_eq: $collectionId}}
          ) {
            name: token_name
            address: token_data_id
          }
        }
      `,
            variables: {collectionId: COLLECTION_ID},
        },
    });

    //("all aptogotchis", result.current_token_datas_v2);
    return result.current_token_datas_v2;
};

export const listAptogotchi = async (
    sender: Account,
    aptogotchiObjectAddr: string
) => {
    const rawTxn = await aptos.transaction.build.simple({
        sender: sender.accountAddress,
        data: {
            function: `${MARKETPLACE_CONTRACT_ADDRESS}::token_marketplace::list_with_fixed_price`,
            typeArguments: [APT],
            functionArguments: [aptogotchiObjectAddr, 10],
        },
    });
    const pendingTxn = await aptos.signAndSubmitTransaction({
        signer: sender,
        transaction: rawTxn,
    });
    const response = await aptos.waitForTransaction({
        transactionHash: pendingTxn.hash,
    });
    //console.log("listed aptogotchi. - ", response.hash);
};

export const buyAptogotchi = async (
    sender: Account,
    listingObjectAddr: string
) => {
    const rawTxn = await aptos.transaction.build.simple({
        sender: sender.accountAddress,
        data: {
            function: `${MARKETPLACE_CONTRACT_ADDRESS}::token_marketplace::purchase`,
            typeArguments: [APT],
            functionArguments: [listingObjectAddr],
        },
    });
    const pendingTxn = await aptos.signAndSubmitTransaction({
        signer: sender,
        transaction: rawTxn,
    });
    const response = await aptos.waitForTransaction({
        transactionHash: pendingTxn.hash,
    });
    //console.log("bought aptogotchi. - ", response.hash);
};

export const getAllListingObjectAddresses = async (sellerAddr: string) => {
    const allListings: [string[]] = await aptos.view({
        payload: {
            function: `${MARKETPLACE_CONTRACT_ADDRESS}::token_marketplace::get_seller_listings`,
            typeArguments: [],
            functionArguments: [sellerAddr],
        },
    });
    //console.log("all listings", allListings);
    return allListings[0];
};

export const getAllSellers = async () => {
    const allSellers: [string[]] = await aptos.view({
        payload: {
            function: `${MARKETPLACE_CONTRACT_ADDRESS}::token_marketplace::get_sellers`,
            typeArguments: [],
            functionArguments: [],
        },
    });
    //console.log("all sellers", allSellers);
    return allSellers[0];
};

export const getListingObjectAndSeller = async (
    listingObjectAddr: string
): Promise<[string, string]> => {
    const listingObjectAndSeller = await aptos.view({
        payload: {
            function: `${MARKETPLACE_CONTRACT_ADDRESS}::token_marketplace::listing`,
            typeArguments: [],
            functionArguments: [listingObjectAddr],
        },
    });
    //console.log("listing object and seller", listingObjectAndSeller);
    return [
        // @ts-ignore
        listingObjectAndSeller[0]["inner"] as string,
        listingObjectAndSeller[1] as string,
    ];
};

export const getListingObjectPrice = async (
    listingObjectAddr: string
): Promise<number> => {
    const listingObjectPrice = await aptos.view({
        payload: {
            function: `${MARKETPLACE_CONTRACT_ADDRESS}::token_marketplace::price`,
            typeArguments: [APT],
            functionArguments: [listingObjectAddr],
        },
    });
    //console.log("listing object price", JSON.stringify(listingObjectPrice));
    // @ts-ignore
    return (listingObjectPrice[0]["vec"] as number) / APT_UNIT;
};
