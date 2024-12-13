import React from "react";
import { Pagination } from "antd";

interface CustomPaginationProps {
  onChange: (page: number) => void;
  defaultCurrent: number;
  total: number;
}

const Pages: React.FC<CustomPaginationProps> = ({
  onChange,
  defaultCurrent,
  total,
}) => {
  return (
    <Pagination
      onChange={onChange}
      defaultCurrent={defaultCurrent}
      total={total}
      showSizeChanger={false}
      align='center'
    />
  );
};

export {Pages};