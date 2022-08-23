import { useState } from 'react';
import './App.css';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import { THEME } from './lib/theme';

function App() {
  const client = new ApolloClient({
    uri: 'http://localhost:8080/v1/graphql',
    cache: new InMemoryCache(),
  });

  const [currTheme, setCurrTheme] = useState(THEME.light);

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
