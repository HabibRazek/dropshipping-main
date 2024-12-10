import React from 'react'
import FeaturesItem, { FeaturesProps } from './features-item'

import { PiPackageFill } from "react-icons/pi";
import { AiOutlineSafety } from "react-icons/ai";
import { MdSupportAgent } from "react-icons/md";





const items : FeaturesProps[] = [
  {
    icon: <PiPackageFill className="w-8 h-8" />,
    title: 'Efficient Inventory Management',
    description: 'Keep track of your stock levels in real-time with our advanced inventory management system, reducing the risk of overselling and stockouts.',
    // href: '/1' // optional
  },
  {
    icon:<MdSupportAgent className="w-8 h-8" />
    ,
    title: 'Comprehensive Support',
    description: 'Benefit from our dedicated customer support team, available to assist you with any queries and ensure your dropshipping business runs smoothly.',

  },
  {
    icon: <AiOutlineSafety className="w-8 h-8" />
    ,
    title: 'Security ',
    description: 'Protect your business and customer data with our state-of-the-art security protocols, ensuring a safe and trustworthy shopping experience for everyone.',
  },


]

export const FeaturesList = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <FeaturesItem key={index} {...item} />
      ))}
    </div>
  )
}


