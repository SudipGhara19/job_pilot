export default function ProfilePage() {
  return (
    <div className="w-full h-full px-8 py-10 pb-28 overflow-y-auto no-scrollbar">
      <h1 className="text-[26px] font-semibold text-gray-900 mb-2 tracking-tight">Employers Profile</h1>
      <p className="text-gray-400 text-[14.5px] mb-10">Manage your company information and public profile.</p>

      <div className="bg-white border border-[#E9EAEF] rounded-[10px] p-10 flex flex-col items-center justify-center text-center max-w-lg">
        <div className="w-16 h-16 bg-[#EBEDFF] rounded-full flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-[#5B5CE2]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </div>
        <h3 className="text-[17px] font-semibold text-gray-900 mb-2">Company Profile</h3>
        <p className="text-gray-500 text-[14px] leading-relaxed">
          Your company profile setup is coming soon. You&apos;ll be able to add your logo, company description, industry, website, and social links here.
        </p>
      </div>
    </div>
  );
}
