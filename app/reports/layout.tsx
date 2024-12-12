export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          {/*<div className="inline-block max-w-lg text-center justify-center border-1 border-red-500">*/}
          <div className="inline-block justify-center">
              {children}
          </div>
      </section>
  );
}
