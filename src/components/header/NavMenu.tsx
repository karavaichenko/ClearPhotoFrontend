import { useNavigate } from "react-router"
import s from "./header.module.css"

type NavMenuPropsType = {
    section: "process" | "history" | "main"
}

const NavMenu = (props: NavMenuPropsType) => {

    const navigate = useNavigate()

    return (
        <nav className={s.navMenu}>
            <button
                className={s.navItem + " " + (props.section == "process" ? s.active : "")}
                onClick={() => navigate('/process')}
            >
                Обработка
            </button>
            <button
                className={s.navItem + " " + (props.section == "history" ? s.active : "")}
                onClick={() => navigate('/history')}
            >
                История
            </button>
        </nav>
    )
}

export default NavMenu