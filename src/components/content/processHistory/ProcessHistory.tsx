import { useEffect } from "react"
import Header from "../../header/Header"
import NavMenu from "../../header/NavMenu"
import s from "./processHistory.module.css"
import { useAppDispatch } from "../../../Store/hooks"
import { getHistoryPhotosThunk, getHistoryThunk } from "../../../Store/historyReducer"
import { useSelector } from "react-redux"
import { selectHistoryState } from "../../../Store/selectors"


const ProcessHistory = () => {

    const historyState = useSelector(selectHistoryState)
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(getHistoryThunk(1, 10))
    }, [dispatch])

    useEffect(() => {
        if (historyState.photos.length !== 0) {
            dispatch(getHistoryPhotosThunk(historyState.photos.map(e => e.id)))
        }
    }, [historyState.photos, dispatch])

    const rowsElems = historyState.photos.map((e, ind) => {
        return (
            <tr key={ind}>
                <td><img src={historyState.photoUrls[ind]} alt="" /></td>
                <td>{e.id}</td>
                <td>{e.faces}</td>
                <td>{e.plates}</td>
                <td>
                    <div className="row-button__container">
                        <button className="row-button"><img src="/public/download.svg" alt=""></img></button>
                        <button className="row-button"><img src="/public/edit.svg" alt=""></img></button>
                    </div>
                </td>
            </tr>
        )
    })


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
                                    Идентификатор
                                </div></th>
                                <th><div>
                                    Лиц 
                                </div></th>
                                <th><div>
                                    Номеров
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

            </div>
        </div>
    )
}

export default ProcessHistory