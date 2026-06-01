import { useState } from 'react';
import { CheckCircle, AlertCircle, Droplets } from 'lucide-react';
import type { ScreeningApplication } from '../types';

interface FormData {
  // Personal Information
  firstName: string;
  middleInitial: string;
  lastName: string;
  address: string;
  prenatalCheckup: string;
  phone: string;
  occupation: string;
  nationality: string;
  dateOfBirth: string;
  age: string;
  civilStatus: string;

  // Classification
  donorSource: string;
  donorSourceOther: string;

  // Travel History
  traveledAbroad: string;
  travelCountry: string;
  travelReason: string;
  travelReasonOther: string;

  // Reason & Info Source
  donationReason: string;
  infoSource: string;
  infoSourceOther: string;
  spouseConsent: string;

  // Health History
  lastDeliveryDate: string;
  childNumber: string;
  normalDelivery: string;
  previouslyDonated: string;
  previousDonationWhen: string;
  previousDonationWhere: string;
  donationDeferred: string;
  deferralReason: string;

  // Medical History
  tuberculosis: string;
  hepatitisB: string;
  mastitis: string;
  syphilis: string;
  herpes: string;
  std: string;
  bloodTransfusion: string;
  organTransplant: string;
  alcoholConsumption: string;
  smoker: string;
  illegalDrugs: string;
  tattoo: string;
  vegetarianDiet: string;
  multivitamins: string;
  herbalDrugs: string;
  contraceptivePills: string;
  breastSurgery: string;
  breastImplants: string;
  multiplePartners: string;

  // Partner History
  partnerBisexual: string;
  partnerPromiscuous: string;
  partnerSTD: string;
  partnerBloodTransfusions: string;
  partnerIVDrug: string;
  needlePrick: string;

  // Child Health
  childAge: string;
  childAgeMonths: string;
  childFullTerm: string;
  exclusiveBreastfeeding: string;
  childJaundice: string;
  jaundiceLength: string;
  childReceivedOtherMilk: string;
  otherMilkSource: string;

  // Consent
  consentAgreed: boolean;
  signature: string;
}

interface DonorRegistrationFormProps {
  onBackToHome?: () => void;
  onSubmitApplication?: (app: ScreeningApplication) => void;
}

