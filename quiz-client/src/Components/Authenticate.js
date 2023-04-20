import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ENDPOINTS, createAPIEndpoint } from "../api";

export default function Authenticate(){   
    const [flag, setFlag] = useState(null)
    function checkAuthenticate(){
         createAPIEndpoint(ENDPOINTS.authenticate)
        .fetch()
        .then((res) => {
            setFlag(res.data)
          })
    }
    useEffect(() => {
        checkAuthenticate();
    },[]);
    return (
        flag === false
            ? <Navigate to="/" />
            : <Outlet />
    )
}