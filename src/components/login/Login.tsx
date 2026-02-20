import { useSelector } from "react-redux"
import { useAppDispatch } from "../../Store/hooks"
import s from "./login.module.css"
import { selectUserState } from "../../Store/selectors"
import { useState } from "react"
import { loginThunk, setResultCode } from "../../Store/authReducer"
import { useNavigate } from "react-router"


const Login = () => {
    
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")


    const onSubmit = () => {
        if (login.length > 5 && password.length > 5) {
            dispatch(loginThunk(login, password))
        } else {
            dispatch(setResultCode(1))
        }
    }

    const me = useSelector(selectUserState)
    const warning = me.resultCode === 2 ? "Что-то введено не так" : 
                    me.resultCode === 1 ? "Нет такого аккаунта" : ""

    if (me.resultCode === 1000) {
        navigate("/")
    }
    return (
        <div className={s.container}>
            <a href="/reg" className={s.cornerBtn + " button--primary"}>Регистрация</a>
            <div className={s.container}>
                <div className={s.wrapper}>
                    <div className={s.header}>
                        <h1>Clear Photo</h1>
                        <p>Вход</p>
                    </div>
                    <div className={s.field}>
                        <label htmlFor="login">Логин</label>
                        <input value={login} onChange={(e) => {setLogin(e.target.value)}} placeholder="Логин" id="login" className="field" type="text" />
                    </div>
                    <div className={s.field}>
                        <label htmlFor="password">Пароль</label>
                        <input value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="qwerty123" id="password" className="field" type="password" />
                    </div>

                    <span className={s.warning}>{warning}</span>

                    <button className="button--primary button--large" onClick={onSubmit}>Войти</button>
                </div>
            </div>
        </div>
    )
}

export default Login