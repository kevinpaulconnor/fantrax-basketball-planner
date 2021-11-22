import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import Amplify from '@aws-amplify/core';
import { withAuthenticator } from '@aws-amplify/ui-react'
import { API } from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);

function App() {
  const [game, updateGame] = useState('');
  useEffect(() =>{
    callApi();

  }, []);

  async function callApi() {
    try{
      const data = await API.get('testReturnGame', '/create-schedule', '');
      console.log(data);
      //updateGame(data);
    } catch (err) {
      console.log('error:', err);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {game}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default withAuthenticator(App);
