// CORE AI - PERMIT GENERATOR
// Automatically generates permit applications

export interface PermitRequest {
  country: string;
  region: string;
  projectType: 'residential' | 'commercial' | 'industrial';
  systemSize: number;
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  owner: {
    name: string;
    email: string;
    phone: string;
    idNumber?: string;
  };
  installer: {
    name: string;
    licenseNumber: string;
    contact: string;
  };
}

export interface PermitResponse {
  permits: GeneratedPermit[];
  requirements: PermitRequirement[];
  estimatedProcessingTime: number;
  estimatedFees: number;
  submissionInstructions: string[];
}

export interface GeneratedPermit {
  id: string;
  name: string;
  authority: string;
  formData: Record<string, any>;
  pdfUrl: string;
  filledForm: string;
  status: 'draft' | 'ready' | 'submitted' | 'approved' | 'rejected';
  trackingNumber?: string;
}

export interface PermitRequirement {
  document: string;
  description: string;
  required: boolean;
  template?: string;
}

class PermitGeneratorAI {
  private permits: Map<string, GeneratedPermit> = new Map();
  
  async generatePermits(request: PermitRequest): Promise<PermitResponse> {
    const permits: GeneratedPermit[] = [];
    
    // Generate country-specific permits
    switch (request.country.toLowerCase()) {
      case 'kenya':
        permits.push(await this.generateKenyaPermit(request));
        break;
      case 'nigeria':
        permits.push(await this.generateNigeriaPermit(request));
        break;
      case 'south africa':
        permits.push(await this.generateSouthAfricaPermit(request));
        break;
      default:
        permits.push(await this.generateGenericPermit(request));
    }
    
    // Get requirements
    const requirements = this.getPermitRequirements(request.country);
    
    // Calculate fees and processing time
    const estimatedFees = this.calculateFees(request);
    const estimatedProcessingTime = this.calculateProcessingTime(request);
    
    // Generate submission instructions
    const submissionInstructions = this.generateSubmissionInstructions(request.country);
    
    return {
      permits,
      requirements,
      estimatedProcessingTime,
      estimatedFees,
      submissionInstructions
    };
  }
  
  private async generateKenyaPermit(request: PermitRequest): Promise<GeneratedPermit> {
    const formData = {
      applicantName: request.owner.name,
      applicantId: request.owner.idNumber || '',
      contactEmail: request.owner.email,
      contactPhone: request.owner.phone,
      propertyAddress: request.location.address,
      systemCapacity: request.systemSize,
      installerName: request.installer.name,
      installerLicense: request.installer.licenseNumber,
      equipmentList: this.generateEquipmentList(request),
      singleLineDiagram: true,
      structuralAssessment: true,
      date: new Date().toISOString()
    };
    
    const permit: GeneratedPermit = {
      id: this.generateId(),
      name: 'EPRA Solar Generation License',
      authority: 'Energy and Petroleum Regulatory Authority (EPRA)',
      formData,
      pdfUrl: '/permits/kenya_epra_template.pdf',
      filledForm: this.fillFormTemplate('kenya_epra', formData),
      status: 'draft'
    };
    
    this.permits.set(permit.id, permit);
    return permit;
  }
  
  private async generateNigeriaPermit(request: PermitRequest): Promise<GeneratedPermit> {
    const formData = {
      applicantName: request.owner.name,
      businessName: request.projectType === 'commercial' ? request.owner.name : '',
      address: request.location.address,
      email: request.owner.email,
      phone: request.owner.phone,
      proposedCapacity: request.systemSize,
      technology: 'Solar PV',
      installer: request.installer.name,
      nercLicense: request.installer.licenseNumber,
      proposedLocation: request.location.address,
      environmentalImpact: request.systemSize > 100 ? 'Required' : 'Not Required'
    };
    
    const permit: GeneratedPermit = {
      id: this.generateId(),
      name: 'NERC Generation License Application',
      authority: 'Nigerian Electricity Regulatory Commission (NERC)',
      formData,
      pdfUrl: '/permits/nigeria_nerc_template.pdf',
      filledForm: this.fillFormTemplate('nigeria_nerc', formData),
      status: 'draft'
    };
    
    this.permits.set(permit.id, permit);
    return permit;
  }
  
