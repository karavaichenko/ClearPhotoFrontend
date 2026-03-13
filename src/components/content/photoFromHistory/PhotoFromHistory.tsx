import { useNavigate, useParams } from "react-router";
import s from "./photoFromHistory.module.css"
import Header from "../../header/Header";
import NavMenu from "../../header/NavMenu";
import { useSelector } from "react-redux";
import { selectCurrentEnteredUrl, selectCurrentPhotoInfo, selectCurrentResultUrl } from "../../../Store/selectors";
import { useEffect } from "react";
import { useAppDispatch } from "../../../Store/hooks";
import { getCurrentPhotoInfoThunk, getCurrentPhotoUrlThunk, resetCurrentPhotoState } from "../../../Store/currentPhotoReducer";

const PhotoFromHistory = () => {
    const {photoId} = useParams();

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const photoInfo = useSelector(selectCurrentPhotoInfo)
    const resultUrl = useSelector(selectCurrentResultUrl)
    const enteredUrl = useSelector(selectCurrentEnteredUrl)

    useEffect(() => {
        if (photoId) {
            dispatch(getCurrentPhotoInfoThunk(Number(photoId)))
        } else {
            navigate("/")
        }
        return () => {
            dispatch(resetCurrentPhotoState())
        }
    }, [photoId, dispatch, navigate])

    useEffect(() => {
        if (photoInfo?.id) {
            dispatch(getCurrentPhotoUrlThunk(photoInfo.id))
        }
    }, [dispatch, photoInfo])

    const handleDownload = async () => {
        if (!resultUrl) return
        try {
            const response = await fetch(resultUrl)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'processedPhoto.jpg'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Ошибка при скачивании:', error)
        }
    }
    
    const photoDate = photoInfo ? new Date(photoInfo.timestamp) : ""
    return (


        <div>
            <Header />
            <NavMenu section="history" />
            <div className={s.container}>
                <div className={s.wrapper}>
                    <div className={s.photosContainer}>
                        <img src={enteredUrl ? enteredUrl : ""} alt="" />
                        <img src={resultUrl ? resultUrl : ""} alt="" />
                    </div>
                    <div className={s.infoContainer}>
                        <div className={s.infoPair}>
                            Лиц обнаружено:
                            <div className={s.infoItem}>{photoInfo?.faces}</div>
                        </div>
                        <div className={s.infoPair}>
                            Номеров обнаружено:
                            <div className={s.infoItem}>{photoInfo?.plates}</div>
                        </div>
                        <div className={s.infoPair}>
                            Дата обработки:
                            <div className={s.infoItem}>{photoDate.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className={s.btnsContainer}>
                        <button onClick={handleDownload} className="button--primary">Скачать</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PhotoFromHistory