export function DonorRegistrationForm({ onBackToHome, onSubmitApplication }: DonorRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [tempRefId, setTempRefId] = useState('');
  const [form, setForm] = useState<FormData>({
    firstName: '', middleInitial: '', lastName: '', address: '', prenatalCheckup: '', phone: '', occupation: '', nationality: '', dateOfBirth: '', age: '', civilStatus: '',
    donorSource: '', donorSourceOther: '', traveledAbroad: '', travelCountry: '', travelReason: '', travelReasonOther: '', donationReason: '', infoSource: '', infoSourceOther: '', spouseConsent: '',
    lastDeliveryDate: '', childNumber: '', normalDelivery: '', previouslyDonated: '', previousDonationWhen: '', previousDonationWhere: '', donationDeferred: '', deferralReason: '',
    tuberculosis: '', hepatitisB: '', mastitis: '', syphilis: '', herpes: '', std: '', bloodTransfusion: '', organTransplant: '', alcoholConsumption: '', smoker: '', illegalDrugs: '', tattoo: '', vegetarianDiet: '', multivitamins: '', herbalDrugs: '', contraceptivePills: '', breastSurgery: '', breastImplants: '', multiplePartners: '',
    partnerBisexual: '', partnerPromiscuous: '', partnerSTD: '', partnerBloodTransfusions: '', partnerIVDrug: '', needlePrick: '',
    childAge: '', childAgeMonths: '', childFullTerm: '', exclusiveBreastfeeding: '', childJaundice: '', jaundiceLength: '', childReceivedOtherMilk: '', otherMilkSource: '',
    consentAgreed: false, signature: '',
  });

  const totalSteps = 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const ref = `TMP-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    setTempRefId(ref);
    if (onSubmitApplication) {
      const app: ScreeningApplication = {
        id: `scr-${Date.now()}`,
        tempRefId: ref,
        submittedAt: now.toISOString(),
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dateOfBirth,
        address: form.address,
        phone: form.phone,
        program: 'milky_way',
        status: 'pending_review',
        consentSigned: form.consentAgreed,
        hepatitisB: form.hepatitisB,
        tuberculosis: form.tuberculosis,
        syphilis: form.syphilis,
        illegalDrugs: form.illegalDrugs,
        bloodTransfusion: form.bloodTransfusion,
        medications: form.herbalDrugs || form.multivitamins || '',
        hivRiskPartner: form.partnerPromiscuous === 'yes' || form.partnerBisexual === 'yes' || form.partnerIVDrug === 'yes',
        serologyHivStatus: 'pending',
        serologyHepBStatus: form.hepatitisB === 'yes' ? 'flagged' : 'pending',
      };
      onSubmitApplication(app);
    }
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 max-w-2xl w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">Application Submitted Successfully</h2>
          <p className="text-gray-600 mb-4">
            Thank you for your interest in becoming a donor. Your health profile (MHMB FORM-001) has been recorded and is now pending review by our screening team.
          </p>
          {tempRefId && (
            <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-4 mb-4">
              <div className="text-pink-600" style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: 4 }}>YOUR APPLICATION REFERENCE NUMBER</div>
              <div className="text-[#1E3A8A]" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.04em' }}>{tempRefId}</div>
              <div className="text-gray-500 mt-1" style={{ fontSize: '0.75rem' }}>Please save this reference number. You will need it when following up with our staff.</div>
            </div>
          )}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Next Steps:</strong> Our staff will contact you within 2-3 business days to schedule your screening appointment and laboratory tests (Hepatitis B, sputum test). Please keep your phone available.
            </p>
          </div>
          <button
            onClick={onBackToHome ?? (() => window.location.reload())}
            className="px-6 py-3 bg-[#1E3A8A] text-white rounded-lg font-semibold hover:bg-[#1e40af] transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="mb-6 text-gray-600 hover:text-[#EC4899] flex items-center gap-2 font-medium"
          >
            ← Back to Home
          </button>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1E3A8A, #EC4899)' }}>
                <Droplets className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#1E3A8A]">Makati Human Milk Bank</h1>
            </div>
            <p className="text-sm text-gray-600">Bangkal Health Center, Rodriguez St. Barangay Bangkal, Makati City</p>
            <div className="mt-3 inline-block px-4 py-2 bg-pink-50 border border-pink-200 rounded-lg">
              <span className="text-pink-800 font-semibold">HEALTH PROFILE MHMB FORM-001</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map(step => (
                <div key={step} className="flex items-center flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep >= step ? 'bg-[#1E3A8A] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  {step < totalSteps && (
                    <div className={`flex-1 h-1 mx-2 transition-all ${
                      currentStep > step ? 'bg-[#1E3A8A]' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-gray-600 mt-2">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-8">

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">I. Personal Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                    <input required type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Initial</label>
                    <input type="text" maxLength={2} value={form.middleInitial} onChange={e => setForm({...form, middleInitial: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name / Surname *</label>
                    <input required type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address / Residence *</label>
                  <input required type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Where did you have your Prenatal Check-up? *</label>
                  <input required type="text" value={form.prenatalCheckup} onChange={e => setForm({...form, prenatalCheckup: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Telephone / Mobile *</label>
                    <input required type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation / Work *</label>
                    <input required type="text" value={form.occupation} onChange={e => setForm({...form, occupation: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nationality / Race *</label>
                    <input required type="text" value={form.nationality} onChange={e => setForm({...form, nationality: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
                    <input required type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Civil Status *</label>
                  <div className="flex flex-wrap gap-3 md:gap-4">
                    {['Single', 'Married', 'Separated', 'Widowed'].map(status => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                        <input required={!form.civilStatus} type="radio" name="civilStatus" value={status} checked={form.civilStatus === status} onChange={e => setForm({...form, civilStatus: e.target.value})} className="w-4 h-4 text-[#EC4899] focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Classification & Travel */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">II. Classification of Donor</h2>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Coming from / Source *</label>
                  <div className="space-y-2">
                    {['Community', 'Private', 'Employee', 'Agency', 'Hospital'].map(source => (
                      <label key={source} className="flex items-center gap-2 cursor-pointer">
                        <input required={!form.donorSource} type="radio" name="donorSource" value={source} checked={form.donorSource === source} onChange={e => setForm({...form, donorSource: e.target.value})} className="w-4 h-4 text-[#EC4899] focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">{source}</span>
                      </label>
                    ))}
                  </div>
                  {['Employee', 'Agency', 'Hospital'].includes(form.donorSource) && (
                    <input type="text" placeholder="Specify..." value={form.donorSourceOther} onChange={e => setForm({...form, donorSourceOther: e.target.value})} className="mt-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">III. Travel History</h2>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Have you traveled outside the Philippines within the last 5 years? *</label>
                  <div className="flex gap-4 mb-4">
                    {['Yes', 'No'].map(option => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input required={!form.traveledAbroad} type="radio" name="traveledAbroad" value={option} checked={form.traveledAbroad === option} onChange={e => setForm({...form, traveledAbroad: e.target.value})} className="w-4 h-4 text-[#EC4899] focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                  {form.traveledAbroad === 'Yes' && (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">If YES, which country?</label>
                        <input type="text" value={form.travelCountry} onChange={e => setForm({...form, travelCountry: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
                      </div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Travel</label>
                      <div className="space-y-2">
                        {['Tourist', 'Work', 'Studies', 'Others'].map(reason => (
                          <label key={reason} className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="travelReason" value={reason} checked={form.travelReason === reason} onChange={e => setForm({...form, travelReason: e.target.value})} className="w-4 h-4 text-[#EC4899] focus:ring-pink-500" />
                            <span className="text-sm text-gray-700">{reason}</span>
                          </label>
                        ))}
                      </div>
                      {form.travelReason === 'Others' && (
                        <input type="text" placeholder="Specify..." value={form.travelReasonOther} onChange={e => setForm({...form, travelReasonOther: e.target.value})} className="mt-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
                      )}
                    </>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">IV. Reason for Donating</h2>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Why do you want to donate your milk? *</label>
                  <textarea required value={form.donationReason} onChange={e => setForm({...form, donationReason: e.target.value})} rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">V. Source of Information</h2>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Where or how did you find out about the Makati Human Milk Bank? *</label>
                  <div className="space-y-2">
                    {['Acquaintance / Someone you know', 'Posters/Pamphlet', 'Others'].map(source => (
                      <label key={source} className="flex items-center gap-2 cursor-pointer">
                        <input required={!form.infoSource} type="radio" name="infoSource" value={source} checked={form.infoSource === source} onChange={e => setForm({...form, infoSource: e.target.value})} className="w-4 h-4 text-[#EC4899] focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">{source}</span>
                      </label>
                    ))}
                  </div>
                  {form.infoSource === 'Others' && (
                    <input type="text" placeholder="Specify..." value={form.infoSourceOther} onChange={e => setForm({...form, infoSourceOther: e.target.value})} className="mt-2 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">VI. Spouse Consent</h2>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Will your spouse/husband allow you to donate your milk? *</label>
                  <div className="flex gap-4">
                    {['YES', 'NO'].map(option => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input required={!form.spouseConsent} type="radio" name="spouseConsent" value={option} checked={form.spouseConsent === option} onChange={e => setForm({...form, spouseConsent: e.target.value})} className="w-4 h-4 text-[#EC4899] focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Health History Part 1 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">SCREENING I: Health History</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">When was your last delivery / childbirth? *</label>
                    <input required type="date" value={form.lastDeliveryDate} onChange={e => setForm({...form, lastDeliveryDate: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Which number child is this? *</label>
                    <input required type="number" min="1" value={form.childNumber} onChange={e => setForm({...form, childNumber: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Was this a "normal delivery"? *</label>
                  <div className="flex gap-4">
                    {['YES', 'NO'].map(option => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input required={!form.normalDelivery} type="radio" name="normalDelivery" value={option} checked={form.normalDelivery === option} onChange={e => setForm({...form, normalDelivery: e.target.value})} className="w-4 h-4 text-[#EC4899] focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <p className="text-sm text-blue-800 font-semibold mb-2">Have you ever had any of the following illnesses?</p>
                </div>

                {[
                  { key: 'tuberculosis', label: 'Tuberculosis' },
                  { key: 'hepatitisB', label: 'Hepatitis B' },
                  { key: 'mastitis', label: 'Mastitis / Breast Inflammation' },
                  { key: 'syphilis', label: 'Syphilis' },
                  { key: 'herpes', label: 'Herpes' },
                  { key: 'std', label: 'Sexually Transmitted Disease' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{label} *</label>
                    <div className="flex gap-4">
                      {['YES', 'NO'].map(option => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input required={!form[key as keyof FormData]} type="radio" name={key} value={option} checked={form[key as keyof FormData] === option} onChange={e => setForm({...form, [key]: e.target.value})} className="w-4 h-4 text-[#EC4899] focus:ring-pink-500" />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Health History Part 2 */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">Health History (Continued)</h2>

                {[
                  { key: 'bloodTransfusion', label: 'Have you received a blood transfusion or any blood products within the past 12 months?' },
                  { key: 'organTransplant', label: 'Have you received an organ transplant within the past 12 months?' },
                  { key: 'alcoholConsumption', label: 'Have you consumed alcohol within the past 24 hours?' },
                  { key: 'smoker', label: 'Do you smoke cigarettes?' },
                  { key: 'illegalDrugs', label: 'Do you use prohibited/illegal drugs?' },
                  { key: 'tattoo', label: 'Do you have a tattoo on any part of your body?' },
                  { key: 'vegetarianDiet', label: 'Do you practice a strictly vegetarian diet only?' },
                  { key: 'multivitamins', label: 'Do you take multivitamins?' },
                  { key: 'herbalDrugs', label: 'Do you take herbal drugs or mega-dose vitamins?' },
                  { key: 'contraceptivePills', label: 'Do you take contraceptive pills or replacement hormones?' },
                  { key: 'breastSurgery', label: 'Have you ever undergone breast surgery?' },
                  { key: 'multiplePartners', label: 'Have you ever had a history of having more than 1 sexual partner?' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{label} *</label>
                    <div className="flex gap-4">
                      {['YES', 'NO'].map(option => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input required={!form[key as keyof FormData]} type="radio" name={key} value={option} checked={form[key as keyof FormData] === option} onChange={e => setForm({...form, [key]: e.target.value})} className="w-4 h-4 text-[#EC4899] focus:ring-pink-500" />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <p className="text-sm text-amber-800 font-semibold mb-2">Have you had a partner who has a history of any of the following?</p>
                </div>

                {[
                  { key: 'partnerBisexual', label: 'Sexual intercourse with the same sex / Bisexual' },
                  { key: 'partnerPromiscuous', label: 'Sexual intercourse with more than one person / Promiscuous' },
                  { key: 'partnerSTD', label: 'Sexual intercourse with a person with an STD / AIDS / HIV' },
                  { key: 'partnerBloodTransfusions', label: 'Repeated blood transfusions' },
                  { key: 'partnerIVDrug', label: 'Used drugs via injection into the body / Intravenous drug user' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{label} *</label>
                    <div className="flex gap-4">
                      {['YES', 'NO'].map(option => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input required={!form[key as keyof FormData]} type="radio" name={key} value={option} checked={form[key as keyof FormData] === option} onChange={e => setForm({...form, [key]: e.target.value})} className="w-4 h-4 text-[#EC4899] focus:ring-pink-500" />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 5: Child Health & Consent */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">VII. Health of the Donor's Child</h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">How old is your youngest child? *</label>
                  <div className="space-y-2">
                    {['0 day - 10 days', '11 days - 7 months', '8 months - 2 years'].map(age => (
                      <label key={age} className="flex items-center gap-2 cursor-pointer">
                        <input required={!form.childAge} type="radio" name="childAge" value={age} checked={form.childAge === age} onChange={e => setForm({...form, childAge: e.target.value})} className="w-4 h-4 text-[#EC4899] focus:ring-pink-500" />
                        <span className="text-sm text-gray-700">{age}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {[
                  { key: 'childFullTerm', label: 'Was your youngest child born full-term?' },
                  { key: 'exclusiveBreastfeeding', label: 'Is the milk you give to your child purely breastmilk (Exclusive Breastfeeding)?' },
                  { key: 'childJaundice', label: 'Did your youngest child develop jaundice (yellowing of the skin)?' },
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{label} *</label>
                    <div className="flex gap-4">
                      {['YES', 'NO'].map(option => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <input required={!form[key as keyof FormData]} type="radio" name={key} value={option} checked={form[key as keyof FormData] === option} onChange={e => setForm({...form, [key]: e.target.value})} className="w-4 h-4 text-[#EC4899] focus:ring-pink-500" />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="mt-8 pt-8 border-t-2 border-gray-200">
                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">DONOR'S CONSENT</h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 space-y-4 text-sm text-gray-700">
                    <div>
                      <h3 className="font-bold text-[#1E3A8A] mb-2">What is Human Milk?</h3>
                      <p>This is milk that comes from breastfeeding mothers. This milk contains high levels of nutrients that are sufficient for the proper growth and development of an infant. It also contains natural properties that protect against illnesses such as sepsis, meningitis, and necrotizing enterocolitis.</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1E3A8A] mb-2">What is a Human Milk Bank?</h3>
                      <p>The Human Milk Bank is a healthcare service that collects milk from voluntary breastfeeding mothers and distributes safe breastmilk to infants who are ill or born prematurely through proper screening and processing.</p>
                    </div>
                  </div>

                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 mb-6">
                    <h3 className="font-bold text-[#1E3A8A] mb-3">CERTIFICATE OF AGREEMENT</h3>
                    <p className="text-sm text-gray-700 mb-4">
                      I voluntarily and wholeheartedly donate my breastmilk without any financial compensation, which may continue for a duration of up to 6 months under the supervision of the Makati Human Milk Bank.
                    </p>
                    <p className="text-sm text-gray-700 mb-4">
                      I agree to have my blood tested for Hepatitis B and to undergo a sputum test before I donate milk. I also agree to share truthful health information and report any health changes during the donation period.
                    </p>
                    <p className="text-sm text-gray-700">
                      I understand that all information and examination results will be treated as private and used solely for Makati Human Milk Bank purposes.
                    </p>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer bg-white border-2 border-[#1E3A8A] rounded-lg p-4 mb-4">
                    <input required type="checkbox" checked={form.consentAgreed} onChange={e => setForm({...form, consentAgreed: e.target.checked})} className="w-5 h-5 text-[#EC4899] focus:ring-pink-500 mt-1" />
                    <div>
                      <span className="text-sm font-bold text-[#1E3A8A]">I have read and agree to the terms above *</span>
                      <p className="text-xs text-gray-600 mt-1">By checking this box, you confirm that all information provided is truthful and you consent to donation under the stated conditions.</p>
                    </div>
                  </label>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name (Electronic Signature) *</label>
                    <input required type="text" value={form.signature} onChange={e => setForm({...form, signature: e.target.value})} placeholder="Type your full name to sign" className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#EC4899] focus:ring-2 focus:ring-pink-100 outline-none transition-all font-signature text-lg" />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-[#1E3A8A] text-white rounded-lg font-semibold hover:bg-[#1e40af] transition-all"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!form.consentAgreed || !form.signature}
                  className="px-4 md:px-8 py-3 bg-[#EC4899] text-white rounded-lg font-semibold hover:bg-[#DB2777] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Submit Application
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Help Notice */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-semibold mb-1">Need Assistance?</p>
              <p>Contact Makati Human Milk Bank: +63 2 8888-MILK | lactabank@makati.gov.ph</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
