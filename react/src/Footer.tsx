import { useCallback, useState } from 'react';
import { Pagination } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

interface FooterProps {
    totalPages: number,
    initialPage: number,
    callback: Function
}

const Footer = ({totalPages, initialPage, callback}: FooterProps) => {

    const [currentPage, setCurrentPage] = useState(initialPage);
    const onNext = useCallback(() => {
        if (currentPage < totalPages) {
            callback(currentPage + 1);
            setCurrentPage(currentPage + 1);
        }
      }, [currentPage, totalPages]);

    const onPrev = useCallback(() => {
        if (currentPage > 1) {
            callback(currentPage - 1);
            setCurrentPage(currentPage - 1);
        }
    }, [currentPage]);
    const onChange = useCallback((newPage, prevPage) => {
        callback(newPage);
        setCurrentPage(newPage);
    }, []);

  return (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        siblingCount={1}
        onChange={onChange}
        onNext={onNext}
        onPrevious={onPrev}
      />
  );
}

export default Footer;
