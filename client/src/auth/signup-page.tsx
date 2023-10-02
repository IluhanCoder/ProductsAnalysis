import {useState} from "react";
import { credentials } from "./auth-types";
import authService from "./auth-service";

const SignupPage = () => {
    const [inputValue, setInputValue] = useState<credentials>({
        email: "",
        username: "",
        password: "",
        passwordSub: ""
    })
    
    const handleOnChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputValue(values => ({...values, [name]: value}))
    }

    const handleSubmit = async () => {
        await authService.SignUp(inputValue);
    }

    return <div>
        <form onChange={handleOnChange}>
            <div>
                <label>Ім'я користувача:</label>
                <input type="text" name="username" value={inputValue.username} onChange={handleOnChange}/>
            </div>
            <div>
                <label>Електрона пошта</label>
                <input type="email" name="email" value={inputValue.email} onChange={handleOnChange}/>
            </div>
            <div>
                <label>Пароль</label>
                <input type="password" name="password" value={inputValue.password} onChange={handleOnChange}/>
            </div>
            <div>
                <label>Підтвердження пароля</label>
                <input type="password" name="passwordSub" value={inputValue.passwordSub} onChange={handleOnChange}/>
            </div>
            <button type="button" onClick={handleSubmit}>Зареєструватися</button>
        </form>
    </div>
}

export default SignupPage;