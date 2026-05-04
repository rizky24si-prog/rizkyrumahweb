import React from 'react';

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {children && (
          <div className="mt-4 sm:mt-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;