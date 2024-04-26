import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { validatePassword } from './utils/form.validations';

const PasswordInputToggle = ({ control, inputName, errors, clearErrors }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Controller
            name={inputName}
            control={control}
            rules={{ required: `${inputName === 'confirmation' ? 'password confirmation required' : 'password is required'}`, validate: value => validatePassword }}
            render={({ field }) => (
              <input
                {...field}
                name={inputName}
                type={isVisible ? 'text' : 'password'}
                placeholder={inputName === 'confirmation' ? 'Confirm password' : 'Password'}
                onFocus={() => clearErrors(['password', 'confirmation', 'credentials'])}
                style={{ paddingRight: '3rem' }} // Make space for the icon
              />
            )}
          />
          <div
            onClick={() => setIsVisible(!isVisible)}
            type="button"
            style={{
              paddingTop: '1rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
          {/* Use an icon here. For demonstration, I'll use text */}
          {isVisible ? <FaRegEyeSlash className='siteIcons' /> : <FaRegEye className='siteIcons' />}
        </div>
      </div>
      {errors[inputName] ? <div className='errormessage'>{errors[inputName]?.message}</div> : null}
    </div>
  );
};

export default PasswordInputToggle;
