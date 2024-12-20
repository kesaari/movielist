import React from "react";
import {Alert} from "antd";

interface Props {
  text: string;
}

const ErrorAlert: React.FC<Props> = ({text}) => {
  return (
    <Alert
      message="Ошибка"
      description={text}
      type="error"
      style={{margin: "50px"}}
    />
  );
};

export {ErrorAlert};
