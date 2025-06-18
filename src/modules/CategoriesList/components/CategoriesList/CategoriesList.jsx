import React, { useEffect } from "react";

import { Flex } from "antd";

import CategoryItem from "../CategoryItem/CategoryItem";

import styles from "./CategoriesList.module.scss";
import { useGetCategory } from "../../../../common/API/services/categories/hooks.api";

const CategoriesList = ({ type = "main", activeCategory = null, bgColorCategory}) => {
  const { data: categoriesData, isLoading, isError } = useGetCategory();
  
  return (
    <div className={`${styles.categoriesList} ${type === "categoryPage" ? styles.noPadding : ""}`}>
      <div className="my-container">
        <Flex gap="30px" wrap className={styles.categoryCards}>
          {categoriesData?.map((categoryData) => (
            <div className={styles.categoryCard} key={categoryData.id}>
              <CategoryItem 
                data={categoryData} 
                type={type} 
                activeCategory={activeCategory} 
                bgColor={bgColorCategory}
              />
            </div>
          ))}
        </Flex>
      </div>
    </div>
  );
};

export default CategoriesList;
