import React,{useContext,useRef,useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from "../App"
import M, { Sidenav } from "materialize-css"

const Navbar = ()=>{
  const history = useHistory()
  const [search, setSearch]=useState("")
  const [userDetails, setUserDetails] = useState([])
  const {state, dispatch}= useContext(UserContext)
  const searchModal = useRef(null)

  useEffect(()=>{
    M.Modal.init(searchModal.current)
  },[])

  const renderList=()=>{
    if(state){
      return[
        <li key="1"><i data-target="modal1" className="modal-trigger material-icons" style={{color:"black"}}>search</i></li>,
        <li key="2"><Link to="/profile">Profile</Link></li>,
        <li key="3"><Link to="/create">Create Post</Link></li>,
        <li key="5"><Link to="/subpost">Explore</Link></li>,
        <li key="8">
          <button className="btn #d50000 red accent-4" 
                onClick={()=>{
                  localStorage.clear()
                  dispatch({"type":"clear"})
                  history.push('/login')
                }}>
                    Logout
                </button>
        </li>
      ]
    }else{
      return[
        <li key="6"><Link to="/login">Login</Link></li>,
        <li key="7"><Link to="/signup">Signup</Link></li>
      ]
    }
  }
  const sideNav=()=>{
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
  }

  const fetchUsers=(query)=>{
    setSearch(query)
    fetch("/search-users",{
      method:"post",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(result=>{
      setUserDetails(result.user)
    })
  }

  return(<div>
          <nav>
            <div className="nav-wrapper">
              <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
              <Link to="#" data-target="mobile-demo" className="sidenav-trigger" ><i className="material-icons">menu</i></Link>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                {renderList()}
              </ul>
            </div>
          </nav>
          <ul className="sidenav" id="mobile-demo">
            {renderList()}
          </ul>
          <script>
          document.addEventListener('DOMContentLoaded', function() {
            sideNav()
          })
          </script>
          <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
            <div className="modal-content">
            <input type="text" placeholder="serach users" value = {search} onChange={(e)=>fetchUsers(e.target.value)} />
            <ul className="collection">
              {userDetails.map(item=>{
                return <Link to={item._id !== state._id? "/profile/"+item._id:"/profile"} onClick={()=>{
                  M.Modal.getInstance(searchModal.current).close()
                  setSearch("")
                }} ><li className="collection-item">{item.email}</li></Link>
              })}
            </ul>
            
            </div>
            <div className="modal-footer">
              <button className="modal-close btn-flat" onClick={()=>setSearch('')}>OK TATA BYE BYE</button>
            </div>
          </div>
        </div>
  );
}

export default Navbar