export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="dark:bg-[#1e1f22] bg-[#f0f4f3] py-52 rounded-lg">
      <div className="flex flex-col min-w-screen justify-center items-center">
        {children}
      </div>
    </section>
  );
}
