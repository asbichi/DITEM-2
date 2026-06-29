import { Building2, Target, Users, Award } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="py-24 bg-brand-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl lg:text-6xl font-extrabold text-brand-primary mb-6">About Dialogue Institute</h1>
          <div className="w-24 h-1.5 bg-brand-accent mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-primary mb-8 leading-tight">Empowering the Next Generation of Tech Leaders</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
              Dialogue Institute of Technology and Management Kaduna is a premier institution dedicated to providing cutting-edge ICT education. Located at the heart of Kaduna, we are committed to making our students relevant in the 21st century.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              With the rapid advancement in technology, our curriculum is designed to meet industry standards, offering a wide range of programs from Data Science and Cyber Security to Web Design and Huawei Courses.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white"
          >
            <img 
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Students learning" 
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-brand-primary/20"></div>
          </motion.div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <motion.div variants={itemVariants} className="bg-white p-10 rounded-3xl text-center border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
            <div className="w-20 h-20 bg-brand-accent/10 text-brand-accent rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-brand-accent group-hover:text-white transition-all duration-300">
              <Building2 size={36} />
            </div>
            <h3 className="text-xl font-bold text-brand-primary mb-4">Prime Location</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Situated at 61/63 Tafawa Balewa Way, opposite KASU, providing easy access for students.</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white p-10 rounded-3xl text-center border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <Target size={36} />
            </div>
            <h3 className="text-xl font-bold text-brand-primary mb-4">Our Mission</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">To equip individuals with practical ICT skills that guarantee relevance in the digital age.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-10 rounded-3xl text-center border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
            <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
              <Users size={36} />
            </div>
            <h3 className="text-xl font-bold text-brand-primary mb-4">Expert Instructors</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Learn from industry professionals with years of hands-on experience in their respective fields.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white p-10 rounded-3xl text-center border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <Award size={36} />
            </div>
            <h3 className="text-xl font-bold text-brand-primary mb-4">Certification</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Earn recognized certificates upon completion of your chosen professional courses.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
