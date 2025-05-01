import React from "react";

import { Link } from "react-router-dom";

import { categoryIcons } from "../../API/categoryIcons";

import styles from "./CategoryItem.module.scss";
import { Flex } from "antd";

const CategoryItem = ({ data, type, activeCategory, bgColor }) => {
  const isActive = activeCategory === data.slug;

  return (
    <Link
      to={`/category/${data.slug}`}
      className={`${styles.categoryCardWrap} ${
        type === "categoryPage" ? styles.innerCategory : ""
      }`}
      style={isActive ? { backgroundColor: bgColor } : {}}
    >
      <Flex
        vertical
        align="center"
        justify="center"
        gap="7px"
        className={styles.categoryCard}
      >
        <div className={styles.categoryCardIcon} style={isActive ? { color: '#FFF' } : {}}>{categoryIcons[data.id]}</div>
        {!isActive && (
          <div className={styles.categoryCardTitle}>
            {data.name}
          </div>
        )}
      </Flex>
    </Link>
  );
};

export default CategoryItem;
