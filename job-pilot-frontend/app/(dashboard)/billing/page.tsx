export default function BillingPage() {
  return (
    <div className="w-full h-full px-8 py-10 pb-28 overflow-y-auto no-scrollbar">
      <h1 className="text-[26px] font-semibold text-gray-900 mb-2 tracking-tight">Plans &amp; Billing</h1>
      <p className="text-gray-400 text-[14.5px] mb-10">Manage your subscription plan and billing details.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[
          { name: "Free", price: "$0", period: "forever", features: ["3 active job posts", "Basic analytics", "Email support"], current: true },
          { name: "Pro", price: "$29", period: "/ month", features: ["Unlimited job posts", "Advanced analytics", "Priority support", "Featured listings"], current: false },
          { name: "Enterprise", price: "Custom", period: "", features: ["Everything in Pro", "Dedicated account manager", "Custom integrations", "SLA guarantee"], current: false },
        ].map((plan) => (
          <div key={plan.name} className={`rounded-[10px] border p-7 flex flex-col ${plan.current ? "border-[#5B5CE2] bg-[#FAFBFF]" : "border-[#E9EAEF] bg-white"}`}>
            {plan.current && <span className="text-[11px] font-semibold text-[#5B5CE2] uppercase tracking-wider mb-3">Current Plan</span>}
            <h3 className="text-[18px] font-semibold text-gray-900 mb-1">{plan.name}</h3>
            <p className="text-[28px] font-bold text-gray-900 mb-1">{plan.price}<span className="text-[14px] font-normal text-gray-400 ml-1">{plan.period}</span></p>
            <ul className="mt-5 space-y-2.5 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-[13.5px] text-gray-600">
                  <span className="w-4 h-4 rounded-full bg-[#EBEDFF] text-[#5B5CE2] flex items-center justify-center flex-shrink-0 text-[10px]">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button className={`mt-7 w-full py-2.5 rounded-full text-[14px] font-medium transition-colors ${plan.current ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-[#5B5CE2] hover:bg-[#4d4eba] text-white"}`} disabled={plan.current}>
              {plan.current ? "Active" : "Upgrade"}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E9EAEF] rounded-[10px] p-7">
        <h2 className="text-[17px] font-semibold text-gray-900 mb-4">Billing History</h2>
        <p className="text-gray-400 text-[14px]">No billing records yet. Your invoices will appear here once you upgrade to a paid plan.</p>
      </div>
    </div>
  );
}
