import { createContext, useState, Fragment, useEffect } from 'react';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import Home from './pages/Home';
import IndexHeader from './components/IndexHeader';
import LoginPage from './pages/LoginPage';

export const ThemeContext = createContext<any>({theme: "light"});
export const widthContext = createContext<any>({});

function App() {
  const client = new ApolloClient({
    uri: 'http://localhost:8080/query',
    cache: new InMemoryCache(),
  });

  const [width, setWidth] = useState(0)
  useEffect(() => {
        updateWidth()
        window.addEventListener("resize", updateWidth)
        return () => window.removeEventListener("resize", updateWidth)
    }, [])

    const updateWidth = () => {
        setWidth(window.innerWidth)
    }
  
  const [currTheme, setCurrTheme] = useState("light");
  var logo ="https://www.logo.wine/a/logo/LinkedIn/LinkedIn-Wordmark-Black-Logo.wine.svg";

  return (
    <ApolloProvider client={client}>
      <ThemeContext.Provider value={{currTheme, setCurrTheme, logo}}>
        <widthContext.Provider value={{width, setWidth}}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={
              <Fragment>
                <IndexHeader/>
                <LoginPage/>
              </Fragment>
              }/>

              <Route path="/regis" element={
              <Fragment>
              <IndexHeader/>
              <LoginPage/>
              </Fragment>
              }/>

              <Route path="/home" element={
              <Fragment>
                <IndexHeader/>
                <Home/>
              </Fragment>
              }/>
            </Routes>
          </BrowserRouter>
        </widthContext.Provider>
      </ThemeContext.Provider>
    </ApolloProvider>
  )
}

export default App
