import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { validatePassword } from './utils/form.validations';

const PasswordInputToggle = ({ control, inputName, errors, clearErrors }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <Controller
        name={inputName}
        control={control}
        rules={{ validate: value => validatePassword(value, true)}}
        render={({ field }) => (
          <input
            {...field}
            type={isVisible ? 'text' : 'password'}
            placeholder="Password"
            onFocus={() => clearErrors(inputName)}
            style={{ paddingRight: '30px' }} // Make space for the icon
          />
        )}
      />
      <button
        onClick={() => setIsVisible(!isVisible)}
        type="button"
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
      >
        {/* Use an icon here. For demonstration, I'll use text */}
        {isVisible ? 'Hide' : 'Show'}
      </button>
      {errors.password ? <div className='errormessage'>{errors.password?.message}</div> : null}
    </div>
  );
};

export default PasswordInputToggle;
