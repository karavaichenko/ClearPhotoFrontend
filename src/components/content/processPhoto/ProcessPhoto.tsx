import { useNavigate } from "react-router"
import Header from "../../header/Header"



const ProcessPhoto = () => {

    const navigate = useNavigate()

    return (
        <div>
            <Header />
            <nav className="nav-menu">
                <button
                    className="nav-item active"
                    onClick={() => navigate('/process')}
                >
                    Обработка
                </button>
                <button
                    className="nav-item"
                    onClick={() => navigate('/history')}
                >
                    История
                </button>
            </nav>
        </div>
    )
}

export default ProcessPhoto