export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="inline-block justify-center">
        {children}
      </div>
    </section>
  );
}
