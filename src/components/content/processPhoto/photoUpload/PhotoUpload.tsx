import { useRef, useState } from "react"
import s from "./photoUpload.module.css"


type PhotoUploadPropsType = {
    onPhotoLoad: (file: File) => void
}

const PhotoUpload = (props: PhotoUploadPropsType) => {

    const [isDragOver, setIsDragOver] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [isProcessed, setIsProcessed] = useState(false)

    const handleFile = (file: File) => {
        if (file && file.type.startsWith("image/")) {
            props.onPhotoLoad(file)
            setIsProcessed(true)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFile(file)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) {
            handleFile(file)
        }
    }

    const handleClick = () => {
        inputRef.current?.click()
    }

    return (
        <div>
            <div
                    className={s.imageLoaderArea}
                    style={{ borderColor: isDragOver ? "var(--font-color)" : "var(--accent-color)" }}
                    onClick={handleClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className={s.loaderHint}>
                        {isDragOver ? "Отпускай" : 
                        isProcessed ? <span className="loader"></span> : "Перетащи фото"}
                    </div>
                </div>
                <input
                    ref={inputRef}
                    className={s.imageInput}
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                />
        </div>
    )
}

export default PhotoUpload