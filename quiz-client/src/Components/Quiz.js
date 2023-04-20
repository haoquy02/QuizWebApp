import React, { useContext, useEffect, useState } from "react";
import useStateContext from "../hooks/useStateContext";
import { BASE_URL, ENDPOINTS, createAPIEndpoint } from "../api";
import { Box, Card, CardContent, CardHeader, CardMedia, LinearProgress, List, ListItemButton, Typography } from "@mui/material";
import { getFormatedTime } from "../helper";
import { useNavigate } from "react-router-dom";
export default function Quiz(){
    const [qns, setQns] = useState([])
    const [qnIndex, setQnIndex] = useState(0)
    const [timeTaken, setTimeTaken] =useState(0)
    const {context,setContext} = useStateContext();
    const navigate = useNavigate();
    let timer;
    const startTime = () => {
        timer = setInterval(() => {
                setTimeTaken(prev => prev + 1)
        },[1000])
    }
    useEffect(()=> {
        setContext({
            timeTaken:0,
            selectedOptions:[]
        })
        createAPIEndpoint(ENDPOINTS.question)
        .fetch()
        .then(res =>{
            setQns(res.data)
            startTime()
        })
        .catch(err=> {console.log(err);})
        return () => {clearInterval(timer)}
    },[])
    const updateAnswer = (qnId,optionIdx) =>{
           
            const temp = [...context.selectedOptions]
            temp.push({
                qnId,
                selected:optionIdx
            })
            if (qnIndex < 4){
                setContext({selectedOptions:[...temp]})
                setQnIndex(qnIndex+1)
            }
            else{
                setContext({selectedOptions:[...temp],timeTaken})
                //navigate result component
                navigate("/result")
            }
    }
    return  (
        qns.length !== 0
        ? <Card
            sx = {{maxWidth:640,mx:'auto',mt:5,
            '& .MuiCardHearder-action':{m:0, alignSelf:'center'}}}>
                <CardHeader 
                title={'Question '+ (qnIndex+1)+' of 5'} 
                action = {<Typography>{getFormatedTime(timeTaken)}</Typography>}
                />
                <Box>
                    <LinearProgress variant="determinate" value={(qnIndex+1)*100/5}/>
                </Box>
                {qns[qnIndex].imageName !== null
                ?<CardMedia
                    component="img"
                    image={BASE_URL+'images/'+qns[qnIndex].imageName}
                    sx={{width:'auto',m:'10px auto'}}/>
                :null}
            <CardContent>
                <Typography variant="h6">
                    {qns[qnIndex].qnInWords}
                </Typography>
                <List>
                    {qns[qnIndex].options.map((item, idx)=>
                        <ListItemButton key = {idx} onClick={()=>updateAnswer(qns[qnIndex].qnID,idx)}>
                            <div>
                               {String.fromCharCode(65+idx)+" . "} {item}
                            </div>
                        </ListItemButton>
                    )} 
                </List>
            </CardContent>
        </Card>
        :null
    )
}