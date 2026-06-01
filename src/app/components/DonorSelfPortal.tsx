import { useState } from 'react';
import { User, Heart, CheckCircle, Edit3, Save } from 'lucide-react';
import { mockDonors, mockCollections } from '../mockData';
import type { User as UserType } from '../types';

interface DonorSelfPortalProps {
  currentUser: UserType;
}

export function DonorSelfPortal({ currentUser }: DonorSelfPortalProps) {
  const donor = mockDonors.find(d => `${d.firstName} ${d.lastName}` === currentUser.name) || mockDonors[0];
  const myCollections = mockCollections.filter(c => c.dtn === donor.dtn);

  const [editMode, setEditMode] = useState(false);
  const [questionnaire, setQuestionnaire] = useState({
    medications: 'None currently',
    recentIllness: false,
    smokingStatus: 'Non-smoker',
    alcoholConsumption: 'None',
    breastfeedingOwn: true,
    notes: 'No notable health changes since last donation.',
  });

  const totalDonated = myCollections.reduce((s, c) => s + c.volumeMl, 0);

  return (
    <div className="p-4 md:p-6 max-w-[900px]">
      <div className="mb-4 md:mb-5">
        <h1 className="text-[#1E3A8A]">My Donor Profile</h1>
        <p className="text-gray-500" style={{ fontSize: '0.875rem' }}>View and update your health questionnaire and donation status</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-6 mb-4 md:mb-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#EC4899] flex items-center justify-center text-white flex-shrink-0" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {donor.firstName[0]}{donor.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-gray-800 mb-1">{donor.firstName} {donor.lastName}</h2>
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <span className="px-2.5 py-1 rounded-full border" style={{ background: '#FFF0F7', color: '#9D174D', borderColor: '#FBCFE8', fontSize: '0.72rem', fontWeight: 600 }}>{donor.dtn}</span>
              <span className="px-2.5 py-1 rounded-full border" style={{ background: '#F0FDF4', color: '#15803D', borderColor: '#BBF7D0', fontSize: '0.72rem', fontWeight: 600 }}>
                Active Donor
              </span>
              <span className="text-gray-400" style={{ fontSize: '0.75rem' }}>Registered: {donor.registrationDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 md:gap-3">
            <div className="text-center">
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#EC4899' }}>{myCollections.length}</div>
              <div className="text-gray-500" style={{ fontSize: '0.72rem' }}>Donations</div>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E3A8A' }}>{totalDonated}</div>
              <div className="text-gray-500" style={{ fontSize: '0.72rem' }}>mL Donated</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {/* Health Questionnaire */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#EC4899]" />
              <h3 className="text-gray-800">Health Questionnaire</h3>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all"
              style={{
                borderColor: editMode ? '#EC4899' : '#E5E7EB',
                color: editMode ? '#EC4899' : '#6B7280',
                fontSize: '0.78rem',
                fontWeight: 500,
              }}
            >
              {editMode ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              {editMode ? 'Save Changes' : 'Update'}
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-gray-500 mb-1" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Current Medications</label>
              {editMode
                ? <input value={questionnaire.medications} onChange={e => setQuestionnaire(q => ({ ...q, medications: e.target.value }))} className="w-full px-3 py-2 border border-[#EC4899] rounded-lg outline-none" style={{ fontSize: '0.82rem' }} />
                : <p className="text-gray-700 bg-[#F8FAFC] px-3 py-2 rounded-lg" style={{ fontSize: '0.82rem' }}>{questionnaire.medications}</p>}
            </div>

            <div>
              <label className="block text-gray-500 mb-1" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Recent Illness (past 6 months)</label>
              <div className="flex gap-2">
                {[true, false].map(val => (
                  <button
                    key={String(val)}
                    disabled={!editMode}
                    onClick={() => setQuestionnaire(q => ({ ...q, recentIllness: val }))}
                    className="px-3 py-1.5 rounded-lg border transition-all"
                    style={{
                      background: questionnaire.recentIllness === val ? '#EC4899' : 'white',
                      color: questionnaire.recentIllness === val ? 'white' : '#374151',
                      borderColor: questionnaire.recentIllness === val ? '#EC4899' : '#E5E7EB',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      opacity: !editMode ? 0.7 : 1,
                    }}
                  >
                    {val ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-500 mb-1" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Smoking Status</label>
              {editMode
                ? <select value={questionnaire.smokingStatus} onChange={e => setQuestionnaire(q => ({ ...q, smokingStatus: e.target.value }))} className="w-full px-3 py-2 border border-[#EC4899] rounded-lg outline-none bg-white" style={{ fontSize: '0.82rem' }}>
                  <option>Non-smoker</option><option>Ex-smoker</option><option>Occasional</option>
                </select>
                : <p className="text-gray-700 bg-[#F8FAFC] px-3 py-2 rounded-lg" style={{ fontSize: '0.82rem' }}>{questionnaire.smokingStatus}</p>}
            </div>

            <div>
              <label className="block text-gray-500 mb-1" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Additional Notes</label>
              {editMode
                ? <textarea value={questionnaire.notes} onChange={e => setQuestionnaire(q => ({ ...q, notes: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-[#EC4899] rounded-lg outline-none resize-none" style={{ fontSize: '0.82rem' }} />
                : <p className="text-gray-700 bg-[#F8FAFC] px-3 py-2 rounded-lg" style={{ fontSize: '0.82rem' }}>{questionnaire.notes}</p>}
            </div>
          </div>
        </div>

        {/* Donation History */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-[#1E3A8A]" />
            <h3 className="text-gray-800">My Donation History</h3>
          </div>

          {myCollections.length > 0 ? (
            <div className="space-y-2">
              {myCollections.map(c => (
                <div key={c.id} className="bg-[#F8FAFC] rounded-lg px-4 py-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E3A8A' }}>{c.ctn}</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#EC4899' }}>{c.volumeMl} mL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500" style={{ fontSize: '0.75rem' }}>{c.collectionDate}</span>
                    <span className="px-2 py-0.5 rounded-full" style={{
                      background: c.program === 'milky_way' ? '#EFF6FF' : '#FFF0F7',
                      color: c.program === 'milky_way' ? '#1E3A8A' : '#9D174D',
                      fontSize: '0.7rem', fontWeight: 600,
                    }}>
                      {c.program === 'milky_way' ? 'Milky Way' : c.program === 'supsup_todo' ? 'Supsup Todo' : "Mom's Act"}
                    </span>
                  </div>
                  {c.batchId && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-green-600" style={{ fontSize: '0.7rem' }}>Processed → {c.batchId}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400" style={{ fontSize: '0.875rem' }}>
              No donation records yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
