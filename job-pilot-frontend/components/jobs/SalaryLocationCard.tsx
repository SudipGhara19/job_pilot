import Image from "next/image";
import map from "@/public/images/job-overview/maps.png";

interface Props {
  minSalary: number;
  maxSalary: number;
  salaryType: string;
  city: string;
  country: string;
}

export default function SalaryLocationCard({ minSalary, maxSalary, salaryType, city, country }: Props) {
  const formatS = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="border border-[#E9EAEF] rounded-[10px] bg-white p-7 mb-6 grid grid-cols-2">
      <div className="flex flex-col items-center justify-center border-r border-[#E9EAEF]">
        <span className="text-[14px] text-gray-500 font-medium mb-2">Salary (USD)</span>
        <span className="text-[18px] font-semibold text-[#2ECA7F] mb-1.5">{formatS(minSalary)} - {formatS(maxSalary)}</span>
        <span className="text-[13px] text-gray-400">{salaryType} salary</span>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="text-[#5B5CE2] mb-2">
          <Image src={map} alt="Job Location" width={24} height={24} />
        </div>
        <span className="text-[13px] text-gray-400 mb-1.5">Job Location</span>
        <span className="text-[14.5px] font-semibold text-gray-900">{city}, {country}</span>
      </div>
    </div>
  );
}
