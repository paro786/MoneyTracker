import { useContext, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { AuthContext } from './Authentication/AuthProvider';
import { Badge, Button, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { LaunchRounded } from '@mui/icons-material';

function UserTable({ users, transactions }) {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true)
    // const [transactionData, setTransactionData] = useState([]);
    // const [balances, setBalances] = useState([]);
    useEffect(() => {
        console.log("users=>", users);
        console.log("transactions=>", transactions);
        transactions.forEach(transaction => {
            transaction.data.involved.forEach((personId) => {
                if (personId === user.uid) {
                }
                else {
                    if (transaction.data.paidBy === user.uid) {
                        users[personId].amount += transaction.data.amount / transaction.data.involved.length
                    } else {
                        users[personId].amount -= transaction.data.amount / transaction.data.involved.length
                    }
                }
                // if (transaction.data.paidBy === user.uid) {
                //     users[personId].amount += transaction.data.amount / transaction.data.involved.length
                // } else {
                //     tempUsers[personId].amount -= transaction.data.amount / transaction.data.involved.length
                // }
            })
        })
        // setTransactionData(tempTransactions);
        // setUsers(tempUsers);
        setLoading(false)
    }, [user, users, transactions]);
    return (
        <Table style={{ fontSize: '1.5rem' }} striped>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                {!loading && transactions.length !== 0 && Object.keys(users)?.map((row, key) => {
                    if (users[row].userId !== user.uid)
                        return (
                            <tr key={key}>
                                <td>{users[row].name}</td>
                                <td>
                                    {users[row].amount >= 0 ? (
                                        <Badge borderRadius={'50px'} colorScheme='green'>Lent</Badge>
                                    ) : (
                                        <Badge borderRadius={'50px'} colorScheme='red'>Borrowed</Badge>
                                    )}
                                </td>
                                <td>
                                    {users[row].amount >= 0 ? (
                                        <Text as={'b'} color='green'>{users[row].amount}</Text>
                                    ) : (
                                        <Text as={'b'} color='red'>{users[row].amount}</Text>
                                    )}
                                </td>
                                <td>
                                    <Link to={`/transaction/user/${row}`}>
                                        <Button colorScheme='messenger'>
                                            Details
                                            <LaunchRounded />
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        )
                    else return null
                })}
            </tbody>
        </Table>
    );
}

export default UserTable;