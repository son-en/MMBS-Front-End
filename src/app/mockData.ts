import type { Donor, CollectionRecord, MilkBatch, Beneficiary, EmailLog, AuditLog, SystemUser, LabResult, ScreeningApplication } from './types';

export const mockScreeningApplications: ScreeningApplication[] = [
  {
    id: 'sa1', tempRefId: 'TEMP-2024-0901', submittedAt: '2024-04-19 08:32:11',
    firstName: 'Patricia', lastName: 'Aquino', dateOfBirth: '1993-07-14',
    address: 'Blk 5 Lot 12 Barangay Poblacion, Makati City',
    phone: '+63 917 123 4567', program: 'milky_way', status: 'pending_review',
    consentSigned: true, hepatitisB: 'NO', tuberculosis: 'NO', syphilis: 'NO',
    illegalDrugs: 'NO', bloodTransfusion: 'NO', medications: 'Multivitamins (Prenatal)',
    hivRiskPartner: false, serologyHivStatus: 'pending', serologyHepBStatus: 'pending',
  },
  {
    id: 'sa2', tempRefId: 'TEMP-2024-0902', submittedAt: '2024-04-19 09:14:55',
    firstName: 'Jennifer', lastName: 'Bautista', dateOfBirth: '1990-03-22',
    address: '23 Kalayaan Ave, Makati City', phone: '+63 918 987 6543',
    program: 'supsup_todo', status: 'pending_review',
    consentSigned: true, hepatitisB: 'NO', tuberculosis: 'NO', syphilis: 'NO',
    illegalDrugs: 'NO', bloodTransfusion: 'YES', medications: 'Iron supplements, Contraceptive pills',
    hivRiskPartner: false, serologyHivStatus: 'pending', serologyHepBStatus: 'pending',
  },
  {
    id: 'sa3', tempRefId: 'TEMP-2024-0903', submittedAt: '2024-04-19 10:05:33',
    firstName: 'Gloria', lastName: 'Navarro', dateOfBirth: '1988-11-09',
    address: '78 Buendia Extension, Makati City', phone: '+63 920 555 8877',
    program: 'moms_act', status: 'pending_review',
    consentSigned: true, hepatitisB: 'YES', tuberculosis: 'NO', syphilis: 'NO',
    illegalDrugs: 'NO', bloodTransfusion: 'NO', medications: 'Herbal supplements',
    hivRiskPartner: true, serologyHivStatus: 'pending', serologyHepBStatus: 'flagged',
  },
  {
    id: 'sa4', tempRefId: 'TEMP-2024-0898', submittedAt: '2024-04-18 14:20:00',
    firstName: 'Marites', lastName: 'Ocampo', dateOfBirth: '1995-05-30',
    address: '102 Pasay Road, Makati City', phone: '+63 916 222 3344',
    program: 'milky_way', status: 'approved', dtn: 'DTN-2024-009',
    consentSigned: true, hepatitisB: 'NO', tuberculosis: 'NO', syphilis: 'NO',
    illegalDrugs: 'NO', bloodTransfusion: 'NO', medications: 'Prenatal vitamins',
    hivRiskPartner: false, serologyHivStatus: 'negative', serologyHepBStatus: 'negative',
    reviewedBy: 'Nurse Dela Cruz', reviewedAt: '2024-04-18 16:00:00',
  },
  {
    id: 'sa5', tempRefId: 'TEMP-2024-0895', submittedAt: '2024-04-17 11:00:00',
    firstName: 'Cristina', lastName: 'Pascual', dateOfBirth: '1987-09-15',
    address: '55 Zobel Roxas, Makati City', phone: '+63 915 444 5566',
    program: 'supsup_todo', status: 'temp_deferred', dtn: 'DTN-2024-010',
    consentSigned: true, hepatitisB: 'YES', tuberculosis: 'NO', syphilis: 'NO',
    illegalDrugs: 'NO', bloodTransfusion: 'NO', medications: 'Hepatitis B treatment',
    hivRiskPartner: false, serologyHivStatus: 'negative', serologyHepBStatus: 'flagged',
    reviewedBy: 'Nurse Santos', reviewedAt: '2024-04-17 15:30:00',
    deferralType: 'temporary',
    deferralNotes: 'Donor tested positive for Hepatitis B surface antigen. Temporary deferral pending treatment completion and re-testing. Advised to return after 6-month treatment course.',
  },
];

