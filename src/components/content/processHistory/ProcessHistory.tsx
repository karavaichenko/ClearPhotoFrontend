import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../Store/hooks"
import {
    fetchUserPhotosThunk,
    deletePhotoThunk,
    changeFilterThunk,
    loadMorePhotosThunk,
    selectHistoryPhotos,
    selectHistoryLoading,
    selectHistoryTotal,
    selectHistoryLimit,
    selectHistoryOffset,
    selectHistoryStats,
    selectHistoryFilter
} from "../../../Store/historyReducer"
import Header from "../../header/Header"
import "./historyTable.css"

const ProcessHistory = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const photos = useAppSelector(selectHistoryPhotos)
    const isLoading = useAppSelector(selectHistoryLoading)
    const total = useAppSelector(selectHistoryTotal)
    const limit = useAppSelector(selectHistoryLimit)
    const offset = useAppSelector(selectHistoryOffset)
    const stats = useAppSelector(selectHistoryStats)
    const filter = useAppSelector(selectHistoryFilter)

    // Базовый URL для изображений
    const IMAGE_BASE_URL = "http://localhost:8000/"

    useEffect(() => {
        dispatch(fetchUserPhotosThunk())
    }, [dispatch])

    const getImageUrl = (url: string) => {
        // Если url начинается с file:// или это локальный путь
        if (url.startsWith('file://') || url.startsWith('/')) {
            // Извлекаем путь к файлу и создаём правильный URL
            const fileName = url.split('/').pop()
            return `${IMAGE_BASE_URL}uploads/${fileName}`
        }
        // Если это уже полный URL, возвращаем как есть
        return url.startsWith('http') ? url : `${IMAGE_BASE_URL}${url}`
    }

    const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit])
    const currentPage = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit])

    const handleFilterChange = (newFilter: 'all' | 'processed' | 'unprocessed') => {
        dispatch(changeFilterThunk(newFilter))
    }

    const handleDelete = (photoId: number) => {
        if (window.confirm('Вы уверены, что хотите удалить это фото?')) {
            dispatch(deletePhotoThunk(photoId))
        }
    }

    const handlePageChange = (page: number) => {
        const newOffset = (page - 1) * limit
        dispatch(fetchUserPhotosThunk(limit, newOffset, filter))
    }

    const handleLoadMore = () => {
        dispatch(loadMorePhotosThunk())
    }

    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return '—'
        return new Date(dateString).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const renderPagination = () => {
        if (totalPages <= 1) return null

        const pages = []
        const maxVisible = 5
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
        let endPage = Math.min(totalPages, startPage + maxVisible - 1)

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    className={i === currentPage ? 'active' : ''}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            )
        }

        return (
            <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    ←
                </button>

                {startPage > 1 && (
                    <>
                        <button onClick={() => handlePageChange(1)}>1</button>
                        {startPage > 2 && <span>...</span>}
                    </>
                )}

                {pages}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span>...</span>}
                        <button onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                    </>
                )}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    →
                </button>

                <div className="pagination-info">
                    <span>Стр.</span>
                    <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={currentPage}
                        onChange={(e) => {
                            const page = parseInt(e.target.value)
                            if (page >= 1 && page <= totalPages) {
                                handlePageChange(page)
                            }
                        }}
                    />
                    <span>из {totalPages}</span>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Header />

            <nav className="nav-menu">
                <button
                    className="nav-item"
                    onClick={() => navigate('/process')}
                >
                    Обработка
                </button>
                <button
                    className="nav-item active"
                    onClick={() => navigate('/history')}
                >
                    История
                </button>
            </nav>

            <div  className="page-container">
                <h1 className="page-title">История обработки</h1>

                <div className="history-filters">
                    <div className="filter-group">
                        <button
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('all')}
                        >
                            Все
                        </button>
                        <button
                            className={`filter-btn ${filter === 'processed' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('processed')}
                        >
                            Обработанные
                        </button>
                        <button
                            className={`filter-btn ${filter === 'unprocessed' ? 'active' : ''}`}
                            onClick={() => handleFilterChange('unprocessed')}
                        >
                            Необработанные
                        </button>
                    </div>

                    <div className="stats">
                        <div className="stat-item">
                            <strong>{stats.total}</strong> всего
                        </div>
                        <div className="stat-item">
                            <strong>{stats.processed}</strong> обработано
                        </div>
                        <div className="stat-item">
                            <strong>{stats.unprocessed}</strong> необработано
                        </div>
                    </div>
                </div>

                {isLoading && photos.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">⏳</div>
                        <div className="empty-text">Загрузка...</div>
                    </div>
                ) : photos.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📷</div>
                        <div className="empty-text">Нет фотографий в истории</div>
                    </div>
                ) : (
                    <>
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Фото</th>
                                    <th>ID</th>
                                    <th>Дата</th>
                                    <th>Статус</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {photos.map((photo) => (
                                    <tr key={photo.id}>
                                        <td>
                                            <img
                                                src={getImageUrl(photo.url)}
                                                alt={`Photo ${photo.id}`}
                                                className="photo-preview"
                                                onClick={() => window.open(getImageUrl(photo.url), '_blank')}
                                            />
                                        </td>
                                        <td>#{photo.id}</td>
                                        <td>{formatDate(photo.timestamp)}</td>
                                        <td>
                                            <span className={`status-badge ${photo.processed ? 'processed' : 'unprocessed'}`}>
                                                {photo.processed ? 'Обработано' : 'Не обработано'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions">
                                                <button
                                                    className="btn-icon"
                                                    title="Просмотреть"
                                                    onClick={() => window.open(getImageUrl(photo.url), '_blank')}
                                                >
                                                    👁️
                                                </button>
                                                <button
                                                    className="btn-icon delete"
                                                    title="Удалить"
                                                    onClick={() => handleDelete(photo.id)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {renderPagination()}

                        {offset + limit < total && (
                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <button className="button button--primary" onClick={handleLoadMore}>
                                    Загрузить ещё
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

        </div>
    )
}

export default ProcessHistory
