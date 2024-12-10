import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <>
      <div className="bg-[#bdffad] absolute top-[-6rem] -z-10 right-[5rem] h-[15rem] w-[31.25rem] rounded-full blur-[8rem] sm:w-[68.75rem] dark:bg-[#bdfcae]"></div>
      <div className="bg-[#b9cfff] absolute top-[-1rem] -z-10 left-[-35rem] h-[15.25rem] w-[50rem] rounded-full blur-[7rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#c2c8ff]"></div>
      <div className="bg-gradient-to-r from-white via-transparent  to-transparent flex h-screen">

        <main className="flex-1 overflow-x-hidden overflow-y-auto ">
          <DefaultLayout>
            {children}
          </DefaultLayout>
        </main>
      </div>
    </>
  );
};

export default ProtectedLayout;
