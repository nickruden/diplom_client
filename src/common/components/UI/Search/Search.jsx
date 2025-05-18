import React, { useEffect, useState } from "react";
import { Button, Flex, Input } from "antd";
import { IoIosSearch } from "react-icons/io";

import "./Search.scss";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import MyButton from "../Button/MyButton";

const SearchInput = ({
  placeholder = "Введите текст",
  onSearch,
  onChange,
  borderRadius,
  width = "500px",
  size,
  imgSize = "20px",
  widthButton,
  useURLParams = false,
  ...props
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [value, setValue] = useState("");
  const [wasInitializedFromURL, setWasInitializedFromURL] = useState(false);

  useEffect(() => {
    if (useURLParams && !wasInitializedFromURL) {
      const currentQuery = searchParams.get("search") || "";
      setValue(currentQuery);
      setWasInitializedFromURL(true);
    }
  }, [searchParams, useURLParams, wasInitializedFromURL]);

  useEffect(() => {
    if (value === "") {
      // Если значение стер пользователь — очищаем
      if (!useURLParams || wasInitializedFromURL) {
        clearSearch();
      }
    } else {
      onChange?.(value);
    }
  }, [value]);

  const executeSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (useURLParams) {
      const params = new URLSearchParams(location.search);
      params.set("search", trimmed);
      if (
        location.pathname !== "/" &&
        !location.pathname.includes("category")
      ) {
        navigate(`/?${params.toString()}#filters`);
        setTimeout(() => {
          const el = document.getElementById("filters");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 500);
      } else {
        navigate({ search: params.toString() });
        const el = document.getElementById("filters");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }

    onSearch?.(trimmed);
  };

  const clearSearch = () => {
    if (useURLParams) {
      const params = new URLSearchParams(location.search);
      params.delete("search");
      navigate({ search: params.toString() });
    }

    setValue("");
    onSearch?.("");
    onChange?.("");
  };

  return (
    <Flex className={`my-search ${widthButton ? "with-button" : ""}`}>
      <Input
        placeholder={placeholder}
        onPressEnter={(e) => executeSearch(e.target.value)}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        size={size}
        style={{ width, borderRadius }}
        prefix={
          <IoIosSearch
            size={imgSize}
            onClick={() => executeSearch(value)}
            className="searchInput__icon"
          />
        }
        className="searchInput"
        suffix={
          value && (
            <IoCloseOutline
              onClick={clearSearch}
              style={{ color: "#aaa", cursor: "pointer" }}
            />
          )
        }
        {...props}
      />
      {widthButton && (
        <MyButton
          type="default"
          onClick={() => executeSearch(value)}
          size={size}
          className="submitBtn"
        >
          Найти
        </MyButton>
      )}
    </Flex>
  );
};

export default SearchInput;
