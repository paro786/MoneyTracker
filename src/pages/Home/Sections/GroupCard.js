import React, { useContext, useState } from 'react'
import { Avatar, AvatarGroup, Badge } from '@chakra-ui/react';
import { LaunchRounded } from '@mui/icons-material';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { DataContext } from '../../../components/Authentication/DataProvider';

const GroupCard = ({ id, data, color, colorss }) => {
    const { currentGroup, setCurrentGroup, users } = useContext(DataContext);
    const { title, desc, days, members } = data;

    const [membersName, setMembersName] = useState([]);
    useEffect(() => {
        const arr = [];
        if ((Object.keys(users).length !== 0) && (members.length !== 0)) {
            members.forEach((member) => {
                const temp = users[member];
                if (temp) arr.push(temp);
            })
            setMembersName(arr)
        }

    }, [members, users]);
    // const [currentGroup, setCurrentGroup] = useState('');
    const handleGroup = () => {
        setCurrentGroup(title)
        console.log(currentGroup);
    }
    return (
        <Container fluid>

            <div className='groupCardHover' style={{ width: "100%", minHeight: "25vh", height: 'auto', display: 'flex', alignContent: 'center', alignItems: 'center', justifyContent: 'center', marginTop: '2%' }}>
                {/* <div className='rounded-xl overflow-hidden h-[65vw] md:h-[35vw] lg:h-72'>
                        <img src={item?.thumbnail} alt={`${item?.title} thumbnail`} className='w-full h-full object-cover' />
                    </div> */}
                <div style={{ width: "50vw", backgroundColor: `${colorss[color % colorss.length]}`, borderRadius: '1.5rem', padding: '2rem' }}>
                    <div style={{ float: 'right', display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center' }}>

                        <>
                            <AvatarGroup size='md' max={5}>
                                {membersName?.map((member, key) => (

                                    <Avatar key={key} name={member.name} src='' />
                                ))}
                            </AvatarGroup>
                        </>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center' }}>

                        <p style={{ fontSize: "2rem", display: "inline-block" }}> {title} <Badge borderRadius={'50px'} color={'black'} border={`1px solid black`} variant='outline' colorScheme={'black'}>{days} Days Trip</Badge></p>
                        <p style={{ fontSize: "1.5rem", display: "inline-block" }}>{desc}</p>
                    </div>
                    <Link onClick={handleGroup} to={`/transaction/group/${id}`} style={{ fontSize: '1.5rem' }}>
                        Details
                        <LaunchRounded fontSize='1.5rem' />
                    </Link>
                </div>
            </div>

        </Container>
    )
}

export default GroupCard