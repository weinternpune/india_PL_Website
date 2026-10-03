import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem, ServiceCategory } from '../../types';
import { ServiceFormModal } from '../../components/modals/ServiceFormModal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Clock,
} from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const { services, deleteService, updateService } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const categories: (ServiceCategory | 'All')[] = [
    'All',
    'Cleaning',
    'Laundry',
    'Repair',
    'Household Help',
    'Technician',
    'Manpower',
  ];

  const filteredServices = services.filter((s) => {
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  const handleEdit = (service: ServiceItem) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (service: ServiceItem) => {
    const nextStatus = service.status === 'Active' ? 'Inactive' : 'Active';
    updateService({ ...service, status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0B2038] tracking-tight">Service Catalog Management</h1>
          <p className="text-xs sm:text-sm text-slate-800 font-medium mt-0.5">
            Configure doorstep service offerings, session pricing, and category structures.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008A8E] text-white text-xs font-bold hover:bg-[#007074] shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-96 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search services by title or description..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-[#0B2038] placeholder-slate-500 focus:outline-none focus:border-[#008A8E] focus:bg-white"
            />
          </div>

          <span className="text-xs text-slate-800 font-bold">
            {filteredServices.length} Services in Catalog
          </span>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-[#0B2038] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 hover:text-[#0B2038]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid (CRUD cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[#008A8E] text-[11px] font-bold shadow-xs border border-slate-200">
                  {service.category}
                </span>

                <button
                  onClick={() => handleToggleStatus(service)}
                  className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-xs transition-colors cursor-pointer ${
                    service.status === 'Active'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-600 text-white'
                  }`}
                  title="Click to toggle Active / Inactive"
                >
                  {service.status}
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-[#0B2038] group-hover:text-[#008A8E] transition-colors leading-snug">
                    {service.name}
                  </h3>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-black text-[#008A8E]">
                      ₹{service.price}
                    </span>
                    {service.originalPrice && (
                      <span className="block text-[11px] text-slate-500 font-bold line-through">
                        ₹{service.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-800 font-medium leading-relaxed line-clamp-2">
                  {service.description}
                </p>

                {/* Duration */}
                <div className="flex items-center gap-2 text-xs text-slate-800 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#008A8E]" />
                  <span>Est. {service.durationMinutes} Minutes Session</span>
                </div>

                {/* Dates */}
                <div className="text-[10px] text-slate-700 font-semibold pt-2 border-t border-slate-100 flex justify-between">
                  <span>Created: {new Date(service.createdAt).toLocaleDateString('en-IN')}</span>
                  <span>Updated: {new Date(service.updatedAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Card Footer CRUD Actions */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleToggleStatus(service)}
                className="text-xs font-bold text-slate-800 hover:text-[#0B2038] cursor-pointer"
              >
                {service.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-teal-300 text-[#008A8E] hover:bg-teal-50 text-xs font-bold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${service.name}?`)) {
                      deleteService(service.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Modal */}
      {isModalOpen && (
        <ServiceFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          serviceToEdit={editingService}
        />
      )}
    </div>
  );
};
