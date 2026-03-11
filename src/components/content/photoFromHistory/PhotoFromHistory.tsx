import { useParams } from "react-router";
import s from "./photoFromHistory.module.css"
import Header from "../../header/Header";
import NavMenu from "../../header/NavMenu";

const PhotoFromHistory = () => {
    const {photoId} = useParams();


    return (
        <div>
            <Header />
            <NavMenu section="history" />
            <div className={s.container}>
                <div className={s.wrapper}>
                    TODO: ФОТО id: {photoId}
                </div>
            </div>
        </div>
    )
}

export default PhotoFromHistory