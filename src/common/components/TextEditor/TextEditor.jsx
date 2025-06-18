import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './TextEditor.scss'

const TextEditor = ({ value, onChange, theme, placeholder='Введите текст', ...props }) => {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      theme={theme}
      placeholder={placeholder}
      className="textEditorComponent"
      {...props}
    />
  );
};

export default TextEditor;
