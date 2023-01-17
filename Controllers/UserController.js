import UserModel from "../Models/userModel.js";
import bcrypt, { genSalt } from 'bcrypt'
import jwt from 'jsonwebtoken'



// get all users
export const getAllUsers = async(req,res) =>{
  try {
    let users = await UserModel.find();

    users = users.map((user)=>{
      const {password,...otherDetails} = user._doc
      return otherDetails
    })
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json(error)
  }
}

// get a user
export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("No such user exists");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// update an user

export const updateUser = async (req, res) => {
  const id = req.params.id;
  console.log(req.body,"update user");
  const { _id, currentUserAdminStatus, password } = req.body;
  try {
    
    if (id === _id ) {
        if(password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(password,salt)
        }
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true
      });
      
      
      const token = jwt.sign(
        {username:user.username, id: user._id},process.env.JWT_KEY,{expiresIn:"1h"}
      )

      res.status(200).json({user,token});
    }else{
        res.status(403).json("Access denied! you can only update your on profile")
    }
  } catch (error) {
    res.status(500).json(error)
  }
};



// delete a user

export const deleteUser= async(req,res)=>{
    const id = req.params.id;
    const {currentUserId, currentUserAdminStatus} = req.body;
    if(currentUserId === id || currentUserAdminStatus){
        try {
            await UserModel.findByIdAndDelete(id)
            res.status(200).json("User deleted successfully")
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("Access denied! you can only update your own profile")
    }
}

//follow a user

export const followUser = async(req,res)=>{
   const id = req.params.id;
   const {_id} = req.body;
   
   if(_id === id){
      res.status(403).json("Action forbidden")
   }else{
    try {
      const followUser = await UserModel.findById(id);
     const followingUser = await UserModel.findById(_id);
     if(!followUser.followers.includes(_id)){
      await followUser.updateOne({$push:{followers:_id}})
      await followingUser.updateOne({$push:{following:id}})
      res.status(200).json("User followed")
     }else{
      res.status(403).json("User is already followed by you")
     } 
    } catch (error) {
      res.status(500).json(error)
    }
     
   }
}




// export const unfollowUser = async(req,res)=>{
//     const id = req.params.id
//     const{currentUserId} = req.body;
//     if(currentUserId === id){
//       res.status(403).json("Action forbidden")
//     }else{
//       try {
//         const unfollowUser = await UserModel.findById(id);
//         const unfollowingUser = await UserModel.findById(currentUserId);
//         if(unfollowingUser.following.includes(id)){
//           await unfollowingUser.updateOne({$pull:{following:id}})
//           await unfollowUser.updateOne({$pull:{$followers:currentUserId}})
//           res.status(200).json("User unfollowed")
//         }else{
//           res.status(403).json("User is not followed by you")
//         }
//       } catch (error) {
//         res.status(500).json(error)
//       }
      
//     }
    
// }


// unfollow a user

export const unfollowUser = async(req,res)=>{
  const id = req.params.id;
  const {_id} = req.body;
  
  if(_id === id){
     res.status(403).json("Action forbidden")
  }else{
   try {
     const followUser = await UserModel.findById(id);
    const followingUser = await UserModel.findById(_id);
    if(followUser.followers.includes(_id)){
     await followUser.updateOne({$pull:{followers:_id}})
     
     await followingUser.updateOne({$pull:{following:id}})
     res.status(200).json("User unfollowed")
    }else{
     res.status(403).json("User is not followed by you")
    } 
   } catch (error) {
     res.status(500).json(error)
   }
    
  }
}



// search user


export const getUserData = async(req,res)=>{
  const {data} = req.body
  console.log(data)
  const peopleData = await UserModel.find({"firstname":new RegExp(data,'i')})
  res.json(peopleData.slice(0, 10))
  console.log(peopleData,'hello from getuserdata')
}