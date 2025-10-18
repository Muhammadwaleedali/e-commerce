import React, { useState } from "react";
import { Form, Input, Select, InputNumber, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { productAPI } from "../api/endpoints";

const { TextArea } = Input;
const { Option } = Select;

const CATEGORIES = [
  { id: 1, name: "Books" },
  { id: 2, name: "Electronics" },
  { id: 3, name: "Fashion" },
  { id: 4, name: "Home & Garden" },
  { id: 5, name: "Sports" },
];

const AddProductModal = ({ onClose, onProductAdded }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState("");

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async (info) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      setImageFile(file);
      try {
        const base64 = await convertToBase64(file);
        setImageBase64(base64);
      } catch (error) {
        message.error('Failed to process image');
      }
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const selectedCategory = CATEGORIES.find(cat => cat.id === values.categoryId);
      
      const productPayload = {
        id: 0,
        name: values.name,
        price: values.price,
        description: values.description || "",
        stock: values.stock || 100,
        categoryId: values.categoryId,
        categoryName: selectedCategory?.name || "",
        image: imageFile ? imageFile.name : "",
        imageUrl: imageBase64
      };

      const response = await productAPI.create(productPayload);
      
      message.success('Product added successfully!');
      form.resetFields();
      setImageFile(null);
      setImageBase64("");
      
      if (onProductAdded) {
        onProductAdded(response.data);
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: 'Please enter product name!' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="Category"
          rules={[{ required: true, message: 'Please select a category!' }]}
        >
          <Select placeholder="Select category">
            {CATEGORIES.map(category => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="Price ($)"
          rules={[{ required: true, message: 'Please enter price!' }]}
        >
          <InputNumber
            placeholder="Enter price"
            className="w-full"
            min={0}
            step={0.01}
          />
        </Form.Item>

        <Form.Item
          name="stock"
          label="Stock Quantity"
          initialValue={100}
        >
          <InputNumber
            placeholder="Enter stock quantity"
            className="w-full"
            min={0}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <TextArea 
            placeholder="Enter product description"
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="image"
          label="Product Image"
          rules={[{ required: true, message: 'Please upload an image!' }]}
        >
          <Upload
            beforeUpload={() => false}
            onChange={handleImageUpload}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>
              Upload Image
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item className="mb-0">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProductModal;