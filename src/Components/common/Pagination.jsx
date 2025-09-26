import React from "react";
import { Pagination } from "react-bootstrap";

const PaginateComponent = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 3;

    if (currentPage > 1) {
      items.push(
        <Pagination.First key="first" onClick={() => onPageChange(1)} />,
        <Pagination.Prev
          key="prev"
          onClick={() => onPageChange(currentPage - 1)}
        />
      );
    }

    if (currentPage > maxVisible) {
      items.push(
        <Pagination.Item key={1} onClick={() => onPageChange(1)}>
          1
        </Pagination.Item>,
        <Pagination.Ellipsis key="start-ellipsis" disabled />
      );
    }

    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages, currentPage + 1);

    for (let i = start; i <= end; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (currentPage + 1 < totalPages) {
      items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      items.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    if (currentPage < totalPages) {
      items.push(
        <Pagination.Next
          key="next"
          onClick={() => onPageChange(currentPage + 1)}
        />,
        <Pagination.Last key="last" onClick={() => onPageChange(totalPages)} />
      );
    }

    return items;
  };

  return <Pagination>{getPaginationItems()}</Pagination>;
};

export default PaginateComponent;
