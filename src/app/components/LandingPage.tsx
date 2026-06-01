import { useState } from 'react';
import { ChevronDown, ChevronRight, Droplets } from 'lucide-react';

interface LandingPageProps {
  onNavigateToStaffPortal: () => void;
  onNavigateToDonorForm: () => void;
  onNavigateToBeneficiaryForm: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

const donorFAQs: FAQItem[] = [
  {
    question: "Who can safely donate human milk?",
    answer: "Any healthy, lactating mother who passes our digitized health history screening and has valid serological clearances."
  },
  {
    question: "Do I need to physically visit the bank to register?",
    answer: "No. You can complete your electronic consent and health history forms directly through this portal. Our staff manages household collections."
  },
  {
    question: "What are the maximum collection size parameters?",
    answer: "Healthy donors can contribute a maximum limit of 800mL per day, or between 30mL to 240mL per individual collection session."
  }
];

const beneficiaryFAQs: FAQItem[] = [
  {
    question: "Which infants are eligible to receive pasteurized donor milk?",
    answer: "Priority is strictly managed by our medical staff, favoring preterm babies, critically ill neonates in the NICU, or infants with severe feeding intolerances."
  },
  {
    question: "What physical documentation must I provide at the pickup window?",
    answer: "Guardians must present a valid Pediatrician's Prescription, a copy of the infant's Clinical Abstract, and bring a secure transport cooler with ice."
  },
  {
    question: "Are there processing fees associated with the service?",
    answer: "Yes. To support laboratory testing and pasteurization compliance, there is a standard processing fee of 2 pesos per mL."
  }
];

function FAQSection({ title, icon, faqs }: { title: string; icon: string; faqs: FAQItem[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {faqs.map((faq, index) => (
          <div key={index} className="px-6 py-4">
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full flex items-start gap-3 text-left group"
            >
              <div className="flex-shrink-0 mt-0.5">
                {expandedIndex === index ? (
                  <ChevronDown className="w-5 h-5 text-[#EC4899]" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#EC4899] transition-colors" />
                )}
              </div>
              <span className="font-medium text-gray-900 group-hover:text-[#EC4899] transition-colors">
                {faq.question}
              </span>
            </button>
            {expandedIndex === index && (
              <div className="mt-3 ml-8 text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LandingPage({ onNavigateToStaffPortal, onNavigateToDonorForm, onNavigateToBeneficiaryForm }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1E3A8A, #EC4899)' }}>
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-[#1E3A8A] text-lg">Makati Human Milk Bank</div>
              <div className="text-xs text-gray-500">LACTA BANK System</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-700 hover:text-[#EC4899] transition-colors font-medium">Home</a>
            <a href="#about" className="text-gray-700 hover:text-[#EC4899] transition-colors font-medium">About</a>
            <a href="#donor-hub" className="text-gray-700 hover:text-[#EC4899] transition-colors font-medium">Donor Hub</a>
            <a href="#beneficiary-guide" className="text-gray-700 hover:text-[#EC4899] transition-colors font-medium">Beneficiary Guide</a>
            <a href="#faqs" className="text-gray-700 hover:text-[#EC4899] transition-colors font-medium">FAQs</a>
          </nav>

          <button
            onClick={onNavigateToStaffPortal}
            className="bg-[#EC4899] hover:bg-[#DB2777] text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            Staff Portal
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-[#F8FAFC] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#1E3A8A] leading-tight mb-6">
                Every Drop is a Lifeline: Providing Superior Nutrition to Filipino Newborns.
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Operating out of Barangay Bangkal, the Makati Human Milk Bank safely screens, pasteurizes, and distributes donor human milk to critically ill and preterm infants in the NICU to reduce childhood mortality.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onNavigateToDonorForm}
                  className="bg-[#EC4899] hover:bg-[#DB2777] text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md"
                >
                  Donate Milk (Remote Screening)
                </button>
                <button
                  onClick={onNavigateToBeneficiaryForm}
                  className="bg-white hover:bg-gray-50 text-[#1E3A8A] border-2 border-[#1E3A8A] px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Request Milk
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#DDF2FF] to-[#FEE2F8] rounded-2xl p-8 aspect-square flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">👶</div>
                <div className="text-8xl">🤱</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Lifecycle */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1E3A8A] mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">A simple, safe biovigilance process to save lives</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gradient-to-br from-[#FEE2F8] to-white p-8 rounded-xl border-2 border-[#EC4899]">
              <div className="w-16 h-16 bg-[#EC4899] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">Remote Screening</h3>
              <p className="text-gray-700 leading-relaxed">
                <span className="font-semibold">For Donors:</span> Complete the digital health profile and serological checklist (HIV, HepB, Syphilis) entirely online to verify physical eligibility.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gradient-to-br from-[#DDF2FF] to-white p-8 rounded-xl border-2 border-[#1E3A8A]">
              <div className="w-16 h-16 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">Safe Collection</h3>
              <p className="text-gray-700 leading-relaxed">
                <span className="font-semibold">For Donors:</span> Once approved, request a Mom's Act home pickup. Our staff collects your frozen milk right from your doorstep to protect the cold chain.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gradient-to-br from-[#F0F9FF] to-white p-8 rounded-xl border-2 border-[#3B82F6]">
              <div className="w-16 h-16 bg-[#3B82F6] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">Life-Saving Triage</h3>
              <p className="text-gray-700 leading-relaxed">
                <span className="font-semibold">For Beneficiaries:</span> Submit your Pediatrician's Prescription and Clinical Abstract. Our triage system prioritizes infants in the highest medical need.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1E3A8A] mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Find answers to common questions about our service</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <FAQSection
              title="DONOR QUESTIONS (The Supply Side)"
              icon="🤱"
              faqs={donorFAQs}
            />
            <FAQSection
              title="BENEFICIARY QUESTIONS (The Demand Side)"
              icon="👶"
              faqs={beneficiaryFAQs}
            />
          </div>
        </div>
      </section>

      {/* Registration Portals */}
      <section id="donor-hub" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1E3A8A] mb-4">Get Started Today</h2>
            <p className="text-lg text-gray-600">Register as a donor or submit a beneficiary inquiry</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Donor Portal */}
            <div className="border-4 border-[#EC4899] rounded-2xl p-8 bg-gradient-to-br from-[#FEE2F8] to-white">
              <div className="text-5xl mb-6 text-center">🤱</div>
              <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4 text-center">Become a Virtual Milk Donor</h3>
              <p className="text-gray-700 leading-relaxed mb-8 text-center">
                Sign your Electronic Consent, complete the digital version of MHMB FORM-001, and coordinate your household pickup schedule.
              </p>
              <button
                onClick={onNavigateToDonorForm}
                className="w-full bg-[#EC4899] hover:bg-[#DB2777] text-white px-8 py-4 rounded-lg font-bold transition-colors shadow-lg text-lg"
              >
                Launch Online Screening Form
              </button>
            </div>

            {/* Beneficiary Portal */}
            <div className="border-4 border-[#3B82F6] rounded-2xl p-8 bg-gradient-to-br from-[#DDF2FF] to-white">
              <div className="text-5xl mb-6 text-center">👶</div>
              <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4 text-center">Register an Infant Inquiry</h3>
              <p className="text-gray-700 leading-relaxed mb-8 text-center">
                If medical stock is currently unavailable, register your child's medical needs here to join our prioritized waitlist queue.
              </p>
              <button
                onClick={onNavigateToBeneficiaryForm}
                className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-4 rounded-lg font-bold transition-colors shadow-lg text-lg"
              >
                Submit Waitlist Inquiry
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E3A8A] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-[#1E3A8A]" />
                </div>
                <div className="font-bold text-lg">LACTA BANK</div>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed">
                Makati Human Milk Bank - Providing superior nutrition to Filipino newborns through safe, pasteurized donor milk.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-3">Contact Information</h4>
              <p className="text-blue-200 text-sm leading-relaxed">
                Makati Human Milk Bank<br />
                Barangay Bangkal<br />
                Makati City, Philippines
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-3">Privacy & Compliance</h4>
              <p className="text-blue-200 text-sm leading-relaxed">
                All serological records are handled with strict backend encryption in compliance with the Data Privacy Act of 2012.
              </p>
            </div>
          </div>

          <div className="border-t border-blue-800 pt-8 text-center text-blue-200 text-sm">
            <p>&copy; {new Date().getFullYear()} Makati Human Milk Bank. All rights reserved.</p>
            <p className="mt-2">Data Privacy Act Compliant | Republic Act No. 10173</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
