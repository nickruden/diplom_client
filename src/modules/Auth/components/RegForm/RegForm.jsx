import React, { useState } from 'react';
import { Form, Input, Button, message, Radio } from 'antd';
import { MailOutlined, PhoneOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { useRegisterUser } from '../../API/hooks.api';

const RegisterForm = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [registerType, setRegisterType] = useState('email');

  const { mutate: registerData, isPending } = useRegisterUser()

  const handleSubmit = (values) => {
    console.log(values)
    registerData(values);
  };

  return (
    <Form
      form={form}
      name="register"
      onFinish={handleSubmit}
      layout="vertical"
    >
      <Form.Item>
        <Radio.Group 
          value={registerType} 
          onChange={(e) => setRegisterType(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="email">Email</Radio.Button>
          <Radio.Button value="phone">Телефон</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="email"
        label={registerType === 'email' ? 'Email' : 'Телефон'}
        rules={[
          { required: true, message: `Пожалуйста, введите ${registerType === 'email' ? 'email' : 'телефон'}` },
          registerType === 'email'
            ? { type: 'email', message: 'Введите корректный email' }
            : { pattern: /^[0-9+\-\s]+$/, message: 'Введите корректный телефон' }
        ]}
      >
        <Input 
          prefix={registerType === 'email' ? <MailOutlined /> : <PhoneOutlined />} 
          placeholder={registerType === 'email' ? 'Email' : 'Телефон'} 
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Пароль"
        rules={[
          { required: true, message: 'Пожалуйста, введите пароль' },
          { min: 6, message: 'Пароль должен быть не менее 6 символов' }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Пароль"
        />
      </Form.Item>

      <Form.Item
        name="firstName"
        label="Имя"
        rules={[{ required: true, message: 'Пожалуйста, введите ваше имя' }]}
      >
        <Input 
          prefix={<UserOutlined />} 
          placeholder="Имя" 
        />
      </Form.Item>

      <Form.Item
        name="lastName"
        label="Фамилия"
        rules={[{ required: true, message: 'Пожалуйста, введите вашу фамилию' }]}
      >
        <Input 
          prefix={<UserOutlined />} 
          placeholder="Фамилия" 
        />
      </Form.Item>
      <Form.Item
        name="organizerName"
        label="Название организатора"
        rules={[{ required: true, message: 'Пожалуйста, введите имя организатора' }]}
      >
        <Input 
          prefix={<UserOutlined />} 
          placeholder="Название организатора" 
        />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={isPending}
          block
        >
          Зарегистрироваться
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;