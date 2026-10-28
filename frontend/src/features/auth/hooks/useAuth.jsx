import  { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, verifyEmailUser } from "../state/authAction";

export const useAuth = () => {
  const { authData, isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const registerByUser = useCallback(
    (data) => {
      return dispatch(registerUser(data)).unwrap();
    },
    [dispatch],
  );

  const verifyEmailByUser = useCallback((data)=>{
    return dispatch(verifyEmailUser(data)).unwrap();
  },[dispatch])

  


  return  {authData,isLoading,error,registerByUser,verifyEmailByUser}
};

export default useAuth;
