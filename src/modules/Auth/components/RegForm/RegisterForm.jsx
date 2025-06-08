import { Form, Input, Button } from "antd";
import {
  MailOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useRegisterUser } from "../../API/hooks.api";
import RegImage from "../../../../assets/RegImage.jpg";

import styles from "./RegisterForm.module.scss";
import { Link } from "react-router-dom";
import MyButton from "../../../../common/components/UI/Button/MyButton";

const RegisterForm = () => {
  const [form] = Form.useForm();

  const { mutate: registerData, isPending } = useRegisterUser();

  const handleSubmit = (values) => {
    console.log(values);
    registerData(values);
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.formSide}>
          <h2 className={styles.title}>Регистрация</h2>
          <Form
            form={form}
            name="register"
            onFinish={handleSubmit}
            layout="vertical"
            className={styles.form}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: `Пожалуйста, введите email`,
                },
                { type: "email", message: "Введите корректный email" }
              ]}
              className={styles.formItem}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="example@mail.com"
                className={styles.inputField}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Пароль"
              rules={[
                { required: true, message: "Пожалуйста, введите пароль" },
                { min: 6, message: "Пароль должен быть не менее 6 символов" },
              ]}
              className={styles.formItem}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" className={styles.inputField} />
            </Form.Item>

            <Form.Item
              name="firstName"
              label="Имя"
              rules={[
                { required: true, message: "Пожалуйста, введите ваше имя" },
              ]}
              className={styles.formItem}
            >
              <Input prefix={<UserOutlined />} placeholder="Имя" className={styles.inputField} />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Фамилия"
              rules={[
                { required: true, message: "Пожалуйста, введите вашу фамилию" },
              ]}
              className={styles.formItem}
            >
              <Input prefix={<UserOutlined />} placeholder="Фамилия" className={styles.inputField} />
            </Form.Item>
            <Form.Item
              name="organizerName"
              label="Название организатора"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите имя организатора",
                },
              ]}
              className={styles.formItem}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Название организатора"
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
                Зарегистрироваться
              </MyButton>
          </Form>
          <div className={styles.links}>
            <Link to={`/auth`} className={styles.createLink}>
              Войти ➞
            </Link>
          </div>
        </div>
        <div className={styles.imageSide}>
          <img src={RegImage} alt="register" />
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
