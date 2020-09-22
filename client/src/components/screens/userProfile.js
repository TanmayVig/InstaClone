import React,{useEffect,useState, useContext, useReducer} from 'react'
import {UserContext} from "../../App"
import {useParams} from 'react-router-dom'

const Profile = ()=>{
    const {userid} = useParams()
    
    const {state, dispatch} = useContext(UserContext)
    const [userProfile, setProfile] = useState(null)
    const [showFollow, setFollow] = useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                'Authorization':"Bearer "+localStorage.getItem('jwt')
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setProfile(result)
        })
    },[])

    const followUser=()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followid:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            // console.log(data)
            dispatch({type:"UPDATE", payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setFollow(false)
        })
    }

    const unfollowUser=()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowid:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            // console.log(data)
            dispatch({type:"UPDATE", payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            
            setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item !== data._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFollower
                    }
                }
            })
            setFollow(true)
        })
    }

    return(
        <>
        {userProfile?
         
        <div style={{maxWidth:"550px",
        margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img style={{width:"160px", height:"160px",borderRadius:"80px"}} 
                    src={userProfile.user.pic}
                    />
                </div>
                <div>
                <h4>{userProfile.user.name}</h4>
                <h4>{userProfile.user.email}</h4>
                    <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                        <h6>{userProfile.post.length} posts</h6>
                        <h6>{userProfile.user.followers? userProfile.user.followers.length: "0"} followers</h6>
                        <h6>{userProfile.user.following? userProfile.user.following.length: "0"} following</h6>
                    </div>
                    {showFollow
                    ?
                        <button style={{margin:"10px"}} className="btn waves-effect waves-light #1e88e5 blue darken-1" 
                            onClick={()=>followUser()}>
                            Follow
                        </button>
                    :
                        <button style={{margin:"10px"}} className="btn waves-effect waves-light #1e88e5 blue darken-1" 
                            onClick={()=>unfollowUser()}>
                            UnFollow
                        </button>

                    }
                    
                </div>
            </div>
            <div className="gallery">
                {
                    userProfile.post.map(item=>{
                        return( 
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        )
                    })
                }
            </div>
            
        </div>
        :<h1>ruk jaa yaar 😖️</h1>
        }
        </>
    )
}

export default Profile