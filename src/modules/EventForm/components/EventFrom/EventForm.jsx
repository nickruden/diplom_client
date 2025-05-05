import React from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

import { Form, Typography, Flex, Divider } from "antd";
const { Title, Text } = Typography;

import { CiCircleList, CiLocationOn, CiTextAlignRight } from "react-icons/ci";
import { LiaHeadingSolid } from "react-icons/lia";
import { MdOutlineCalendarViewDay, MdOutlineEditCalendar } from "react-icons/md";
import { AiOutlineClockCircle } from "react-icons/ai";
import imageBlockBgImage from '../../../../assets/pages/event-info/image-block/bg-image.png'

import { useGetCategory } from "../../../../common/API/services/categories/hooks.api";

import SearchInput from "../../../../common/components/UI/Search/Search";
import MyInput from "../../../../common/components/UI/Input/MyInput";
import MySelect from "../../../../common/components/UI/MySelect/MySelect";
import MySwitch from "../../../../common/components/UI/Switch/MySwitch";
import MySegmented from "../../../../common/components/UI/Segmented/MuSegmented";
import MyDateTimePicker from '../../../../common/components/UI/DatePicker/MyDatePicker'

import { MySkeleton, TextEditor, ImageUploader, MyLocationMap  } from "../../../../common/components";

// этот импорт не правильный с точки зрения архитектуры модульности
import { BigBanner } from '../../../BigBanner';

import styles from './EventForm.module.scss'
import { useDeleteImage } from "../../../../common/API/services/events/hooks.api";


