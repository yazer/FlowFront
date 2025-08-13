export interface PageHeaderProps {
  header: string | React.ReactNode;
  append?: React.ReactNode;
}

export function PageHeader({ header, append }: PageHeaderProps) {
  return (
    <div className="items-end mb-6 flex flex-wrap justify-end bg-gray-300 px-4 py-2 rounded-md">
      <div className="flex-grow">
        <h2 className="font-medium text-sm sm:text-2xl">{header}</h2>
      </div>

      {append && <div className="mt-5 md:mt-0">{append}</div>}
    </div>
  );
}

export default PageHeader;
