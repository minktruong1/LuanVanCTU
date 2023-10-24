import React from "react";
import { Collapse, Divider } from "antd";

const FaqQuestion = ({ ques, answer }) => {
  return (
    <div className="mb-1">
      <Collapse
        size="large"
        items={[
          {
            key: "1",
            label: ques,
            children: <p>{answer}</p>,
          },
        ]}
      />
    </div>
  );
};

export default FaqQuestion;
