import React from "react";
import styles from "./AuthUser.module.scss";
import { Input, Button, Form } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import LoginImage from "../../../../assets/LoginImage.jpg";
import MyButton from "../../../../common/components/UI/Button/MyButton";
import { useLoginUser } from '../../API/hooks.api';
import { Link } from "react-router-dom";


const AuthUser = () => {
  const [form] = Form.useForm();
  const { mutate: userLogin, isPending } = useLoginUser();

  const handleSubmit = (values) => {
    console.log(values)
    userLogin(values);
  };

  const switchToRegister = () => {
    setActiveTab("register");
    form.resetFields();
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.imageSide}>
          <img src={LoginImage} alt="Login" />
        </div>
        <div className={styles.formSide}>
          <h2 className={styles.title}>Вход</h2>

          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
            className={styles.form}
          >
            <Form.Item
              name="identifier"
              label="Email"
              rules={[
                { required: true, message: "Введите данные" },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const isEmail = value.includes("@");
                    const isPhone = /^[0-9+\-\s]+$/.test(value);
                    if (!isEmail && !isPhone) {
                      return Promise.reject(
                        "Введите корректный email"
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              className={styles.formItem}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="example@mail.com"
                className={styles.inputField}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Пароль"
              rules={[{ required: true, message: "Введите пароль" }]}
              className={styles.formItem}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="••••••••"
                className={styles.inputField}
              />
            </Form.Item>

              <MyButton
                type="primary"
                loading={isPending}
                bgColor="orange"
                className={styles.loginButton}
                onClick={() => form.submit()}
              >
                Войти
              </MyButton>
          </Form>

          <div className={styles.links}>
              <Link to={'/register'} className={styles.createLink}>
                Создать аккаунт ➞
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthUser;
