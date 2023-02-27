import React from 'react';
import Header from '../Header/Header';
import Banner from '../Banner/Banner';
import Search from '../SearchBar/search';

const App = () => {
    return(
        <>
            <Header isStudent={true} loggedIn={false} />
            <Banner/>
            <Search />
        </>
    )
}

export default App;
