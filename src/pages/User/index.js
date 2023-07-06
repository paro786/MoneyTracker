import { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Heading } from "@chakra-ui/react";
import { AuthContext } from "../../components/Authentication/AuthProvider";
// import { db } from "../../utils/firebase";
import UserTable from "../../components/UserTable"
import Loader from "../../components/Loader";
// import { DataContext } from "../../components/Authentication/DataProvider";
import { db } from "../../utils/firebase";
const User = () => {
    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [users, setUsers] = useState({});
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const temp = [];
        const tempFriends = []

        db.collection("transactions")
            .where("involved", "array-contains", user.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data());
                    const id = doc.id;
                    const data = doc.data();
                    const finalTransaction = {
                        id,
                        data,
                    }
                    data.involved.forEach(personId => {
                        if (tempFriends.includes(personId)) { }
                        else tempFriends.push(personId)
                    });
                    temp.push(finalTransaction);
                })
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            })
            .finally(() => {
                setFriends(tempFriends);
                setTransactions(temp);
            });
    }, [user]);
    useEffect(() => {
        const temp = {}
        if (friends.length) db.collection("users")
            .where("userId", "in", friends)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    const data = doc.data();
                    const dataWithAmt = { ...data, amount: 0 };
                    temp[data.userId] = dataWithAmt;
                    // setUsers((prevUsers) => {
                    //     return { ...prevUsers, [id]: dataWithAmt, }
                    // })
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            })
            .finally(() => {
                setUsers(temp)
                setLoading(false)
            })
    }, [friends]);

    // useEffect(() => {
    //     if (transactions.length !== 0 && Object.keys(users).length !== 0) {
    //         setTransactionsData(transactions)
    //         setUsersData(users)
    //         setLoading(false);
    //     }
    // }, [user, users, transactions]);
    return (
        <Container>
            <Heading margin={'2%'}>Users</Heading>
            {loading && <Loader />}
            {!loading && transactions.length !== 0 && Object.keys(users).length !== 0 && (
                <UserTable users={users} transactions={transactions} />
            )}
        </Container>
    );
};

export default User;