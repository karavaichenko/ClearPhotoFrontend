import { useNavigate } from "react-router"
import Header from "../../header/Header"


const Main = () => {

    const navigate = useNavigate()

    return (
        <div className="container">
            <Header />
            <nav className="nav-menu">
                <button
                    className="nav-item"
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

export default Main