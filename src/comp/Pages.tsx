import React from "react";
import { Pagination } from "antd";

interface Props {
  onChange: (page: number) => void;
  defaultCurrent: number;
  total: number;
}

const Pages: React.FC<Props> = ({
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