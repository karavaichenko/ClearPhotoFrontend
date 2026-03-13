import { useEffect, useState } from "react"
import { useAppDispatch } from "../../../Store/hooks"
import s from "./changePasswordWindow.module.css"
import { changePasswordThunk, setChangePassStatus } from "../../../Store/accountReducer"
import { useSelector } from "react-redux"
import { selectChangePasswordStatus } from "../../../Store/selectors"

type ChangePasswordPropsType = {
    onClose: () => void
}

const ChangePassword = (props: ChangePasswordPropsType) => {

    const dispatch = useAppDispatch()
    const changePasswordStatus = useSelector(selectChangePasswordStatus)

    const [oldPass, setOldPass] = useState("")
    const [newPass, setNewPass] = useState("")
    const [warning, setWarning] = useState("")

    useEffect(() => {
        if (changePasswordStatus === false) {
            // eslint-disable-next-line
            setWarning("Неверный старый пароль")
        }
    }, [changePasswordStatus])

    const handleAccept = () => {
        if (oldPass.trim() === "" || newPass.trim() === "") {
            setWarning("Заполните все поля")
        } else {
            dispatch(changePasswordThunk(oldPass, newPass))
        }
    }

    const handleClose = () => {
        setWarning("")
        setOldPass("")
        setNewPass("")
        dispatch(setChangePassStatus(null))
        props.onClose()
    }

    useEffect(() => {
        if (changePasswordStatus === true) {
            dispatch(setChangePassStatus(null))
            props.onClose()
        } 
    }, [dispatch, changePasswordStatus, props])

    return (
        <div className={s.container}>
            <div className={s.wrapper}>
                <div className={s.headerContainer}>
                    <div className={s.header}>Смена пароля</div>
                    <button onClick={handleClose} className={s.closeBtn}><img src="/public/close.svg" alt="" /></button>
                </div>

                <div className={s.fieldsContainer}>
                    <div className={s.field}>
                        <div className={s.fieldLabel}>Старый пароль</div>
                        <input onChange={(e) => {setOldPass(e.target.value)}} type="text" className={s.fieldInput} />
                    </div>
                    <div className={s.field}>
                        <div className={s.fieldLabel}>Новый пароль</div>
                        <input onChange={(e) => {setNewPass(e.target.value)}} type="text" className={s.fieldInput} />
                    </div>
                </div>

                {warning !== "" ?
                    <div className={s.warningContainer}>
                        <div className={s.warning}>
                            {warning}
                        </div>    
                    </div>
                    :
                    ""
                }

                <div className={s.btnsContainer}>
                    <button onClick={handleClose} className="button">Отмена</button>
                    <button onClick={handleAccept} className={s.acceptBtn + " button"}>Подтвердить</button>
                </div>

            </div>
        </div>
    )
}

export default ChangePassword