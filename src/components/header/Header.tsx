import { useSelector } from "react-redux"
import s from "./header.module.css"
import { selectUserState } from "../../Store/selectors"
import { Link } from "react-router"
import { useAppDispatch } from "../../Store/hooks"
import { logoutThunk } from "../../Store/authReducer"
import { useState } from "react"
import Account from "../login/Account"

const Header = () => {

    const me = useSelector(selectUserState)
    const dispatch = useAppDispatch()

    const [isAccount, setIsAccount] = useState(false)

    const handleAccount = () => {
        setIsAccount(!isAccount)
    }

    const logoutOnClick = () => {
        dispatch(logoutThunk())
    }

    if (me.resultCode === 1000) {
        return (
            <div className={s.container}>
                <Link to="/" className={s.header}>
                    Clear Your Photo
                </Link>
                <div className={s.header__btns}>
                    <div className={s.settingBtn + " button"}>
                        <button onClick={handleAccount}><img src="/public/setting.svg" alt="" /></button>
                    </div>
                    <div className={s.settingBtn + " button--primary"}>
                        <button onClick={logoutOnClick}><img src="/public/logout.svg" alt="" /></button>
                    </div>
                    {isAccount ? <Account onClose={() => setIsAccount(false)} /> : ""}
                </div>
            </div>
        )
    }
    return (
        <div className={s.container}>
            <a href="/" className={s.header}>
                Clear Your Photo
            </a>
            <div className={s.header__btns}>
                <Link to="/reg" className="button">Зарегистироваться</Link>
                <Link to="/login" className="button--primary">Войти</Link>
            </div>
        </div>
    )
}

export default Header