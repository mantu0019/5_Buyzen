import { createSlice } from "@reduxjs/toolkit";
import { registerUser, verifyEmailUser } from "./authAction";



const authSlice = createSlice({
    name:"auth",
    initialState:{
        authData:null,
        isLoading:false,
        error:null
    },
    extraReducers:(builder)=>{
           return builder.
            //registerUser
           addCase(registerUser.pending,(state,action)=>{

           state.isLoading = true;
           state.error = null;

           }).addCase(registerUser.fulfilled,(state,action)=>{

             state.isLoading = false;
             state.authData = action?.payload;
             state.error  = null;
           }).addCase(registerUser.rejected,(state,action)=>{
               state.isLoading = false;
               state.error = action?.payload || "Error in Register";

           })
            // verifyEmailUser
           
           .addCase(verifyEmailUser.pending,(state,action)=>{
           state.isLoading = true;
           state.error = null;
 

           }).addCase(verifyEmailUser.fulfilled,(state,action)=>{
          state.isLoading = false;
          state.authData = action?.payload;
           state.error = null; 
           }).addCase(verifyEmailUser.rejected,(state,action)=>{
            state.isLoading = false;
            state.error = action?.payload || "something went wrong"
           })

 

    }
});


export default authSlice.reducer;