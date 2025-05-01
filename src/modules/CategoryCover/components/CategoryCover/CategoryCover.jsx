import React from "react";

import styles from "./CategoryCover.module.scss";
import { Flex } from "antd";
import Title from "antd/es/typography/Title";

export const CategoryCover = ({ categorySlug, categoryConfig }) => {
  const config = categoryConfig[categorySlug];

  if (!config) return null; 

  return (
    <div
      style={{
        background: config.gradient,
        color: config.textColor,
      }}
      className={styles.categoryCover}
    >
      <div className="my-container">
        <Flex justify="space-between" className={styles.categoryCover__inner}>
          <div className={styles.categoryCover__texts}>
            <Title style={{ color: config.textColor}} level={1} className={styles.title}>{config.title}</Title>
            <p style={{ color: config.textColor}} className={styles.text}>{config.desc}</p>
          </div>
          <div style={{ color: config.color }} className={styles.categoryCover__icon}>{config.icon}</div>
        </Flex>
      </div>
    </div>
  );
};

export default CategoryCover;
