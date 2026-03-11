import Header from "../header/Header"
import NavMenu from "../header/NavMenu"
import s from "./account.module.css"


const Account = () => {
    return (
        <div>
            <Header />
            <NavMenu section="main" />
            <div className={s.container}>
                <div className={s.wrapper}>
                    Account
                </div>
            </div>
        </div>
    )
}

export default Account