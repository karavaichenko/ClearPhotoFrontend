import { useSelector } from "react-redux"
import Header from "../../header/Header"
import NavMenu from "../../header/NavMenu"
import { selectProcessStatus } from "../../../Store/selectors"
import ProcessPhotoInit from "./ProcessPhotoInit"
import ProcessPhotoSucess from "./ProcessPhotoSucess"
import ProcessPhotoError from "./ProcessPhotoError"



const ProcessPhoto = () => {

    const processStatus = useSelector(selectProcessStatus)
    return (
        <div>
            <Header />
            <NavMenu section="process"/>

            { 
                processStatus == "init" || processStatus == "successInfo" ? 
                <ProcessPhotoInit status={processStatus} /> :
                processStatus == "success" ?
                <ProcessPhotoSucess /> :
                <ProcessPhotoError />
            }

        </div>
    )
}

export default ProcessPhoto