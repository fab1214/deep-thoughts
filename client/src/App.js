import React from "react";
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink, } from "@apollo/client";
//used to create middleware function that will retrieve the token and combine it with the existing httpLink
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./pages/Login";
import NoMatch from "./pages/NoMatch";
import SingleThought from "./pages/SingleThought";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";

//establish new link to GraphQL server at its /graphql endpoint
const httpLink = createHttpLink({
  uri: "/graphql",
});

//use setContext to retrieve token from localStorage and set HTTP request headers
//of every request to include token
//tip: "_" in first parameter is a placeholder for skipping if parameter is not needed
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

//create connection to the API
const client = new ApolloClient({
  //combine the authLink and httpLink objects so that 
  //every request retrieves the token and sets the request headers before 
  //making the request to the API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/profile/:username?" component={Profile} />
            <Route exact path="/thought/:id?" component={SingleThought} />

            <Route component={NoMatch} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
