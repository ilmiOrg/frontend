import React from 'react';
import './ScrollContainer.css';

const ScrollContainer = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = true,
  maxHeight,
  smooth = true,
  ...props 
}) => {
  const containerClass = `scroll-container scroll-container--${variant} ${padding ? 'scroll-container--padded' : ''} ${className}`.trim();
  
  const containerStyle = {
    ...(maxHeight && { maxHeight }),
    ...props.style
  };

  return (
    <div 
      className={containerClass}
      style={containerStyle}
      {...props}
    >
      <div className="scroll-container__content">
        {children}
      </div>
    </div>
  );
};

export default ScrollContainer;
