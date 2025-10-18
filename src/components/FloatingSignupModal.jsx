import React, { useState } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

const FloatingSignupModal = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { register } = useAuth();

  const handleFloatingModalClick = () => {
    setIsCredentialsModalOpen(true);
  };

  const handleCredentialsSubmit = async (values) => {
    try {
      await register(values.name, values.email, values.password);
      message.success('Account created successfully!');
      setIsCredentialsModalOpen(false);
      setIsVisible(false);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create account. Please try again.');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Signup Modal */}
      <div className="fixed bottom-6 right-6 z-50">
        <div 
          onClick={handleFloatingModalClick}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transform hover:scale-105 transition-all duration-300 max-w-xs"
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="absolute top-2 right-2 text-white hover:text-gray-200 text-lg font-bold"
          >
            ×
          </button>
          <div className="flex items-center space-x-3">
            <UserOutlined className="text-2xl" />
            <div>
              <h3 className="font-bold text-lg">Join Us!</h3>
              <p className="text-sm opacity-90">Click to sign up</p>
            </div>
          </div>
        </div>
      </div>

      {/* Credentials Modal */}
      <Modal
        title="Create Your Account"
        open={isCredentialsModalOpen}
        onCancel={() => setIsCredentialsModalOpen(false)}
        footer={null}
        centered
        width={400}
      >
        <Form
          form={form}
          onFinish={handleCredentialsSubmit}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name!' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Enter your full name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Enter your email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Confirm your password"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FloatingSignupModal;