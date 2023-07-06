import React from 'react'
import { CircularProgress } from '@chakra-ui/react'

const Loader = () => {
    return (
        <CircularProgress left={"50%"} top={"50%"} isIndeterminate size='100px' thickness='4px' />
    )
}

export default Loader