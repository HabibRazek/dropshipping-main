import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-transparent">
      <div className="container p-6 mx-auto text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="px-6">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={200}
              height={100}
              className="mx-auto"
            />
            <p className="max-w-sm mt-2 mx-auto text-gray-500 dark:text-gray-400">
              A simple, secure, and reliable platform for managing your
              dropshipping business.
            </p>
          </div>
        </div>

        <hr className="h-px my-6 bg-gray-200 border-none dark:bg-gray-700" />

        <div>
          <p className="text-gray-500 dark:text-gray-400">
            © Brand 2024 - All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
