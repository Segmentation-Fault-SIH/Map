import React, { useState } from 'react';

const Tracking = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex flex-col md:flex-row w-screen h-screen bg-white">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarExpanded
            ? 'w-full md:w-40'
            : 'w-26 md:w-1/6' // Adjust width based on expansion state
        } bg-green-500 transition-width duration-300 ease-in-out w-full`}
      >
        <button
          className={ `w-full p-2 rounded-none text-white transition ease-in-out delay-150 bg-blue-500   hover:bg-indigo-500 duration-100` }
          onClick={toggleSidebar}
        >
          {!isSidebarExpanded?'>>':"<<"}
        </button>
        <div className="p-4 text-white">hi</div>
      </div>

      {/* Content */}
      <div
        className={`${
          isSidebarExpanded ? 'md:ml-40' : 'md:ml-16' // Adjust margin-left based on expansion state
        }w-full flex-1 bg-black transition-margin-left duration-300 ease-in-out`}
      >
        
      </div>
    </div>
  );
};

export default Tracking;
