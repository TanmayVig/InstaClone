import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'



const Home=()=>{
    const [data, setData]=useState([])
    const {state, dispatch} = useContext(UserContext)

    useEffect(()=>{
        fetch("/getsubpost",{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result.posts)
        })
    },[])
    const likePost = (id)=>{
        fetch("/like",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newDAta= data.map(item=>{
                if (item._id==result._id) {
                    return result
                }
                else{
                    return item
                }
            })
            setData(newDAta)
        }).catch(err=>{
            console.log(err)
        })
    }

    const unlikePost = (id)=>{
        fetch("/unlike",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newDAta= data.map(item=>{
                if (item._id==result._id) {
                    return result
                }
                else{
                    return item
                }
            })
            setData(newDAta)
        }).catch(err=>{
            console.log(err)
        })
    }
    
    const makeComment=(text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newDAta= data.map(item=>{
                if (item._id==result._id) {
                    return result
                }
                else{
                    return item
                }
            })
            setData(newDAta)
        }).catch(err=>{
            console.log(err)
        })
    }

    const deletePost=(postId)=>{
        fetch(`/deletePost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const deleteComm=(postId,commentInd)=>{
        fetch(`/deleteComm/${postId}/${commentInd}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result.post.comments[commentInd])
            const newData= data
            .map((post)=>post)
            .filter(item=>{
                // console.log(item.comments)
                return item.comments[commentInd]._id !== result.post.comments[commentInd]._id
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    return(
        <div className="home">
            {
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <h5 style={{padding:"6px"}}><Link to={ item.postedBy._id !== state._id? "/profile/"+item.postedBy._id:"/profile"}>{item.postedBy.name}</Link>
                            { item.postedBy._id == state._id
                                &&<i className ="material-icons" style={{float:"right"}}
                                 onClick={()=>deletePost(item._id)} >
                                    delete
                                </i>

                            } 
                            
                            </h5>
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                                {item.likes.includes(state._id)
                                    ? 
                                    <i className ="material-icons" style={{color:"red"}} onClick={()=>{unlikePost(item._id)}}>
                                        favorite
                                        </i>

                                    :
                                    <i className ="material-icons" onClick={()=>{likePost(item._id)}}>
                                        favorite_border
                                        </i>
                                   
                                }
                                
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                        <h6 key={record._id}>
                                            <span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}
                                            { record.postedBy._id == state._id
                                                 &&<i className ="material-icons" style={{float:"right"}}
                                                 onClick={()=>deleteComm(item._id,item.comments.indexOf(record))} >
                                                    delete
                                                </i>
                                            }
                                        </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                }}>
                                    <input type="text" placeholder="add a comment" />
                                </form>
                                
                            </div>
                        </div>
                    )
                })
            }
            
        </div>
    )
}

export default Home