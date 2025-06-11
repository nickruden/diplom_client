import { Form, Typography, Flex, Divider } from "antd";
const { Title, Text } = Typography;

import { CiCircleList, CiLocationOn, CiTextAlignRight } from "react-icons/ci";
import { LiaHeadingSolid } from "react-icons/lia";
import {
  MdOutlineCalendarViewDay,
  MdOutlineEditCalendar,
} from "react-icons/md";
import { AiOutlineClockCircle } from "react-icons/ai";
import imageBlockBgImage from "../../../../assets/pages/event-info/image-block/bg-image.png";

import { useGetCategory } from "../../../../common/API/services/categories/hooks.api";

import MyInput from "../../../../common/components/UI/Input/MyInput";
import MySelect from "../../../../common/components/UI/MySelect/MySelect";
import MySwitch from "../../../../common/components/UI/Switch/MySwitch";
import MySegmented from "../../../../common/components/UI/Segmented/MuSegmented";
import MyDateTimePicker from "../../../../common/components/UI/DatePicker/MyDatePicker";

import { Tooltip } from "antd";

import {
  MySkeleton,
  TextEditor,
  ImageUploader,
} from "../../../../common/components";

import { BigBanner } from "../../../BigBanner";

import styles from "./EventForm.module.scss";
import { useDeleteImage } from "../../../../common/API/services/events/hooks.api";
import MyButton from "../../../../common/components/UI/Button/MyButton";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { normalizeToUtcWithoutOffset } from "../../../../common/utils/Date/formatDate";

