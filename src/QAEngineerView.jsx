import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Cpu,
  FolderGit2,
  Copy,
  Check,
  Braces,
  Sliders,
  X,
  GraduationCap,
  Award,
  Calendar,
  MapPin,
  Clock,
  Download,
  Code2,
  Mail
} from 'lucide-react';

interface SkillCardData {
  title: string;
  badge: string;
  badgeColor: 'emerald' | 'cyan' | 'amber' | 'purple';
  icon: typeof ShieldCheck;
  iconColor: string;
  desc: string;
  skills: string[];
}

const CV_SKILL_CARDS: SkillCardData[] = [
  {
    title: "QA & Software Testing",
    badge: "Primary OJT Strength",
    badgeColor: "emerald",
    icon: ShieldCheck,
    iconColor: "text-emerald-400",
    desc: "Core testing competencies for defect isolation, test documentation, and validation across SDLC and STLC phases.",
    skills: [
      "Manual Testing",
      "Test Case Design",
      "Test Planning",
      "Bug Reporting & Tracking",
      "Functional & Regression",
      "API Testing",
      "Edge Case Validation",
      "SDLC & STLC"
    ]
  },
  {
    title: "Testing & Diagnostics",
    badge: "Defect Tools",
    badgeColor: "cyan",
    icon: Sliders,
    iconColor: "text-cyan-400",
    desc: "Essential developer tools and platforms used for inspecting payloads, diagnosing errors, and managing code repositories.",
    skills: [
      "Postman",
      "Chrome DevTools",
      "Git",
      "GitHub"
    ]
  },
  {
    title: "Databases & Backend",
    badge: "Data Verification",
    badgeColor: "emerald",
    icon: FolderGit2,
    iconColor: "text-emerald-400",
    desc: "Database environments and backend services verified for transactional integrity and secure schema constraints.",
    skills: [
      "PostgreSQL",
      "MySQL",
      "Supabase",
      "Node.js",
      "Express.js",
      "SQL Querying",
      "Data Integrity",
      "RLS Security"
    ]
  },
  {
    title: "Web & Mobile Stacks",
    badge: "Tested Frameworks",
    badgeColor: "cyan",
    icon: Code2,
    iconColor: "text-cyan-400",
    desc: "Frontend and cross-platform UI architectures evaluated for responsive layout rendering and input edge cases.",
    skills: [
      "React",
      "Next.js",
      "Flutter",
      "React Native",
      "Tailwind CSS",
      "Bootstrap"
    ]
  },
  {
    title: "Languages & Core Code",
    badge: "BSIT Foundations",
    badgeColor: "amber",
    icon: Braces,
    iconColor: "text-amber-400",
    desc: "Academic and industry-certified language foundations in algorithmic logic, data querying, and scripting.",
    skills: [
      "Python (Cisco Certified)",
      "JavaScript",
      "C++",
      "SQL",
      "HTML5",
      "CSS3"
    ]
  },
  {
    title: "AI & Workplace Skills",
    badge: "Productivity & Team",
    badgeColor: "purple",
    icon: Cpu,
    iconColor: "text-purple-400",
    desc: "Modern AI tooling used for scenario building, combined with essential teamwork and problem-solving mindset.",
    skills: [
      "ChatGPT & Claude",
      "Copilot & Gemini",
      "Attention to Detail",
      "Analytical Thinking",
      "Problem Solving",
      "Team Collaboration",
      "Tagalog & English"
    ]
  }
];

