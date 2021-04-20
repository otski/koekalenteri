import { Container } from '@material-ui/core';
import React from 'react';
import InfoContainer from '../components/InfoContainer';
import NotificationContainer from '../components/NotificationContainer';
import MainContainer from '../components/MainContainer';

const SearchPage = () => {
    return(
        <Container maxWidth="md">
            <NotificationContainer />
            <InfoContainer/>
            <MainContainer/>
        </Container>

    )
}

export default SearchPage;