  private async generateSouthAfricaPermit(request: PermitRequest): Promise<GeneratedPermit> {
    const formData = {
      applicantName: request.owner.name,
      applicantType: request.projectType,
      premisesAddress: request.location.address,
      contactDetails: request.owner.email,
      systemCapacity: request.systemSize,
      inverterType: 'Hybrid',
      installerDetails: request.installer.name,
      registrationNumber: request.installer.licenseNumber,
      sabsCompliance: 'Yes',
      signedOffBy: request.installer.name,
      date: new Date().toISOString()
    };
    
    const permit: GeneratedPermit = {
      id: this.generateId(),
      name: 'SSEG Registration Application',
      authority: 'NERSA / Local Municipality',
      formData,
      pdfUrl: '/permits/southafrica_sseg_template.pdf',
      filledForm: this.fillFormTemplate('southafrica_sseg', formData),
      status: 'draft'
    };
    
    this.permits.set(permit.id, permit);
    return permit;
  }
  
  private async generateGenericPermit(request: PermitRequest): Promise<GeneratedPermit> {
    const formData = {
      applicantName: request.owner.name,
      propertyAddress: request.location.address,
      systemSize: request.systemSize,
      installerName: request.installer.name,
      installerLicense: request.installer.licenseNumber,
      applicationDate: new Date().toISOString()
    };
    
    const permit: GeneratedPermit = {
      id: this.generateId(),
      name: 'Electrical Installation Permit',
      authority: 'Local Building Department',
      formData,
      pdfUrl: '/permits/generic_template.pdf',
      filledForm: this.fillFormTemplate('generic', formData),
      status: 'draft'
    };
    
    this.permits.set(permit.id, permit);
    return permit;
  }
  
