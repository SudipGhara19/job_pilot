export default function CandidatesPage() {
  return (
    <div className="w-full h-full px-8 py-10 pb-28 overflow-y-auto no-scrollbar">
      <h1 className="text-[26px] font-semibold text-gray-900 mb-2 tracking-tight">Saved Candidates</h1>
      <p className="text-gray-400 text-[14.5px] mb-10">Candidates you&apos;ve bookmarked will appear here.</p>

      <div className="bg-white border border-[#E9EAEF] rounded-[10px] p-10 flex flex-col items-center justify-center text-center max-w-lg">
        <div className="w-16 h-16 bg-[#EBEDFF] rounded-full flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-[#5B5CE2]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 0 0-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 0 1 5.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 0 1 9.288 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </div>
        <h3 className="text-[17px] font-semibold text-gray-900 mb-2">No Saved Candidates Yet</h3>
        <p className="text-gray-500 text-[14px] leading-relaxed">
          When you bookmark candidates from job applications, they&apos;ll show up here for easy comparison and follow-up. This feature is coming soon.
        </p>
      </div>
    </div>
  );
}
