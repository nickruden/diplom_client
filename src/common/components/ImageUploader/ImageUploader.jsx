import React, { useState } from "react";
import { Upload, message, Tooltip, Flex, Spin } from "antd";
import { UploadOutlined, DeleteOutlined, StarFilled } from "@ant-design/icons";

import { uploadToCloudinary } from "../../../common/utils/uploadImage";

const ImageUploader = ({ value = [], onChange, onDeleteImage }) => {
  const [loadingItems, setLoadingItems] = useState([]);

  const customRequest = async ({ file, onSuccess, onError }) => {
    const publicId = file.uid;
    setLoadingItems((prev) => [...prev, publicId]);

    try {
      const { imageUrl } = await uploadToCloudinary(file);

      const updated = [
        ...value.map((img) => ({ ...img, isMain: false })),
        {
          publicId,
          imageUrl,
          isMain: value.length === 0,
        },
      ];

      onChange?.(updated);
      onSuccess("ok");
    } catch (err) {
      message.error("Ошибка при загрузке");
      onError(err);
    } finally {
      setLoadingItems((prev) => prev.filter((id) => id !== publicId));
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    const imgToDelete = value.find((img) => img.imageUrl === imageUrl);
    if (!imgToDelete) return;

    setLoadingItems((prev) => [...prev, imageUrl]);

    try {
      if (onDeleteImage) {
        await onDeleteImage(imgToDelete);
      }

      const updated = value.filter((img) => img.imageUrl !== imageUrl);
      if (!updated.some((img) => img.isMain) && updated.length > 0) {
        updated[0].isMain = true;
      }

      onChange?.(updated);
    } catch (err) {
      message.error("Не удалось удалить изображение с сервера");
    } finally {
      setLoadingItems((prev) => prev.filter((id) => id !== imageUrl));
    }
  };

  const handleSetMain = (imageUrl) => {
    const updated = value.map((img) => ({
      ...img,
      isMain: img.imageUrl === imageUrl,
    }));
    onChange?.(updated);
  };

  return (
    <Flex gap={16}>
      <Upload
        customRequest={customRequest}
        showUploadList={false}
        multiple
        accept="image/*"
        listType="picture-card"
      >
        <div style={{ textAlign: "center" }}>
          <UploadOutlined style={{ fontSize: 24 }} />
          <div>Загрузить</div>
        </div>
      </Upload>

      <Flex wrap="wrap" gap={16}>
        {loadingItems.map((uid) => (
          <div
            key={uid}
            style={{
              width: 100,
              height: 100,
              borderRadius: 12,
              overflow: "hidden",
              background: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
            }}
          >
            <Spin />
          </div>
        ))}

        {value.map((img) => (
          <div
            key={img.imageUrl}
            style={{
              width: 100,
              height: 100,
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: img.isMain
                ? "0 0 0 3px #1890ff"
                : "0 0 0 1px rgba(0,0,0,0.1)",
              cursor: "pointer",
              background: "#f5f5f5",
            }}
          >
            <img
              src={img.imageUrl}
              alt=""
              onClick={() => handleSetMain(img.imageUrl)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {/* Кнопка удаления */}
            <Tooltip title="Удалить">
              <DeleteOutlined
                onClick={() => handleDeleteImage(img.imageUrl)}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: "white",
                  background: "rgba(0,0,0,0.6)",
                  padding: 6,
                  borderRadius: "50%",
                  fontSize: 16,
                  zIndex: 2,
                }}
              />
            </Tooltip>

            {/* Индикатор загрузки удаления */}
            {loadingItems.includes(img.imageUrl) && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Spin />
              </div>
            )}

            {/* Иконка "Главное изображение" */}
            {img.isMain && (
              <Tooltip title="Главное изображение">
                <StarFilled
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 8,
                    color: "#1890ff",
                    background: "white",
                    borderRadius: "50%",
                    padding: 4,
                    fontSize: 18,
                    zIndex: 2,
                  }}
                />
              </Tooltip>
            )}
          </div>
        ))}
      </Flex>
    </Flex>
  );
};

export default ImageUploader;
