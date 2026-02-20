import { useEffect, useState, type ChangeEvent } from "react"
import { useAppDispatch } from "../../Store/hooks"
import s from "./login.module.css"
import { registerThunk, setResultCode, verifyEmailThunk } from "../../Store/authReducer"
import { useSelector } from "react-redux"
import { selectUserState } from "../../Store/selectors"
import { useNavigate } from "react-router"

const Registration = () => {

    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [login, setLogin] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [code, setCode] = useState<number>()
    const onSubmit = () => {
        if (login.length > 5 && password.length > 5 && email.length > 5) {
            dispatch(registerThunk(login, password, email))
        } else {
            dispatch(setResultCode(5))
        }
    }

    const onCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const codeStr = e.target.value
        if (/^\d+$/.test(e.target.value) || e.target.value === "") {
            setCode(Number(codeStr))
        }
    }
    const onSubmitCode = () => {
        if (typeof me.hash === "string" && typeof me.email === "string") {
            dispatch(verifyEmailThunk(code ? code : 0, me.hash, me.email))
        } else {
            alert("Что-то пошло не так")
        }
    }

    const me = useSelector(selectUserState) 

    useEffect(() => {

    }, [me.resultCode])

    const warning = me.resultCode === 2 ? "Почта уже используется" : 
                    me.resultCode === 1 ? "Логин занят" :
                    me.resultCode === 3 ? "Что-то пошло не так" : 
                    me.resultCode === 4 ? "Неверный код" : 
                    me.resultCode === 5 ? "Слишком коротко" : ""

    if (me.resultCode == 100 || me.resultCode == 4) {
        return (
            <div className={s.container}>
            <div className={s.wrapper}>
                <div className={s.header}>
                    <h1>Clear Photo</h1>
                    <p>Код отправлен на почту</p>
                </div>
                <label htmlFor="verifCode"></label>
                <input onChange={onCodeChange} value={code} className={s.fieldCode} id="verifCode"/>

                <span className={s.warning}>{warning}</span>

                <button className="button--primary button--large" onClick={onSubmitCode}>Продолжить</button>
            </div>
        </div>
        )
    } else if (me.resultCode === 101) {
        navigate('/login');
    } else {
        return (
            <div className={s.container}>
                <a href="/login" className={s.cornerBtn + " button--primary"}>Войти</a>
                <div className={s.container}>
                    <div className={s.wrapper}>
                        <div className={s.header}>
                            <h1>Clear Photo</h1>
                            <p>Регистрация</p>
                        </div>
                        <div className={s.field}>
                            <label htmlFor="login">Логин</label>
                            <input value={login} onChange={(e) => {setLogin(e.target.value)}} placeholder="Логин" id="login" className="field" type="text" />
                        </div>
                        <div className={s.field}>
                            <label htmlFor="email">Почта</label>
                            <input value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder="Почта" id="email" className="field" type="email" />
                        </div>
                        <div className={s.field}>
                            <label htmlFor="password">Пароль</label>
                            <input value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="qwerty123" id="password" className="field" type="password" />
                        </div>
        
                        <span className={s.warning}>{warning}</span>
        
                        <button className="button--primary button--large" onClick={onSubmit}>Продолжить</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Registration