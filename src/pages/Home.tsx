import { ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';

export default function Home() {
  const { courses } = useAppContext();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* School Name Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-primary text-white py-4 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
          <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold text-white uppercase tracking-[0.2em]">
            Dialogue Institute of Technology & Management
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm text-slate-400 mt-2 font-bold uppercase tracking-widest">
            Dialogue Centre, 61 Tafawa Balewa Way close to KASU Kaduna
          </p>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-accent/5 -skew-x-12 transform translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-8 text-brand-primary tracking-tighter">
                Be Relevant in the <span className="text-brand-accent">21st Century</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg font-medium">
                Master the skills of tomorrow. From Cyber Security to Data Science, we provide the path to your professional excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/admission"
                  className="inline-flex justify-center items-center px-10 py-4 text-lg font-bold rounded-full text-white bg-brand-accent hover:bg-brand-accent-hover transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-brand-accent/20"
                >
                  Apply Now
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex justify-center items-center px-10 py-4 text-lg font-bold rounded-full border-2 border-slate-200 text-brand-primary hover:border-brand-primary transition-all duration-300 active:scale-95"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-brand-accent/10 rounded-[2.5rem] blur-2xl"></div>
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="https://i.ibb.co/7JsFX6fP/476218512-1126456625943493-3212904141993264594-n.jpg"
                  alt="Dialogue Institute Building"
                  className="w-full h-auto object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-24 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-primary mb-6">Our ICT Programs</h2>
            <div className="w-20 h-1.5 bg-brand-accent mx-auto rounded-full mb-8"></div>
            <p className="text-lg text-slate-500 font-medium">
              Discover our comprehensive range of courses designed to equip you with the skills needed for today's technology-driven world.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {courses.map((course, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group overflow-hidden flex flex-col"
              >
                <div className="h-48 w-full overflow-hidden relative">
                  <img 
                    src={course.image} 
                    alt={course.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <h3 className="text-xl font-bold text-brand-primary mb-4 group-hover:text-brand-accent transition-colors leading-tight">{course.name}</h3>
                  <Link to="/admission" className="text-brand-accent text-sm font-bold uppercase tracking-widest hover:gap-2 transition-all inline-flex items-center">
                    Enroll Now <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-brand-primary rounded-3xl shadow-xl p-8 text-white flex flex-col justify-center items-center text-center relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">And Many More...</h3>
              <p className="text-slate-400 text-sm mb-8 relative z-10 font-medium">Contact us to explore all our available courses.</p>
              <Link
                to="/contact"
                className="bg-white text-brand-primary px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all shadow-lg relative z-10"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-brand-accent rounded-[3rem] p-12 lg:p-20 text-center text-white shadow-2xl shadow-brand-accent/30 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-10 backdrop-blur-sm"
              >
                <Phone size={40} />
              </motion.div>
              <h2 className="text-4xl lg:text-5xl font-extrabold mb-8 leading-tight">Ready to Start Your Journey?</h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto font-medium">
                Call us today or visit our campus to speak with an academic advisor.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <a 
                  href="tel:08069196891" 
                  className="bg-white text-brand-accent px-12 py-5 rounded-2xl font-bold text-xl hover:bg-brand-primary hover:text-white transition-all shadow-xl active:scale-95"
                >
                  08069196891
                </a>
                <Link 
                  to="/contact" 
                  className="bg-brand-primary text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-white hover:text-brand-primary transition-all shadow-xl active:scale-95 border border-white/10"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}