export const mockDonors: Donor[] = [
  { id: '1', dtn: 'DTN-2024-001', firstName: 'Maria', lastName: 'Santos', registrationDate: '2024-01-15', medicalStatus: 'eligible', operationalProgram: 'milky_way', eligibilityState: 'active', consentSigned: true, hivStatus: 'negative', hepBStatus: 'negative' },
  { id: '2', dtn: 'DTN-2024-002', firstName: 'Ana', lastName: 'Reyes', registrationDate: '2024-01-22', medicalStatus: 'eligible', operationalProgram: 'supsup_todo', eligibilityState: 'active', consentSigned: true, hivStatus: 'negative', hepBStatus: 'negative' },
  { id: '3', dtn: 'DTN-2024-003', firstName: 'Lorna', lastName: 'Cruz', registrationDate: '2024-02-03', medicalStatus: 'temp_deferred', operationalProgram: 'milky_way', eligibilityState: 'on_hold', consentSigned: true, hivStatus: 'flagged', hepBStatus: 'pending' },
  { id: '4', dtn: 'DTN-2024-004', firstName: 'Cecilia', lastName: 'Mendoza', registrationDate: '2024-02-14', medicalStatus: 'eligible', operationalProgram: 'moms_act', eligibilityState: 'active', consentSigned: true, hivStatus: 'negative', hepBStatus: 'negative' },
  { id: '5', dtn: 'DTN-2024-005', firstName: 'Rosario', lastName: 'Dela Cruz', registrationDate: '2024-03-01', medicalStatus: 'eligible', operationalProgram: 'milky_way', eligibilityState: 'active', consentSigned: true, hivStatus: 'negative', hepBStatus: 'negative' },
  { id: '6', dtn: 'DTN-2024-006', firstName: 'Ligaya', lastName: 'Fernandez', registrationDate: '2024-03-10', medicalStatus: 'permanently_deferred', operationalProgram: 'supsup_todo', eligibilityState: 'terminated', consentSigned: true, hivStatus: 'flagged', hepBStatus: 'flagged' },
  { id: '7', dtn: 'DTN-2024-007', firstName: 'Dolores', lastName: 'Ramos', registrationDate: '2024-03-18', medicalStatus: 'eligible', operationalProgram: 'moms_act', eligibilityState: 'active', consentSigned: true, hivStatus: 'negative', hepBStatus: 'negative' },
  { id: '8', dtn: 'DTN-2024-008', firstName: 'Esperanza', lastName: 'Villanueva', registrationDate: '2024-04-02', medicalStatus: 'eligible', operationalProgram: 'milky_way', eligibilityState: 'active', consentSigned: true, hivStatus: 'negative', hepBStatus: 'pending' },
];

export const mockCollections: CollectionRecord[] = [
  { id: '1', ctn: 'CTN-2024-0101', dtn: 'DTN-2024-001', donorName: 'Maria Santos', volumeMl: 180, arrivalTempC: 4.2, collectionDate: '2024-04-10', program: 'milky_way', batchId: 'BATCH-001' },
  { id: '2', ctn: 'CTN-2024-0102', dtn: 'DTN-2024-002', donorName: 'Ana Reyes', volumeMl: 220, arrivalTempC: 3.8, collectionDate: '2024-04-10', program: 'supsup_todo', batchId: 'BATCH-001' },
  { id: '3', ctn: 'CTN-2024-0103', dtn: 'DTN-2024-004', donorName: 'Cecilia Mendoza', volumeMl: 150, arrivalTempC: 4.5, collectionDate: '2024-04-11', program: 'moms_act', batchId: 'BATCH-002' },
  { id: '4', ctn: 'CTN-2024-0104', dtn: 'DTN-2024-005', donorName: 'Rosario Dela Cruz', volumeMl: 200, arrivalTempC: 4.1, collectionDate: '2024-04-12', program: 'milky_way', batchId: 'BATCH-002' },
  { id: '5', ctn: 'CTN-2024-0105', dtn: 'DTN-2024-007', donorName: 'Dolores Ramos', volumeMl: 175, arrivalTempC: 3.9, collectionDate: '2024-04-13', program: 'supsup_todo', batchId: 'BATCH-003' },
  { id: '6', ctn: 'CTN-2024-0106', dtn: 'DTN-2024-008', donorName: 'Esperanza Villanueva', volumeMl: 195, arrivalTempC: 4.3, collectionDate: '2024-04-14', program: 'moms_act' },
];

