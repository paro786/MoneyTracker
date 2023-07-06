import React from 'react'
import { Badge, Stack } from '@chakra-ui/react'

const ListMail = ({ mails }) => {

    return (
        <Stack direction='row'>
            {mails.map((user) => (
                <Badge colorScheme={'green'}>{user.name} </Badge>
            ))}
        </Stack>
    )
}

export default ListMail