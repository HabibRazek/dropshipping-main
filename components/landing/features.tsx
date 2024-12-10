import React from 'react';
import { FeaturesList } from './features-list';
export const Features = () => {
  return (
    <section className="bg-transparent mt-[-15px]">
      <div className="container px-6 py-10 mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
          explore our <br /> awesome <span className="underline decoration-[#63e796]">Feauters</span>
        </h1>

        <p className="mt-4 text-gray-700 xl:mt-6 dark:text-gray-300 mb-3">
          Streamline your back office operations and increase productivity with our features.
        </p>
        <FeaturesList />
      </div>
    </section>
  );
};