const defaultIntervals = [
  { minute: 0, tempC: null, recorded: false },
  { minute: 5, tempC: null, recorded: false },
  { minute: 10, tempC: null, recorded: false },
  { minute: 15, tempC: null, recorded: false },
  { minute: 20, tempC: null, recorded: false },
  { minute: 25, tempC: null, recorded: false },
  { minute: 30, tempC: null, recorded: false },
];

export const mockBatches: MilkBatch[] = [
  { id: '1', batchId: 'BATCH-001', ctn: 'CTN-2024-0101,CTN-2024-0102', volumeMl: 400, status: 'pasteurized', timeIn: '08:00', timeOut: '08:30', bottleCount: 4, intervals: [
    { minute: 0, tempC: 62.6, recorded: true }, { minute: 5, tempC: 62.7, recorded: true }, { minute: 10, tempC: 62.8, recorded: true },
    { minute: 15, tempC: 62.9, recorded: true }, { minute: 20, tempC: 63.0, recorded: true }, { minute: 25, tempC: 62.8, recorded: true }, { minute: 30, tempC: 62.7, recorded: true },
  ], pasteurizationTemp: 62.7, labResult: 'pass', expirationDate: '2024-10-10', createdDate: '2024-04-10' },
  { id: '2', batchId: 'BATCH-002', ctn: 'CTN-2024-0103,CTN-2024-0104', volumeMl: 350, status: 'quarantined', timeIn: '09:15', timeOut: '09:45', bottleCount: 3, intervals: [
    { minute: 0, tempC: 62.5, recorded: true }, { minute: 5, tempC: 62.5, recorded: true }, { minute: 10, tempC: 62.4, recorded: true },
    { minute: 15, tempC: 62.5, recorded: true }, { minute: 20, tempC: 62.6, recorded: true }, { minute: 25, tempC: 62.5, recorded: true }, { minute: 30, tempC: 62.5, recorded: true },
  ], pasteurizationTemp: 62.5, labResult: 'quarantine', expirationDate: '2024-10-11', createdDate: '2024-04-11' },
  { id: '3', batchId: 'BATCH-003', ctn: 'CTN-2024-0105', volumeMl: 175, status: 'raw', timeIn: '', timeOut: '', bottleCount: 2, intervals: defaultIntervals, pasteurizationTemp: undefined, labResult: null, expirationDate: '2024-10-13', createdDate: '2024-04-13' },
  { id: '4', batchId: 'BATCH-004', ctn: 'CTN-2024-0106', volumeMl: 195, status: 'rejected', timeIn: '07:30', timeOut: '08:00', bottleCount: 2, intervals: [
    { minute: 0, tempC: 62.5, recorded: true }, { minute: 5, tempC: 62.3, recorded: true }, { minute: 10, tempC: 62.1, recorded: true },
    { minute: 15, tempC: 62.0, recorded: true }, { minute: 20, tempC: 61.9, recorded: true }, { minute: 25, tempC: 62.1, recorded: true }, { minute: 30, tempC: 62.2, recorded: true },
  ], pasteurizationTemp: 62.5, labResult: 'reject', expirationDate: '2024-10-14', createdDate: '2024-04-14' },
  { id: '5', batchId: 'BATCH-005', ctn: 'CTN-2024-0107', volumeMl: 280, status: 'pasteurized', timeIn: '10:00', timeOut: '10:30', bottleCount: 3, intervals: [
    { minute: 0, tempC: 62.7, recorded: true }, { minute: 5, tempC: 62.8, recorded: true }, { minute: 10, tempC: 63.0, recorded: true },
    { minute: 15, tempC: 62.9, recorded: true }, { minute: 20, tempC: 62.8, recorded: true }, { minute: 25, tempC: 62.9, recorded: true }, { minute: 30, tempC: 63.0, recorded: true },
  ], pasteurizationTemp: 63.0, labResult: 'pass', expirationDate: '2024-11-01', createdDate: '2024-04-15' },
  { id: '6', batchId: 'BATCH-006', ctn: 'CTN-2024-0108', volumeMl: 210, status: 'pasteurized', timeIn: '11:00', timeOut: '11:30', bottleCount: 2, intervals: [
    { minute: 0, tempC: 62.6, recorded: true }, { minute: 5, tempC: 62.7, recorded: true }, { minute: 10, tempC: 62.8, recorded: true },
    { minute: 15, tempC: 62.8, recorded: true }, { minute: 20, tempC: 62.7, recorded: true }, { minute: 25, tempC: 62.8, recorded: true }, { minute: 30, tempC: 62.8, recorded: true },
  ], pasteurizationTemp: 62.8, labResult: 'pass', expirationDate: '2024-11-05', createdDate: '2024-04-18' },
];

