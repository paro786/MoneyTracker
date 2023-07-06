import { useContext, useEffect, useState } from "react";
import { FormControl, FormLabel, FormErrorMessage, Input, Box, Heading, Select, Stack, useToast } from "@chakra-ui/react";
import { Button, Container, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { addTransactionResolver } from "../../../utils/validator/addTransactionResolver";
import { db } from "../../../utils/firebase";
import GroupTable from "../../../components/GroupTable";
import { useParams } from "react-router-dom";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { DataContext } from "../../../components/Authentication/DataProvider";

const GroupTransaction = () => {
    const { id } = useParams();

    const { currentGroup, users, groups } = useContext(DataContext);
    const [currentGroupData, setCurrentGroupData] = useState({});
    const [payerId, setPayerId] = useState('')
    const [involved, setInvolved] = useState([])
    const [showAdd, setShowAdd] = useState(false);
    const [request, setRequest] = useState(true);
    const handleClose = () => setShowAdd(false);
    const handleShowAdd = () => setShowAdd(true);
    const toast = useToast();
    const {
        handleSubmit,
        register,
        formState: { errors },
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
            groupId: currentGroupData.id,
            groupTitle: currentGroupData.data.title,
            day,
            desc,
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
                handleClose()
                setRequest(!request)
            })

    }
    const handleChange = (event) => {
        const payerId = event.target.value;
        setPayerId(payerId)
    };
    const handleInvolved = (e) => {
        const value = e.target.value;
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
        if (currentGroup && (groups.length !== 0)) {
            let temp;
            groups.forEach(group => {
                if (group.data.title === currentGroup) {
                    temp = group
                }
            });
            setCurrentGroupData(temp)
        }
    }, [currentGroup, groups]);
    useEffect(() => {
        if (Object.keys(currentGroupData).length !== 0) {
            setInvolved(currentGroupData.data.members)
        }
    }, [currentGroupData])



    return (
        <Container style={{ width: "80%" }}>
            <Heading display={"inline-block"} margin={'2%'}>{currentGroup}</Heading>
            <Button variant="dark" style={{ float: "right", margin: "10px", borderRadius: "50%", backgroundColor: "black", height: "50px", width: "50px", color: '#04bef8' }} onClick={handleShowAdd}>
                <AddRoundedIcon />
            </Button>

            <Modal show={showAdd} onHide={handleClose}>
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
                                placeholder="Enter Title"
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
                                placeholder="Enter Amount"
                                {...register("amount")}
                            />
                            <FormErrorMessage>
                                {errors.amount && errors.amount.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.payer}>
                            <FormLabel htmlFor="payer">Paid By:</FormLabel>
                            <Select isInvalid={errors.payer} onChangeCapture={handleChange} name='payer' placeholder='Select payer' {...register("payer")} >
                                {Object.keys(currentGroupData).length !== 0 && Object.keys(users).length !== 0 && currentGroupData.data.members?.map((memberId) => (
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
                                {Object.keys(users).length !== 0 && Object.keys(currentGroupData).length !== 0 && involved.length !== 0 && currentGroupData.data.members?.map(memberId => (
                                    <FormLabel>
                                        <input
                                            type="checkbox"
                                            checked={involved.includes(memberId)}
                                            disabled={memberId === payerId}
                                            onChange={handleInvolved}
                                            value={memberId}
                                            placeholder={"Enter email to add"}
                                        />
                                        {users[memberId].name}
                                    </FormLabel>
                                ))}

                            </Stack>
                        </FormControl>

                        <Box mt="5" color="red.500">
                            {errors.API_ERROR && errors.API_ERROR.message}
                        </Box>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button type="submit" variant="success">
                            Submit
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
            <GroupTable request={request} setRequest={setRequest} id={id} />
        </Container>
    );
};

export default GroupTransaction;
