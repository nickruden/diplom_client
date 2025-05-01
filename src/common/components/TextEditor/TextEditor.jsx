import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import './TextEditor.scss'

const TextEditor = ({ value, onChange, theme, ...props }) => {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      theme={theme}
      placeholder='Введите текст'
      className="textEditorComponent"
      {...props}
    />
  );
};

export default TextEditor;
