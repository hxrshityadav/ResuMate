import React from 'react';
import './DemoContent.css';

const DemoContent = () => {
  return (
    <div className="demo-content">
      <h1 className="demo-title">
        Modern Resizable Navbar Demo
      </h1>
      <p className="demo-subtitle">
        This navbar is <span className="highlight">fixed</span> and responsive. 
        Try resizing your browser to see the mobile menu in action.
      </p>
      
      <div className="demo-grid">
        {[
          {
            id: 1,
            title: "Professional",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-gradient-1",
          },
          {
            id: 2,
            title: "Resume",
            width: "md:col-span-2",
            height: "h-60",
            bg: "bg-gradient-2",
          },
          {
            id: 3,
            title: "Builder",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-gradient-3",
          },
          {
            id: 4,
            title: "ATS",
            width: "md:col-span-3",
            height: "h-60",
            bg: "bg-gradient-4",
          },
          {
            id: 5,
            title: "Friendly",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-gradient-5",
          },
          {
            id: 6,
            title: "Templates",
            width: "md:col-span-2",
            height: "h-60",
            bg: "bg-gradient-6",
          },
          {
            id: 7,
            title: "Export",
            width: "md:col-span-2",
            height: "h-60",
            bg: "bg-gradient-7",
          },
          {
            id: 8,
            title: "PDF & DOCX",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-gradient-8",
          },
          {
            id: 9,
            title: "Real-time Preview",
            width: "md:col-span-2",
            height: "h-60",
            bg: "bg-gradient-9",
          },
          {
            id: 10,
            title: "ResuMate",
            width: "md:col-span-1",
            height: "h-60",
            bg: "bg-gradient-10",
          },
        ].map((box) => (
          <div
            key={box.id}
            className={`demo-box ${box.width} ${box.height} ${box.bg}`}
          >
            <h2 className="box-title">{box.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoContent;
