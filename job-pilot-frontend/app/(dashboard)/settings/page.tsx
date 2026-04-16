'use client';

import { useState } from "react";
import DeleteAccountModal from "@/components/dashboard/DeleteAccountModal";

export default function SettingsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="w-full h-full px-8 py-10 pb-28 overflow-y-auto no-scrollbar">
      <h1 className="text-[26px] font-semibold text-gray-900 mb-2 tracking-tight">Settings</h1>
      <p className="text-gray-400 text-[14.5px] mb-10">Manage your account preferences and security.</p>

      <div className="space-y-5 max-w-2xl">
        {[
          { title: "Account Settings", desc: "Update your name, email address and profile photo.", icon: "👤" },
          { title: "Password & Security", desc: "Change your password and manage two-factor authentication.", icon: "🔒" },
          { title: "Notifications", desc: "Choose which email and in-app notifications you receive.", icon: "🔔" },
          { title: "Privacy", desc: "Control your data and visibility preferences.", icon: "🛡️" },
        ].map((item) => (
          <div key={item.title} className="bg-white border border-[#E9EAEF] rounded-[10px] p-6 flex items-center justify-between group hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gray-50 rounded-[10px] flex items-center justify-center text-xl border border-[#E9EAEF]">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-[15px] text-gray-900">{item.title}</p>
                <p className="text-[13px] text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-[#5B5CE2] transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        ))}
      </div>

      <div className="mt-8 max-w-2xl bg-red-50 border border-red-100 rounded-[10px] p-6 flex items-center justify-between">
        <div>
          <p className="font-semibold text-[15px] text-red-600">Delete Account</p>
          <p className="text-[13px] text-red-400 mt-0.5">Permanently delete your account and all associated data.</p>
        </div>
        <button 
          onClick={() => setShowDeleteModal(true)}
          className="px-5 py-2 text-[13.5px] text-red-500 border border-red-200 rounded-full hover:bg-red-100 transition-colors font-medium"
        >
          Delete
        </button>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}
    </div>
  );
}
