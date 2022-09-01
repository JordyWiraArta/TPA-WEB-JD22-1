import { createContext, useState, Fragment, useEffect } from 'react';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import IndexHeader from './components/IndexHeader';
import LoginPage from './pages/LoginPage';
import RegisPage from './pages/RegisPage';
import ResetPass from './pages/ResetPass';
import HomeNavigation from './pages/HomeNavigation';
import Activate from './pages/Activate';
import { AuthProvider } from './lib/contexts/authContext';
import { SearchProvider } from './lib/contexts/searchContext';

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
      <AuthProvider>
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
              <RegisPage/>
              </Fragment>
              }/>

              <Route path="/linkhedIn/*" element={
              <Fragment>
                <SearchProvider>
                  <IndexHeader/>
                  <HomeNavigation/>
                </SearchProvider>
              </Fragment>
              }/>

              <Route path="/forgotPass/:code" element={
              <Fragment>
                <IndexHeader/>
                <ResetPass/>
              </Fragment>
              }/>

              <Route path="/verification/:code" element={
                <Fragment>
                  <IndexHeader/>
                  <Activate/>
                </Fragment>
              }/>
            </Routes>
          </BrowserRouter>
        </widthContext.Provider>
      </ThemeContext.Provider>
      </AuthProvider>
    </ApolloProvider>
  )
}

export default App
