import type { ChangeEvent } from 'react';
import s from "./paginator.module.css"

type PaginatorPropsType = {
    currentPage: number
    totalPages: number
    limit: number
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void
}


const Paginator = (props: PaginatorPropsType) => {

  const limits = [10, 20, 50, 100]
  const showTotal = true
  const totalItems = 0
  const siblingCount = 1

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= props.totalPages) {
      props.onPageChange(page);
    }
  };

  const handleLimitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value);
    props.onLimitChange(newLimit);
    // Обычно при изменении limit сбрасывают на первую страницу
    if (props.onPageChange) {
      props.onPageChange(1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const totalPageNumbers = siblingCount * 2 + 3; // Текущая + соседние + первая + последняя + ...
    
    if (props.totalPages <= totalPageNumbers) {
      // Если страниц мало, показываем все
      for (let i = 1; i <= props.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftSiblingIndex = Math.max(props.currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(props.currentPage + siblingCount, props.totalPages);
      
      const showLeftDots = leftSiblingIndex > 2;
      const showRightDots = rightSiblingIndex < props.totalPages - 1;
      
      if (!showLeftDots && showRightDots) {
        // Слева нет многоточия, показываем первые страницы
        for (let i = 1; i < 3 + 2 * siblingCount; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(props.totalPages);
      } else if (showLeftDots && !showRightDots) {
        // Справа нет многоточия, показываем последние страницы
        pages.push(1);
        pages.push('...');
        for (let i = props.totalPages - (2 + 2 * siblingCount); i <= props.totalPages; i++) {
          pages.push(i);
        }
      } else if (showLeftDots && showRightDots) {
        // Многоточия с обеих сторон
        pages.push(1);
        pages.push('...');
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(props.totalPages);
      }
    }
    
    return pages;
  };

  const startItem = totalItems ? (props.currentPage - 1) * props.limit + 1 : 0;
  const endItem = totalItems ? Math.min(props.currentPage * props.limit, totalItems) : 0;

  return (
    <div className={s.paginatorContainer}>
      <div className={s.paginatorControls}>
        {/* Кнопка "Первая" */}
        <button 
          onClick={() => handlePageChange(1)}
          disabled={props.currentPage === 1}
          className="paginator-button"
          aria-label="Первая страница"
        >
          ⏮
        </button>

        {/* Кнопка "Предыдущая" */}
        <button 
          onClick={() => handlePageChange(props.currentPage - 1)}
          disabled={props.currentPage === 1}
          className="paginator-button"
          aria-label="Предыдущая страница"
        >
          ◀
        </button>

        {/* Номера страниц */}
        <div className={s.paginatorPages}>
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
              disabled={page === '...'}
              className={`paginator-page ${props.currentPage === page ? s.activePage : ''} ${page === '...' ? 'dots' : ''}`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Кнопка "Следующая" */}
        <button 
          onClick={() => handlePageChange(props.currentPage + 1)}
          disabled={props.currentPage === props.totalPages}
          className=" paginator-button"
          aria-label="Следующая страница"
        >
          ▶
        </button>

        {/* Кнопка "Последняя" */}
        <button 
          onClick={() => handlePageChange(props.totalPages)}
          disabled={props.currentPage === props.totalPages}
          className="paginator-button"
          aria-label="Последняя страница"
        >
          ⏭
        </button>
      </div>

      <div className="paginator-info">
        {/* Селектор количества элементов на странице */}
        <div className={s.paginatorLimit}>
          <label htmlFor="limit-select">Показывать по:</label>
          <select 
            id="limit-select"
            value={props.limit} 
            onChange={handleLimitChange}
            className="paginator-select"
          >
            {limits.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Информация о записях */}
        {showTotal && totalItems > 0 && (
          <div className="paginator-total">
            {startItem}-{endItem} из {totalItems} записей
          </div>
        )}
      </div>
    </div>
  );
};


export default Paginator;