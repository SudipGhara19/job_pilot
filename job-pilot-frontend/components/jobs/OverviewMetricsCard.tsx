import Image from "next/image";
import mortarboard from "@/public/images/job-overview/mortarboard-01.png";
import briefcaseImg from "@/public/images/job-overview/briefcase-01.png";
import layers from "@/public/images/job-overview/layers-01.png";
import clock from "@/public/images/job-overview/stop-watch.png";
import calendar from "@/public/images/job-overview/calendar-03.png";
import { StaticImageData } from "next/image";

interface Props {
  postedDate: string;
  expirationDate: string;
  jobLevel: string;
  experience: string;
  education: string;
}

interface Metric {
  label: string;
  value: string;
  img: StaticImageData;
}

export default function OverviewMetricsCard({ postedDate, expirationDate, jobLevel, experience, education }: Props) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  const metrics: Metric[] = [
    { label: "Job Posted",    value: formatDate(postedDate),    img: calendar },
    { label: "Job Expires on", value: formatDate(expirationDate), img: clock },
    { label: "Job Level",     value: jobLevel,                  img: layers },
    { label: "Experience",    value: experience,                img: briefcaseImg },
    { label: "Education",     value: education,                 img: mortarboard },
  ];

  return (
    <div className="border border-[#E9EAEF] rounded-[10px] bg-white p-7">
      <h3 className="text-[17px] font-semibold text-gray-900 mb-7">Job Overview</h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="mb-3">
              <Image src={m.img} alt={m.label} width={24} height={24} />
            </div>
            <span className="text-[13px] text-gray-400 mb-1">{m.label}</span>
            <span className="text-[14.5px] font-medium text-gray-900">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