  private getPermitRequirements(country: string): PermitRequirement[] {
    const requirements: Record<string, PermitRequirement[]> = {
      kenya: [
        { document: 'Site Plan', description: 'Detailed site layout showing panel placement', required: true, template: '/templates/site_plan.pdf' },
        { document: 'Single Line Diagram', description: 'Electrical schematic of the system', required: true, template: '/templates/sld_template.pdf' },
        { document: 'Structural Assessment', description: 'Engineer's report on roof capacity', required: true },
        { document: 'Equipment Datasheets', description: 'Specifications for all components', required: true },
        { document: 'Installer Certification', description: 'Proof of installer qualifications', required: true },
        { document: 'Insurance Certificate', description: 'Public liability insurance', required: false }
      ],
      nigeria: [
        { document: 'NERC Application Form', description: 'Completed NERC form', required: true, template: '/templates/nerc_form.pdf' },
        { document: 'Technical Specification', description: 'System technical details', required: true },
        { document: 'Site Assessment Report', description: 'Site inspection report', required: true },
        { document: 'Environmental Impact', description: 'For systems >100kW', required: false }
      ],
      'south africa': [
        { document: 'SSEG Application', description: 'Small-scale embedded generation form', required: true, template: '/templates/sseg_form.pdf' },
        { document: 'Electrical Diagram', description: 'Single line diagram', required: true },
        { document: 'Compliance Certificate', description: 'SABS compliance', required: true },
        { document: 'Municipal Approval', description: 'Local municipality consent', required: true }
      ]
    };
    
    return requirements[country.toLowerCase()] || requirements.kenya;
  }
  
  private calculateFees(request: PermitRequest): number {
    const baseFees: Record<string, number> = {
      kenya: 25000,
      nigeria: 50000,
      'south africa': 35000
    };
    
    let fee = baseFees[request.country.toLowerCase()] || 15000;
    
    // Additional fees based on system size
    if (request.systemSize > 100) fee += 25000;
    else if (request.systemSize > 50) fee += 10000;
    
    return fee;
  }
  
  private calculateProcessingTime(request: PermitRequest): number {
    const baseTimes: Record<string, number> = {
      kenya: 30,
      nigeria: 45,
      'south africa': 60
    };
    
    let days = baseTimes[request.country.toLowerCase()] || 21;
    
    if (request.systemSize > 100) days += 15;
    else if (request.systemSize > 50) days += 7;
    
    return days;
  }
  
  private generateSubmissionInstructions(country: string): string[] {
    const instructions: Record<string, string[]> = {
      kenya: [
        'Complete all forms in the EPRA online portal',
        'Upload all required documents in PDF format',
        'Pay the application fee via M-Pesa or bank transfer',
        'Submit application and wait for inspection',
        'Inspection typically scheduled within 14 days'
      ],
      nigeria: [
        'Submit application through NERC's online portal',
        'Pay processing fee via REMITA',
        'Await technical assessment (2-3 weeks)',
        'Complete site inspection when scheduled',
        'Receive generation license upon approval'
      ],
      'south africa': [
        'Submit SSEG application to local municipality',
        'Provide NERSA registration confirmation',
        'Arrange for municipal inspection',
        'Receive approval letter (typically 4-6 weeks)'
      ]
    };
    
    return instructions[country.toLowerCase()] || [
      'Submit application to local building department',
      'Pay permit fee',
      'Schedule inspection after installation',
      'Receive final approval'
    ];
  }
  
  private generateEquipmentList(request: PermitRequest): string[] {
    const panelCount = Math.ceil(request.systemSize / 0.485);
    const batteryKwh = request.systemSize * 1.5;
    
    return [
      `${panelCount} x JA Solar 485W Solar Panels`,
      `1 x Deye ${Math.ceil(request.systemSize)}kW Hybrid Inverter`,
      `${batteryKwh}kWh Lithium Battery Storage`,
      'Mounting Structure and Hardware',
      'DC/AC Protection and Isolation Equipment'
    ];
  }
  
  private fillFormTemplate(template: string, data: Record<string, any>): string {
    // In production, this would generate a filled PDF
    return JSON.stringify(data, null, 2);
  }
  
  async getPermit(permitId: string): Promise<GeneratedPermit | null> {
    return this.permits.get(permitId) || null;
  }
  
  async updatePermit(permitId: string, updates: Partial<GeneratedPermit>): Promise<GeneratedPermit | null> {
    const permit = await this.getPermit(permitId);
    if (!permit) return null;
    
    const updated = { ...permit, ...updates };
    this.permits.set(permitId, updated);
    return updated;
  }
  
  async submitPermit(permitId: string): Promise<GeneratedPermit> {
    const permit = await this.getPermit(permitId);
    if (!permit) throw new Error('Permit not found');
    
    permit.status = 'submitted';
    permit.trackingNumber = `TRK${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    this.permits.set(permitId, permit);
    return permit;
  }
  
  async getPermitStatus(permitId: string): Promise<{ status: string; trackingNumber?: string; estimatedCompletion: Date }> {
    const permit = await this.getPermit(permitId);
    if (!permit) throw new Error('Permit not found');
    
    const estimatedCompletion = new Date();
    estimatedCompletion.setDate(estimatedCompletion.getDate() + 30);
    
    return {
      status: permit.status,
      trackingNumber: permit.trackingNumber,
      estimatedCompletion
    };
  }
  
  async getRequiredDocuments(country: string, systemSize: number): Promise<{
    mandatory: string[];
    optional: string[];
    templates: Record<string, string>;
  }> {
    const requirements = this.getPermitRequirements(country);
    
    return {
      mandatory: requirements.filter(r => r.required).map(r => r.document),
      optional: requirements.filter(r => !r.required).map(r => r.document),
      templates: Object.fromEntries(
        requirements.filter(r => r.template).map(r => [r.document, r.template!])
      )
    };
  }
  
  private generateId(): string {
    return `permit_${Date.now()}_${Math.random().toString(36).substr(2, 10)}`;
  }
}

export const permitGeneratorAI = new PermitGeneratorAI();