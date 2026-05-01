/**
 * GENERATOR ORACLE - PARTS ORDER PANEL
 * Supplier search and parts ordering interface
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Package,
  Search,
  Phone,
  Mail,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  Plus,
  Trash2,
  Send,
  ExternalLink,
  MessageCircle,
  Building,
  Filter,
  X,
} from 'lucide-react';
import type { Supplier, PartItem } from '@/lib/generator-oracle/supplierService';

interface PartsOrderPanelProps {
  onClose?: () => void;
  diagnosisId?: string;
  suggestedParts?: PartItem[];
  brand?: string;
  model?: string;
  faultCode?: string;
}

export default function PartsOrderPanel({
  onClose,
  diagnosisId,
  suggestedParts = [],
  brand,
  model,
  faultCode,
}: PartsOrderPanelProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [parts, setParts] = useState<PartItem[]>(suggestedParts);
  const [isSending, setIsSending] = useState(false);

  // Fetch suppliers
  useEffect(() => {
    async function fetchSuppliers() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set('query', searchQuery);
        if (selectedCity) params.set('city', selectedCity);

        const response = await fetch(`/api/generator-oracle/suppliers?${params}`);
        const data = await response.json();

        if (data.success) {
          setSuppliers(data.suppliers);
        }
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
      }
      setIsLoading(false);
    }

    const debounce = setTimeout(fetchSuppliers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedCity]);

  // Add part
  const addPart = useCallback(() => {
    setParts(prev => [...prev, { name: '', quantity: 1 }]);
  }, []);

  // Update part
  const updatePart = useCallback((index: number, field: keyof PartItem, value: string | number) => {
    setParts(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, []);

  // Remove part
  const removePart = useCallback((index: number) => {
    setParts(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Send WhatsApp request
  const sendWhatsAppRequest = useCallback(async (supplier: Supplier) => {
    if (parts.length === 0 || parts.every(p => !p.name.trim())) {
      alert('Please add at least one part');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/generator-oracle/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'whatsapp',
          supplierId: supplier.id,
          parts: parts.filter(p => p.name.trim()),
          context: { brand, model, faultCode },
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Open WhatsApp
        window.open(data.url, '_blank');

        // Record the request
        await fetch('/api/generator-oracle/suppliers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'request',
            supplierId: supplier.id,
            diagnosisId,
            parts: parts.filter(p => p.name.trim()),
            contactMethod: 'whatsapp',
          }),
        });
      }
    } catch (error) {
      console.error('Failed to send request:', error);
    }
    setIsSending(false);
  }, [parts, brand, model, faultCode, diagnosisId]);

  // Get unique cities
  const cities = [...new Set(suppliers.map(s => s.city).filter(Boolean))];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-bold text-white">Parts & Suppliers</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4 p-4">
        {/* Parts List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-300">Parts Needed</h3>
            <button
              onClick={addPart}
              className="flex items-center gap-1 px-2 py-1 bg-blue-600 rounded text-white text-sm hover:bg-blue-500"
            >
              <Plus className="w-4 h-4" />
              Add Part
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {parts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No parts added. Click "Add Part" to start.
              </div>
            ) : (
              parts.map((part, index) => (
                <div key={index} className="flex gap-2 items-center bg-gray-800 rounded-lg p-2">
                  <input
                    type="text"
                    value={part.name}
                    onChange={e => updatePart(index, 'name', e.target.value)}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                    placeholder="Part name"
                  />
                  <input
                    type="text"
                    value={part.partNumber || ''}
                    onChange={e => updatePart(index, 'partNumber', e.target.value)}
                    className="w-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                    placeholder="P/N"
                  />
                  <input
                    type="number"
                    value={part.quantity}
                    onChange={e => updatePart(index, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-16 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm text-center"
                    min="1"
                  />
                  <select
                    value={part.urgency || 'normal'}
                    onChange={e => updatePart(index, 'urgency', e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical</option>
                  </select>
                  <button
                    onClick={() => removePart(index)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Context info */}
          {(brand || model || faultCode) && (
            <div className="bg-gray-800 rounded-lg p-3 text-sm">
              <p className="text-gray-400 mb-1">Request context:</p>
              {brand && <p className="text-white">Brand: {brand}</p>}
              {model && <p className="text-white">Model: {model}</p>}
              {faultCode && <p className="text-white">Fault: {faultCode}</p>}
            </div>
          )}
        </div>

        {/* Suppliers List */}
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-9 pr-3 py-2 text-white text-sm"
                placeholder="Search suppliers, brands..."
              />
            </div>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Suppliers */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto" />
              </div>
            ) : suppliers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No suppliers found
              </div>
            ) : (
              suppliers.map(supplier => (
                <div
                  key={supplier.id}
                  className={`bg-gray-800 rounded-lg p-3 border transition-colors ${
                    selectedSupplier?.id === supplier.id
                      ? 'border-orange-500'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-white">{supplier.name}</h4>
                        {supplier.isVerified && (
                          <span title="Verified"><CheckCircle className="w-4 h-4 text-green-500" /></span>
                        )}
                      </div>
                      {supplier.location && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {supplier.location}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {supplier.rating && (
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm">{supplier.rating}</span>
                        </div>
                      )}
                      {supplier.responseTime && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {supplier.responseTime}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Brands */}
                  {supplier.brandsCarried && supplier.brandsCarried.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {supplier.brandsCarried.slice(0, 4).map(brand => (
                        <span key={brand} className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                          {brand}
                        </span>
                      ))}
                      {supplier.brandsCarried.length > 4 && (
                        <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-400">
                          +{supplier.brandsCarried.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Contact buttons */}
                  <div className="flex gap-2 mt-2">
                    {supplier.whatsapp && (
                      <button
                        onClick={() => sendWhatsAppRequest(supplier)}
                        disabled={isSending}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600 rounded text-white text-sm hover:bg-green-500 disabled:opacity-50"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </button>
                    )}
                    {supplier.phone && (
                      <a
                        href={`tel:${supplier.phone}`}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-600 rounded text-white text-sm hover:bg-blue-500"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                    )}
                    {supplier.email && (
                      <a
                        href={`mailto:${supplier.email}?subject=Parts Inquiry`}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 bg-gray-600 rounded text-white text-sm hover:bg-gray-500"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
