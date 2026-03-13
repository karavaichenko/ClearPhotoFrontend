import { useEffect, useState } from "react"
import { useAppDispatch } from "../../Store/hooks"
import s from "./account.module.css"
import { getAccountInfoThunk } from "../../Store/accountReducer"
import { useSelector } from "react-redux"
import { selectAccountInfo } from "../../Store/selectors"
import { logoutThunk } from "../../Store/authReducer"
import ChangePassword from "./changePasswordWindow/ChangePassword"

type AccountProps = {
    onClose: () => void
}

const Account = (props: AccountProps) => {

    const dispatch = useAppDispatch()

    const accountInfo = useSelector(selectAccountInfo)
    const [isPasswordChange, setIsPasswordChange] = useState(false)

    useEffect(() => {
        dispatch(getAccountInfoThunk())
    }, [dispatch])

    const handleExit = () => {
        dispatch(logoutThunk())
    }

    const handlePasswordChange = () => {
        setIsPasswordChange(!isPasswordChange)
    }


    return (
        <div className={s.container}>
            <div className={s.wrapper}>
                <div className={s.headerContainer}>
                    <div className={s.header}>Ваш аккаунт</div>
                    <button onClick={props.onClose} className={s.closeBtn}><img src="/public/close.svg" alt="" /></button>
                </div>

                <div className={s.infoContainer}>

                    <div className={s.infoWrapper}>
                        <div className={s.infoItem}>
                            <div>Логин:</div>
                            <div>{accountInfo.login}</div>
                        </div>
                        <div className={s.infoItem}>
                            <div>Email:</div>
                            <div>{accountInfo.email}</div>
                        </div>
                    </div>

                    <div className={s.infoWrapper}>
                        <div className={s.infoItem}>
                            <div>Фото обработано:</div>
                            <div>{accountInfo.photoCount}</div>
                        </div>
                    </div>

                </div>

                <div className={s.btnsContainer}>
                    <button onClick={handleExit} className="button">Выйти</button>
                    <button onClick={handlePasswordChange} className={s.changePassBtn + " button"}>Сменить пароль</button>
                </div>

                {isPasswordChange ? <ChangePassword onClose={() => handlePasswordChange()} /> : ""}

            </div>
        </div>
    )
}

export default Account