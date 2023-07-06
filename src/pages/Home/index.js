import { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Card from "../../components/Card";
import AddGroup from "./Sections/AddGroup";
import GroupCard from "./Sections/GroupCard";
import { db } from "../../utils/firebase";
import { AuthContext } from "../../components/Authentication/AuthProvider";
import { DataContext } from "../../components/Authentication/DataProvider";
import AddButton from "../../components/AddButton";
import Loader from "../../components/Loader";
import img1 from "../../assets/images/i5.jpeg"
import img2 from "../../assets/images/p3.jpeg"
import img3 from "../../assets/images/t3.jpeg"

const colorss = ["#B794F4", "#c5fb9d", "#f5a9b8", "#faf089", "#90D2DA", "#FEB2B2", "#FBD38D", "#DA90CB", "#DB90CB"]

const Home = () => {
    const { user } = useContext(AuthContext);
    const { transactions } = useContext(DataContext);
    const [groups, setGroups] = useState([]);
    const [amount, setAmount] = useState({ total: 0, iOwe: 0, peopleOwe: 0 })
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const temp = [];
        db.collection("groups")
            .where("members", "array-contains", user.uid)
            .get()
            .then((data) => {
                data.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    temp.push({ id: doc.id, data: doc.data() });
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            })
            .finally(() => {
                setGroups(temp)
                setLoading(false)
            });

    }, [user]);

    useEffect(() => {
        let total = 0, negative = 0, positive = 0;
        transactions.forEach((transaction) => {
            const amt = transaction.data.amount / transaction.data.involved.length
            if (transaction.data.paidBy === user.uid) {
                positive += amt
                total += amt
            } else {
                negative -= amt
                total += amt
            }
        })
        const updatedAmount = {
            total: total,
            iOwe: negative,
            peopleOwe: positive,
        }
        setAmount(updatedAmount)
    }, [transactions, user])

    // const [spent, setSpent] = useState(0);
    // const [remain, setRemain] = useState(0);
    // const spentLink = "/";
    // const remainLink = "/";

    return (
        <>
            <Container id="feedback">
                <Card
                    className="fbcard"
                    imgUrl={img3}
                    head="Total Expenditure"
                    text={`₹ ${amount.total}`}
                    textColor={'info'}
                    link="/transaction"
                />
                <Card
                    className="fbcard"
                    imgUrl={img2}
                    head="I OWE PEOPLE"
                    text={`₹ ${amount.iOwe}`}
                    textColor={'danger'}
                    link="/transaction"
                />
                <Card
                    className="fbcard"
                    imgUrl={img1}
                    head="PEOPLE OWE ME"
                    text={`₹ ${amount.peopleOwe}`}
                    textColor={'success'}
                    link="/user"
                />
            </Container>
            <br />
            <Container id="content">
                <div className="groups-wrapper">
                    <AddButton handler={handleShow} />
                    {show && <AddGroup show={show} handleClose={handleClose} />}
                    {loading ? <Loader /> :
                        groups?.map((group, key) => (
                            <GroupCard id={group.id} data={group.data} key={group.id} color={key} colorss={colorss} />
                        ))}
                </div>
            </Container>
        </>
    );
};

export default Home;
