import React, { useState, useEffect } from 'react';
import { ServiceItem, ServiceCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Layers, Image as ImageIcon } from 'lucide-react';

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit?: ServiceItem | null;
}

export const ServiceFormModal: React.FC<ServiceFormModalProps> = ({
  isOpen,
  onClose,
  serviceToEdit,
}) => {
  const { addService, updateService } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Cleaning');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(299);
  const [originalPrice, setOriginalPrice] = useState(499);
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name);
      setCategory(serviceToEdit.category);
      setDescription(serviceToEdit.description);
      setPrice(serviceToEdit.price);
      setOriginalPrice(serviceToEdit.originalPrice || Math.round(serviceToEdit.price * 1.4));
      setDurationMinutes(serviceToEdit.durationMinutes);
      setStatus(serviceToEdit.status);
      setImage(serviceToEdit.image);
    } else {
      setName('');
      setCategory('Cleaning');
      setDescription('');
      setPrice(299);
      setOriginalPrice(499);
      setDurationMinutes(120);
      setStatus('Active');
      setImage(
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
      );
    }
  }, [serviceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (serviceToEdit) {
      updateService({
        ...serviceToEdit,
        name,
        category,
        description,
        price: Number(price),
        originalPrice: Number(originalPrice),
        durationMinutes: Number(durationMinutes),
        status,
        image:
          image ||
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
      });
    } else {
      addService({
        name,
        category,
        description,
        price: Number(price),
        originalPrice: Number(originalPrice),
        durationMinutes: Number(durationMinutes),
        status,
        image:
          image ||
          'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
        includedItems: ['Standard Cleaning', 'Sanitization', 'Safe & Hygienic'],
      });
    }

    onClose();
  };

  const categories: ServiceCategory[] = [
    'Cleaning',
    'Laundry',
    'Repair',
    'Household Help',
    'Technician',
    'Manpower',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2038]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#DCEEEB] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-teal-50/70 border-b border-[#DCEEEB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#009E9B] text-white flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B2038]">
                {serviceToEdit ? 'Edit Service Catalog Item' : 'Add New Service'}
              </h3>
              <p className="text-xs text-[#5B738B]">
                Manage services, category categorization and customer pricing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white text-slate-400 hover:text-[#0B2038]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-1.5">
              Service Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Residential Cleaning"
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#009E9B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#009E9B]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#009E9B]"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-1.5">
              Short Description / Value Proposition
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Clean Homes • Fresh Spaces • Happier Living"
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#009E9B]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-1.5">
                Price (₹)
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#009E9B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-1.5">
                Strikethrough (₹)
              </label>
              <input
                type="number"
                min={0}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#009E9B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-1.5">
                Duration (min)
              </label>
              <input
                type="number"
                min={15}
                step={15}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#009E9B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-1.5">
              Service Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#009E9B]"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-full"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#009E9B] text-white text-xs font-bold rounded-full hover:bg-[#00827F] shadow-sm transition-all"
            >
              {serviceToEdit ? 'Save Changes' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
