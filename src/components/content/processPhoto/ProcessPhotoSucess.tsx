import { useSelector } from "react-redux"
import s from "./processPhoto.module.css"
import { selectPhotoInfo, selectPhotoUrl } from "../../../Store/selectors"
import { useAppDispatch } from "../../../Store/hooks"
import { resetPhoto } from "../../../Store/photoReducer"

const ProcessPhotoSucess = () => {

    const photoUrl = useSelector(selectPhotoUrl)
    const photoInfo = useSelector(selectPhotoInfo)
    const dispatch = useAppDispatch()

    const handleDownload = async () => {
        if (!photoUrl) return
        try {
            const response = await fetch(photoUrl)
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

    const handleReset = () => {
        dispatch(resetPhoto())
    }

    if (photoUrl) {
        return (
            <div className={s.container}>
                <div className={s.wrapper}>
                    <img className="" src={photoUrl} alt="" />
                    <div className={s.infoContainer}>
                        <div className={s.infoItem}>
                            Обработано лиц:
                            <div className={s.infoItemNum}>{photoInfo?.faces}</div> 
                        </div>
                        <div className={s.infoItem}>
                            Обработано номеров:
                            <div className={s.infoItemNum}>{photoInfo?.plates}</div> 
                        </div>
                    </div>
                    <div className={s.btnsContainer}>
                        <button onClick={handleReset} className={s.resetBtn}>Обработать ещё</button>
                        <button onClick={handleDownload} className={s.downloadBtn}>Скачать</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProcessPhotoSucess