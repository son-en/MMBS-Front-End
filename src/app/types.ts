export type UserRole = 'admin' | 'nurse' | 'donor' | 'beneficiary';
export type MilkStatus = 'raw' | 'quarantined' | 'pasteurized' | 'rejected';
export type OperationalProgram = 'supsup_todo' | 'milky_way' | 'moms_act';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  username: string;
}

export interface Donor {
  id: string;
  dtn: string;
  firstName: string;
  lastName: string;
  registrationDate: string;
  medicalStatus: 'eligible' | 'temp_deferred' | 'permanently_deferred' | 'inactive';
  operationalProgram: OperationalProgram;
  eligibilityState: 'active' | 'on_hold' | 'terminated';
  consentSigned: boolean;
  hivStatus: 'negative' | 'pending' | 'flagged';
  hepBStatus: 'negative' | 'pending' | 'flagged';
}

export interface CollectionRecord {
  id: string;
  ctn: string;
  dtn: string;
  donorName: string;
  volumeMl: number;
  arrivalTempC: number;
  collectionDate: string;
  program: OperationalProgram;
  batchId?: string;
}

export interface PasteurizationInterval {
  minute: number;
  tempC: number | null;
  recorded: boolean;
}

export interface MilkBatch {
  id: string;
  batchId: string;
  ctn: string;
  volumeMl: number;
  status: MilkStatus;
  timeIn?: string;
  timeOut?: string;
  bottleCount?: number;
  intervals: PasteurizationInterval[];
  pasteurizationTemp?: number;
  labResult?: 'pass' | 'quarantine' | 'reject' | null;
  expirationDate: string;
  createdDate: string;
}

export interface LabResult {
  id: string;
  batchId: string;
  phase: 'pre' | 'post';
  totalPlateCount: number;
  coliformCount: number;
  phBalance: number;
  result: 'pass' | 'fail' | 'pending';
  testedDate: string;
  testedBy: string;
}

export interface Beneficiary {
  id: string;
  guardianName: string;
  infantName: string;
  clinicAssignment: string;
  clinicalNeeds: string;
  prescriptionAttached: boolean;
  coolerCheckCompleted: boolean;
  priority: 1 | 2 | 3;
  dispensingHistory: DispensingRecord[];
}

export interface DispensingRecord {
  id: string;
  beneficiaryId: string;
  batchId: string;
  volumeMl: number;
  date: string;
  fee: number;
  billingStatus: 'paid' | 'pending' | 'waived';
  safetyCleared: boolean;
}

export interface EmailLog {
  id: string;
  emailId: string;
  beneficiaryId: string;
  targetBatchId: string;
  recipientEmail: string;
  guardianName: string;
  subject: string;
  status: 'sent' | 'delivered' | 'failed' | 'bounced';
  senderAccount: string;
  sentAt: string;
}

export interface AuditLog {
  id: string;
  logId: string;
  changedBy: string;
  auditAction: string;
  targetTable: string;
  oldData: string;
  newData: string;
  timestamp: string;
}

export type ScreeningStatus = 'pending_review' | 'approved' | 'temp_deferred' | 'permanently_deferred';

export interface ScreeningApplication {
  id: string;
  tempRefId: string;
  submittedAt: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  phone: string;
  program: OperationalProgram;
  status: ScreeningStatus;
  dtn?: string;
  consentSigned: boolean;
  // Clinical flags from form
  hepatitisB: string;
  tuberculosis: string;
  syphilis: string;
  illegalDrugs: string;
  bloodTransfusion: string;
  medications: string;
  hivRiskPartner: boolean;
  serologyHivStatus: 'negative' | 'pending' | 'flagged';
  serologyHepBStatus: 'negative' | 'pending' | 'flagged';
  // Review
  reviewedBy?: string;
  reviewedAt?: string;
  deferralType?: 'temporary' | 'permanent';
  deferralNotes?: string;
}

export interface SystemUser {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  status: 'active' | 'revoked';
  lastLogin: string;
}
