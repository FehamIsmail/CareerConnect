import React from 'react';
import Header from '../Header/Header';
import Home from '../Home/Home';

const App = () => {
    return(
        <>
          <Header isStudent={true} loggedIn={false} />
          <Home/>
        </>
    )
}

export default App;
