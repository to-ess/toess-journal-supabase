import React from "react";
import UsefulSidebar from "../components/UsefulSidebar";

export default function SidebarLayout({ children, title, subtitle, icon: Icon, sidebarExtra }) {
  return (
    <>
      {title && (
        <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center max-w-4xl mx-auto">
              {Icon && (
                <div className="flex justify-center mb-4">
                  <Icon className="w-12 h-12" />
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
              {subtitle && (
                <p className="text-lg text-blue-100 leading-relaxed">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start gap-8">

            <div className="flex-1 min-w-0">
              {children}
            </div>

            <div className="md:w-72 flex-shrink-0 self-start sticky top-24">
              <UsefulSidebar />
              {sidebarExtra}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}