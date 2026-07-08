import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Users, Trash2, Edit2, Plus, Image as ImageIcon } from 'lucide-react';
import { DBStaff } from '../../context/AppContext';

export default function StaffManager() {
  const { dbStaff, addStaff, updateStaff, deleteStaff } = useAppContext();
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<DBStaff, 'id'>>({
    name: '',
    role: '',
    email: '',
    phone: '',
    bio: '',
    image: '',
    isChairman: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateStaff(isEditing, formData);
      setIsEditing(null);
    } else {
      addStaff(formData);
    }
    setFormData({ name: '', role: '', email: '', phone: '', bio: '', image: '', isChairman: false });
  };

  const handleEdit = (staff: DBStaff) => {
    setIsEditing(staff.id);
    setFormData({
      name: staff.name,
      role: staff.role,
      email: staff.email,
      phone: staff.phone,
      bio: staff.bio,
      image: staff.image,
      isChairman: staff.isChairman || false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Staff Directory Management</h3>
            <p className="text-xs text-slate-500 mt-0.5">Add, update, or remove members of the staff directory, including the Chairman.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase">{isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}</h4>
          </div>
          
          <input
            type="text"
            placeholder="Full Name"
            required
            className="text-xs border border-slate-200 rounded-lg p-2.5 w-full bg-white outline-none focus:border-indigo-500"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Role / Designation"
            required
            className="text-xs border border-slate-200 rounded-lg p-2.5 w-full bg-white outline-none focus:border-indigo-500"
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email Address"
            required
            className="text-xs border border-slate-200 rounded-lg p-2.5 w-full bg-white outline-none focus:border-indigo-500"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="text-xs border border-slate-200 rounded-lg p-2.5 w-full bg-white outline-none focus:border-indigo-500"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
          />
          <div className="col-span-1 md:col-span-2">
             <input
              type="text"
              placeholder="Image URL (e.g. Unsplash or ImgBB)"
              required
              className="text-xs border border-slate-200 rounded-lg p-2.5 w-full bg-white outline-none focus:border-indigo-500"
              value={formData.image}
              onChange={e => setFormData({ ...formData, image: e.target.value })}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <textarea
              placeholder="Short Bio / Description"
              required
              rows={2}
              className="text-xs border border-slate-200 rounded-lg p-2.5 w-full bg-white outline-none focus:border-indigo-500"
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
            ></textarea>
          </div>
          
          <div className="col-span-1 md:col-span-2 flex items-center justify-between mt-2 pt-4 border-t border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                checked={formData.isChairman}
                onChange={e => setFormData({ ...formData, isChairman: e.target.checked })}
              />
              <span className="text-xs font-bold text-slate-700">Set as Chairman (Hero layout)</span>
            </label>

            <div className="flex gap-2">
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(null);
                    setFormData({ name: '', role: '', email: '', phone: '', bio: '', image: '', isChairman: false });
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                {isEditing ? <Edit2 size={13} /> : <Plus size={13} />}
                <span>{isEditing ? 'Save Changes' : 'Add Staff Member'}</span>
              </button>
            </div>
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {dbStaff.map((staff) => (
            <div key={staff.id} className={`flex items-start gap-4 p-4 rounded-xl border ${staff.isChairman ? 'border-amber-300 bg-amber-50' : 'border-slate-100 bg-white'}`}>
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                <img src={staff.image} alt={staff.name} className="w-full h-full object-cover object-top" />
              </div>
              <div className="flex-grow min-w-0">
                <h5 className="text-xs font-black text-slate-800 truncate flex items-center gap-2">
                  {staff.name}
                  {staff.isChairman && <span className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider">Chairman</span>}
                </h5>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5 truncate">{staff.role}</p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => handleEdit(staff)}
                    className="text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <Edit2 size={10} /> Edit
                  </button>
                  <button 
                    onClick={() => {
                      if(window.confirm('Are you sure you want to remove this staff member?')) {
                        deleteStaff(staff.id);
                      }
                    }}
                    className="text-[10px] text-rose-500 font-bold hover:underline flex items-center gap-1 ml-auto"
                  >
                    <Trash2 size={10} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          {dbStaff.length === 0 && (
             <div className="col-span-1 sm:col-span-2 xl:col-span-3 text-center py-8 text-xs text-slate-500">
                No staff members exist in the directory.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
