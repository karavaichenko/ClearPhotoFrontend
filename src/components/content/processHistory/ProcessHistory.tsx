import { useEffect } from "react"
import Header from "../../header/Header"
import NavMenu from "../../header/NavMenu"
import s from "./processHistory.module.css"
import { useAppDispatch } from "../../../Store/hooks"
import { getHistoryPhotosThunk, getHistoryThunk, setHistoryLimit, setHistoryPage } from "../../../Store/historyReducer"
import { useSelector } from "react-redux"
import { selectHistoryState } from "../../../Store/selectors"
import { Link } from "react-router"
import Pagination from "../../paginator/Paginator"


const ProcessHistory = () => {

    const historyState = useSelector(selectHistoryState)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getHistoryThunk(historyState.page, historyState.limit))
    }, [dispatch, historyState.page, historyState.limit])

    useEffect(() => {
        if (historyState.photos.length !== 0) {
            dispatch(getHistoryPhotosThunk(historyState.photos.map(e => e.id)))
        }
    }, [historyState.photos, dispatch])


    const handleDownload = async (photoUrl: string) => {
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

    const rowsElems = historyState.photos.map((e, ind) => {
        const date = new Date(e.timestamp);
        return (
            <tr key={ind}>
                {/* <td>{e.id}</td> */}
                <td><img src={historyState.photoUrls[ind]} alt="" /></td>
                <td>{e.faces}</td>
                <td>{e.plates}</td>
                <td>{date.toLocaleString()}</td>
                <td>
                    <div className="row-button__container">
                        <button onClick={() => {handleDownload(historyState.photoUrls[ind])}} className="row-button"><img src="/public/download.svg" alt=""></img></button>
                        <Link to={`/history/${e.id}`} className="row-button"><img src="/public/edit.svg" alt=""></img></Link>
                    </div>
                </td>
            </tr>
        )
    })

    const onPageChange = (page: number) => {
        dispatch(setHistoryPage(page))
    }

    const onLimitChange = (limit: number) => {
        dispatch(setHistoryLimit(limit))
    }


    return (
        <div>
            <Header />
            <NavMenu section="history"/>
            <div className={s.container}>

                <div className="table__container">
                    <div className="table__wrapper">
                        <table className="table">
                            <thead id="tableHead">
                                <tr>
                                <th><div>
                                    Фото
                                </div></th>
                                <th><div>
                                    Лиц 
                                </div></th>
                                <th><div>
                                    Номеров
                                </div></th>
                                <th><div>
                                    Дата
                                </div></th>
                                <th><div>
                                    Действия
                                </div></th>
                                </tr>
                            </thead>
                            <tbody id="tableBody"> 

                                {rowsElems}

                            </tbody>
                        </table>
                    </div>


                </div>
                    <Pagination 
                        onLimitChange={(limit) => {onLimitChange(limit)}} 
                        onPageChange={(page) => {onPageChange(page)}} 
                        currentPage={historyState.page} 
                        limit={historyState.limit} 
                        totalPages={Math.ceil(historyState.count / historyState.limit)} 
                    />

            </div>
        </div>
    )
}

export default ProcessHistory