import React,{useState,useContext} from 'react'
import {Link, useHistory} from "react-router-dom";
import {UserContext} from "../../App"
import M from "materialize-css"


const Login =() =>{
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory("")
    const [password, setPassword]=useState("")
    const [email, setEmail]=useState("")
    const PostData =()=> {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({html: "invalid email", classes: "#d50000 red accent-4"})
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error, classes:"#d50000 red accent-4"})
                return
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER", payload:data.user})
                M.toast({html: 'signedIn sucessfully', classes:"#69f0ae green accent-2"})
                history.push('/')
            }
        }).catch(err=>{
           console.log(err); 
        })
    }
    
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input type="text" placeholder="email" value = {email} onChange={(e)=>setEmail(e.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                <button className="btn waves-effect waves-light #1e88e5 blue darken-1" 
                onClick={()=>PostData()}>
                    Login
                </button>
                <h5>
                        <Link to="/signup">New to instagram ?</Link>
                    </h5>
            
            </div>
        </div>
    );
}

export default Login