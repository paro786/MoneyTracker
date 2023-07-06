import React, { useContext, useEffect, useState } from "react";
import { FormControl, FormLabel, FormErrorMessage, Input, Box, Heading, useToast, Select, Stack } from "@chakra-ui/react";
import { Button, Container, Modal } from "react-bootstrap";
import TransactionTable from "../../components/TransactionTable";
import { useForm } from "react-hook-form";
import { addTransactionResolver } from "../../utils/validator/addTransactionResolver";
import { db } from "../../utils/firebase";
import FilterListIcon from '@mui/icons-material/FilterList';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { AuthContext } from "../../components/Authentication/AuthProvider";
import { DataContext } from "../../components/Authentication/DataProvider";
import Loader from "../../components/Loader";

const Transaction = () => {
    const { user } = useContext(AuthContext)
    const { groups, transactions, users, requestTransactions, setRequestTransactions } = useContext(DataContext)
    const [currentGroup, setCurrentGroup] = useState({});
    const [involved, setInvolved] = useState([]);
    const [filters, setFilters] = useState({ groupId: '', userId: '' });
    const [showAdd, setShowAdd] = useState(false);
    const [showGroup, setShowGroup] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [payerId, setPayerId] = useState(user.uid);
    const handleCloseGroup = () => setShowGroup(false);
    const handleCloseFilter = () => setShowFilter(false);
    const handleCloseAdd = () => setShowAdd(false);
    const handleShowGroup = () => setShowGroup(true);
    const handleShowAdd = () => setShowAdd(true);
    const handleShowFilter = () => setShowFilter(true);
    const toast = useToast();
    // console.log(searchParams);
    const {
        handleSubmit,
        register,
        formState: { errors },
        // setError,
        // clearErrors,
    } = useForm({ resolver: addTransactionResolver });
    const addTransaction = (data) => {
        const { title, desc, day, amount, payer } = data
        const firstLetter = title.charAt(0);
        const firstLetterCap = firstLetter.toUpperCase();
        const remainingLetters = title.slice(1);
        const finalTitle = firstLetterCap + remainingLetters
        const date = new Date().toISOString()
        const finalDoc = {
            datetime: date,
            title: finalTitle,
            desc,
            groupId: currentGroup.id,
            groupTitle: currentGroup.data.title,
            day,
            amount,
            paidBy: payer,
            involved,
            status: "pending",
        }

        db.collection("transactions").add(finalDoc)
            .then((ref) => {
                toast({
                    title: 'top-right toast',
                    position: 'top-right',
                    isClosable: true,
                    render: () => (
                        <Box color='white' p={3} bg='blue.500'>
                            Transaction added successfully!!
                        </Box>
                    ),
                })
                console.log("Document successfully written!", ref.id, ref.data);
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            })
            .finally(() => {
                handleCloseAdd()
                setRequestTransactions(!requestTransactions)
            })

    }
    const handleFilter = (e) => {
        e.preventDefault()
        const groupId = e.target.group.value
        const userId = e.target.user.value
        setFilters({
            groupId,
            userId,
        })
        handleCloseFilter()
    }
    const handleGroupSelector = (e) => {
        e.preventDefault()
        const grpId = e.target.group.value
        let curr;
        groups.forEach(group => {
            if (group.id === grpId) {
                curr = group
            }
        });
        setCurrentGroup(curr)
        handleCloseGroup()
        handleShowAdd()
    }
    const handleChange = (event) => {
        const payerId = event.target.value;
        setPayerId(payerId)
    };
    const handleInvolved = (e) => {
        const value = e.target.value;
        console.log(value);
        if (!e.target.checked) {
            const prev = involved.filter(val => value !== val)
            setInvolved(prev)
        }
        if (e.target.checked) {
            const prev = involved;
            prev.push(value)
            setInvolved(prev)
        }
    }
    useEffect(() => {
        if (Object.keys(currentGroup).length !== 0) setInvolved(currentGroup.data.members)
    }, [currentGroup]);


    return (
        <Container style={{ width: "80%" }}>
            <Heading display={"inline-block"} margin={"2%"}>Transactions</Heading>
            <Button variant="dark" style={{ float: "right", margin: "10px", borderRadius: "50%", backgroundColor: "black", height: "50px", width: "50px", color: '#04bef8' }} onClick={handleShowGroup}><AddRoundedIcon /></Button>
            <Button variant="dark" style={{ float: "right", margin: "10px", borderRadius: "50%", backgroundColor: "black", height: "50px", width: "50px", color: '#04bef8' }} onClick={handleShowFilter}><FilterListIcon /></Button>
            <br />
            <Modal show={showFilter} onHide={handleCloseFilter}>
                <Modal.Header closeButton>
                    <Modal.Title>Filter By</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleFilter}>
                    <Modal.Body>
                        <FormControl>
                            <FormLabel htmlFor="group">Group</FormLabel>
                            <Select name='group' placeholder='Select a group' >
                                {groups?.map((group) => (
                                    <option key={group.id} value={group.id}>{group.data.title}</option>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="user">User</FormLabel>
                            <Select name='user' placeholder='Select a user' >
                                {Object.keys(users).length !== 0 && Object.keys(users)?.map((memberId) => {
                                    if (memberId !== user.uid)
                                        return (<option key={memberId} value={memberId}>{users[memberId].name}</option>)
                                    else return null
                                })}
                            </Select>
                        </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseFilter}>
                            Close
                        </Button>
                        <Button type="submit" variant="info">
                            Apply
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            <Modal show={showGroup} onHide={handleCloseGroup}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Group</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleGroupSelector}>
                    <Modal.Body>
                        <FormControl>
                            <FormLabel htmlFor="group">Group</FormLabel>
                            <Select required name='group' placeholder='Select a group' >
                                {groups?.map((group) => (
                                    <option key={group.id} value={group.id}>{group.data.title}</option>
                                ))}
                            </Select>
                        </FormControl>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseGroup}>
                            Close
                        </Button>
                        <Button type="submit" variant="info">
                            Next
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
            <Modal show={showAdd} onHide={handleCloseAdd}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Transaction</Modal.Title>
                </Modal.Header>
                <form onSubmit={handleSubmit(addTransaction)}>
                    <Modal.Body>
                        <FormControl isInvalid={errors.title}>
                            <FormLabel htmlFor="title">Title</FormLabel>
                            <Input
                                type="text"
                                name="title"
                                placeholder="Enter title"
                                {...register("title")}
                            />
                            <FormErrorMessage>
                                {errors.title && errors.title.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl marginTop="2" isInvalid={errors.desc}>
                            <FormLabel htmlFor="desc">Description</FormLabel>
                            <Input
                                type="text"
                                name="desc"
                                placeholder="Add a note"
                                {...register("desc")}
                            />
                            <FormErrorMessage>
                                {errors.desc && errors.desc.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl marginTop="2" isInvalid={errors.day}>
                            <FormLabel htmlFor="day">Day</FormLabel>
                            <Input
                                type="number"
                                name="day"
                                placeholder="Enter day of trip"
                                {...register("day")}
                            />
                            <FormErrorMessage>
                                {errors.day && errors.day.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl marginTop="2" isInvalid={errors.amount}>
                            <FormLabel htmlFor="amount">Amount</FormLabel>
                            <Input
                                type="number"
                                name="amount"
                                placeholder="Enter amount"
                                {...register("amount")}
                            />
                            <FormErrorMessage>
                                {errors.amount && errors.amount.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.payer}>
                            <FormLabel htmlFor="payer">Paid By:</FormLabel>
                            {/* <Input
                                type="text"
                                name="payer"
                                placeholder="Select a payer"
                                {...register("payer")}
                            /> */}
                            <Select isInvalid={errors.payer} onChangeCapture={handleChange} name='payer' placeholder='Select payer' {...register("payer")} >
                                {Object.keys(users).length !== 0 && Object.keys(currentGroup).length !== 0 && currentGroup.data.members?.map((memberId) => (
                                    <option key={memberId} value={memberId}>{users[memberId].name}</option>
                                ))}
                            </Select>
                            <FormErrorMessage>
                                {errors.payer && errors.payer.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl as='fieldset' mt="2">
                            <FormLabel htmlFor="involved">Add members involved</FormLabel>
                            <Stack spacing={[1, 5]} direction={['column', 'row']}>
                                {Object.keys(users).length !== 0 && payerId && currentGroup.data && involved.length !== 0 && currentGroup.data.members?.map(memberId => (
                                    <FormLabel>
                                        <input
                                            type="checkbox"
                                            checked={involved.includes(memberId)}
                                            disabled={memberId === payerId}
                                            // name="involved"
                                            // id="field-5"
                                            // {...register('involved')}
                                            onChange={handleInvolved}
                                            // className="chakra-input css-1c6j008"
                                            value={memberId}
                                            placeholder={"Enter email to add"}
                                        />
                                        {users[memberId].name}
                                        {/* <Checkbox isDisabled={memberId === payerId} key={users[memberId].userId} value={users[memberId].userId}>{users[memberId].name}</Checkbox> */}
                                    </FormLabel>
                                ))}

                            </Stack>
                            <FormErrorMessage>
                                {errors.involved && errors.involved.message}
                            </FormErrorMessage>
                        </FormControl>

                        <Box mt="5" color="red.500">
                            {errors.API_ERROR && errors.API_ERROR.message}
                        </Box>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAdd}>
                            Close
                        </Button>
                        <Button type="submit" variant="success">
                            Submit
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            {transactions.length === 0 || Object.keys(users).length === 0 ? <Loader /> : (
                <TransactionTable id={filters.userId} group={filters.groupId} />
            )}
        </Container>
    );
};

export default Transaction;
