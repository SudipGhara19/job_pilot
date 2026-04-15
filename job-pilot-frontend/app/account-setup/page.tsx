'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { setCurrentUser } from "@/lib/features/user/userSlice";
import axios from "axios";
import Image from "next/image";
import logo from "@/public/images/auth/logo.png";
import cloudUpload from "@/public/images/account-setup/cloud-upload.png";
import { ChevronDown, X } from "lucide-react";
import { COUNTRY_CODES } from "@/lib/countries";
import AccountSetupComplete from "@/components/AccountSetupComplete";

export default function AccountSetupPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const [countryIso, setCountryIso] = useState("us");
  const [phoneInput, setPhoneInput] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    organizationType: "",
    industryType: "",
    teamSize: "",
    yearOfEstablishment: "",
    aboutUs: "",
    location: "",
    contactNumber: "",
    email: "",
  });

  // Protect route
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  // Combine phone parts
  useEffect(() => {
    const selectedCountry = COUNTRY_CODES.find(c => c.iso === countryIso) || COUNTRY_CODES.find(c => c.iso === "us");
    const code = selectedCountry?.code || "+1";
    setFormData(prev => ({
      ...prev,
      contactNumber: phoneInput ? `${code} ${phoneInput}` : ""
    }));
  }, [countryIso, phoneInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      e.target.value = ''; // Reset input to allow re-upload if cancelled
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setError(null);

    try {
      setLoading(true);

      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });
      if (logoFile) {
        submitData.append("logo", logoFile);
      }

      const res = await axios.patch(
        "http://localhost:5505/api/user/update-company",
        submitData,
        {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      // Update local Redux store user object preserving the rest
      dispatch(
        setCurrentUser({
          ...currentUser,
          company: res.data.company,
        })
      );

      setIsComplete(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to update profile");
      } else {
        setError("Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null; // Prevent flicker

  const selectedCountry = COUNTRY_CODES.find(c => c.iso === countryIso) || COUNTRY_CODES.find(c => c.iso === "us") || COUNTRY_CODES[0];

  return (
    <div className="min-h-screen bg-white font-sans py-14 px-6 sm:px-12 lg:px-24 flex justify-center">
      <div className="w-full max-w-4xl">
        
        {/* Header Elements */}
        <div className="flex items-center mb-10">
          <div className="flex items-center gap-2.5">
            <Image src={logo} alt="JobPilot Logo" width={40} height={40} className="w-auto h-8" />
            <span className="text-2xl font-semibold tracking-tight text-gray-900">JobPilot</span>
          </div>
        </div>

        {isComplete ? (
          <div className="mt-16 sm:mt-24">
            <AccountSetupComplete />
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-medium text-gray-900 mb-10">Account Setup</h1>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-[10px] text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Logo Upload Section */}
          <div>
            <h2 className="text-[17px] font-medium text-gray-900 mb-4">Logo Upload</h2>
            {!logoPreview ? (
              <label className="border-2 border-dashed border-gray-200 rounded-[10px] px-6 py-10 w-full sm:w-[320px] flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                <Image src={cloudUpload} alt="Upload Logo" width={48} height={48} className="mb-4" />
                <p className="text-[14px] text-gray-900 font-medium mb-2">
                  Browse photo <span className="text-gray-400 font-normal">or drop here</span>
                </p>
                <p className="text-[12px] text-gray-400">A photo larger than 400 pixels work best.<br/>Max file size 5 MB.</p>
              </label>
            ) : (
              <div className="relative w-full sm:w-[320px] h-[180px] border border-gray-200 rounded-[10px] overflow-hidden flex items-center justify-center bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoPreview} alt="Logo Preview" className={`max-w-full max-h-full object-contain transition-opacity ${loading ? 'opacity-40' : 'opacity-100'}`} />
                {!loading && (
                  <button 
                    type="button" 
                    onClick={handleRemoveLogo} 
                    className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors border border-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {loading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px]">
                    <div className="w-8 h-8 border-3 border-[#5B5CE2]/30 border-t-[#5B5CE2] rounded-full animate-spin mb-2" style={{ borderWidth: '3px' }}></div>
                    <span className="text-[13px] font-medium text-gray-800 drop-shadow-sm">Uploading...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Company Info Section */}
          <div>
            <h2 className="text-[17px] font-medium text-gray-900 mb-6">Company Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div>
                <label className="block text-[14px] text-gray-500 mb-2 font-normal">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-[10px] border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-[14px] text-gray-500 mb-2 font-normal">Organization Type</label>
                <div className="relative">
                  <select
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-[10px] border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="" disabled></option>
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                    <option value="Non-profit">Non-profit</option>
                  </select>
                  <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-gray-500 mb-2 font-normal">Industry Type</label>
                <div className="relative">
                  <select
                    name="industryType"
                    value={formData.industryType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-[10px] border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="" disabled></option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                  </select>
                  <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-gray-500 mb-2 font-normal">Team Size</label>
                <div className="relative">
                  <select
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-[10px] border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 appearance-none cursor-pointer"
                  >
                    <option value="" disabled></option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="500+">500+</option>
                  </select>
                  <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[14px] text-gray-500 mb-2 font-normal">Year of Establishment</label>
                <input
                  type="text"
                  name="yearOfEstablishment"
                  value={formData.yearOfEstablishment}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-[10px] border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                />
              </div>

            </div>

            <div className="mt-6">
              <label className="block text-[14px] text-gray-500 mb-2 font-normal">About Us</label>
              <textarea
                name="aboutUs"
                value={formData.aboutUs}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-[10px] border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Contact Info Section */}
          <div>
            <h2 className="text-[17px] font-medium text-gray-900 mb-6">Contact Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div>
                <label className="block text-[14px] text-gray-500 mb-2 font-normal">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-[10px] border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-[14px] text-gray-500 mb-2 font-normal">Contact Number</label>
                <div className="w-full rounded-[10px] border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white overflow-hidden flex items-center h-[50px]">
                  
                  {/* Custom Country Code Dropdown */}
                  <div className="relative flex items-center justify-center border-r border-gray-300 cursor-pointer h-full bg-white hover:bg-gray-50 transition-colors">
                    <select
                      value={countryIso}
                      onChange={(e) => setCountryIso(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 text-black bg-white"
                    >
                      {COUNTRY_CODES.map((country, idx) => (
                        <option key={`${country.iso}-${idx}`} value={country.iso} className="text-black bg-white">
                          {country.name} ({country.code})
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1.5 px-2.5 pointer-events-none">
                      {/* Using standard HTML img with external CDN for flawless cross-platform SVG display */}
                      <img 
                        src={`https://flagcdn.com/${selectedCountry.iso}.svg`} 
                        alt={selectedCountry.name} 
                        className="w-[20px] h-[14px] object-cover rounded-[2px] shadow-sm" 
                      />
                      {/* Solid down triangle icon exactly matching the mockup */}
                      <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-700">
                        <path d="M5 6L0 0H10L5 6Z" fill="currentColor"/>
                      </svg>
                    </div>
                  </div>

                  {/* Input segment displaying the selected country code directly matching mockup text placement */}
                  <div className="flex items-center flex-1 h-full px-4">
                    <span className="text-gray-900 font-normal whitespace-nowrap text-[15px]">{selectedCountry.code}</span>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="flex-1 w-full h-full pl-2 outline-none bg-transparent text-gray-900 text-[15px]"
                    />
                  </div>

                </div>
              </div>

              <div>
                <label className="block text-[14px] text-gray-500 mb-2 font-normal">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-[10px] border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                />
              </div>

            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#5B5CE2] hover:bg-[#4d4eba] disabled:bg-[#a6a8eb] disabled:cursor-not-allowed text-white font-medium rounded-full transition-colors text-[15px]"
            >
              {loading ? "Saving..." : "Finish Setup"}
            </button>
          </div>

        </form>
          </>
        )}
      </div>
    </div>
  );
}