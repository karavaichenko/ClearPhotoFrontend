import { useAppDispatch } from "../../../Store/hooks"
import { resetPhoto } from "../../../Store/photoReducer"
import s from "./processPhoto.module.css"

const ProcessPhotoError = () => {

    const dispatch = useAppDispatch()

    const handleReset = () => {
        dispatch(resetPhoto())
    }

    return (
        <div className={s.container}>
            <div className={s.wrapper}>
                <div className={s.errorMsg}>
                    При обработке произошла ошибка
                </div>
                <button onClick={handleReset} className={s.resetBtn}>Попробовать ещё</button>
            </div>
        </div>
    )
}

export default ProcessPhotoError