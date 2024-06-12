import * as React from 'react';
import { useEffect,useState } from 'react';

 const useUserAuthenticated = ()=>{
 
    const [isValid,setIsValid] = useState(false)
    useEffect(() => {
        
   }, []);
    const checkAuthentication =  () => {
      console.log("")
      };
    const setAuthentication = (data) => {
       
    };
 
    return{
        checkAuthentication,
        setAuthentication
    }
 
}
 
export default useUserAuthenticated;