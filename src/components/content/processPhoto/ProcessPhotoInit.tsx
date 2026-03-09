import { useEffect } from "react"
import s from "./processPhoto.module.css"
import PhotoUpload from "./photoUpload/PhotoUpload"
import { useAppDispatch } from "../../../Store/hooks"
import { getResultPhotoThunk, processPhotoThunk, type StatusType } from "../../../Store/photoReducer"
import { useSelector } from "react-redux"
import { selectPhotoInfo } from "../../../Store/selectors"

type ProcessPhotoInitProps = {
    status: StatusType
}

const ProcessPhotoInit = (props: ProcessPhotoInitProps) => {

    const dispatch = useAppDispatch()
    const photoInfo = useSelector(selectPhotoInfo)
    
    const onPhotoLoad = (file: File) => {
        const formData = new FormData()
        formData.append('photo', file)
        dispatch(processPhotoThunk(formData))
    }

    useEffect(() => {
        if (props.status == 'successInfo') {
            if (photoInfo) {
                dispatch(getResultPhotoThunk(photoInfo.id))
            }
        }
    }, [props.status, photoInfo, dispatch])

    return (
        <div className={s.container}>
            <div className={s.initHeader}>
                Загрузите фото чтобы обработать
            </div>
            <div className={s.wrapper}>
                <PhotoUpload onPhotoLoad={onPhotoLoad}/>
            </div>
        </div>
    )
}

export default ProcessPhotoInit