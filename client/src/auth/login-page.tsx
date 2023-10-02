import {useState} from "react";
import { credentials } from "./auth-types";
import $api from "../axios-setup";

const LoginPage = () => {
    const [inputValue, setInputValue] = useState<credentials>({
        email: "",
        password: ""
    });

    const handleOnChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputValue(values => ({...values, [name]: value}))
    }

    const handleSubmit = async () => {
        await $api.post("/login", inputValue);
    }

    return <div>
        <form onChange={handleOnChange}>
            <div>
                <label>Електрона пошта</label>
                <input type="email" name="email" value={inputValue.email} onChange={handleOnChange}/>
            </div>
            <div>
                <label>Пароль</label>
                <input type="password" name="password" value={inputValue.password} onChange={handleOnChange}/>
            </div>
            <button type="button" onClick={handleSubmit}>Увійти в обліковий запис</button>
        </form>
    </div>
}

export default LoginPage;