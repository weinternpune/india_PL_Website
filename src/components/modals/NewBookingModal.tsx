import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCategory } from '../../types';
import { X, Calendar, Clock, MapPin, Check } from 'lucide-react';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (bookingId: string) => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { customers, services, createNewBooking } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.customerId || '');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [customAddress, setCustomAddress] = useState('');

  if (!isOpen) return null;

  const currentCustomer = customers.find((c) => c.customerId === selectedCustomerId) || customers[0];
  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const customerAddress =
      customAddress.trim() ||
      (currentCustomer?.addresses?.[0]
        ? `${currentCustomer.addresses[0].addressLine}, ${currentCustomer.addresses[0].city}`
        : 'Plot No. 123, KIIT Road, Patia, Bhubaneswar');

    const newBooking = createNewBooking({
      customerId: currentCustomer.customerId,
      customerName: currentCustomer.name,
      customerPhone: currentCustomer.phone,
      customerEmail: currentCustomer.email,
      customerAvatar: currentCustomer.avatar,
      serviceId: currentService.id,
      serviceName: currentService.name,
      serviceCategory: currentService.category,
      selectedServices: [
        { name: currentService.name, price: currentService.price },
      ],
      customerLocation: {
        address: customerAddress,
        city: 'Bhubaneswar',
        state: 'Odisha',
        pincode: '751024',
        latitude: currentCustomer.addresses?.[0]?.latitude || 20.3540,
        longitude: currentCustomer.addresses?.[0]?.longitude || 85.8175,
      },
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      subtotal: currentService.price,
      convenienceFee: 25,
      totalAmount: currentService.price + 25,
    });

    onClose();
    if (onCreated) {
      onCreated(newBooking.bookingId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2038]/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#DCEEEB] shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-teal-50/70 border-b border-[#DCEEEB] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0B2038]">Create Customer Booking</h3>
            <p className="text-xs text-[#5B738B]">Simulate a customer order ready for GPS dispatch</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white text-slate-400 hover:text-[#0B2038]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Customer Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-1.5">
              Select Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#009E9B]"
            >
              {customers.map((c) => (
                <option key={c.customerId} value={c.customerId}>
                  {c.name} ({c.phone}) - {c.location}
                </option>
              ))}
            </select>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-1.5">
              Service
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#009E9B]"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category}) — ₹{s.price}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-1.5">
                Date
              </label>
              <input
                type="text"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                placeholder="e.g. 06 Oct 2026"
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#009E9B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-1.5">
                Time Slot
              </label>
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#009E9B]"
              >
                <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
                <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                <option value="05:00 PM - 07:00 PM">05:00 PM - 07:00 PM</option>
              </select>
            </div>
          </div>

          {/* Address Line */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0B2038] mb-1.5">
              Service Location / Address (Bhubaneswar)
            </label>
            <input
              type="text"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              placeholder="e.g. Plot No. 123, KIIT Road, Patia, Bhubaneswar"
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#009E9B]"
            />
          </div>

          {/* Pricing Preview */}
          <div className="p-3 rounded-2xl bg-teal-50/50 border border-teal-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-[#5B738B]">Total Amount Payable</span>
            <span className="text-base font-extrabold text-[#009E9B]">
              ₹{(currentService?.price || 297) + 25}
            </span>
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
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
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