export const mockLabResults: LabResult[] = [
  { id: 'lr1', batchId: 'BATCH-001', phase: 'pre', totalPlateCount: 8200, coliformCount: 12, phBalance: 6.9, result: 'pass', testedDate: '2024-04-10', testedBy: 'Nurse Dela Cruz' },
  { id: 'lr2', batchId: 'BATCH-001', phase: 'post', totalPlateCount: 0, coliformCount: 0, phBalance: 6.8, result: 'pass', testedDate: '2024-04-10', testedBy: 'Nurse Dela Cruz' },
  { id: 'lr3', batchId: 'BATCH-002', phase: 'pre', totalPlateCount: 9500, coliformCount: 18, phBalance: 7.0, result: 'pass', testedDate: '2024-04-11', testedBy: 'Nurse Santos' },
  { id: 'lr4', batchId: 'BATCH-002', phase: 'post', totalPlateCount: 12000, coliformCount: 25, phBalance: 7.1, result: 'fail', testedDate: '2024-04-12', testedBy: 'Nurse Santos' },
  { id: 'lr5', batchId: 'BATCH-004', phase: 'pre', totalPlateCount: 6000, coliformCount: 10, phBalance: 6.7, result: 'pass', testedDate: '2024-04-14', testedBy: 'Nurse Dela Cruz' },
  { id: 'lr6', batchId: 'BATCH-004', phase: 'post', totalPlateCount: 18000, coliformCount: 30, phBalance: 7.3, result: 'fail', testedDate: '2024-04-14', testedBy: 'Nurse Dela Cruz' },
  { id: 'lr7', batchId: 'BATCH-005', phase: 'post', totalPlateCount: 0, coliformCount: 0, phBalance: 6.8, result: 'pass', testedDate: '2024-04-15', testedBy: 'Nurse Dela Cruz' },
];

