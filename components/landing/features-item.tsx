import React from 'react'


export interface FeaturesProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}

const Features = ({ icon, title, description, href }: FeaturesProps) => {
  return (
    <div className="p-8 shadow-xl rounded-xl bg-white/50 space-y-3 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl">
      <span className="inline-block text-white  bg-gray-900 p-4 rounded-xl ">
        {icon}
      </span>
      <h1 className="text-xl font-semibold text-gray-700 capitalize dark:text-white">
        {title}
      </h1>
      <p className="text-gray-700 dark:text-gray-300">
        {description}
      </p>
      {href && (
        <a href={href} className="text-blue-500 hover:text-blue-700 transition duration-300">Link</a>
      )}
    </div>
  )
}

export default Features



