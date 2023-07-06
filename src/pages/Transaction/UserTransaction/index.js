import React from 'react'
import { Heading } from "@chakra-ui/react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import TransactionTable from '../../../components/TransactionTable';

const UserTransaction = () => {
    const { id } = useParams();
    return (
        <Container>
            <Heading margin={'2%'}>Transactions</Heading>
            <TransactionTable id={id} />
        </Container>
    );
};


export default UserTransaction