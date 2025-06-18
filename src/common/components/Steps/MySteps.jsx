import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './MySteps.scss';

const MySteps = ({ steps }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Получаем индекс текущего шага по URL
  const currentStep = steps.findIndex((step) =>
    location.pathname.includes(step.path.split('/').pop())
  );

  return (
    <div className="my-steps-custom">
      {steps.map((step, index) => (
        <div
          key={step.title}
          className={`my-steps-custom__step ${index === currentStep ? 'active' : ''}`}
          onClick={() => step?.path && navigate(step.path)}
        >
          {step.title}
        </div>
      ))}
    </div>
  );
};

export default MySteps;
