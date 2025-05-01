import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Form, Input, Button, message, Tabs, Card, Divider, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import RegisterForm from '../RegForm/RegForm'

import styles from './AuthUser.module.scss';
import { useLoginUser } from '../../API/hooks.api';

const { TabPane } = Tabs;

const AuthForm = () => {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('login');

  const { mutate: userLogin, isPending, error } = useLoginUser();

  const handleSubmit = (values) => {
    userLogin(values);
  };

  const switchToRegister = () => {
    setActiveTab('register');
    form.resetFields();
  };

  return (
    <div className={styles.auth}>
      <div className="my-container">
        <div className={styles.authCard}>
          
            <div className={styles.authHeader}>
              <h2>Добро пожаловать</h2> 
            </div>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab} 
            centered
            className={styles.authTabs}
          >
            <TabPane tab="Вход" key="login">
              <Form
                form={form}
                name="login"
                onFinish={handleSubmit}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="identifier"
                  label="Email или телефон"
                  rules={[
                    { required: true, message: 'Введите данные' },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        const isEmail = value.includes('@');
                        const isPhone = /^[0-9+\-\s]+$/.test(value);
                        
                        if (!isEmail && !isPhone) {
                          return Promise.reject('Введите корректный email или телефон');
                        }

                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined className={styles.formItemIcon} />} 
                    placeholder="example@mail.com или +7 (999) 123-45-67" 
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Пароль"
                  rules={[{ required: true, message: 'Введите пароль' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined className={styles.formItemIcon} />}
                    placeholder="••••••••"
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={isPending}
                    block
                    size="large"
                    className={styles.authButton}
                  >
                    Войти
                  </Button>
                </Form.Item>

                <Space direction="vertical" className={styles.authFooter}>
                  <Divider className={styles.divider}>Или</Divider>
                  <Button 
                    type="link" 
                    onClick={switchToRegister}
                    block
                    className={styles.switchButton}
                  >
                    Создать новый аккаунт
                  </Button>
                </Space>
              </Form>
            </TabPane>

            <TabPane tab="Регистрация" key="register">
              <RegisterForm onSuccess={() => setActiveTab('login')} />
            </TabPane>
          </Tabs>
        </div>
        </div>
    </div>
  );
};

export default AuthForm;