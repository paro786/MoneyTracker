import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthProvider';
import { db } from '../../utils/firebase';

export const DataContext = createContext();
export const DataProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [groups, setGroups] = useState([]);
    const [currentGroup, setCurrentGroup] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [friends, setFriends] = useState([]);
    const [users, setUsers] = useState({});
    const [requestGroups, setRequestGroups] = useState(true);
    const [requestTransactions, setRequestTransactions] = useState(true);
    const [requestUsers, setRequestUsers] = useState(true);
    useEffect(() => {
        const temp = [];
        // const tempFriends = []
        db.collection("transactions")
            .where("involved", "array-contains", user.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // console.log(doc.id, " => ", doc.data());
                    const id = doc.id;
                    const data = doc.data();
                    const finalTransaction = {
                        id,
                        data,
                    }
                    // data.involved.forEach(personId => {
                    //     if (tempFriends.includes(personId)) { }
                    //     else tempFriends.push(personId)
                    // });
                    temp.push(finalTransaction);
                })
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            })
            .finally(() => {
                // setFriends(tempFriends);
                setTransactions(temp);
            });


    }, [user, requestTransactions]);
    useEffect(() => {
        const temp = {}
        if (friends.length) db.collection("users")
            .where("userId", "in", friends)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
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
                // setLoading(false)
            })
    }, [friends, requestUsers]);
    useEffect(() => {
        const temp = [];
        const tempFriends = []
        db.collection("groups")
            .where("members", "array-contains", user.uid)
            .get()
            .then((data) => {
                data.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    temp.push({ id: doc.id, data: doc.data() });
                    const data = doc.data();
                    data.members.forEach(personId => {
                        if (tempFriends.includes(personId)) { }
                        else tempFriends.push(personId)
                    });
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            })
            .finally(() => {
                setFriends(tempFriends);
                setGroups(temp)
            });
    }, [user, requestGroups]);

    return (
        <DataContext.Provider value={{
            groups,
            setGroups,
            requestGroups,
            setRequestGroups,
            transactions,
            setTransactions,
            requestTransactions,
            setRequestTransactions,
            users,
            setUsers,
            requestUsers,
            setRequestUsers,
            currentGroup,
            setCurrentGroup
        }} >
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider