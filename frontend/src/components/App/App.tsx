import React from 'react';
import Header from '../Header/Header';
import Banner from '../Banner/Banner';

const App = () => {
    return(
        <>
            <Header isStudent={true} loggedIn={false} />
            <Banner />
        </>
    )
}

export default App;
