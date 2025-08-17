import React from "react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import "./BentoGridDemo.css";

export function BentoGridDemo() {
  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}

// Skeleton Components for ResuMate Features
const SkeletonOne = () => {
  return (
    <div className="skeleton-container flex-col space-y-2">
      <div className="animated-item">
        <div className="resume-line">
          <div className="profile-circle bg-gradient-to-r from-pink-500 to-violet-500"></div>
          <div className="content-bar bg-gray-100"></div>
        </div>
      </div>
      <div className="animated-item delay-1">
        <div className="resume-line ml-auto w-3/4">
          <div className="content-bar bg-gray-100"></div>
          <div className="profile-circle bg-gradient-to-r from-pink-500 to-violet-500"></div>
        </div>
      </div>
      <div className="animated-item delay-2">
        <div className="resume-line">
          <div className="profile-circle bg-gradient-to-r from-pink-500 to-violet-500"></div>
          <div className="content-bar bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
};

const SkeletonTwo = () => {
  const arr = new Array(6).fill(0);
  return (
    <div className="skeleton-container flex-col space-y-2">
      {arr.map((_, i) => (
        <div
          key={"skeleton-two-" + i}
          className="progress-bar"
          style={{
            maxWidth: Math.random() * (100 - 40) + 40 + "%",
            animationDelay: `${i * 0.1}s`
          }}
        ></div>
      ))}
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div className="skeleton-container">
      <div className="gradient-animation"></div>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div className="skeleton-container flex-row space-x-2">
      <div className="template-card">
        <div className="template-header">
          <div className="template-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="template-content">
          <div className="template-line"></div>
          <div className="template-line short"></div>
          <div className="template-line"></div>
        </div>
        <div className="template-badge modern">Modern</div>
      </div>
      <div className="template-card active">
        <div className="template-header">
          <div className="template-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="template-content">
          <div className="template-line"></div>
          <div className="template-line short"></div>
          <div className="template-line"></div>
        </div>
        <div className="template-badge classic">Classic</div>
      </div>
      <div className="template-card">
        <div className="template-header">
          <div className="template-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="template-content">
          <div className="template-line"></div>
          <div className="template-line short"></div>
          <div className="template-line"></div>
        </div>
        <div className="template-badge minimal">Minimal</div>
      </div>
    </div>
  );
};

const SkeletonFive = () => {
  return (
    <div className="skeleton-container flex-col space-y-2">
      <div className="export-item">
        <div className="export-icon pdf">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="export-text">
          <p className="text-xs text-neutral-500">
            Export your resume as a professional PDF document ready for submission.
          </p>
        </div>
      </div>
      <div className="export-item docx">
        <div className="export-text">
          <p className="text-xs text-neutral-500">Download as DOCX for editing.</p>
        </div>
        <div className="export-icon docx">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Feature items for ResuMate
const items = [
  {
    title: "Real-time Preview",
    description: (
      <span className="text-sm">
        See your resume update instantly as you type and edit your information.
      </span>
    ),
    header: <SkeletonOne />,
    className: "md:col-span-1",
    icon: (
      <svg className="h-4 w-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: "ATS Optimization",
    description: (
      <span className="text-sm">
        All templates are designed to pass Applicant Tracking Systems with ease.
      </span>
    ),
    header: <SkeletonTwo />,
    className: "md:col-span-1",
    icon: (
      <svg className="h-4 w-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Smart Auto-Save",
    description: (
      <span className="text-sm">
        Never lose your work with intelligent auto-save and local storage.
      </span>
    ),
    header: <SkeletonThree />,
    className: "md:col-span-1",
    icon: (
      <svg className="h-4 w-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    title: "Professional Templates",
    description: (
      <span className="text-sm">
        Choose from multiple professionally designed templates for every industry.
      </span>
    ),
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: (
      <svg className="h-4 w-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    title: "Multiple Export Formats",
    description: (
      <span className="text-sm">
        Download your resume as PDF or DOCX format, ready for any application.
      </span>
    ),
    header: <SkeletonFive />,
    className: "md:col-span-1",
    icon: (
      <svg className="h-4 w-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];