export const mockBeneficiaries: Beneficiary[] = [
  {
    id: '1',
    guardianName: 'Jose Reyes',
    infantName: 'Baby Reyes',
    clinicAssignment: 'Makati Medical Center NICU',
    clinicalNeeds: 'Premature birth, 28 weeks gestation, NICU support',
    prescriptionAttached: true,
    coolerCheckCompleted: true,
    priority: 1,
    dispensingHistory: [
      { id: 'd1', beneficiaryId: '1', batchId: 'BATCH-001', volumeMl: 100, date: '2024-04-12', fee: 50, billingStatus: 'paid', safetyCleared: true },
    ]
  },
  {
    id: '2',
    guardianName: 'Mila Torres',
    infantName: 'Baby Torres',
    clinicAssignment: 'Ospital ng Makati',
    clinicalNeeds: 'Low birth weight, feeding intolerance',
    prescriptionAttached: true,
    coolerCheckCompleted: true,
    priority: 2,
    dispensingHistory: [
      { id: 'd2', beneficiaryId: '2', batchId: 'BATCH-001', volumeMl: 80, date: '2024-04-13', fee: 0, billingStatus: 'waived', safetyCleared: true },
    ]
  },
  {
    id: '3',
    guardianName: 'Roberto Garcia',
    infantName: 'Baby Garcia',
    clinicAssignment: 'Makati Medical Center NICU',
    clinicalNeeds: 'Post-surgical recovery, NEC prevention',
    prescriptionAttached: false,
    coolerCheckCompleted: false,
    priority: 1,
    dispensingHistory: []
  },
  {
    id: '4',
    guardianName: 'Sandra Lim',
    infantName: 'Baby Lim',
    clinicAssignment: 'Pasay City General Hospital',
    clinicalNeeds: 'Moderate prematurity, 32 weeks',
    prescriptionAttached: true,
    coolerCheckCompleted: true,
    priority: 3,
    dispensingHistory: []
  },
];

export const mockEmailLogs: EmailLog[] = [
  { id: '1', emailId: 'EML-20240412-001', beneficiaryId: '1', targetBatchId: 'BATCH-001', recipientEmail: 'jose.reyes@email.com', guardianName: 'Jose Reyes', subject: 'LACTA BANK — Your Milk Order is Ready for Pickup', status: 'delivered', senderAccount: 'noreply@lactabank.ph', sentAt: '2024-04-12 09:00' },
  { id: '2', emailId: 'EML-20240412-002', beneficiaryId: '2', targetBatchId: 'BATCH-001', recipientEmail: 'mila.torres@email.com', guardianName: 'Mila Torres', subject: 'LACTA BANK — Pickup Schedule Confirmed: BATCH-001', status: 'delivered', senderAccount: 'noreply@lactabank.ph', sentAt: '2024-04-12 09:01' },
  { id: '3', emailId: 'EML-20240415-001', beneficiaryId: '3', targetBatchId: 'BATCH-005', recipientEmail: 'roberto.garcia@email.com', guardianName: 'Roberto Garcia', subject: 'LACTA BANK — Priority Clearance: BATCH-005 Available', status: 'sent', senderAccount: 'noreply@lactabank.ph', sentAt: '2024-04-15 14:30' },
  { id: '4', emailId: 'EML-20240416-001', beneficiaryId: '4', targetBatchId: 'BATCH-005', recipientEmail: 'sandra.lim@email.com', guardianName: 'Sandra Lim', subject: 'LACTA BANK — Action Required: Prescription Documents Missing', status: 'failed', senderAccount: 'noreply@lactabank.ph', sentAt: '2024-04-16 10:00' },
  { id: '5', emailId: 'EML-20240418-001', beneficiaryId: '1', targetBatchId: 'BATCH-006', recipientEmail: 'jose.reyes@email.com', guardianName: 'Jose Reyes', subject: 'LACTA BANK — Additional Stock Available: BATCH-006', status: 'delivered', senderAccount: 'noreply@lactabank.ph', sentAt: '2024-04-18 11:00' },
  { id: '6', emailId: 'EML-20240418-002', beneficiaryId: '2', targetBatchId: 'BATCH-006', recipientEmail: 'mila.torres@email.com', guardianName: 'Mila Torres', subject: 'LACTA BANK — BATCH-006 Cleared for Pickup', status: 'bounced', senderAccount: 'noreply@lactabank.ph', sentAt: '2024-04-18 11:05' },
];