export default function QAEngineerView() {
  // Project Showcase State
  const [activeProjectTab, setActiveProjectTab] = useState<'pos-system' | 'barangay-app'>('pos-system');

  // Modals & Feedback
  const [emailCopied, setEmailCopied] = useState<boolean>(false);
  const [resumeModalOpen, setResumeModalOpen] = useState<boolean>(false);

  // Real-time Clock & Device Location State
  const [currentTime, setCurrentTime] = useState<string>('');
  const [deviceLocation, setDeviceLocation] = useState<string>('Detecting...');

  const requestExactLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            // 1. BigDataCloud reverse geocode (accurate to municipality/town)
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            if (res.ok) {
              const data = await res.json();
              const city = data.locality || data.city || '';
              const province = data.principalSubdivision || '';
              const country = data.countryName || 'Philippines';

              let formatted = '';
              if (city && province && city.toLowerCase() !== province.toLowerCase()) {
                formatted = `${city}, ${province}`;
              } else if (city) {
                formatted = `${city}, ${country}`;
              } else if (province) {
                formatted = `${province}, ${country}`;
              } else {
                formatted = country;
              }

              setDeviceLocation(formatted);
              localStorage.setItem('user_detected_location', formatted);
              return;
            }
          } catch (err) {
            console.warn('BigDataCloud error, trying Nominatim...', err);
          }

          // 2. OpenStreetMap Nominatim fallback
          try {
            const resNom = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            if (resNom.ok) {
              const nomData = await resNom.json();
              const addr = nomData.address || {};
              const town = addr.municipality || addr.city || addr.town || addr.village || addr.suburb || '';
              const state = addr.state || addr.region || '';
              const formatted = (town && state) ? `${town}, ${state}` : (town || state || 'Philippines');
              setDeviceLocation(formatted);
              localStorage.setItem('user_detected_location', formatted);
              return;
            }
          } catch (nomErr) {
            console.warn('Nominatim reverse error', nomErr);
          }
        },
        () => {
          // If declined or error, fallback to IP network if no cache
          if (!localStorage.getItem('user_detected_location')) {
            fetchIPLocation();
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      );
    } else {
      fetchIPLocation();
    }
  };

  const fetchIPLocation = () => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.city && data.country_name) {
          setDeviceLocation(`${data.city}, ${data.country_name}`);
        }
      })
      .catch(() => {
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          setDeviceLocation(tz ? tz.replace(/_/g, ' ') : 'Philippines');
        } catch {
          setDeviceLocation('Philippines');
        }
      });
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Check cached location first
    const cached = localStorage.getItem('user_detected_location');
    if (cached) {
      setDeviceLocation(cached);
    }

    // Trigger high-accuracy device location
    requestExactLocation();

    return () => clearInterval(interval);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText('johnandreiagustin12@gmail.com');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2200);
  };

  return (
    <div className="bg-[#0b0f19] text-slate-100 font-sans min-h-screen selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Background Cyber Glow & Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] z-0"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none z-0"></div>

      {/* ===================================================================== */}
      {/* 1. TOP NAVIGATION */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-40 bg-[#0b0f19]/85 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-emerald-500/60 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs shadow-[0_0_12px_rgba(16,185,129,0.3)] group-hover:border-cyan-400 transition-colors">
              JA
            </div>
            <span className="font-mono font-extrabold text-sm tracking-wider text-slate-100 group-hover:text-emerald-400 transition-colors">
              JA<span className="text-emerald-400">.qa</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-xs font-mono font-medium text-slate-300">
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a>
            <a href="#education" className="hover:text-cyan-400 transition-colors">Education</a>
            <a href="#certifications" className="hover:text-emerald-400 transition-colors">Certifications</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Drei-Nitsu"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-white text-xs font-mono transition-colors"
            >
              <img src="/github-icon.png" alt="GitHub" className="w-3.5 h-3.5 rounded-full object-contain" />
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/john-andrei-agustin-143b79386"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs font-mono transition-colors"
            >
              <img src="/linkedin-icon.png" alt="LinkedIn" className="w-3.5 h-3.5 rounded-sm object-contain" />
              <span>LinkedIn</span>
            </a>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="hidden sm:inline">SEEKING QA INTERNSHIP / OJT (486 HRS)</span>
              <span className="sm:hidden">QA INTERN (486 HRS)</span>
            </div>
          </div>

        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-20">

        {/* =================================================================== */}
        {/* 2. HERO SECTION */}
        {/* =================================================================== */}
        <section id="hero" className="text-center pt-4 pb-2 space-y-6 max-w-3xl mx-auto">
          
          {/* Avatar Photo with Gradient Ring */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full p-1 bg-gradient-to-tr from-emerald-400 via-cyan-400 to-teal-500 shadow-[0_0_25px_rgba(16,185,129,0.35)]">
            <img
              src="/profile.png"
              alt="John Andrei Garcia Agustin"
              className="w-full h-full object-cover rounded-full bg-slate-900"
              onError={(e) => {
                // Fallback avatar if local image not ready
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold tracking-wide">SEEKING QA INTERNSHIP / OJT &bull; 486 HRS</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-300">John Andrei Garcia Agustin</span> 👋
            </h1>
            <p className="text-lg sm:text-xl font-medium text-slate-200">
              Aspiring Quality Assurance (QA) Engineer &amp; Test Automation Enthusiast
            </p>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            I combine software development knowledge with an analytical QA mindset. Currently focusing on <strong className="text-white font-semibold">manual testing methodologies</strong>, <strong className="text-white font-semibold">Postman</strong> REST API verification, and <strong className="text-white font-semibold">SQL database testing</strong> to catch edge-case bugs early.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#projects"
              className="px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:-translate-y-0.5"
            >
              <FolderGit2 className="w-4 h-4" />
              <span>View Tested Projects</span>
            </a>
            <a
              href="/John-Andrei-Agustin-CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white font-bold text-xs font-mono flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>View / Download CV</span>
            </a>
            <a
              href="#contact"
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs font-mono transition-all"
            >
              Contact Andrei
            </a>
          </div>
        </section>

        

        {/* =================================================================== */}
        {/* 4. ACADEMIC BACKGROUND & EDUCATION (DE LA SALLE LIPA) */}
        {/* =================================================================== */}
        <section id="education" className="scroll-mt-24 space-y-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>ACADEMIC BACKGROUND</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Education &amp; Qualifications
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            
            {/* De La Salle Lipa */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-4 relative overflow-hidden group shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-xl bg-slate-950 border border-emerald-500/40 p-2 flex items-center justify-center shrink-0">
                    <img src="/dlsl.png" alt="De La Salle Lipa" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">De La Salle Lipa</h3>
                    <p className="text-xs sm:text-sm text-emerald-400 font-mono">BS Information Technology &bull; Specialization in Systems Development</p>
                  </div>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
                  4TH YEAR (CLASS OF 2027)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Currently in my 4th year specializing in Systems Development, focusing on software quality assurance, manual test documentation, defect reporting, and database systems. Actively seeking a 486-hour QA Internship / OJT deployment.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-3 border-t border-slate-800">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold"><CheckCircle2 className="w-4 h-4" /> 486 Hours OJT Required</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-cyan-400" /> 2023 &ndash; Present</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Lipa City, Batangas</span>
              </div>
            </div>

          </div>

        </section>

        {/* =================================================================== */}
        {/* 5. PROJECTS SHOWCASE (REAL DEV PROJECTS + QA SUITES) */}
        {/* =================================================================== */}
        <section id="projects" className="scroll-mt-24 space-y-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-semibold">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>PROJECTS &amp; TEST SUITES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              What I've Built &amp; Tested
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Explore my software development capstone projects alongside my hands-on QA automated testing suites.
            </p>
          </div>

          {/* Project Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 font-mono text-xs overflow-x-auto pb-px">
            <button
              onClick={() => setActiveProjectTab('pos-system')}
              className={`py-2.5 px-4 flex items-center gap-2 border-b-2 font-semibold transition-all whitespace-nowrap ${
                activeProjectTab === 'pos-system'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Fedelicious Wings POS (Tested)</span>
            </button>
            <button
              onClick={() => setActiveProjectTab('barangay-app')}
              className={`py-2.5 px-4 flex items-center gap-2 border-b-2 font-semibold transition-all whitespace-nowrap ${
                activeProjectTab === 'barangay-app'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Barangay Safety App (Flutter)</span>
            </button>
          </div>

          {/* TAB 1: FEDELICIOUS WINGS POS */}
          {activeProjectTab === 'pos-system' && (
            <div className="p-5 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src="/fedelicous.png.png"
                    alt="Fedelicious Wings POS"
                    className="w-full h-auto object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 text-[10px] font-mono font-bold">
                      WEB POS &bull; TESTED PROTOTYPE
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base sm:text-lg">
                    Fedelicious Wings Restaurant Point-of-Sale (POS)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Designed to modernize paper-based restaurant operations. As an aspiring QA, I tested order calculations, receipt printing consistency, inventory quantity reduction, and tested against negative price entries and concurrency errors.
                  </p>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800">Node.js</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800">Express.js</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800">MySQL</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800">Calculation Testing</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BARANGAY SAFETY APP */}
          {activeProjectTab === 'barangay-app' && (
            <div className="p-5 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <img
                    src="/barangay.png.png"
                    alt="Barangay Safety Incident Reporting"
                    className="w-full h-auto object-cover"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                </div>
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[10px] font-mono font-bold">
                      MOBILE APP &bull; SUPABASE POSTGRES
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base sm:text-lg">
                    Barangay Safety Incident Reporting Mobile Application
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A mobile solution to modernize community incident reporting in Lipa City with GPS geo-tagging and interactive map dashboards. I conducted functional testing on Role-Based Access Control (RBAC), offline caching, and tested PostgreSQL real-time subscriptions.
                  </p>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800">Flutter</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800">Supabase</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800">PostgreSQL</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800">RBAC Testing</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </section>

        {/* =================================================================== */}
        {/* 6. SKILLS & COMPETENCIES (GLASS CARDS HARMONIZED WITH EPORTFOLIO) */}
        {/* =================================================================== */}
        <section id="skills" className="scroll-mt-24 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-semibold">
              <Sliders className="w-3.5 h-3.5" />
              <span>CAPABILITIES &amp; CV PROFILE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Skills &amp; Competencies
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Structured directly from my official CV — combining dedicated Quality Assurance methodologies with practical system development stacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CV_SKILL_CARDS.map((card, idx) => {
              const Icon = card.icon;
              const isPrimary = idx === 0;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border ${
                    isPrimary
                      ? 'border-emerald-500/40 hover:border-emerald-500/70 shadow-[0_0_20px_rgba(16,185,129,0.08)]'
                      : 'border-slate-800 hover:border-slate-700'
                  } transition-all space-y-4 flex flex-col justify-between group`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0">
                        <Icon className={`w-5 h-5 ${card.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                          {card.title}
                        </h3>
                        <span className={`text-[11px] font-mono font-semibold ${
                          card.badgeColor === 'emerald' ? 'text-emerald-400' :
                          card.badgeColor === 'cyan' ? 'text-cyan-400' :
                          card.badgeColor === 'amber' ? 'text-amber-400' : 'text-purple-400'
                        }`}>
                          {card.badge}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {card.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all cursor-default ${
                          isPrimary
                            ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-semibold hover:bg-emerald-500/25'
                            : 'bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          card.badgeColor === 'emerald' ? 'bg-emerald-400' :
                          card.badgeColor === 'cyan' ? 'bg-cyan-400' :
                          card.badgeColor === 'amber' ? 'bg-amber-400' : 'bg-purple-400'
                        }`} />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =================================================================== */}
        {/* 7. REAL CERTIFICATIONS GALLERY (FROM HIS 3RD/4TH YEAR) */}
        {/* =================================================================== */}
        <section id="certifications" className="scroll-mt-24 space-y-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>CONTINUOUS LEARNING &amp; GROWTH</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Certifications &amp; Training
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Credentials earned through Cisco Networking Academy, Accenture, and JPCS De La Salle Chapter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            {/* Cert 1: Python Essentials 1 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img src="/PE1.png" alt="Python Essentials 1" className="w-full h-auto object-cover" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-cyan-400">Cisco Networking Academy</div>
                <h4 className="font-bold text-white text-sm">Python Essentials 1</h4>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">March 2026</div>
              </div>
            </div>

            {/* Cert 2: Python Essentials 2 */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img src="/PE2.png" alt="Python Essentials 2" className="w-full h-auto object-cover" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-cyan-400">Cisco Networking Academy</div>
                <h4 className="font-bold text-white text-sm">Python Essentials 2</h4>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">April 2026</div>
              </div>
            </div>

            {/* Cert 3: Cyber Threat Management */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img src="/Cyberthreat.png" alt="Cyber Threat Management" className="w-full h-auto object-cover" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-emerald-400">Cisco Networking Academy</div>
                <h4 className="font-bold text-white text-sm">Cyber Threat Management</h4>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">March 2026</div>
              </div>
            </div>

            {/* Cert 4: Skills to Succeed Academy */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img src="/Skills2Succeed.png" alt="Skills to Succeed" className="w-full h-auto object-cover" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-purple-400">Accenture</div>
                <h4 className="font-bold text-white text-sm">Skills to Succeed Academy</h4>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">March 2026</div>
              </div>
            </div>

            {/* Cert 5: DevRoutes */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img src="/Devroutes.png" alt="DevRoutes" className="w-full h-auto object-cover" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
              <div>
                <div className="text-[10px] font-mono text-cyan-400">JPCS &bull; De La Salle Chapter</div>
                <h4 className="font-bold text-white text-sm">DevRoutes: Learning with Roadmaps</h4>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">January 2026</div>
              </div>
            </div>

          </div>

        </section>

      </main>

      {/* Dynamic Real-Time Status & Location Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md pt-8 pb-28 sm:pb-10 px-4 sm:px-6 lg:px-8 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left md:pr-52">
          {/* Left: Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
              JA
            </div>
            <div className="text-white font-semibold text-sm tracking-wide">
              John Andrei Garcia Agustin
            </div>
          </div>

          {/* Right: Live Device Location & Real-Time Clock */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5">
            {/* Device Location Pill */}
            <button
              onClick={requestExactLocation}
              title="Click to detect exact GPS location"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-300 shadow-sm transition-all cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px]">
                <span className="text-slate-500 mr-1">Device Location:</span>
                <strong className="text-cyan-300 font-mono">{deviceLocation}</strong>
              </span>
            </button>

            {/* Live Clock Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-slate-300 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">
                <span className="text-slate-500 mr-1">Device Time:</span>
                <strong className="text-emerald-400 font-mono">{currentTime || '--:--:--'}</strong>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Resume Preview Modal */}
      {resumeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl p-6 space-y-4 font-mono text-xs shadow-2xl">
            <div className="flex justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-white text-sm">John Andrei Garcia Agustin &mdash; Resume Snapshot</span>
              <button onClick={() => setResumeModalOpen(false)}><X className="w-4 h-4 text-slate-400 hover:text-white" /></button>
            </div>
            <div className="space-y-2 text-slate-300">
              <div><strong className="text-emerald-400">Target Role:</strong> QA Engineering Intern / OJT (486 Practicum Hours)</div>
              <div><strong className="text-cyan-400">Education:</strong> 4th Year BSIT (Specialization in Systems Development) at De La Salle Lipa (Class of 2027)</div>
              <div><strong className="text-emerald-400">Email:</strong> johnandreiagustin12@gmail.com</div>
              <div><strong className="text-cyan-400">GitHub:</strong> github.com/Drei-Nitsu</div>
              <div><strong className="text-emerald-400">LinkedIn:</strong> linkedin.com/in/john-andrei-agustin-143b79386</div>
              <div><strong className="text-cyan-400">QA Stack:</strong> Manual Testing, Test Case Design, Bug Reporting, Postman, Chrome DevTools, SQL Data Verification</div>
              <div><strong className="text-emerald-400">Projects:</strong> Fedelicious Wings POS (Tested), Barangay Safety Incident Reporting App (Tested)</div>
            </div>
            <div className="pt-3 border-t border-slate-800 flex flex-wrap justify-end gap-2">
              <a
                href="/John-Andrei-Agustin-CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold border border-emerald-500/40 transition-colors inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open Full PDF CV</span>
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=johnandreiagustin12@gmail.com&su=QA%20Internship%20Inquiry%20-%20John%20Andrei%20Agustin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-lg bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300 transition-colors inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Open in Gmail</span>
              </a>
              <button
                onClick={copyEmail}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition-colors inline-flex items-center gap-1.5"
              >
                {emailCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{emailCopied ? "Copied!" : "Copy Email"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
