import { body } from "express-validator";

const loginValidator = () =>{
    return [
        body("username")
    ]
}