import React from "react";
import UsefulSidebar from "../components/UsefulSidebar";

export default function SidebarLayout({ children, title, subtitle, icon: Icon }) {
  return (
    <>
      {/* Hero Section */}
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
                <p className="text-lg text-blue-100 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content + Sidebar */}
      {/* pt-16 prevents navbar overlap (assuming navbar is h-16 / 64px) */}
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-8">

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {children}
            </div>

            {/* Sidebar */}
            <div className="md:w-72 flex-shrink-0">
              {/* top-20 = navbar height (64px) + spacing */}
              <div className="sticky top-20">
                <UsefulSidebar />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}