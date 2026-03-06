import { useNavigate } from "react-router"
import Header from "../../header/Header"



const ProcessHistory = () => {

    const navigate = useNavigate()

    return (
        <div>
            <Header />
            <nav className="nav-menu">
                <button
                    className="nav-item"
                    onClick={() => navigate('/process')}
                >
                    Обработка
                </button>
                <button
                    className="nav-item active"
                    onClick={() => navigate('/history')}
                >
                    История
                </button>
            </nav>
        </div>
    )
}

export default ProcessHistory