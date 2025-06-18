import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Input,
  Divider,
  Space,
  Typography,
  Upload,
  Form,
  Row,
  Col,
  Tooltip,
  message,
  Flex,
  Card,
  Statistic,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  CameraOutlined,
  SaveOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { FaExternalLinkAlt } from "react-icons/fa";

import "./AccountPage.scss";
import { AppLayout } from "../../../common/components";
import { useAuth } from "../../../common/hooks/useAuth";
import dayjs from "dayjs";
import InputMask from "inputmask";
import MyButton from "../../../common/components/UI/Button/MyButton";
import {
  useDeleteUser,
  useUpdateUserInfo,
} from "../../../common/API/services/user/hooks.api";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const AccountPage = () => {
  const { user } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const [phoneValue, setPhoneValue] = useState(user.phone);

  useEffect(() => {
    const mask = new InputMask("+7 (999) 999-99-99");
    mask.mask(document.querySelector("#phone"));
  }, []);

  const handleEditToggle = () => setEditMode((prev) => !prev);

  const handleAvatarChange = (info) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      const url = URL.createObjectURL(info.file.originFileObj);
      setAvatarUrl(url);
    }
  };

  const { mutate: deleteUser } = useDeleteUser();

  const handleDeleteUser = () => {
    dispatch(logoutUser());
    deleteUser(user.id);
  };

  const { mutate: userUpdate, isPending, error } = useUpdateUserInfo();

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const { facebook, instagram, twitter, ...rest } = values;

        const organizerMedias = JSON.stringify({
          facebook,
          instagram,
          twitter,
        });

        const data = {
          ...rest,
          organizerMedias,
          avatar: avatarUrl,
        };

        console.log("Обновляем юзера:", user.id, data);
        userUpdate({ id: user.id, data });
        setEditMode(false);
      })
      .catch((err) => {
        console.log("Validation Failed", err);
      });
  };

  const organizerMedias = JSON.parse(user.organizerMedias || "{}");

  const handlePhoneChange = (e) => {
    setPhoneValue(e.target.value);
  };

  return (
    <AppLayout>
      <div className="accountPage">
        <div className="my-container">
          <Flex
            justify="space-between"
            align="center"
            className="accountPage__header"
            style={{ marginBottom: 24 }}
          >
            <Text type="secondary">
              Зарегистрирован: {dayjs(user.createdAt).format("DD.MM.YYYY")}
            </Text>
            <Space size="middle" wrap>
              <MyButton
                type="text"
                icon={<EditOutlined />}
                onClick={handleEditToggle}
              >
                {editMode ? "Отменить" : "Редактировать профиль"}
              </MyButton>
              <MyButton icon={<LockOutlined />}>Изменить пароль</MyButton>
              <MyButton
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteUser}
              >
                Удалить профиль
              </MyButton>
            </Space>
          </Flex>

          <Flex
            align="flex-start"
            gap="32px"
            wrap
            className="accountPage__body"
          >
            <div
              className="profileCard"
              style={{
                minWidth: 280,
                textAlign: "center",
                position: "relative",
                background: "#f9f9f9",
                padding: 24,
                borderRadius: 12,
              }}
            >
              <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleAvatarChange}
                disabled={!editMode}
              >
                <Tooltip
                  title="Нажмите, чтобы изменить фото"
                  open={editMode ? undefined : false}
                >
                  <Avatar
                    size={128}
                    src={avatarUrl}
                    icon={
                      !avatarUrl && <CameraOutlined style={{ fontSize: 40 }} />
                    }
                    style={{
                      cursor: editMode ? "pointer" : "default",
                      marginBottom: 12,
                    }}
                  />
                </Tooltip>
              </Upload>
              <Title level={3}>
                {user.firstName} {user.lastName}
              </Title>
              <Divider />
              <Flex justify="center" align="center" gap={30}>
                <Statistic value={user.followersCount} title="Подписчики" />
                <Statistic value={user.eventsCount} title="Всего ивентов" />
              </Flex>
            </div>

            <Form
              form={form}
              layout="vertical"
              initialValues={{
                email: user.email,
                phone: user.phone,
                firstName: user.firstName,
                lastName: user.lastName,
                organizerName: user.organizerName,
                organizerDesc: user.organizerDesc,
                facebook: organizerMedias.facebook,
                instagram: organizerMedias.instagram,
                twitter: organizerMedias.twitter,
              }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 50,
              }}
              disabled={!editMode}
              className="accountForm"
            >
              <div className="formBlock">
                <div
                  className="formBlock__innner"
                  style={{
                    background: "#f9f9f9",
                    padding: 24,
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <Row gutter={30}>
                    <Col span={12}>
                      <Form.Item
                        name="firstName"
                        label="Имя"
                        rules={
                          editMode
                            ? [
                                { required: true, message: "Введите имя" },
                                { max: 40, message: "Максимум 40 символов" },
                              ]
                            : null
                        }
                      >
                        <Input
                          placeholder="Введите имя"
                          style={{
                            backgroundColor: editMode ? undefined : "#f5f5f5",
                            color: "#000",
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="lastName"
                        label="Фамилия"
                        rules={
                          editMode
                            ? [{ required: true, message: "Введите фамилию" }]
                            : null
                        }
                      >
                        <Input
                          placeholder="Введите фамилию"
                          style={{
                            backgroundColor: editMode ? undefined : "#f5f5f5",
                            color: "#000",
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={30}>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email"
                        rules={
                          editMode
                            ? [
                                {
                                  required: true,
                                  type: "email",
                                  message: "Введите корректный email",
                                },
                              ]
                            : null
                        }
                      >
                        <Input
                          style={{
                            backgroundColor: editMode ? undefined : "#f5f5f5",
                            color: "#000",
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="phone" label="Телефон">
                        <Input
                          id="phone"
                          value={phoneValue}
                          onChange={handlePhoneChange}
                          style={{
                            backgroundColor: editMode ? undefined : "#f5f5f5",
                            color: "#000",
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </div>

              <div className="formBlock">
                <Link to={`/creator/${user.id}`}>
                  <Title level={4}>
                    Страница организатора <FaExternalLinkAlt size={18} />
                  </Title>
                </Link>
                <div
                  className="formBlock__innner"
                  style={{
                    background: "#f9f9f9",
                    padding: 24,
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <Form.Item
                    name="organizerName"
                    label="Имя от лица организатора"
                    rules={
                      editMode
                        ? [
                            {
                              required: true,
                              message: "Введите название организатора",
                            },
                            { max: 40, message: "Максимум 40 символов" },
                          ]
                        : null
                    }
                  >
                    <Input
                      style={{
                        backgroundColor: editMode ? undefined : "#f5f5f5",
                        color: "#000",
                      }}
                    />
                  </Form.Item>
                  <Form.Item name="organizerDesc" label="Описание">
                    <Input.TextArea
                      rows={3}
                      style={{
                        backgroundColor: editMode ? undefined : "#f5f5f5",
                        color: "#000",
                      }}
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="formBlock">
                <Title level={4}>Социальные сети</Title>
                <div
                  className="formBlock__innner"
                  style={{
                    background: "#f9f9f9",
                    padding: 24,
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <Form.Item name="facebook" label="Facebook">
                    <Input
                      style={{
                        backgroundColor: editMode ? undefined : "#f5f5f5",
                        color: "#000",
                      }}
                    />
                  </Form.Item>
                  <Form.Item name="instagram" label="Instagram">
                    <Input
                      style={{
                        backgroundColor: editMode ? undefined : "#f5f5f5",
                        color: "#000",
                      }}
                    />
                  </Form.Item>
                  <Form.Item name="twitter" label="Twitter">
                    <Input
                      style={{
                        backgroundColor: editMode ? undefined : "#f5f5f5",
                        color: "#000",
                      }}
                    />
                  </Form.Item>
                </div>
              </div>

              {editMode && (
                <MyButton
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  style={{ marginTop: 8 }}
                >
                  Сохранить изменения
                </MyButton>
              )}
            </Form>
          </Flex>
        </div>
      </div>
    </AppLayout>
  );
};

export default AccountPage;