export const mockAuditLogs: AuditLog[] = [
  { id: '1', logId: 'AUD-001', changedBy: 'Nurse Dela Cruz', auditAction: 'INSERT', targetTable: 'DONORS', oldData: 'NULL', newData: '{ dtn: "DTN-2024-008", firstName: "Esperanza", lastName: "Villanueva", medicalStatus: "eligible" }', timestamp: '2024-04-02 08:15:23' },
  { id: '2', logId: 'AUD-002', changedBy: 'Nurse Santos', auditAction: 'UPDATE', targetTable: 'MILK_COLLECTION', oldData: '{ volumeMl: 190 }', newData: '{ volumeMl: 195, arrivalTempC: 4.3 }', timestamp: '2024-04-14 09:30:11' },
  { id: '3', logId: 'AUD-003', changedBy: 'Admin Reyes', auditAction: 'DELETE', targetTable: 'SYSTEM_USERS', oldData: '{ username: "test_user_009", role: "nurse" }', newData: 'NULL', timestamp: '2024-04-14 11:00:45' },
  { id: '4', logId: 'AUD-004', changedBy: 'Nurse Dela Cruz', auditAction: 'UPDATE', targetTable: 'MILK_BATCHES', oldData: '{ status: "raw" }', newData: '{ status: "quarantined", labResult: "quarantine" }', timestamp: '2024-04-11 14:22:09' },
  { id: '5', logId: 'AUD-005', changedBy: 'Nurse Santos', auditAction: 'INSERT', targetTable: 'DISPENSING_LOGS', oldData: 'NULL', newData: '{ batchId: "BATCH-001", beneficiaryId: "1", volumeMl: 100, fee: 50 }', timestamp: '2024-04-12 09:45:00' },
  { id: '6', logId: 'AUD-006', changedBy: 'Admin Reyes', auditAction: 'EXPORT', targetTable: 'SYSTEM_REPORTS', oldData: 'NULL', newData: '{ reportType: "DOH Monthly", period: "April 2024" }', timestamp: '2024-04-15 16:00:33' },
  { id: '7', logId: 'AUD-007', changedBy: 'Admin Reyes', auditAction: 'REVOKE', targetTable: 'SYSTEM_USERS', oldData: '{ status: "active", role: "nurse" }', newData: '{ status: "revoked" }', timestamp: '2024-04-16 10:15:00' },
];

export const mockSystemUsers: SystemUser[] = [
  { id: 'u1', name: 'Nurse Maria Dela Cruz', username: 'nurse_delacruz', role: 'nurse', status: 'active', lastLogin: '2024-04-18 08:00' },
  { id: 'u2', name: 'Nurse Juan Santos', username: 'nurse_santos', role: 'nurse', status: 'active', lastLogin: '2024-04-18 07:45' },
  { id: 'u3', name: 'Admin Ana Reyes', username: 'admin_reyes', role: 'admin', status: 'active', lastLogin: '2024-04-18 09:00' },
  { id: 'u4', name: 'Donor Maria Santos', username: 'donor_santos', role: 'donor', status: 'active', lastLogin: '2024-04-10 10:00' },
  { id: 'u5', name: 'Beneficiary Jose Reyes', username: 'ben_reyes', role: 'beneficiary', status: 'active', lastLogin: '2024-04-12 09:30' },
  { id: 'u6', name: 'Nurse Pedro Cruz', username: 'nurse_cruz', role: 'nurse', status: 'revoked', lastLogin: '2024-03-01 14:00' },
];

export const analyticsMonthlyData = [
  { month: 'Jan', rawMl: 1200, pasteurizedMl: 980, dispensedMl: 820, donors: 12 },
  { month: 'Feb', rawMl: 1400, pasteurizedMl: 1150, dispensedMl: 990, donors: 15 },
  { month: 'Mar', rawMl: 1650, pasteurizedMl: 1380, dispensedMl: 1200, donors: 18 },
  { month: 'Apr', rawMl: 1920, pasteurizedMl: 1600, dispensedMl: 1420, donors: 21 },
  { month: 'May', rawMl: 1750, pasteurizedMl: 1480, dispensedMl: 1310, donors: 20 },
  { month: 'Jun', rawMl: 2100, pasteurizedMl: 1800, dispensedMl: 1650, donors: 24 },
];
