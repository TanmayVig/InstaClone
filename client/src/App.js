import React,{useEffect,createContext, useReducer,useContext} from 'react';
import Navbar from '../src/components/navbar'
import './App.css'
import {BrowserRouter,  Route, Switch, useHistory} from 'react-router-dom'
import Home from "./components/screens/Home"
import Profile from "../src/components/screens/profile"
import Signup from "../src/components//screens/signup"
import Login from '../src/components/screens/login'
import CreatePost from "../src/components/screens/createpost"
import UserProfile from "../src/components/screens/userProfile"
import SubscribedUserPost from "./components/screens/SubscribedUserPost"
import {reducer, initialState} from "./reducer/userReducer"

export const UserContext = createContext()

const Routing = ()=>{
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({type:"USER", payload:user})
      // history.push('/')
    }
    else{
      history.push('/login')
    }
  },[])
  return(
    <Switch>
      <Route exact path="/">
        <Home/>
      </Route>
        <Route path="/signup">
          <Signup/>
        </Route>
        <Route path="/login">
          <Login/>
        </Route>
        <Route exact path="/profile">
          <Profile/>
        </Route>
        <Route path="/create">
          <CreatePost/>
        </Route>
        <Route path="/profile/:userid">
          <UserProfile/>
        </Route>
        <Route path="/subpost">
          <SubscribedUserPost/>
        </Route>
      </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer,initialState) 
  return (
    <UserContext.Provider value={{state, dispatch}}>
    <BrowserRouter>
      <Navbar/>
      <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
