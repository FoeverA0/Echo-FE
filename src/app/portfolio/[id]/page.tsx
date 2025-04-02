"use client";

import {Alert, AlertIcon, Box, Heading} from "@chakra-ui/react";
import {Portfolio} from "../../../components/Portfolio";
import {useKeylessAccount} from "@/context/KeylessAccountContext";
import {useParams} from "next/navigation";
import {useWallet} from "@aptos-labs/wallet-adapter-react";
import {useEffect, useState} from "react";

export default function Page() {
    return (
        <Box>
            <Heading margin={4} textAlign="center">
                Portfolio
            </Heading>
            <PageContent/>
        </Box>
    );
}

function PageContent() {
    const params = useParams();
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        const address = Array.isArray(params.id) ? params.id[0] : params.id;
        setId(address);
    }, [params.id]);
    const {keylessAccount, setKeylessAccount} = useKeylessAccount();
    if (!keylessAccount) {
        return (
            <Alert status="warning" variant="left-accent" marginY={8}>
                <AlertIcon/>
                Connect wallet to see your portfolio.
            </Alert>
        );
    }

    if (!id) {
        return (
            <Alert status="warning" variant="left-accent" marginY={8}>
                <AlertIcon />
                Please provide a valid address.
            </Alert>
        );
    }

    return <Portfolio address={id}/>;
}