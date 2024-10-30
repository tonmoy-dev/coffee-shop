import React, { ReactNode } from "react";

interface StatsDataCardProps {
  title: string;
  total: number;
  children: ReactNode;
}

const StatsDataCard: React.FC<StatsDataCardProps> = ({
  title,
  total,
  children,
}) => {
  return (
    <div className="rounded-md border px-6 py-6 shadow-sm">
      {/* Card contents */}
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-meta-2 dark:bg-meta-4 mx-auto md:mx-0">
        {/* Svg icon */}
        {children}
      </div>
      {/* Main content */}
      <div className="mt-4 text-center md:text-left">
        {/* total numbers */}
        <h4 className="text-title-md font-bold text-black dark:text-white">
          {Math.round(total)}
        </h4>
        {/* stats title */}
        <span className="text-sm font-medium">{title}</span>
      </div>
    </div>
  );
};

export default StatsDataCard;
