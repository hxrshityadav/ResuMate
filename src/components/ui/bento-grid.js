import React from 'react';
import './bento-grid.css';

export const BentoGrid = ({ className = '', children, ...props }) => {
  return (
    <div
      className={`bento-grid ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className = '',
  title,
  description,
  header,
  icon,
  ...props
}) => {
  return (
    <div
      className={`bento-grid-item ${className}`}
      {...props}
    >
      {header}
      <div className="bento-content">
        {icon && <div className="bento-icon">{icon}</div>}
        <div className="bento-text">
          <div className="bento-title">{title}</div>
          <div className="bento-description">{description}</div>
        </div>
      </div>
    </div>
  );
};
