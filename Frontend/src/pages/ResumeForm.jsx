import React, { useState } from "react";

const ResumeForm = ({ initialData }) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (path, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let obj = updated;
      keys.slice(0, -1).forEach((key) => {
        if (!obj[key]) obj[key] = {};
        obj = obj[key];
      });
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleArrayChange = (path, index, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let arr = updated;
      keys.forEach((key) => (arr = arr[key]));
      arr[index] = value;
      return updated;
    });
  };

  const addArrayItem = (path, emptyValue) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let arr = updated;
      keys.forEach((key) => (arr = arr[key]));
      arr.push(emptyValue);
      return updated;
    });
  };

  const removeArrayItem = (path, index) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let arr = updated;
      keys.forEach((key) => (arr = arr[key]));
      arr.splice(index, 1);
      return updated;
    });
  };

 
};

export default ResumeForm;