const EventInfo = ({formData, handleInputChange, formErrors, wasValidated}) => {
  const { data: categories, isLoading: loadingCategories } = useGetCategory();
  const { mutate: deleteImage } = useDeleteImage();

  const handleDeleteImage = async (img) => {
    console.log(img.publicId)
    deleteImage({publicId: img.publicId});
  };

  return (
    <div className={styles.eventInfoStep}>
      <Form className={styles.eventForm}>
        <Flex gap={40} vertical>
          <Flex
            gap={180}
            style={{ maxWidth: "1200px" }}
            className={`${styles.formBlock} ${
              wasValidated && formErrors.images
                ? styles.validateError
                : wasValidated && formData.images
                ? styles.validateSuccess
                : ""
            }`}
          >
            <div className={styles.bgImageBlockIcons}>
              <img src={imageBlockBgImage} alt="" />
            </div>
            <Flex gap={20} vertical style={{ position: "relative", zIndex: 5 }}>
              <div className={styles.header}>
                <Title level={4} className={styles.title}>
                  Изображения мероприятия
                </Title>
                <Text className={styles.description}>
                  Загрузите изображения для вашего события
                </Text>
              </div>
              <Form.Item
                className={styles.input}
                validateStatus={
                  wasValidated ? (formErrors.images ? "error" : "success") : ""
                }
                help={formErrors.images}
              >
                <Flex vertical gap={20} className={styles.addImages}>
                  <Flex style={{ maxWidth: 800 }}>
                    {formData.images?.length > 0 ? (
                      <BigBanner type="uploadExemple" data={formData.images} />
                    ) : (
                      <MySkeleton width="800px" height="350px" />
                    )}
                  </Flex>
                  <ImageUploader
                    value={formData.images}
                    onChange={(newImages) =>
                      handleInputChange("images", newImages)
                    }
                    onDeleteImage={handleDeleteImage}
                  />
                </Flex>
                <Text
                  type="secondary"
                  style={{ fontSize: 12, fontWeight: 600, fontStyle: "italic" }}
                >
                  Рекомендуемый размер изображения: 2160 x 1080px (16 / 9) •
                  Максимальный размер файла: 10MB
                </Text>
              </Form.Item>
            </Flex>
          </Flex>

          <Flex
            gap={20}
            className={`${styles.formBlock} ${
              formErrors.category
                ? styles.validateError
                : formData.category
                ? styles.validateSuccess
                : ""
            }`}
            style={{ maxWidth: "400px" }}
          >
            <CiCircleList size={80} />
            <Flex vertical>
              <Flex gap={20} className={styles.header}>
                <Flex vertical>
                  <Title level={4} className={styles.title}>
                    Категория
                  </Title>
                  <Text className={styles.description}>
                    Выберите категорию, которая лучше всего описывает ваше
                    мероприятие
                  </Text>
                </Flex>
              </Flex>
              <Form.Item
                className={styles.input}
                validateStatus={
                  formErrors.category
                    ? "error"
                    : formData.category
                    ? "success"
                    : ""
                }
                help={formErrors.category}
              >
                <MySelect
                  value={formData.category}
                  onChange={(value) => handleInputChange("category", value)}
                  size="large"
                  placeholder="Выберите категорию"
                  options={categories?.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                />
              </Form.Item>
            </Flex>
          </Flex>

          <Flex
            gap={20}
            style={{ maxWidth: "800px" }}
            className={`${styles.formBlock} ${
              formErrors.title
                ? styles.validateError
                : formData.title
                ? styles.validateSuccess
                : ""
            }`}
          >
            <LiaHeadingSolid
              size={280}
              color="#d3d3d3c4"
              style={{
                marginTop: 5,
                position: "absolute",
                right: -51,
                bottom: -93,
                rotate: "26deg",
              }}
            />
            <Flex vertical>
              <Flex gap={20} className={styles.header}>
                <Flex vertical>
                  <Title level={4} className={styles.title}>
                    Название мероприятия
                  </Title>
                  <Text className={styles.description}>
                    Будьте ясны и коротки в названии, чтобы привлечь внимание
                  </Text>
                </Flex>
              </Flex>
              <Form.Item
                className={styles.input}
                validateStatus={
                  formErrors.title ? "error" : formData.title ? "success" : ""
                }
                help={formErrors.title}
              >
                <MyInput
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Введите название мероприятия"
                  size="large"
                />
              </Form.Item>
            </Flex>
          </Flex>

          <Flex
            gap={20}
            style={{ maxWidth: "800px" }}
            className={`${styles.formBlock} ${
              formErrors.dateTime
                ? styles.validateError
                : !formErrors.dateTime &&
                  formData.startDate &&
                  formData.startTime &&
                  formData.endTime
                ? styles.validateSuccess
                : ""
            }`}
          >
            <MdOutlineEditCalendar
              size={120}
              color="rgb(234 255 237)"
              style={{
                position: "absolute",
                left: -10,
                top: -20,
                rotate: "345deg",
              }}
            />
            <Flex vertical style={{ marginLeft: 120 }}>
              <Flex
                gap={20}
                className={styles.header}
                style={{ marginBottom: 10 }}
              >
                <Flex vertical>
                  <Title level={4} className={styles.title}>
                    Дата и время
                  </Title>
                  <Text className={styles.description}>
                    Укажите дату и время начала и окончания вашего мероприятия
                  </Text>
                </Flex>
              </Flex>

              <MySwitch
                title="Мероприятие не в один день?"
                checked={formData.multiDay}
                onChange={(checked) => {
                  handleInputChange("multiDay", checked);
                  if (checked) {
                    // очищаем endDate при включении мультидаты
                    handleInputChange("endDate", null);
                  } else if (formData.startDate) {
                    // дублируем startDate в endDate при выключении
                    handleInputChange("endDate", formData.startDate);
                  }
                }}
              />

              <Divider style={{ margin: "10px 0px 20px 0px" }} />

              <Flex gap={40} className={styles.input}>
                <Flex vertical gap={12}>
                  <Flex align="center" gap={8}>
                    <MdOutlineCalendarViewDay size={22} color="#000" />
                    <Text strong>Дата</Text>
                  </Flex>
                  {!formData.multiDay ? (
                    <Form.Item className={styles.formElement}>
                      <MyDateTimePicker
                        placeholder="Дата начала"
                        value={formData.startDate}
                        onChange={(value) =>
                          handleInputChange("startDate", value)
                        }
                        type="date"
                        size="large"
                      />
                    </Form.Item>
                  ) : (
                    <Form.Item className={styles.formElement}>
                      <MyDateTimePicker
                        placeholder={["Начальная дата", "Конечная дата"]}
                        value={[formData.startDate, formData.endDate]}
                        onChange={(range) => {
                          handleInputChange("startDate", range?.[0]);
                          handleInputChange("endDate", range?.[1]);
                        }}
                        type="range"
                        size="large"
                      />
                    </Form.Item>
                  )}
                </Flex>
                <Flex vertical gap={12}>
                  <Flex align="center" gap={8}>
                    <AiOutlineClockCircle size={22} color="#000" />
                    <Text strong>Время</Text>
                  </Flex>
                  <Flex align="center" gap={20}>
                    <Form.Item className={styles.formElement}>
                      <MyDateTimePicker
                        value={formData.startTime}
                        onChange={(time) =>
                          handleInputChange("startTime", time)
                        }
                        type="time"
                        size="large"
                        placeholder="Начало"
                      />
                    </Form.Item>
                    <span style={{ fontSize: 28 }}>–</span>
                    <Form.Item className={styles.formElement}>
                      <MyDateTimePicker
                        value={formData.endTime}
                        onChange={(time) => handleInputChange("endTime", time)}
                        type="time"
                        size="large"
                        placeholder="Конец"
                      />
                    </Form.Item>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          <Flex
            gap={20}
            style={{ maxWidth: "800px" }}
            className={`${styles.formBlock} ${
              formErrors.address
                ? styles.validateError
                : formData.address || formData.locationType === "online"
                ? styles.validateSuccess
                : ""
            }`}
          >
            <CiLocationOn size={60} />
            <Flex vertical style={{ width: "100%" }}>
              <Flex gap={20} className={styles.header}>
                <Flex vertical>
                  <Title level={4} className={styles.title}>
                    Локация
                  </Title>
                  <Text className={styles.description}>
                    Укажите, где будет проходить ваше мероприятие
                  </Text>
                </Flex>
              </Flex>
              <Form.Item className={`${styles.input} ${styles.location}`}>
                <MySegmented
                  options={[
                    { label: "Офлайн", value: "offline" },
                    { label: "Онлайн", value: "online" },
                  ]}
                  value={formData.locationType}
                  onChange={(value) => handleInputChange("locationType", value)}
                  size="large"
                  style={{ marginBottom: 16 }}
                />

                {formData.locationType === "offline" && (
                    <MyInput
                      value={formData.address}
                      placeholder="Введите название мероприятия"
                      size="large"
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                    />
                )}
              </Form.Item>
            </Flex>
          </Flex>

          <div
            gap={20}
            style={{ maxWidth: "800px" }}
            className={`${styles.formBlock} ${
              formErrors.description
                ? styles.validateError
                : formData.description
                ? styles.validateSuccess
                : ""
            }`}
          >
            <Flex
              gap={20}
              className={styles.header}
              style={{ marginBottom: 30 }}
            >
              <CiTextAlignRight size={60} />
              <Flex vertical>
                <Title level={4} className={styles.title}>
                  Описание мероприятия
                </Title>
                <Text className={styles.description}>
                  Подробно опишите ваше мероприятие. Расскажите, что ждет
                  участников.
                </Text>
              </Flex>
            </Flex>
            <Form.Item
              className={styles.input}
              validateStatus={
                formErrors.description
                  ? "error"
                  : formData.description
                  ? "success"
                  : ""
              }
            >
              <TextEditor
                value={formData.description}
                onChange={(value) => handleInputChange("description", value)}
                theme="snow"
              />
            </Form.Item>
          </div>
        </Flex>
      </Form>
    </div>
  );
}

export default EventInfo;