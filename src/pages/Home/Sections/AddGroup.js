import React, { useContext, useState } from 'react'
import { FormControl, FormLabel, FormErrorMessage, Input, Box, useToast } from "@chakra-ui/react";
import { Button, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { db } from '../../../utils/firebase'
import { addGroupResolver } from '../../../utils/validator/addGroupResolver';
import ListMail from './ListMail';
import { AuthContext } from '../../../components/Authentication/AuthProvider';
import { DataContext } from '../../../components/Authentication/DataProvider';

const AddGroup = (props) => {
    const { user } = useContext(AuthContext)
    const { requestGroups, setRequestGroups } = useContext(DataContext)
    const { show, handleClose } = props;
    // const [members, setMembers] = useState([]);
    const [currEmail, setCurrEmail] = useState('');
    const [mails, setMails] = useState([]);
    const toast = useToast();
    const handleChange = (event) => {
        setCurrEmail(event.target.value)
    };

    const {
        handleSubmit,
        register,
        formState: { errors },
        trigger,
        setError,
        // clearErrors,
    } = useForm({ resolver: addGroupResolver });

    const getUserByEmail = () => {
        db.collection("users")
            .where("email", "==", currEmail)
            .get()
            .then((data) => {

                if (data.size === 0) {
                    setError('involved', { type: 'custom', message: 'Account not found' });
                }
                data.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    setMails(prevMails => [...prevMails, doc.data()])
                });

            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            })
            .finally(() => {
                console.log("mails", mails)
            })
    }


    const addGroup = ({ title, days, desc }) => {
        const firstLetter = title.charAt(0);
        const firstLetterCap = firstLetter.toUpperCase();
        const remainingLetters = title.slice(1);
        const finalTitle = firstLetterCap + remainingLetters;
        const arr = [user.uid];
        mails.forEach((mail) => {
            arr.push(mail.userId)
        })
        const finalDoc = {
            title: finalTitle,
            days,
            desc,
            members: arr,
        }

        db.collection("groups").add(finalDoc)
            .then((ref) => {
                toast({
                    title: 'top-right toast',
                    position: 'top-right',
                    isClosable: true,
                    render: () => (
                        <Box color='white' p={3} bg='blue.500'>
                            Group added successfully!!
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
                setRequestGroups(!requestGroups)
            })

    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Group</Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit(addGroup)}>
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

                    <FormControl marginTop="2" isInvalid={errors.days}>
                        <FormLabel htmlFor="days">Days</FormLabel>
                        <Input
                            type="number"
                            name="days"
                            placeholder="Number of days of the trip"
                            {...register("days")}
                        />
                        <FormErrorMessage>
                            {errors.days && errors.days.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl mt="2" isInvalid={errors.involved}>
                        <FormLabel htmlFor="involved">Add members to the group</FormLabel>
                        <input
                            type={"email"}
                            name="involved"
                            id="field-5"
                            {...register('involved')}
                            onChange={handleChange}
                            className="chakra-input css-1c6j008"
                            value={currEmail}
                            placeholder={"Enter email to add"}
                        />
                        <Button onClick={() => {
                            trigger("involved")
                                .then(() => getUserByEmail())
                                .catch((err) => console.log("Error: ", err))
                        }}>+</Button>
                        <FormErrorMessage>
                            {errors.involved && errors.involved.message}
                        </FormErrorMessage>
                        {mails && <ListMail mails={mails} />}
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
    )
}

export default AddGroup;