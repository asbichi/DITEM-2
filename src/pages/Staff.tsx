import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Award, Shield, Cpu, BookOpen } from 'lucide-react';

import { useAppContext } from '../context/AppContext';

export default function Staff() {
  const { dbStaff } = useAppContext();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const chairman = dbStaff.find(s => s.isChairman);
  const teamMembers = dbStaff.filter(s => !s.isChairman);

  return (
    <div className="py-20 bg-slate-50 overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-brand-accent text-xs font-extrabold uppercase tracking-widest bg-brand-accent/10 px-4 py-1.5 rounded-full inline-block mb-3">
            Governance & Executive Council
          </span>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Management Staff
          </h1>
          <div className="w-20 h-1 bg-brand-accent mx-auto mt-4 rounded-full"></div>
          <p className="text-slate-500 text-sm max-w-xl mx-auto mt-4 leading-relaxed font-medium">
            Dedicated visionaries driving academic and operational excellence at Dialogue Institute of Technology & Management, Kaduna.
          </p>
        </motion.div>

        {/* Chairman - Centered Middle Focus Section */}
        {chairman && (
          <div className="flex justify-center mb-24">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="w-full max-w-2xl bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/60 p-8 md:p-12 text-center relative overflow-hidden"
            >
              {/* Elegant corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-bl-full pointer-events-none"></div>
              
              {/* Big Circular Portrait of Chairman in the middle */}
              <div className="relative mx-auto mb-8 w-96 h-96 md:w-[28rem] md:h-[28rem]">
                {/* Outer decorative glowing ring */}
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-brand-accent/40 animate-[spin_40s_linear_infinite]"></div>
                {/* Inner border ring */}
                <div className="absolute inset-2 rounded-full border-4 border-white shadow-md z-10"></div>
                {/* Actual Image container */}
                <div className="absolute inset-2 overflow-hidden rounded-full z-20 shadow-inner bg-slate-100">
                  <img 
                    src={chairman.image} 
                    alt={chairman.name} 
                    className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                {chairman.name}
              </h2>
              <p className="text-brand-accent font-extrabold text-xs uppercase tracking-widest mt-1">
                {chairman.role}
              </p>

              {/* Inspiring quote */}
              <div className="my-6 relative px-6 md:px-12">
                <span className="absolute left-0 top-0 text-slate-200 text-5xl font-serif select-none leading-none">“</span>
                <p className="text-slate-600 text-sm md:text-base italic leading-relaxed font-medium">
                  {chairman.bio}
                </p>
                <span className="absolute right-0 bottom-0 text-slate-200 text-5xl font-serif select-none leading-none">”</span>
              </div>

              <div className="flex flex-wrap gap-4 justify-center text-xs text-slate-500 font-medium pt-4 border-t border-slate-100">
                <span className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-100">
                  <MapPin size={13} className="text-brand-accent" /> Kaduna, Nigeria
                </span>
                <span className="flex items-center gap-1.5 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-100">
                  <Mail size={13} className="text-brand-accent" /> {chairman.email}
                </span>
              </div>
            </motion.div>
          </div>
        )}

        {/* Rest of Management Staff Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {teamMembers.map((member) => {
            return (
              <motion.div 
                key={member.id}
                variants={itemVariants} 
                className="bg-white rounded-3xl border border-slate-100 shadow-md shadow-slate-100/50 hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between overflow-hidden"
              >
                {/* Visual Top Bar Accent */}
                <div className="h-2 bg-gradient-to-r from-brand-accent to-red-600 w-full"></div>
                
                <div className="p-8 flex-grow">
                  {/* Portrait Avatar */}
                  <div className="relative w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-md border-4 border-white group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="text-center mb-4">
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-brand-accent transition-colors duration-200">
                      {member.name}
                    </h3>
                    <p className="text-brand-accent text-[11px] uppercase tracking-widest font-extrabold mt-0.5">
                      {member.role}
                    </p>
                  </div>

                  <p className="text-slate-500 text-xs text-center leading-relaxed font-medium mb-6">
                    {member.bio}
                  </p>
                </div>

                {/* Footer details */}
                <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex flex-col gap-1.5 text-[11px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-2">
                    <Mail size={12} className="text-brand-accent shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <Phone size={12} className="text-brand-accent shrink-0" />
                    <span>{member.phone}</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
