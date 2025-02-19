import { useEffect, useState } from 'react';
import{Button,EditableText,InputGroup,Toaster} from "@blueprintjs/core";
import './App.css';

const AppToaster=Toaster.create({
  position:"top"
})

function App() {
const [users,setusers]=useState([]);
const [newName,setnewname]= useState("")
const [newEmail,setnewemail]= useState("")
const [newWebsite,setnewwebsite]= useState("")

useEffect(()=>{
  fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json() )
  .then((json => setusers(json)))
},[])

function adduser(){
             const name=newName.trim();
             const email=newEmail.trim();
             const website=newWebsite.trim();

             if(name && email && website){
                  fetch("https://jsonplaceholder.typicode.com/users",
                  {
                    method:"POST",
                    body:JSON.stringify({
                      name,
                      email,
                      website
                    }),
                    headers:{
                      "Content-Type":"application/json; charset=UTF-8"
                    }
                  }
                ).then((response)=>response.json())
                .then(data=>{
                  setusers([...users,data]);
                  AppToaster.show({
                    message:"user added successfully",
                    intent:"success",
                    timeout:"3000"

                  })
                  setnewname("");
                  setnewemail("");
                  setnewwebsite("");

                })

             }

}

function onchangehandler(id,key,value){
  setusers((users)=>{
     return users.map(user=>{
      return user.id === id? {...user,[key]:value} :user;
     })
  })
}

function updateuser(id){
  const user = users. find((user)=> user.id=== id);
  fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
    {
      method:"PUT",
      body:JSON.stringify(user),
      headers:{
        "Content-Type":"application/json; charset=UTF-8"
      }
    }
  ).then((response)=>response.json())
  .then(data=>{
    AppToaster.show({
      message:"user updated successfully",
      intent:"success",
      timeout:"3000"

    })

  })

}


function deleteuser(id){
  const user = users. find((user)=> user.id=== id);
  fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
    {
      method:"DELETE",
    }
  ).then((response)=>response.json())
  .then(data=>{
   setusers((users) => {
      return  users.filter((user)=> user.id !== id)
   })

    AppToaster.show({
      message:"user deleted successfully",
      intent:"success",
      timeout:"3000"

    })

  })
}



  return (
    <div className="App">
      <table className='bp-4-html-table modifier '>
        <thead>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Website</th>
          <th>Action</th>


        </thead>
        <tbody>
          {users.map(user => 
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.name}</td>
            <td><EditableText onChange={value=> onchangehandler(user.id,"email",value)} value={user.email} /></td>
            <td><EditableText onChange={value=> onchangehandler(user.id,"website",value)} value={user.website} /></td>
            <td>
            <Button intent='primary' onClick={()=>updateuser(user.id)}>Update</Button>
            &nbsp;
            <Button intent='danger'  onClick={()=>deleteuser(user.id)}>Delete</Button>
            </td>
          </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td><InputGroup value={newName}
            onChange={(e)=>setnewname(e.target.value)}
            placeholder='Enter Name...' /></td>
             <td><InputGroup value={newEmail}
            onChange={(e)=>setnewemail(e.target.value)}
            placeholder='Enter Email...' /></td>
             <td><InputGroup value={newWebsite}
            onChange={(e)=>setnewwebsite(e.target.value)}
            placeholder='Enter Website...' /></td>
            <td>
              <Button intent='success' onClick={adduser}>Add User</Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
