import Table from 'react-bootstrap/Table';
import { db } from '../utils/firebase';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './Authentication/AuthProvider';
import { DataContext } from './Authentication/DataProvider';
import { Badge, Box, IconButton, useToast } from '@chakra-ui/react';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

function GroupTable({ request, setRequest, id }) {
    const { user } = useContext(AuthContext);
    const { users } = useContext(DataContext)
    const [transactions, setTransactions] = useState([]);
    const toast = useToast();

    useEffect(() => {
        let temp = [];
        db.collection("transactions")
            .where("involved", "array-contains", user.uid)
            .where("groupId", "==", id)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data());
                    temp.push({ id: doc.id, data: doc.data() });
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            })
            .finally(() => {
                setTransactions(temp)
            });
    }, [user, id, request]);

    const deleteTransaction = (id) => {
        db.collection("transactions").doc(id).delete().then(() => {
            toast({
                title: 'top-right toast',
                position: 'top-right',
                isClosable: true,
                render: () => (
                    <Box color='white' p={3} bg='red.500'>
                        Transaction deleted successfully!!
                    </Box>
                ),
            })
            setRequest(!request)
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }
    const settleTransaction = (id) => {
        // Add a new document in collection "cities"
        db.collection("transactions").doc(id).set({
            status: "settled",
        }, { merge: true })
            .then(() => {
                toast({
                    title: 'top-right toast',
                    position: 'top-right',
                    isClosable: true,
                    render: () => (
                        <Box color='white' p={3} bg='green.500'>
                            Transaction settled up!!
                        </Box>
                    ),
                })
                setRequest(!request)
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }
    const getDate = (isoString) => {
        const date = new Date(isoString).toDateString()
        return date
    }

    return (





        <Table className="table align-middle mb-0 bg-white">


            <thead className="bg-light" >
                <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Day</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Actions</th>

                </tr>
            </thead>
            <tbody>

                {transactions?.map((transaction) => (
                    <tr key={transaction.id}>
                        <td><div className="d-flex align-items-center">



                            <div className="ms-3">
                                <p className="fw-bold mb-1">{transaction.data.title}</p>
                                <p className="text-muted mb-0">
                                    {users && transaction.data.paidBy === user.uid ? "YOU Paid" : `Paid by: ${users[transaction.data.paidBy].name}`}
                                </p>
                            </div>


                        </div></td>
                        <td><p className="fw-bold mb-1">{transaction.data.category}</p>
                            <p className="text-muted mb-0">{transaction.data.desc}</p>
                        </td>
                        <td>{transaction.data.day}</td>
                        <td>{getDate(transaction.data.datetime)}</td>
                        <td>

                            {transaction.data.status !== 'pending' ? (
                                <div>
                                    <Badge variant='solid' colorScheme='green'>
                                        {transaction.data.status}
                                    </Badge>
                                </div>

                            ) : (
                                <div>
                                    <Badge variant='outline' colorScheme='red'>
                                        {transaction.data.status}
                                    </Badge>
                                </div>
                            )}

                        </td>

                        <td>{transaction.data.amount}</td>

                        <td>
                            <IconButton
                                variant='outline'
                                colorScheme='red'
                                aria-label='Send email'
                                onClick={() => deleteTransaction(transaction.id)}
                                icon={<DeleteIcon />}
                            />
                            {" "}
                            {transaction.data.status === 'pending' && transaction.data.paidBy === user.uid && (
                                <IconButton
                                    variant='outline'
                                    colorScheme='green'
                                    aria-label='Send email'
                                    onClick={() => settleTransaction(transaction.id)}
                                    icon={<CheckCircleOutlineRoundedIcon />}
                                />
                            )}


                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default GroupTable;