const EventInfo = ({
  formData,
  handleInputChange,
  formErrors,
  wasValidated,
  eventData,
}) => {
  const location = useLocation();
  const [hasTickets, setHasTickets] = useState(false);
  const [hasPokupki, setHasPokupki] = useState(false);

  const { data: categories, isLoading: loadingCategories } = useGetCategory();
  const { mutate: deleteImage } = useDeleteImage();

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setHasTickets(eventData.tickets.length > 0);
      setHasPokupki(eventData.totalSoldTickets > 0);
    }
  }, [location.pathname, eventData]);

  const handleDeleteImage = async (img) => {
    deleteImage({ publicId: img.publicId });
  };

  // Вычисляем массив занятых дат (по проданным или созданным билетам)
  const busyDates = useMemo(() => {
    const dates = new Set();
    eventData?.tickets?.forEach((ticket) => {
      if (ticket.validFrom) {
        const date = normalizeToUtcWithoutOffset(
          dayjs(ticket.validFrom)
        ).format("YYYY-MM-DD");
        console.log(date);
        dates.add(date);
      }
    });
    return dates;
  }, [eventData]);

  // Добавление нового дня — пустой и редактируемый
  const addEmptyDay = () => {
    const current = JSON.parse(formData.dailySchedule || "[]");
    current.push({ date: null, startTime: null, endTime: null });
    handleInputChange("dailySchedule", JSON.stringify(current));
  };

  const updateDailySchedule = (id, field, value) => {
    const current = JSON.parse(formData.dailySchedule || "[]");
    current[id] = { ...current[id], [field]: value };
    handleInputChange("dailySchedule", JSON.stringify(current));
  };

  const removeDay = (id) => {
    const current = JSON.parse(formData.dailySchedule || "[]");
    current.splice(id, 1);
    handleInputChange("dailySchedule", JSON.stringify(current));
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

          <Tooltip
            title={
              hasTickets
                ? "Сначала удалите созданные билеты на эту дату и время!"
                : ""
            }
          >
            <Flex
              id="eventDate"
              gap={20}
              style={{ maxWidth: "800px" }}
              className={`${styles.formBlock} ${
                formErrors.dateTime || formErrors.dailySchedule
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
                <div style={{ display: "inline-block" }}>
                  <MySwitch
                    title="Мероприятие не в один день?"
                    checked={formData.multiDay}
                    disabled={hasTickets}
                    onChange={(checked) => {
                      handleInputChange("multiDay", checked);
                      handleInputChange("hasIndividualSchedule", false);
                      handleInputChange("dailySchedule", "[]");
                      if (checked) {
                        handleInputChange("endDate", null);
                      } else if (formData.startDate) {
                        handleInputChange("endDate", formData.startDate);
                      }
                    }}
                  />
                </div>

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
                          disabled={hasTickets}
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
                          disableStartDate={hasTickets}
                        />
                      </Form.Item>
                    )}
                  </Flex>
                  {!formData.hasIndividualSchedule && (
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
                            disabled={hasTickets}
                          />
                        </Form.Item>
                        <span style={{ fontSize: 28 }}>–</span>
                        <Form.Item className={styles.formElement}>
                          <MyDateTimePicker
                            value={formData.endTime}
                            onChange={(time) =>
                              handleInputChange("endTime", time)
                            }
                            type="time"
                            size="large"
                            placeholder="Конец"
                            disabled={hasTickets}
                          />
                        </Form.Item>
                      </Flex>
                    </Flex>
                  )}
                </Flex>

                {formData.multiDay && (
                  <>
                    <Flex
                      justify="space-between"
                      align="center"
                      style={{ marginTop: 20 }}
                      gap={20}
                    >
                      <MySwitch
                        title="Продолжительность каждого дня одинаковая?"
                        checked={!formData.hasIndividualSchedule}
                        onChange={(checked) => {
                          handleInputChange("hasIndividualSchedule", !checked);

                          if (checked) {
                            handleInputChange("dailySchedule", "[]");
                          }
                        }}
                        disabled={hasTickets}
                      />

                      {formData.hasIndividualSchedule && (
                        <MyButton type="text" onClick={addEmptyDay}>
                          + Добавить день
                        </MyButton>
                      )}
                    </Flex>

                    {formData.hasIndividualSchedule && (
                      <Flex vertical style={{ marginTop: 16 }}>
                        {JSON.parse(formData.dailySchedule || "[]").map(
                          (entry, id) => {
                            const entryDate = entry.date
                              ? dayjs(entry.date).format("YYYY-MM-DD")
                              : null;
                            const isBusy =
                              entryDate && busyDates.has(entryDate);

                            return (
                              <Flex
                                key={id}
                                gap={16}
                                align="center"
                                style={{ marginBottom: 8 }}
                              >
                                <MyDateTimePicker
                                  placeholder="Дата"
                                  value={entry.date ? dayjs(entry.date) : null}
                                  onChange={(val) =>
                                    updateDailySchedule(id, "date", val)
                                  }
                                  disabled={isBusy}
                                  disabledDate={(currentDate) => {
                                    const dateStr =
                                      dayjs(currentDate).format("YYYY-MM-DD");

                                    const isPast = currentDate.isBefore(
                                      dayjs().startOf("day")
                                    ); // 🔒 Вчера и раньше

                                    const isAlreadyUsed = JSON.parse(
                                      formData.dailySchedule || "[]"
                                    ).some((item, index) => {
                                      if (!item.date || index === id)
                                        return false; // Пропускаем текущую строку
                                      return (
                                        dayjs(item.date).format(
                                          "YYYY-MM-DD"
                                        ) === dateStr
                                      );
                                    });

                                    const isBusyGlobally =
                                      busyDates.has(dateStr); // Уже есть билеты

                                    return (
                                      isPast || isAlreadyUsed || isBusyGlobally
                                    );
                                  }}
                                />
                                <MyDateTimePicker
                                  placeholder="Начало"
                                  type="time"
                                  value={
                                    entry.startTime
                                      ? dayjs(entry.startTime)
                                      : null
                                  }
                                  onChange={(val) =>
                                    updateDailySchedule(id, "startTime", val)
                                  }
                                  disabled={isBusy}
                                />
                                <MyDateTimePicker
                                  placeholder="Конец"
                                  type="time"
                                  value={
                                    entry.endTime ? dayjs(entry.endTime) : null
                                  }
                                  onChange={(val) =>
                                    updateDailySchedule(id, "endTime", val)
                                  }
                                  disabled={isBusy}
                                />

                                <MyButton
                                  type="danger"
                                  onClick={() => removeDay(id)}
                                  disabled={isBusy}
                                >
                                  Удалить
                                </MyButton>
                              </Flex>
                            );
                          }
                        )}

                        {formErrors.dailySchedule && (
                          <Text type="danger" style={{ marginTop: 8 }}>
                            {formErrors.dailySchedule}
                          </Text>
                        )}
                      </Flex>
                    )}
                  </>
                )}
              </Flex>
            </Flex>
          </Tooltip>

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
                <Tooltip
                  title={hasPokupki ? "Сначала верните купленные билеты!" : ""}
                >
                  <MySegmented
                    options={[
                      { label: "Офлайн", value: "offline" },
                      { label: "Онлайн", value: "online" },
                    ]}
                    value={formData.locationType}
                    onChange={(value) =>
                      handleInputChange("locationType", value)
                    }
                    size="large"
                    style={{ marginBottom: 16 }}
                    disabled={hasPokupki}
                  />
                </Tooltip>

                {formData.locationType === "offline" && (
                  <MyInput
                    value={formData.address}
                    placeholder="Введите полный адресс или узнаваемое название"
                    size="large"
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                )}
                {formData.locationType === "online" && (
                  <Flex
                    vertical
                    style={{ maxWidth: "800px" }}
                    className={`${styles.formBlock} ${
                      formErrors.onlineLink
                        ? styles.validateError
                        : formData.onlineLink
                        ? styles.validateSuccess
                        : ""
                    }`}
                  >
                    <Flex gap={20} className={styles.header}>
                      <Flex vertical>
                        <Text className={styles.description}>
                          Укажите ссылку для подключения и дополнительные
                          сведения
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex vertical gap={20}>
                      <Form.Item
                        className={styles.input}
                        validateStatus={
                          formErrors.onlineLink
                            ? "error"
                            : formData.onlineLink
                            ? "success"
                            : ""
                        }
                        help={
                          formErrors.onlineLink &&
                          "Ссылка обязательна для онлайн события"
                        }
                      >
                        <MyInput
                          value={formData.onlineLink}
                          onChange={(e) =>
                            handleInputChange("onlineLink", e.target.value)
                          }
                          placeholder="https://zoom.us/..."
                          size="large"
                        />
                      </Form.Item>

                      <Form.Item className={styles.input}>
                        <MyInput
                          value={formData.onlinePassword}
                          onChange={(e) =>
                            handleInputChange("onlinePassword", e.target.value)
                          }
                          placeholder="Пароль (если есть)"
                          size="large"
                        />
                      </Form.Item>

                      <Form.Item className={styles.input}>
                        <TextEditor
                          value={formData.onlineInstructions}
                          onChange={(val) =>
                            handleInputChange("onlineInstructions", val)
                          }
                          theme="snow"
                          placeholder="Опишите главные инструкции, чтобы пользователь не потерялся"
                        />
                      </Form.Item>
                    </Flex>
                  </Flex>
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
};

export default EventInfo;
