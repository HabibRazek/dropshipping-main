
const AuthLayout = ({


  children
}: {
  children: React.ReactNode
}) => {
  return (
    <>
      <div className="h-full flex sm:items-center justify-center ">
        <div className="bg-[#bdffad] absolute top-[-6rem] -z-10 right-[5rem] h-[15rem] w-[31.25rem] rounded-full blur-[8rem] sm:w-[68.75rem] dark:bg-[#bdfcae]"></div>
        <div className="bg-[#b9cfff] absolute top-[-1rem] -z-10 left-[-35rem] h-[15.25rem] w-[50rem] rounded-full blur-[7rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#c2c8ff]"></div>
        {children}
      </div>
    </>
  );
}

export default AuthLayout;
