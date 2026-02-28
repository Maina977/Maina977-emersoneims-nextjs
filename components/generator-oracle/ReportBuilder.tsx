/**
 * GENERATOR ORACLE - REPORT BUILDER
 * Comprehensive diagnostic report builder UI
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

'use client';

import React, { useState, useCallback } from 'react';
import {
  FileText,
  User,
  MapPin,
  Settings,
  Camera,
  DollarSign,
  Download,
  Printer,
  Send,
  X,
  Plus,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import SignatureCapture from './SignatureCapture';
import {
  DiagnosticReport,
  generateReportId,
  printReport,
  generatePDFBlob,
} from '@/lib/generator-oracle/diagnosticReportPDF';
import type { AIAnalysisResult } from '@/lib/generator-oracle/ai-diagnostic-engine';

interface ReportBuilderProps {
  diagnosis: AIAnalysisResult;
  controllerBrand?: string;
  controllerModel?: string;
  onClose: () => void;
  onSave?: (report: DiagnosticReport) => void;
}

type ReportSection = 'info' | 'equipment' | 'customer' | 'photos' | 'parts' | 'signatures' | 'preview';

export default function ReportBuilder({
  diagnosis,
  controllerBrand,
  controllerModel,
  onClose,
  onSave,
}: ReportBuilderProps) {
  const [activeSection, setActiveSection] = useState<ReportSection>('info');
  const [isSaving, setIsSaving] = useState(false);
  const [showTechSignature, setShowTechSignature] = useState(false);
  const [showCustomerSignature, setShowCustomerSignature] = useState(false);

  // Report data state
  const [report, setReport] = useState<Partial<DiagnosticReport>>({
    reportId: generateReportId(),
    generatedAt: new Date().toISOString(),
    diagnosis,
    equipment: {
      type: 'generator',
      brand: controllerBrand || '',
      model: controllerModel || '',
    },
    photos: [],
    partsQuoted: [],
  });

  const updateReport = useCallback((updates: Partial<DiagnosticReport>) => {
    setReport(prev => ({ ...prev, ...updates }));
  }, []);

  const updateEquipment = useCallback((field: string, value: string | number) => {
    setReport(prev => ({
      ...prev,
      equipment: { ...prev.equipment, [field]: value } as DiagnosticReport['equipment'],
    }));
  }, []);

  const updateCustomer = useCallback((field: string, value: string) => {
    setReport(prev => ({
      ...prev,
      customer: { ...prev.customer, [field]: value } as DiagnosticReport['customer'],
    }));
  }, []);

  const updateTechnician = useCallback((field: string, value: string) => {
    setReport(prev => ({
      ...prev,
      technician: { ...prev.technician, [field]: value } as DiagnosticReport['technician'],
    }));
  }, []);

  const addPart = useCallback(() => {
    setReport(prev => ({
      ...prev,
      partsQuoted: [
        ...(prev.partsQuoted || []),
        { name: '', partNumber: '', quantity: 1, unitPrice: 0 },
      ],
    }));
  }, []);

  const updatePart = useCallback((index: number, field: string, value: string | number) => {
    setReport(prev => {
      const parts = [...(prev.partsQuoted || [])];
      parts[index] = { ...parts[index], [field]: value };
      return { ...prev, partsQuoted: parts };
    });
  }, []);

  const removePart = useCallback((index: number) => {
    setReport(prev => ({
      ...prev,
      partsQuoted: prev.partsQuoted?.filter((_, i) => i !== index),
    }));
  }, []);

  const calculateTotal = useCallback(() => {
    return report.partsQuoted?.reduce((sum, part) => {
      return sum + (part.quantity * part.unitPrice);
    }, 0) || 0;
  }, [report.partsQuoted]);

  const handlePrint = useCallback(async () => {
    if (!report.diagnosis) return;
    await printReport(report as DiagnosticReport);
  }, [report]);

  const handleDownload = useCallback(async () => {
    if (!report.diagnosis) return;
    setIsSaving(true);
    try {
      const blob = await generatePDFBlob(report as DiagnosticReport);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diagnostic-report-${report.reportId}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setIsSaving(false);
    }
  }, [report]);

  const handleSave = useCallback(() => {
    if (onSave && report.diagnosis) {
      updateReport({ totalEstimateKES: calculateTotal() });
      onSave(report as DiagnosticReport);
    }
  }, [onSave, report, updateReport, calculateTotal]);

  const sections: { id: ReportSection; label: string; icon: React.ReactNode }[] = [
    { id: 'info', label: 'Basic Info', icon: <FileText className="w-4 h-4" /> },
    { id: 'equipment', label: 'Equipment', icon: <Settings className="w-4 h-4" /> },
    { id: 'customer', label: 'Customer', icon: <User className="w-4 h-4" /> },
    { id: 'photos', label: 'Photos', icon: <Camera className="w-4 h-4" /> },
    { id: 'parts', label: 'Parts Quote', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'signatures', label: 'Signatures', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'preview', label: 'Preview', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">Diagnostic Report Builder</h2>
            <p className="text-sm text-gray-400">Report ID: {report.reportId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-700 px-4">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap ${
                activeSection === section.id
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Basic Info */}
          {activeSection === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Technician Name
                </label>
                <input
                  type="text"
                  value={report.technician?.name || ''}
                  onChange={e => updateTechnician('name', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Enter technician name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Technician Phone
                </label>
                <input
                  type="tel"
                  value={report.technician?.phone || ''}
                  onChange={e => updateTechnician('phone', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="+254 7XX XXX XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Site Location
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={report.siteLocation?.address || ''}
                    onChange={e => updateReport({
                      siteLocation: { ...report.siteLocation, address: e.target.value }
                    })}
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="Enter site address"
                  />
                  <button className="px-3 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500">
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={report.notes || ''}
                  onChange={e => updateReport({ notes: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white h-24"
                  placeholder="Any additional observations or notes..."
                />
              </div>
            </div>
          )}

          {/* Equipment */}
          {activeSection === 'equipment' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Equipment Type
                  </label>
                  <select
                    value={report.equipment?.type || 'generator'}
                    onChange={e => updateEquipment('type', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="generator">Generator</option>
                    <option value="ats">ATS (Transfer Switch)</option>
                    <option value="ups">UPS</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Brand</label>
                  <input
                    type="text"
                    value={report.equipment?.brand || ''}
                    onChange={e => updateEquipment('brand', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="e.g., Cummins, CAT, FG Wilson"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Model</label>
                  <input
                    type="text"
                    value={report.equipment?.model || ''}
                    onChange={e => updateEquipment('model', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="e.g., C150D5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    value={report.equipment?.serialNumber || ''}
                    onChange={e => updateEquipment('serialNumber', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="Enter serial number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Engine Hours
                  </label>
                  <input
                    type="number"
                    value={report.equipment?.engineHours || ''}
                    onChange={e => updateEquipment('engineHours', parseInt(e.target.value) || 0)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="e.g., 5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    kVA Rating
                  </label>
                  <input
                    type="number"
                    value={report.equipment?.kvaRating || ''}
                    onChange={e => updateEquipment('kvaRating', parseInt(e.target.value) || 0)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="e.g., 150"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Customer */}
          {activeSection === 'customer' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={report.customer?.name || ''}
                  onChange={e => updateCustomer('name', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={report.customer?.company || ''}
                  onChange={e => updateCustomer('company', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Enter company name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={report.customer?.phone || ''}
                    onChange={e => updateCustomer('phone', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={report.customer?.email || ''}
                    onChange={e => updateCustomer('email', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="customer@company.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Photos */}
          {activeSection === 'photos' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Add photos of the equipment or fault</p>
                <button className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add Photos
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Photo capture will be available after Phase 5 implementation
                </p>
              </div>
              {report.photos && report.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {report.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-video bg-gray-800 rounded-lg">
                      <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                      <button
                        onClick={() => updateReport({
                          photos: report.photos?.filter((_, i) => i !== index)
                        })}
                        className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Parts Quote */}
          {activeSection === 'parts' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Parts & Labor Quote</h3>
                <button
                  onClick={addPart}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 rounded-lg text-white text-sm hover:bg-blue-500"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              {report.partsQuoted && report.partsQuoted.length > 0 ? (
                <div className="space-y-3">
                  {report.partsQuoted.map((part, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-3 grid grid-cols-12 gap-2 items-center">
                      <input
                        type="text"
                        value={part.name}
                        onChange={e => updatePart(index, 'name', e.target.value)}
                        className="col-span-4 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        placeholder="Part name"
                      />
                      <input
                        type="text"
                        value={part.partNumber || ''}
                        onChange={e => updatePart(index, 'partNumber', e.target.value)}
                        className="col-span-2 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        placeholder="Part #"
                      />
                      <input
                        type="number"
                        value={part.quantity}
                        onChange={e => updatePart(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="col-span-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm text-center"
                        min="1"
                      />
                      <input
                        type="number"
                        value={part.unitPrice}
                        onChange={e => updatePart(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="col-span-2 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                        placeholder="Unit price"
                      />
                      <div className="col-span-2 text-right text-white font-medium">
                        KES {(part.quantity * part.unitPrice).toLocaleString()}
                      </div>
                      <button
                        onClick={() => removePart(index)}
                        className="col-span-1 p-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="bg-orange-900/30 border border-orange-700 rounded-lg p-4 flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">Total Estimate</span>
                    <span className="text-2xl font-bold text-orange-500">
                      KES {calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No parts added yet. Click "Add Item" to add parts or labor.
                </div>
              )}
            </div>
          )}

          {/* Signatures */}
          {activeSection === 'signatures' && (
            <div className="space-y-6">
              {/* Technician Signature */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Technician Signature</h3>
                {report.technician?.signature ? (
                  <div className="bg-white rounded-lg p-4 relative">
                    <img src={report.technician.signature} alt="Technician signature" className="max-h-24" />
                    <button
                      onClick={() => updateTechnician('signature', '')}
                      className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : showTechSignature ? (
                  <SignatureCapture
                    title="Technician Signature"
                    description="Sign to confirm the diagnosis"
                    onSave={(sig) => {
                      updateTechnician('signature', sig);
                      setShowTechSignature(false);
                    }}
                    onCancel={() => setShowTechSignature(false)}
                  />
                ) : (
                  <button
                    onClick={() => setShowTechSignature(true)}
                    className="w-full py-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-blue-500 hover:text-blue-400"
                  >
                    Click to sign
                  </button>
                )}
              </div>

              {/* Customer Signature */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Customer Signature</h3>
                {report.customer?.signature ? (
                  <div className="bg-white rounded-lg p-4 relative">
                    <img src={report.customer.signature} alt="Customer signature" className="max-h-24" />
                    <button
                      onClick={() => updateCustomer('signature', '')}
                      className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : showCustomerSignature ? (
                  <SignatureCapture
                    title="Customer Signature"
                    description="Customer acknowledges the diagnosis and quote"
                    onSave={(sig) => {
                      updateCustomer('signature', sig);
                      setShowCustomerSignature(false);
                    }}
                    onCancel={() => setShowCustomerSignature(false)}
                  />
                ) : (
                  <button
                    onClick={() => setShowCustomerSignature(true)}
                    className="w-full py-4 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-blue-500 hover:text-blue-400"
                  >
                    Click to sign
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Preview */}
          {activeSection === 'preview' && (
            <div className="bg-white text-black rounded-lg p-6 max-h-96 overflow-y-auto">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold">DIAGNOSTIC REPORT</h1>
                <p className="text-gray-600">Report #{report.reportId}</p>
                <p className="text-sm text-gray-500">
                  {new Date(report.generatedAt || '').toLocaleString()}
                </p>
              </div>

              {/* Equipment Info */}
              <div className="mb-4">
                <h2 className="font-bold border-b pb-1 mb-2">Equipment Information</h2>
                <p><strong>Type:</strong> {report.equipment?.type}</p>
                <p><strong>Brand:</strong> {report.equipment?.brand}</p>
                <p><strong>Model:</strong> {report.equipment?.model}</p>
                {report.equipment?.serialNumber && (
                  <p><strong>Serial:</strong> {report.equipment.serialNumber}</p>
                )}
                {report.equipment?.engineHours && (
                  <p><strong>Engine Hours:</strong> {report.equipment.engineHours}</p>
                )}
              </div>

              {/* Diagnosis */}
              <div className="mb-4">
                <h2 className="font-bold border-b pb-1 mb-2">Diagnosis Summary</h2>
                <p className="text-sm">{diagnosis.primaryDiagnosis?.summary}</p>
                {diagnosis.issues && diagnosis.issues.length > 0 && (
                  <p className="mt-2"><strong>Issues Found:</strong> {diagnosis.issues.map(i => i.title).join(', ')}</p>
                )}
              </div>

              {/* Quote */}
              {report.partsQuoted && report.partsQuoted.length > 0 && (
                <div className="mb-4">
                  <h2 className="font-bold border-b pb-1 mb-2">Parts & Labor Quote</h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1">Item</th>
                        <th className="text-center">Qty</th>
                        <th className="text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.partsQuoted.map((part, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-1">{part.name}</td>
                          <td className="text-center">{part.quantity}</td>
                          <td className="text-right">KES {(part.quantity * part.unitPrice).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-bold">
                        <td colSpan={2} className="py-2">TOTAL</td>
                        <td className="text-right">KES {calculateTotal().toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleDownload}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500"
            >
              <Download className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Download PDF'}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 rounded-lg text-white hover:bg-orange-500"
            >
              <Send className="w-4 h-4" />
              Save Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
