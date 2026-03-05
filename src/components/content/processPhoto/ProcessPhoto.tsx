import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { DragEvent, ChangeEvent } from "react"
import { useAppDispatch, useAppSelector } from "../../../Store/hooks"
import {
    uploadPhotoThunk,
    resetPhotoState,
    setProcessingError,
    selectCurrentPhoto,
    selectProcessingState,
    selectErrorMessage
} from "../../../Store/photoReducer"
import Header from "../../header/Header"
import "./processPhoto.css"

const ProcessPhoto = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const currentPhoto = useAppSelector(selectCurrentPhoto)
    const processingState = useAppSelector(selectProcessingState)
    const errorMessage = useAppSelector(selectErrorMessage)

    const [dragOver, setDragOver] = useState(false)

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOver(false)
    }

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOver(false)

        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFileSelect(files[0])
        }
    }

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFileSelect(files[0])
        }
    }

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            dispatch(setProcessingError('Пожалуйста, выберите изображение'))
            return
        }
        dispatch(uploadPhotoThunk(file))
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleReset = () => {
        dispatch(resetPhotoState())
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleDownload = () => {
        if (currentPhoto.photoId) {
            // Здесь должна быть логика скачивания обработанного фото
            // Пока заглушка - можно реализовать через API
            window.open(`/api/photo/${currentPhoto.photoId}/download`, '_blank')
        }
    }

    const getProgressText = () => {
        switch (processingState) {
            case 'uploading':
                return 'Загрузка файла...'
            case 'processing':
                return `Обработка: ${currentPhoto.progress}%`
            case 'success':
                return 'Обработка завершена!'
            case 'error':
                return 'Ошибка обработки'
            default:
                return ''
        }
    }

    return (
        <div>
            <Header />

            <nav className="nav-menu">
                <button
                    className="nav-item active"
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

            <div className="page-container">
                
                <h1 className="page-title">Обработка фотографии</h1>

                {errorMessage && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        <span>{errorMessage}</span>
                    </div>
                )}

                {processingState === 'idle' && (
                    <div
                        className={`upload-area ${dragOver ? 'drag-over' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleUploadClick}
                    >
                        <div className="upload-icon">📁</div>
                        <div className="upload-text">
                            Перетащите файл сюда или нажмите для выбора
                        </div>
                        <div className="upload-hint">
                            Поддерживаемые форматы: JPG, PNG, WEBP
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileInput}
                        />
                    </div>
                )}

                {(processingState === 'uploading' || processingState === 'processing') && (
                    <div className="progress-container">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${currentPhoto.progress}%` }}
                            />
                        </div>
                        <div className="progress-info">
                            <span>{getProgressText()}</span>
                            <span>{currentPhoto.progress}%</span>
                        </div>
                        <div className="progress-stats">
                            <div className="stat">
                                <div className="stat-value">{currentPhoto.faces}</div>
                                <div className="stat-label">Найдено лиц</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">{currentPhoto.plates}</div>
                                <div className="stat-label">Найдено номеров</div>
                            </div>
                        </div>
                    </div>
                )}

                {processingState === 'success' && (
                    <div className="result-container">
                        <div className="result-title">✅ Обработка завершена!</div>
                        
                        {currentPhoto.photoId && (
                            <img
                                src={`/api/photo/${currentPhoto.photoId}/view`}
                                alt="Обработанное фото"
                                className="result-image"
                            />
                        )}

                        <div className="progress-stats" style={{ marginBottom: '24px' }}>
                            <div className="stat">
                                <div className="stat-value">{currentPhoto.faces}</div>
                                <div className="stat-label">Заблокировано лиц</div>
                            </div>
                            <div className="stat">
                                <div className="stat-value">{currentPhoto.plates}</div>
                                <div className="stat-label">Заблокировано номеров</div>
                            </div>
                        </div>

                        <div className="result-actions">
                            <button className="button button--primary" onClick={handleDownload}>
                                ⬇️ Скачать
                            </button>
                            <button className="button" onClick={handleReset}>
                                🔄 Обработать ещё
                            </button>
                        </div>
                    </div>
                )}

                {processingState === 'error' && (
                    <div className="result-container">
                        <div className="result-title" style={{ color: '#c62828' }}>
                            ❌ Произошла ошибка
                        </div>
                        <p style={{ marginBottom: '24px', color: '#666' }}>
                            {errorMessage || 'Не удалось обработать фотографию'}
                        </p>
                        <button className="button button--primary" onClick={handleReset}>
                            🔄 Попробовать снова
                        </button>
                    </div>
                )}

            </div>

        </div>
    )
}

export default ProcessPhoto
