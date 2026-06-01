import { useState } from 'react';
import { CheckCircle, AlertCircle, FileText, IdCard, Refrigerator, Stethoscope, Upload, Phone, Droplets } from 'lucide-react';

interface FormData {
  // Step 1: Requester & Guardian Information
  guardianFullName: string;
  relationshipToInfant: string;
  mobileNumber: string;
  alternativeContact: string;
  residentialAddress: string;
  emailAddress: string;

  // Step 2: Infant Clinical Profile
  infantFullName: string;
  infantDateOfBirth: string;
  gestationalAge: string;
  birthWeightGrams: string;
  currentLocation: string;
  medicalIndications: string[];

  // Step 3: Milk Volume Request
  requestedVolumeMl: string;
  pediatricianName: string;
  pediatricianLicense: string;
  estimatedDuration: string;

  // Step 4: Digital Upload
  prescriptionFile: File | null;

  // Step 5: Consent
  consentAcknowledged: boolean;
  certifyAccuracy: boolean;
}

interface BeneficiaryRegistrationFormProps {
  onBackToHome?: () => void;
}

export function BeneficiaryRegistrationForm({ onBackToHome }: BeneficiaryRegistrationFormProps) {
  const totalSteps = 5;
  const [currentStep, setCurrentStep] = useState(0); // 0 = checklist, 1-5 = form steps
  const [submitted, setSubmitted] = useState(false);
  const [trackingRef] = useState(`WL-${Date.now().toString(36).toUpperCase()}`);

  const [form, setForm] = useState<FormData>({
    guardianFullName: '',
    relationshipToInfant: '',
    mobileNumber: '',
    alternativeContact: '',
    residentialAddress: '',
    emailAddress: '',
    infantFullName: '',
    infantDateOfBirth: '',
    gestationalAge: '',
    birthWeightGrams: '',
    currentLocation: '',
    medicalIndications: [],
    requestedVolumeMl: '',
    pediatricianName: '',
    pediatricianLicense: '',
    estimatedDuration: '',
    prescriptionFile: null,
    consentAcknowledged: false,
    certifyAccuracy: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Beneficiary Inquiry Submitted:', form);
    setSubmitted(true);
  };

  const handleMedicalIndicationToggle = (indication: string) => {
    if (form.medicalIndications.includes(indication)) {
      setForm({
        ...form,
        medicalIndications: form.medicalIndications.filter(i => i !== indication)
      });
    } else {
      setForm({
        ...form,
        medicalIndications: [...form.medicalIndications, indication]
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, prescriptionFile: e.target.files[0] });
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-12 px-6">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">Inquiry Received</h2>
            <p className="text-gray-600 mb-6">Your tracking reference has been created</p>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Waitlist Tracking Reference</p>
              <p className="text-2xl font-bold text-[#1E3A8A] tracking-wider">{trackingRef}</p>
            </div>

            <div className="bg-[#DDF2FF] border-l-4 border-[#3B82F6] p-6 rounded-r-lg mb-6 text-left">
              <div className="flex items-start gap-3 mb-3">
                <Phone className="w-5 h-5 text-[#3B82F6] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  <strong>A text alert will be dispatched to your mobile number</strong> ({form.mobileNumber}) as soon as clinical stock is allocated to your tier.
                </p>
              </div>
              <p className="text-sm text-gray-600 pl-8">
                Milk distribution is based on medical priority determined by our clinical staff. Please ensure you have all physical documents ready for verification upon pickup notification.
              </p>
            </div>

            <div className="space-y-3 text-left mb-8">
              <h3 className="font-semibold text-gray-800 text-sm">Next Steps:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#3B82F6] mt-0.5">•</span>
                  <span>Your inquiry has been registered in the Makati Human Milk Bank waitlist system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B82F6] mt-0.5">•</span>
                  <span>Triage nurses will review your infant's clinical profile within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B82F6] mt-0.5">•</span>
                  <span>You will receive SMS notification when pasteurized milk matching your requirements becomes available</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#3B82F6] mt-0.5">•</span>
                  <span>Bring all physical documents and a secure cooler with ice packs to Bangkal Health Center for pickup</span>
                </li>
              </ul>
            </div>

            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="w-full bg-[#1E3A8A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2563EB] transition-all"
              >
                Return to Home
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* Back Button */}
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="mb-6 text-gray-600 hover:text-[#3B82F6] flex items-center gap-2 font-medium"
          >
            ← Back to Home
          </button>
        )}

        {/* Infographic Checklist - Step 0 */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-8 text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1E3A8A, #EC4899)' }}>
                  <Droplets className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[#1E3A8A]">Beneficiary Inquiry Form</h1>
              </div>
              <p className="text-sm text-gray-600 mb-1">Makati Human Milk Bank Waitlist Registration</p>
              <p className="text-xs text-gray-500">Bangkal Health Center, Rodriguez St. Barangay Bangkal, Makati City</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-4 md:p-8 border-2 border-blue-200">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-[#1E3A8A] mb-2">📋 Required Physical Documents Checklist</h2>
                <p className="text-sm text-gray-600">Please prepare these documents before visiting the collection window</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-5 border-l-4 border-[#3B82F6] shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm mb-1">Requirement 1</h3>
                      <p className="text-sm text-gray-700 font-semibold mb-1">Official Pediatrician's Prescription</p>
                      <p className="text-xs text-gray-600">Stating the medical indication for Pasteurised Donor Human Milk</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border-l-4 border-[#3B82F6] shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm mb-1">Requirement 2</h3>
                      <p className="text-sm text-gray-700 font-semibold mb-1">Infant's Clinical Abstract / Birth Certificate Copy</p>
                      <p className="text-xs text-gray-600">For NICU/Preterm weight verification</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border-l-4 border-[#3B82F6] shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IdCard className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm mb-1">Requirement 3</h3>
                      <p className="text-sm text-gray-700 font-semibold mb-1">Valid ID of the Parent/Guardian</p>
                      <p className="text-xs text-gray-600">For verification upon pickup</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border-l-4 border-[#3B82F6] shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Refrigerator className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm mb-1">Requirement 4</h3>
                      <p className="text-sm text-gray-700 font-semibold mb-1">Secure Transport Cooler with Ice Packs</p>
                      <p className="text-xs text-gray-600">To maintain the cold chain during transport</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                <p className="text-xs text-gray-700">
                  <strong className="text-yellow-800">Processing Fee Footnote:</strong> Standard processing fee of <strong>₱2.00 per mL</strong> applies to support laboratory screening and pasteurisation compliance.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-[#1E3A8A] text-white px-4 md:px-8 py-3 rounded-lg font-semibold hover:bg-[#2563EB] transition-all"
              >
                I Understand — Proceed to Form
              </button>
            </div>
          </div>
        )}

        {/* Form Steps 1-5 */}
        {currentStep > 0 && (
          <form onSubmit={handleSubmit}>
            {/* Header with Progress */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1E3A8A, #EC4899)' }}>
                  <Droplets className="w-4 h-4 text-white" />
                </div>
                  <h1 className="text-2xl font-bold text-[#1E3A8A]">Beneficiary Inquiry Form</h1>
                </div>
                <p className="text-sm text-gray-600">Waitlist Registration</p>
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
                        <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                          currentStep > step ? 'bg-[#1E3A8A]' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                  <span>Guardian Info</span>
                  <span className="text-center">Clinical Profile</span>
                  <span className="text-center">Request Details</span>
                  <span className="text-center">Upload Docs</span>
                  <span className="text-right">Consent</span>
                </div>
              </div>
            </div>

            {/* Form Content Card */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-8 mb-6">
              {/* Step 1: Requester & Guardian Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">Step 1: Requester & Guardian Information</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name of Guardian/Parent *</label>
                      <input
                        type="text"
                        required
                        value={form.guardianFullName}
                        onChange={e => setForm({...form, guardianFullName: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship to the Infant *</label>
                      <select
                        required
                        value={form.relationshipToInfant}
                        onChange={e => setForm({...form, relationshipToInfant: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      >
                        <option value="">Select Relationship</option>
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Legal Guardian">Legal Guardian</option>
                        <option value="Hospital Representative">Hospital Representative</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        pattern="09[0-9]{9}"
                        placeholder="09XXXXXXXXX"
                        value={form.mobileNumber}
                        onChange={e => setForm({...form, mobileNumber: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1">Essential for automated 2G/GSM text status notifications</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Alternative Contact Number</label>
                      <input
                        type="tel"
                        value={form.alternativeContact}
                        onChange={e => setForm({...form, alternativeContact: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Complete Residential Address *</label>
                    <input
                      type="text"
                      required
                      value={form.residentialAddress}
                      onChange={e => setForm({...form, residentialAddress: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={form.emailAddress}
                      onChange={e => setForm({...form, emailAddress: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Infant Clinical Profile */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#1E3A8A] mb-2">Step 2: Infant Clinical Profile (Triage Inputs)</h2>
                    <p className="text-sm text-gray-600 mb-4">These metrics feed into our internal nurse triage queue for medical priority sorting</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Infant's Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Baby Girl Reyes"
                        value={form.infantFullName}
                        onChange={e => setForm({...form, infantFullName: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Infant's Date of Birth *</label>
                      <input
                        type="date"
                        required
                        max={new Date().toISOString().split('T')[0]}
                        value={form.infantDateOfBirth}
                        onChange={e => setForm({...form, infantDateOfBirth: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Gestational Age at Birth *</label>
                      <select
                        required
                        value={form.gestationalAge}
                        onChange={e => setForm({...form, gestationalAge: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      >
                        <option value="">Select Gestational Age</option>
                        <option value="Preterm <32 weeks">Preterm &lt;32 weeks</option>
                        <option value="Moderate Preterm 32-36 weeks">Moderate Preterm 32-36 weeks</option>
                        <option value="Full Term >=37 weeks">Full Term ≥37 weeks</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Current Birth Weight (grams) *</label>
                      <input
                        type="number"
                        required
                        min="500"
                        max="6000"
                        placeholder="e.g., 1850"
                        value={form.birthWeightGrams}
                        onChange={e => setForm({...form, birthWeightGrams: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Location of the Infant *</label>
                    <select
                      required
                      value={form.currentLocation}
                      onChange={e => setForm({...form, currentLocation: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    >
                      <option value="">Select Current Location</option>
                      <option value="Makati Medical Center NICU">Makati Medical Center NICU</option>
                      <option value="Ospital ng Makati NICU">Ospital ng Makati NICU</option>
                      <option value="Home (Bangkal Community)">Home (Bangkal Community)</option>
                      <option value="Other Hospital NICU">Other Hospital NICU</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Primary Medical Indication / Diagnosis * (Select all that apply)</label>
                    <div className="space-y-2">
                      {[
                        'Prematurity / Low Birth Weight',
                        'Necrotizing Enterocolitis (NEC) Risk',
                        'Formula Feeding Intolerance / Severe Malabsorption',
                        'Post-Surgery Recovery',
                        'Maternal Illness / Inadequate Maternal Milk Supply',
                        'Abandoned / Orphaned Neonate'
                      ].map(indication => (
                        <label key={indication} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={form.medicalIndications.includes(indication)}
                            onChange={() => handleMedicalIndicationToggle(indication)}
                            className="mt-0.5 w-5 h-5 text-[#3B82F6] focus:ring-blue-500 rounded"
                          />
                          <span className="text-sm text-gray-700">{indication}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Milk Volume Request Parameters */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">Step 3: Milk Volume Request Parameters</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Requested Volume (in mL) *</label>
                      <input
                        type="number"
                        required
                        min="50"
                        max="5000"
                        placeholder="e.g., 500"
                        value={form.requestedVolumeMl}
                        onChange={e => setForm({...form, requestedVolumeMl: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Duration of Need *</label>
                      <select
                        required
                        value={form.estimatedDuration}
                        onChange={e => setForm({...form, estimatedDuration: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      >
                        <option value="">Select Duration</option>
                        <option value="1-3 Days Emergency">1-3 Days Emergency</option>
                        <option value="4-7 Days Short-Term">4-7 Days Short-Term</option>
                        <option value="2+ Weeks Extended Clinical Abstract Required">2+ Weeks Extended (Clinical Abstract Required)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Prescribing Pediatrician's Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. [Full Name]"
                        value={form.pediatricianName}
                        onChange={e => setForm({...form, pediatricianName: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">License Number of Pediatrician *</label>
                      <input
                        type="text"
                        required
                        placeholder="PRC License No."
                        value={form.pediatricianLicense}
                        onChange={e => setForm({...form, pediatricianLicense: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Digital Upload Pre-Verification */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#1E3A8A] mb-2">Step 4: Digital Upload Pre-Verification (Optional)</h2>
                    <p className="text-sm text-gray-600 mb-4">Upload a digital copy to accelerate internal verification by our triage nurses</p>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8 text-center hover:border-[#3B82F6] transition-colors">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-[#3B82F6]" />
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Upload Digital Copy of Pediatrician's Prescription / Clinical Abstract</h3>
                    <p className="text-sm text-gray-600 mb-4">JPEG or PDF format. Max file size: 5MB</p>

                    <input
                      type="file"
                      id="prescriptionUpload"
                      accept=".jpg,.jpeg,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="prescriptionUpload"
                      className="inline-block bg-[#1E3A8A] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#2563EB] cursor-pointer transition-all"
                    >
                      Choose File
                    </label>

                    {form.prescriptionFile && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                        <CheckCircle className="w-4 h-4" />
                        <span>{form.prescriptionFile.name} ({(form.prescriptionFile.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-gray-700">
                      <strong className="text-[#1E3A8A]">Note:</strong> Uploading a clear photo of your prescription here accelerates the internal verification process. You must still bring the original physical documents upon pickup.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 5: Terms of Allocation & Acknowledgement */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">Step 5: Terms of Allocation & Acknowledgement</h2>

                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 max-h-64 overflow-y-auto">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      I understand that submitting this inquiry registers my child into the <strong>Makati Human Milk Bank system waitlist</strong>.
                      Milk distribution is strictly dependent on current pasteurised biological inventory stock levels and is allocated based on
                      <strong> medical priority tiers determined by clinical staff</strong>.
                      I agree to present the physical prescription and bring a proper cooling apparatus upon notification of stock availability.
                      <br /><br />
                      I acknowledge that:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-3 ml-2">
                      <li>All information provided is accurate to the best of my knowledge</li>
                      <li>The medical conditions listed match the official prescription from our attending physician</li>
                      <li>I will maintain cold chain protocols during transport</li>
                      <li>Processing fees (₱2.00/mL) support laboratory screening and pasteurization compliance</li>
                      <li>Allocation is based on clinical need, not submission order</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border-2 border-gray-200 hover:border-[#3B82F6] transition-colors">
                      <input
                        type="checkbox"
                        required
                        checked={form.consentAcknowledged}
                        onChange={e => setForm({...form, consentAcknowledged: e.target.checked})}
                        className="mt-0.5 w-5 h-5 text-[#3B82F6] focus:ring-blue-500 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        <strong>I have read and agree to the terms of allocation stated above.</strong> I understand that milk distribution depends on clinical inventory and medical priority.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border-2 border-gray-200 hover:border-[#3B82F6] transition-colors">
                      <input
                        type="checkbox"
                        required
                        checked={form.certifyAccuracy}
                        onChange={e => setForm({...form, certifyAccuracy: e.target.checked})}
                        className="mt-0.5 w-5 h-5 text-[#3B82F6] focus:ring-blue-500 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        <strong>I certify that the medical conditions listed above match the prescription issued by our attending physician.</strong>
                      </span>
                    </label>
                  </div>

                  {(!form.consentAcknowledged || !form.certifyAccuracy) && (
                    <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">
                        Please check both consent boxes to proceed with submission
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Previous
                </button>
              )}
              {currentStep === 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(0)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Back to Checklist
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="ml-auto bg-[#1E3A8A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2563EB] transition-all"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!form.consentAcknowledged || !form.certifyAccuracy}
                  className="ml-auto bg-[#1E3A8A] text-white px-4 md:px-8 py-3 rounded-lg font-semibold hover:bg-[#2563EB] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Waitlist Inquiry
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
