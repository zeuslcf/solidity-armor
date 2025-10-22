export type Scan = {
  id: string;
  userId: string;
  contractName: string;
  status: 'Pending' | 'Analyzing' | 'Completed' | 'Failed';
  riskSummary: 'Low' | 'Medium' | 'High' | 'None' | null;
  vulnerabilities: Vulnerability[];
  summary: string;
  sourceCode: string;
  createdAt: string; // ISO 8601 string format
  updatedAt?: string; // ISO 8601 string format
};

export type Vulnerability = {
  type: string;
  description: string;
  riskScore: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  suggestedFix?: string;
};
