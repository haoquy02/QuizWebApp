import { useState } from "react";
export default function useForm(getFreshModelObject){
    const [values, setValues] = useState(getFreshModelObject());
    const [errors, setErrors] = useState({});
    const hadleInputChange = e =>{
        const {name, value} = e.target
        setValues({
            ... values,
            [name]:value
        })
    }
    return {
        values,
        setValues,
        errors,
        setErrors,
        hadleInputChange
    }
}
