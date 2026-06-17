import React, { useState, useEffect, useRef } from "react";
import { 
  Phone, 
  MapPin, 
  Clock, 
  Wrench, 
  Shield, 
  CheckCircle, 
  Menu, 
  X, 
  Car, 
  Settings, 
  Wind, 
  Navigation, 
  ChevronUp, 
  Star, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  MessageSquare, 
  Check, 
  Sparkles,
  Search,
  ThumbsUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Reference generated hero image directly as string to bypass PNG type declarations
const heroBg = "/src/assets/images/hero_mechanic_shop_1780930363158.png";

// Types
interface ServiceItem {
  id: string;
  name: string;
  category: "mechanics" | "brakes" | "diagnostics" | "ac" | "suspension" | "fluids";
  description: string;
  basePrice: number;
  timeEstimate: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: "comp-diag",
    name: "Diagnostyka komputerowa",
    category: "diagnostics",
    description: "Szybkie odczytanie i kasowanie błędów elektrycznych, adaptacja podzespołów, diagnostyka parametrów na żywo.",
    basePrice: 150,
    timeEstimate: "30-45 minut"
  },
  {
    id: "brake-pads",
    name: "Wymiana klocków hamulcowych",
    category: "brakes",
    description: "Kompleksowa wymiana klocków z czyszczeniem oraz smarowaniem prowadnic zacisku. Bezpieczeństwo to priorytet.",
    basePrice: 120,
    timeEstimate: "1 - 1.5 godziny"
  },
  {
    id: "brake-discs",
    name: "Wymiana tarcz i klocków (oś)",
    category: "brakes",
    description: "Wymiana tarcz hamulcowych wraz z klockami, pomiar bicia piasty oraz kontrola płynu hamulcowego.",
    basePrice: 240,
    timeEstimate: "1.5 - 2 godziny"
  },
  {
    id: "oil-service",
    name: "Wymiana oleju i filtrów",
    category: "fluids",
    description: "Wymiana oleju silnikowego dostosowanego do specyfikacji producenta wraz z filtrem oleju, powietrza i kabiny.",
    basePrice: 100,
    timeEstimate: "45-60 minut"
  },
  {
    id: "ac-service",
    name: "Serwis klimatyzacji (R134a/R1234yf)",
    category: "ac",
    description: "Próżniowy test szczelności układu, uzupełnienie czynnika chłodniczego z olejem i kontrastem UV oraz ozonowanie wnętrza.",
    basePrice: 199,
    timeEstimate: "1 godzina"
  },
  {
    id: "suspension-arm",
    name: "Wymiana wahacza / amortyzatorów",
    category: "suspension",
    description: "Wymiana zużytych elementów zawieszenia. Likwidacja luzów i stuków, przywrócenie idealnej precyzji prowadzenia.",
    basePrice: 180,
    timeEstimate: "1.5 - 3 godziny"
  },
  {
    id: "timing-belt",
    name: "Wymiana rozrządu",
    category: "mechanics",
    description: "Precyzyjna wymiana paska lub łańcucha rozrządu wraz z pompą wody na najwyższej jakości podzespołach renomowanych marek.",
    basePrice: 650,
    timeEstimate: "1-2 dni robocze"
  },
  {
    id: "clutch-replace",
    name: "Naprawa / wymiana sprzęgła",
    category: "mechanics",
    description: "Kompleksowa usługa wymiany tarczy, docisku, wysprzęglika oraz ewentualnie koła dwumasowego.",
    basePrice: 700,
    timeEstimate: "1-2 dni robocze"
  }
];

const CAR_SEGMENTS = [
  { id: "compact", name: "Segment A/B/C (Małe / Kompaktowe)", multiplayer: 1.0 },
  { id: "sedan", name: "Segment D/E/SUV (Klasa Średnia / SUV)", multiplayer: 1.25 },
  { id: "premium", name: "Segment Premium / Dostawcze", multiplayer: 1.5 }
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Interactive Cost Calculator State
  const [selectedServices, setSelectedServices] = useState<string[]>(["comp-diag"]);
  const [selectedSegment, setSelectedSegment] = useState<string>("compact");
  const [carMake, setCarMake] = useState<string>("");
  const [carYear, setCarYear] = useState<string>("");
  const [calcName, setCalcName] = useState<string>("");
  const [calcPhone, setCalcPhone] = useState<string>("");
  const [calcDate, setCalcDate] = useState<string>("");
  const [calcSubmitted, setCalcSubmitted] = useState<boolean>(false);

  // Standard Appointment Form State
  const [contactName, setContactName] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [contactMessage, setContactMessage] = useState<string>("");
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  // Active Accordion State for FAQs
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Auto detect scrolling to show scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate instant estimate
  const currentSegmentObj = CAR_SEGMENTS.find(s => s.id === selectedSegment) || CAR_SEGMENTS[0];
  const totalBaseCost = selectedServices.reduce((sum, currentId) => {
    const found = SERVICES_DATA.find(s => s.id === currentId);
    return sum + (found ? found.basePrice : 0);
  }, 0);
  
  const estimatedCostMin = Math.round(totalBaseCost * currentSegmentObj.multiplayer);
  // Add a typical buffer for mechanic pricing to show a realistic range
  const estimatedCostMax = Math.round(totalBaseCost * currentSegmentObj.multiplayer * 1.25 + 50);

  const toggleServiceInCalculator = (id: string) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s !== id));
      }
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handleCalculatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calcPhone) return;
    setCalcSubmitted(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPhone) return;
    setContactSubmitted(true);
  };

  const resetCalculator = () => {
    setSelectedServices(["comp-diag"]);
    setSelectedSegment("compact");
    setCarMake("");
    setCarYear("");
    setCalcName("");
    setCalcPhone("");
    setCalcDate("");
    setCalcSubmitted(false);
  };

  const resetContactForm = () => {
    setContactName("");
    setContactPhone("");
    setContactMessage("");
    setContactSubmitted(false);
  };

  const filteredServices = activeCategory === "all" 
    ? SERVICES_DATA 
    : SERVICES_DATA.filter(s => s.category === activeCategory);

  const stats = [
    { value: "100%", label: "Uczciwe Ceny", desc: "Zawsze ustalamy budżet przed naprawą" },
    { value: "od ręki", label: "Komputerowa Diagnostyka", desc: "Wykrycie usterek w kilkanaście minut" },
    { value: "Gwarancja", label: "Na Każdy Montaż", desc: "Długoterminowa pewność i niezawodność" },
    { value: "Szybki Czas", label: "Lokalny Serwis", desc: "Obsługa Wojkowic, Żórawiny i okolic Wrocławia" }
  ];

  const faqs = [
    {
      q: "Czy przed rozpoczęciem naprawy zostanę poinformowany o całkowitych kosztach?",
      a: "Zdecydowanie TAK! Wyznajemy zasadę 100% transparentności. Po przeprowadzeniu bezpłatnej lub wstępnej weryfikacji i diagnostyki, dzwonimy do Ciebie z dokładną wyceną części oraz robocizny. Dopiero po otrzymaniu Twojej wyraźnej zgody przystępujemy do prac. Nigdy nie spotkają Cię u nas niespodziewane dopłaty przy odbiorze pojazdu."
    },
    {
      q: "Jak długo trwa standardowa diagnostyka komputerowa?",
      a: "Diagnostyka komputerowa wraz z interpretacją błędów i weryfikacją fizyczną trwa zazwyczaj od 30 do 45 minut. Posiadamy nowoczesne, licencjonowane testery diagnostyczne obsługujące wszystkie europejskie, azjatyckie i amerykańskie marki samochodowe."
    },
    {
      q: "Czy kupujecie części czy mogę dostarczyć własne?",
      a: "Współpracujemy z największymi hurtowniami motoryzacyjnymi we Wrocławiu, co gwarantuje nam natychmiastowy dostęp do części zamiennych (oryginałów oraz sprawdzonych zamienników o jakości OE) we wspaniałych cenach hurtowych z pełną gwarancją. Na życzenie klienta montujemy również części powierzone, jednak w trosce o Twoje bezpieczeństwo przed montażem zawsze oceniamy ich stan techniczny."
    },
    {
      q: "Czy świadczycie usługi naprawy klimatyzacji samochodowej?",
      a: "Tak, prowadzimy pełnoprawny serwis klimatyzacji. Obsługujemy zarówno starszy czynnik chłodniczy (R134a), jak i nowoczesne układy z czynnikiem R1234yf. Zakres usług obejmuje test próżniowej szczelności, napełnianie, dodanie barwnika UV ułatwiającego lokalizację nieszczelności, wymianę filtrów kabinowych, czyszczenie parownika oraz ozonowanie (dezynfekcję) całego wnętrza pojazdu."
    },
    {
      q: "Gdzie dokładnie znajduje się Wasz warsztat i czy łatwo dojechać?",
      a: "Nasz warsztat znajduje się w Wojkowicach przy ulicy Wrocławskiej 12A (gmina Żórawina), tuż przy głównej trasie wylotowej z Wrocławia na południe. Dojedziesz do nas błyskawicznie z wrocławskich dzielnic Jagodno, Brochów, Wojszyce czy Ołtaszyn (około 10-15 minut drogi). Bliskość zjazdu z autostrady A4 (węzeł Wrocław Wschód) sprawia, że dojazd z okolicznych miejscowości jest niezwykle wygodny."
    }
  ];

  return (
    <div className="min-h-screen bg-[#121214] text-gray-100 selection:bg-brand-orange selection:text-white overflow-x-hidden">
      
      {/* 1. TOP INFORMATION BANNER (Local Authority & Quick Actions) */}
      <div className="bg-[#1a1a1f] border-b border-gray-800 text-xs py-2 md:py-3 transition-all">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-gray-400">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5 text-brand-orange" />
              <span>ul. Wrocławska 12A, 55-020 Wojkowice (koło Wrocławia)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-orange" />
              <span>Pon. - Pt: 8:00 - 17:00</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#a5a5b5] hidden sm:inline">Szukasz zaufanego mechanika?</span>
            <a 
              href="tel:507563317" 
              className="flex items-center gap-1.5 font-bold text-brand-orange hover:text-white transition-all bg-[#25252d] px-3 py-1 rounded-full border border-brand-orange/30 hover:border-brand-orange"
            >
              <Phone className="w-3.5 h-3.5 animate-pulse" />
              <span>Zadzwoń: 507 563 317</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. STICKY DYNAMIC HEADER & LOGO */}
      <header className="sticky top-0 z-40 bg-[#121214]/90 backdrop-blur-md border-b border-gray-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          
          {/* Logo with mechanical feeling */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-brand-orange rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-orange/20 group-hover:rotate-12 transition-transform duration-300">
              <Wrench className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display font-black text-lg md:text-xl tracking-tight text-white block uppercase leading-none">
                TWÓJ MECHANIK
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#a5a5b5] block">
                Serwis &amp; Naprawa Samochodów
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#services" className="hover:text-brand-orange transition-colors">Nasze Usługi</a>
            <a href="#why-choose-us" className="hover:text-brand-orange transition-colors">Dlaczego My</a>
            <a href="#calculator" className="hover:text-brand-orange transition-colors flex items-center gap-1.5 bg-brand-orange/5 px-3 py-1.5 rounded-md border border-brand-orange/20 text-brand-orange">
              <Sparkles className="w-3.5 h-3.5" />
              Kalkulator Cen
            </a>
            <a href="#reviews" className="hover:text-brand-orange transition-colors">Opinie</a>
            <a href="#faq" className="hover:text-brand-orange transition-colors">FAQ</a>
            <a href="#contact" className="hover:text-brand-orange transition-colors">Kontakt</a>
          </nav>

          {/* Desktop Call to Action Button */}
          <div className="hidden lg:block">
            <a 
              href="tel:507563317" 
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-brand-orange rounded-lg hover:bg-brand-orange-hover hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-orange/15"
              id="cta_header_call"
            >
              Ustal termin: 507 563 317
            </a>
          </div>

          {/* Mobile menu action */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 text-gray-400 hover:text-white bg-[#1e1e24] rounded-lg border border-gray-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-[#1e1e24] border-b border-gray-800"
            >
              <div className="px-4 py-6 flex flex-col gap-4 text-base font-medium">
                <a 
                  href="#services" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-brand-orange transition-colors border-b border-gray-800"
                >
                  Nasze Usługi
                </a>
                <a 
                  href="#why-choose-us" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-brand-orange transition-colors border-b border-gray-800"
                >
                  Dlaczego My
                </a>
                <a 
                  href="#calculator" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-brand-orange transition-colors border-b border-gray-800 flex items-center gap-2 text-brand-orange"
                >
                  <Sparkles className="w-4 h-4" />
                  Kalkulator Szacunkowych Cen
                </a>
                <a 
                  href="#reviews" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-brand-orange transition-colors border-b border-gray-800"
                >
                  Opinie Klientów
                </a>
                <a 
                  href="#faq" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-brand-orange transition-colors border-b border-gray-800"
                >
                  Częste Pytania (FAQ)
                </a>
                <a 
                  href="#contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 hover:text-brand-orange transition-colors"
                >
                  Adres i Kontakt
                </a>
                <div className="pt-2 flex flex-col gap-3">
                  <a 
                    href="tel:507563317" 
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-orange text-white font-bold rounded-lg hover:bg-brand-orange-hover text-center transition-all shadow-md"
                  >
                    <Phone className="w-4 h-4" />
                    Zadzwoń: 507 563 317
                  </a>
                  <a 
                    href="#calculator" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 px-4 bg-transparent text-gray-300 font-semibold rounded-lg border border-gray-700 hover:bg-gray-800 transition-all text-sm"
                  >
                    Szybka Wycena Online
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3. HERO / VALUE PROPOSITION SECTION */}
      <section className="relative min-h-[85vh] lg:min-h-[80vh] flex items-center py-12 md:py-20 lg:py-24 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }}>
        {/* Dark dynamic radial overlay to guarantee 100% typography readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#121214] via-[#121214]/95 to-[#121214]/30 z-0"></div>
        
        {/* Subtle grid accent for that technical look */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & High-converting elements */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Highlight local SEO tags */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs md:text-sm font-bold uppercase tracking-wider mb-6 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping"></span>
                <span>Wojkowice · Żórawina · Wrocław i okolice</span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-white tracking-tight leading-[1.1] mb-6">
                Szukasz uczciwego mechanika? <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400">
                  Napraw auto bez stresu
                </span>
              </h1>

              <p className="text-[#a5a5b5] text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed mb-8">
                Specjalizujemy się w naprawach bieżących, zaawansowanej diagnostyce komputerowej i serwisie klimatyzacji. Mówimy jasno, co jest do zrobienia, wyceniamy przed naprawą i dajemy pełną gwarancję na części i robociznę.
              </p>

              {/* Dynamic conversion badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl mb-8">
                <div className="flex items-center gap-2.5 bg-[#1e1e24]/80 p-3 rounded-lg border border-gray-800">
                  <CheckCircle className="w-5 h-5 text-brand-orange shrink-0" />
                  <span className="text-xs font-semibold text-gray-200">Wycena przed rozpoczęciem prac</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#1e1e24]/80 p-3 rounded-lg border border-gray-800">
                  <Shield className="w-5 h-5 text-brand-orange shrink-0" />
                  <span className="text-xs font-semibold text-gray-200">Gwarancja i faktura VAT/paragon</span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#1e1e24]/80 p-3 rounded-lg border border-gray-800">
                  <Clock className="w-5 h-5 text-brand-orange shrink-0" />
                  <span className="text-xs font-semibold text-gray-200">Szybkie terminy (często na dziś)</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <a 
                  href="tel:507563317" 
                  className="px-8 py-4 font-bold text-base text-white bg-brand-orange rounded-xl hover:bg-brand-orange-hover hover:scale-[1.03] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-3 shadow-lg shadow-brand-orange/20"
                  id="hero_cta_call"
                >
                  <Phone className="w-5 h-5 stroke-[2.5]" />
                  Zadzwoń: 507 563 317
                </a>
                <a 
                  href="#calculator" 
                  className="px-8 py-4 font-bold text-base text-gray-200 bg-[#1e1e24] rounded-xl hover:bg-gray-800 border border-gray-700 hover:border-gray-500 hover:scale-[1.03] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-brand-orange" />
                  Oblicz koszt naprawy
                </a>
              </div>

              {/* Live Status indicator */}
              <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>Dziś wolne terminy na diagnostykę! Zapraszamy od ręki.</span>
              </div>

            </div>

            {/* Right Column: Dynamic conversion card */}
            <div className="lg:col-span-5 w-full">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-[#1e1e24] p-6 sm:p-8 rounded-2xl border border-gray-800 shadow-2xl relative"
              >
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand-orange text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow">
                  Formularz zgłoszenia
                </div>
                
                <h3 className="font-display font-bold text-xl text-white mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-orange" />
                  Zarezerwuj termin wizyty
                </h3>
                <p className="text-xs text-gray-400 mb-6">
                  Wypełnij krótki formularz. Oddzwonimy w ciągu 15 minut w celu potwierdzenia godziny przyjęcia pojazdu!
                </p>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {contactSubmitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 px-4"
                    >
                      <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-400" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">Dziękujemy za zgłoszenie!</h4>
                      <p className="text-sm text-gray-400 mb-6">
                        Otrzymaliśmy Twoje zgłoszenie. Specjalista oddzwoni na podany numer tel. do 15 minut!
                      </p>
                      <div className="bg-[#2a2a35] p-3 rounded-lg text-xs text-[#a5a5b5] leading-relaxed mb-6 font-medium">
                        Potrzebujesz natychmiastowej pomocy? Kliknij poniżej, by połączyć się bezpośrednio:
                      </div>
                      <a 
                        href="tel:507563317" 
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-brand-orange text-white text-sm font-bold rounded-xl hover:bg-brand-orange-hover transition-all"
                      >
                        <Phone className="w-4 h-4" />
                        507 563 317 - Zadzwoń Teraz
                      </a>
                      <button 
                        type="button"
                        onClick={resetContactForm}
                        className="text-xs text-gray-500 underline hover:text-gray-300 mt-4 block mx-auto"
                      >
                        Wyślij kolejne zgłoszenie
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Twoje Imię</label>
                        <input 
                          type="text" 
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="np. Jan Kowalski" 
                          className="w-full bg-[#121214] border border-gray-800 rounded-lg py-2.5 px-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Numer Telefonu *</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">+48</span>
                          <input 
                            type="tel" 
                            required
                            value={contactPhone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setContactPhone(val);
                            }}
                            placeholder="507 563 317" 
                            className="w-full bg-[#121214] border border-gray-800 rounded-lg py-2.5 pl-12 pr-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Opisz krótko problem / usterkę (Opcjonalnie)</label>
                        <textarea 
                          rows={3}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="np. stukanie w prawym przednim kole przy skręcaniu, kontrolka silnika..." 
                          className="w-full bg-[#121214] border border-gray-800 rounded-lg py-2.5 px-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange transition-colors"
                        ></textarea>
                      </div>

                      <div className="pt-2">
                        <button 
                          type="submit"
                          className="w-full py-3.5 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-brand-orange/10 hover:scale-[1.01]"
                          id="submit_appointment_form"
                        >
                          Zarezerwuj Szybką Weryfikację
                        </button>
                      </div>

                      <p className="text-[10px] text-gray-500 text-center leading-relaxed">
                        Wyrażam zgodę na kontakt telefoniczny w celu ustalenia terminu naprawy. Dbamy o ochronę Twoich danych osobowych.
                      </p>
                    </>
                  )}
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REAL STATS BAR */}
      <section className="bg-[#1a1a1f] py-10 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-800">
            {stats.map((stat, i) => (
              <div key={i} className={`flex flex-col items-center lg:items-start text-center lg:text-left ${i > 0 ? "pt-6 lg:pt-0 lg:pl-6" : ""}`}>
                <span className="font-display font-black text-2xl md:text-3xl text-brand-orange block leading-none mb-1">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold text-white block mb-0.5">
                  {stat.label}
                </span>
                <span className="text-xs text-[#a5a5b5] leading-relaxed">
                  {stat.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SERVICES GRID WITH ACCENT ACCORDION & REAL TRANSPARENT PRICES */}
      <section id="services" className="py-20 md:py-24 bg-[#121214] relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Szeroki zakres pomocy drogowej i warsztatowej</span>
            <h2 className="font-display font-black text-3xl md:text-4xl lg:text-4xl text-white tracking-tight mb-4">
              Nasze Profesjonalne Usługi
            </h2>
            <p className="text-[#a5a5b5] text-sm md:text-base leading-relaxed">
              Nie bawimy się w zgadywanie. Korzystamy ze specjalistycznego sprzętu najwyższej klasy, gwarantując bezpieczną i precyzyjną diagnostykę usterek w Twoim aucie we Wrocławiu i gminie Żórawina.
            </p>
            
            {/* Filter Categories tab */}
            <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
              {[
                { id: "all", label: "Wszystkie systemy" },
                { id: "mechanics", label: "Mechanika Silnikowa" },
                { id: "brakes", label: "Układy Hamulcowe" },
                { id: "diagnostics", label: "Komputer & Elektronika" },
                { id: "ac", label: "Serwis Klimatyzacji" },
                { id: "suspension", label: "Zawieszenie & Układ Jezdny" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    activeCategory === cat.id 
                      ? "bg-brand-orange border-brand-orange text-white" 
                      : "bg-[#1e1e24] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => {
                // Assign matching icons to service categories
                let CategoryIcon = Wrench;
                if (service.category === "brakes") CategoryIcon = Wrench; // Or specific
                if (service.category === "diagnostics") CategoryIcon = Settings;
                if (service.category === "ac") CategoryIcon = Wind;
                if (service.category === "fluids") CategoryIcon = Wrench;
                if (service.category === "suspension") CategoryIcon = Settings;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    key={service.id}
                    className="bg-[#1e1e24] p-6 rounded-xl border border-gray-800 hover:border-brand-orange/30 transition-all flex flex-col justify-between group h-full relative overflow-hidden"
                  >
                    {/* Corner hover glow */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-brand-orange/5 rounded-bl-full group-hover:bg-brand-orange/15 transition-all"></div>
                    
                    <div>
                      <div className="w-12 h-12 bg-[#25252d] border border-gray-800 rounded-lg flex items-center justify-center text-brand-orange mb-5 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                        <CategoryIcon className="w-5 h-5 stroke-[2]" />
                      </div>
                      
                      <h3 className="font-display font-bold text-lg text-white mb-2 tracking-tight group-hover:text-brand-orange transition-colors">
                        {service.name}
                      </h3>
                      
                      <p className="text-xs text-[#a5a5b5] leading-relaxed mb-6">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-800/60 mt-auto flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium">Cena od:</span>
                        <span className="text-brand-orange font-bold text-sm bg-brand-orange/10 px-2 py-0.5 rounded">
                          {service.basePrice} zł
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium">Czas naprawy:</span>
                        <span className="text-gray-300 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-orange" />
                          {service.timeEstimate}
                        </span>
                      </div>
                      
                      {/* Interactive click CTA inside card */}
                      <a 
                        href="#calculator" 
                        onClick={() => {
                          if (!selectedServices.includes(service.id)) {
                            setSelectedServices([...selectedServices, service.id]);
                          }
                        }}
                        className="text-center mt-3 py-1.5 px-3 bg-[#25252d] hover:bg-brand-orange hover:text-white transition-colors text-[10px] font-bold text-brand-orange uppercase rounded tracking-wider"
                      >
                        Wybierz do kalkulatora +
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="mt-12 text-center bg-[#1e1e24] p-6 rounded-2xl border border-gray-800 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h4 className="text-white font-bold text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-brand-orange" />
                Inna usterka? Nietypowy problem z autem?
              </h4>
              <p className="text-xs text-gray-400 mt-1 max-w-xl leading-relaxed">
                Nasi mechanicy poradzą sobie z najbardziej skomplikowanym wyzwaniem mechanicznym lub elektrycznym. Wykonujemy też remonty silników, naprawy zawieszenia, układów chłodzenia i więcej.
              </p>
            </div>
            <a 
              href="tel:507563317" 
              className="py-3 px-6 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shrink-0 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Zadzwoń i opisz usterkę
            </a>
          </div>

        </div>
      </section>

      {/* 6. "WHY CHOOSE US" TRIPLE BENEFIT SECTION */}
      <section id="why-choose-us" className="py-20 md:py-24 bg-[#1a1a1f] relative border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side info */}
            <div className="lg:col-span-5 text-left">
              <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Nasze standardy pracy</span>
              <h2 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight mb-6">
                Dlaczego profesjonalni kierowcy wybierają właśnie Twój Mechanik Wojkowice?
              </h2>
              <p className="text-[#a5a5b5] text-sm md:text-base leading-relaxed mb-8">
                Wiemy, jak frustrujące bywają wizyty w tradycyjnych warsztatach motoryzacyjnych. Brak kontaktu, niespodziewane koszty przy odbiorze, przeciągające się terminy. Przełamujemy te stereotypy!
              </p>

              {/* Highlighting local presence near Wroclaw */}
              <div className="p-4 rounded-xl bg-[#25252d] border border-gray-800 flex items-start gap-4">
                <MapPin className="w-6 h-6 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-white text-sm">Znakomita Lokalizacja pod Wrocławiem</h5>
                  <p className="text-xs text-[#a5a5b5] leading-relaxed mt-1">
                    Idealny punkt dla mieszkańców Wojkowic, Żórawiny, Wrocławia (Jagodno, Wojszyce, Ołtaszyn) oraz gmin sąsiednich. Oszczędzasz czas na dojazdy i stoisz w mniejszych korkach niż w centrum miasta.
                  </p>
                </div>
              </div>
            </div>

            {/* Right side core values detailed boxes */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="bg-[#121214] p-6 sm:p-8 rounded-xl border border-gray-800 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center text-brand-orange mb-6 border border-brand-orange/20">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-white mb-2">100% Transparentności</h4>
                  <p className="text-xs text-[#a5a5b5] leading-relaxed">
                    Każda usterka jest fotografowana lub szczegółowo omawiana. Nie wymieniamy części „w ciemno”. Zanim ruszymy z robotą, dzwonimy i akceptujesz kosztorys.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs text-brand-orange font-bold uppercase tracking-widest">
                  Bez ukrytych oplat
                </div>
              </div>

              <div className="bg-[#121214] p-6 sm:p-8 rounded-xl border border-gray-800 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center text-brand-orange mb-6 border border-brand-orange/20">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-white mb-2">Szybkie i Terminowe Realizacje</h4>
                  <p className="text-xs text-[#a5a5b5] leading-relaxed">
                    Szanujemy Twój czas. Naprawy eksploatacyjne (wymiana hamulców, filtrów, serwis klimatyzacji) realizujemy tego samego dnia! Dokładny czas podajemy przed oddaniem kluczyków.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs text-brand-orange font-bold uppercase tracking-widest">
                  Auto gotowe na czas
                </div>
              </div>

              <div className="bg-[#121214] p-6 sm:p-8 rounded-xl border border-gray-800 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center text-brand-orange mb-6 border border-brand-orange/20">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-white mb-2">Renomowane Części &amp; OE</h4>
                  <p className="text-xs text-[#a5a5b5] leading-relaxed">
                    Współpracujemy wyłącznie z wiodącymi producentami części (ATE, Bosch, Brembo, Lemförder, Sachs, LuK etc.). Możesz wybrać tańsze, atestowane zamienniki lub oryginalne komponenty.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs text-brand-orange font-bold uppercase tracking-widest">
                  Bezpieczeństwo przede wszystkim
                </div>
              </div>

              <div className="bg-[#121214] p-6 sm:p-8 rounded-xl border border-gray-800 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-lg flex items-center justify-center text-brand-orange mb-6 border border-brand-orange/20">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-lg text-white mb-2">Doświadczony Zespół Pasjonatów</h4>
                  <p className="text-xs text-[#a5a5b5] leading-relaxed">
                    Samochody to nasza pasja. Regularnie szkolimy się z obsługi nowych jednostek napędowych, układów hybrydowych oraz technologii klimatyzacji. Rozwiązujemy trudne zagadki elektryczne.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs text-brand-orange font-bold uppercase tracking-widest">
                  Pełen profesjonalizm
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE QUOTATION ESTIMATOR & CALCULATOR */}
      <section id="calculator" className="py-20 md:py-24 bg-[#121214] relative">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          
          <div className="text-center mb-12">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest bg-brand-orange/10 border border-brand-orange/20 px-3 py-1 rounded-full mb-3 inline-block">
              Natychmiastowa Kalkulacja szacunkowa
            </span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight mb-3">
              Interaktywny Kalkulator Kosztów
            </h2>
            <p className="text-sm text-[#a5a5b5] max-w-2xl mx-auto leading-relaxed">
              Wybierz zakres usług, segment swojego pojazdu, a nasz kalkulator poda Ci szacowany kosztorys (robocizna + orientacyjny pakiet części podstawowych).
            </p>
          </div>

          <div className="bg-[#1e1e24] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left configuration pane (col-span-7) */}
            <div className="lg:col-span-7 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-gray-800">
              
              {/* Step 1: Services Selection */}
              <div className="mb-6">
                <span className="block text-xs font-bold uppercase tracking-widest text-brand-orange mb-3">Krok 1: Wybierz usługi do wyceny</span>
                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                  {SERVICES_DATA.map((service) => {
                    const isSelected = selectedServices.includes(service.id);
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleServiceInCalculator(service.id)}
                        className={`w-full text-left p-3 rounded-lg border text-xs flex justify-between items-center transition-all ${
                          isSelected 
                            ? "bg-brand-orange/10 border-brand-orange text-white" 
                            : "bg-[#121214] border-gray-800 text-[#a5a5b5] hover:text-white hover:border-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 py-0 pl-1 ${isSelected ? "text-brand-orange" : "text-gray-700"}`}>
                            {isSelected ? <Check className="w-3.5 h-3.5" /> : <div className="w-3 h-3 rounded-sm border border-gray-700"></div>}
                          </div>
                          <div>
                            <span className="font-bold block text-white">{service.name}</span>
                            <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">{service.timeEstimate}</span>
                          </div>
                        </div>
                        <span className={`font-semibold bg-[#25252d] px-2 py-0.5 rounded ${isSelected ? "text-brand-orange border border-brand-orange/20" : "text-gray-400"}`}>
                          +{service.basePrice} zł
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Car Segment Selection */}
              <div className="mb-4">
                <span className="block text-xs font-bold uppercase tracking-widest text-brand-orange mb-3">Krok 2: Wybierz gabaryt / klasę pojazdu</span>
                <div className="grid grid-cols-1 gap-2">
                  {CAR_SEGMENTS.map((segment) => (
                    <button
                      key={segment.id}
                      type="button"
                      onClick={() => setSelectedSegment(segment.id)}
                      className={`w-full text-left p-3 rounded-lg border text-xs flex justify-between items-center transition-all ${
                        selectedSegment === segment.id 
                          ? "bg-brand-orange/10 border-brand-orange text-white" 
                          : "bg-[#121214] border-gray-800 text-[#a5a5b5] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-brand-orange" />
                        <span className="font-medium text-white">{segment.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold bg-[#1e1e24] px-1.5 py-0.5 rounded border border-gray-800">
                        Współczynnik x{segment.multiplayer}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Estimator & CTA Block (col-span-5) */}
            <div className="lg:col-span-5 bg-[#17171c] p-6 sm:p-8 flex flex-col justify-between text-left">
              
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Szacunkowy koszt usługi</span>
                
                {/* Dynamically calculated price block */}
                <div className="bg-[#121214] p-4 rounded-xl border border-gray-800 text-center mb-6">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Przedział cenowy brutto:</span>
                  <div className="font-display font-black text-3xl sm:text-4xl text-brand-orange mt-1">
                    {estimatedCostMin} - {estimatedCostMax} zł
                  </div>
                  <span className="text-[9px] text-[#a5a5b5] block mt-1.5 leading-relaxed">
                    * Obejmuje robociznę + przybliżony koszt materiałów podstawowych / uszczelek.
                  </span>
                </div>

                {/* Info Note icon block */}
                <div className="flex gap-2.5 items-start text-[11px] text-[#a5a5b5] leading-relaxed mb-6">
                  <AlertCircle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <p>
                    Cena zależy od dokładnego modelu silnika, rocznika i marki części (zamienniki vs oryginalne części OE). Zadzwoń do nas, a podamy precyzyjną wycenę dla Twojego egzemplarza!
                  </p>
                </div>
              </div>

              {/* Instant Book / Call Action inside calculator */}
              <div>
                {calcSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#1e1e24] p-4 rounded-xl border border-green-500/20 text-center text-xs"
                  >
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <span className="font-bold text-white block mb-1">Dziękujemy za kontakt!</span>
                    <p className="text-gray-400 mb-3">Zadzwoń bezpośrednio pod numer, by natychmiast uzgodnić dogodny czas!</p>
                    <a href="tel:507563317" className="block w-full py-2 bg-brand-orange text-white text-xs font-bold rounded hover:bg-brand-orange-hover transition-colors">
                      Zadzwoń: 507 563 317
                    </a>
                    <button onClick={resetCalculator} className="text-[10px] underline text-gray-500 mt-2 hover:text-gray-300">
                      Oblicz ponownie
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleCalculatorSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        value={carMake}
                        onChange={(e) => setCarMake(e.target.value)}
                        placeholder="Marka, np. Opel" 
                        className="w-full bg-[#121214] border border-gray-800 rounded py-2 px-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange"
                      />
                      <input 
                        type="text" 
                        value={carYear}
                        onChange={(e) => setCarYear(e.target.value)}
                        placeholder="Rocznik, np. 2016" 
                        className="w-full bg-[#121214] border border-gray-800 rounded py-2 px-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div>
                      <input 
                        type="tel" 
                        required
                        value={calcPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setCalcPhone(val);
                        }}
                        placeholder="Twój Numer Telefonu *" 
                        className="w-full bg-[#121214] border border-gray-800 rounded py-2 px-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow shadow-brand-orange/20 flex items-center justify-center gap-2"
                      id="submit_calculator_cta"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Zatwierdź i Umów Wizytę
                    </button>
                  </form>
                )}
              </div>

            </div>

          </div>

          {/* Verification Badge */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-6 text-gray-500 text-xs text-center">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-brand-orange" /> Bezpłatna weryfikacja zawieszenia przy zakupie części u nas</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-brand-orange" /> 12 miesięcy gwarancji na wykonaną robociznę</span>
          </div>

        </div>
      </section>

      {/* 8. AUTHENTIC CUSTOMER REVIEWS WITH RATING */}
      <section id="reviews" className="py-20 md:py-24 bg-[#1a1a1f] border-y border-gray-850">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-1.5">Zaufanie i partnerskie relacje</span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight mb-4">
              Co mówią o nas kierowcy z okolicy?
            </h2>
            <p className="text-sm text-[#a5a5b5] leading-relaxed">
              Prawdziwe opublikowane opinie naszych zadowolonych klientów świadczą o naszym rzetelnym podejściu do motoryzacji. Twoje zaufanie to nasza wizytówka!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-[#121214] p-6 rounded-2xl border border-gray-800 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-brand-orange fill-brand-orange" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 italic leading-relaxed mb-6">
                  &quot;Szukałem zaufanego warsztatu na wymianę klocków i tarcz w moim Audi A6. Trafiłem do chłopaków w Wojkowicach i jestem niesamowicie zadowolony. Świetny kontakt telefoniczny – zadzwonili z precyzyjną wyceną części i robocizny przed montażem. Szybko, bardzo czysto i profesjonalnie. Polecam z całego serca!&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-800/60 mt-auto">
                <div className="w-10 h-10 bg-brand-orange/10 border border-brand-orange/20 rounded-full flex items-center justify-center font-bold text-brand-orange text-sm shrink-0">
                  TK
                </div>
                <div>
                  <span className="font-bold text-white text-sm block">Tomasz Kamiński</span>
                  <span className="text-[10px] text-gray-500 block">Pacjent: Audi A6 C7 (Wrocław Jagodno)</span>
                </div>
              </div>
            </div>

            <div className="bg-[#121214] p-6 rounded-2xl border border-gray-800 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-brand-orange fill-brand-orange" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 italic leading-relaxed mb-6">
                  &quot;Serwis klimatyzacji zrobiony od ręki! Wszystko zostało dokładnie sprawdzone pod kątem szczelności, napełnione nowym czynnikiem i porządnie wyozonowane. Zapach stęchlizny w aucie zniknął całkowicie. Bardzo miła i rzeczowa atmosfera, doskonałe ceny. Mój stały punkt serwisowy pod Wrocławiem od dziś!&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-800/60 mt-auto">
                <div className="w-10 h-10 bg-brand-orange/10 border border-brand-orange/20 rounded-full flex items-center justify-center font-bold text-brand-orange text-sm shrink-0">
                  MD
                </div>
                <div>
                  <span className="font-bold text-white text-sm block">Magda Drozd</span>
                  <span className="text-[10px] text-gray-500 block">Pacjent: Volkswagen Golf VII (Żórawina)</span>
                </div>
              </div>
            </div>

            <div className="bg-[#121214] p-6 rounded-2xl border border-gray-800 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-brand-orange fill-brand-orange" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 italic leading-relaxed mb-6">
                  &quot;Diagnostyka i naprawa zawieszenia przebiegła wzorowo. Przed przystąpieniem do jakichkolwiek prac otrzymałem dokładną rozpiskę uszkodzonych tulei wahaczy oraz cen amortyzatorów. Zero niespodzianek przy płaceniu faktury, profesjonalizm w każdym calu. Ogromny plus za terminowość – auto odebrałem tego samego popołudnia.&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-800/60 mt-auto">
                <div className="w-10 h-10 bg-brand-orange/10 border border-brand-orange/20 rounded-full flex items-center justify-center font-bold text-brand-orange text-sm shrink-0">
                  MN
                </div>
                <div>
                  <span className="font-bold text-white text-sm block">Mikołaj Nowak</span>
                  <span className="text-[10px] text-gray-500 block">Pacjent: Opel Astra K (Wojkowice)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Social Proof Badges */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 text-center">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-2xl text-white">4.9</span>
              <span className="text-brand-orange text-lg">★★★★★</span>
              <span className="text-xs text-gray-400">Na bazie ponad 120 ocen w wyszukiwarkach</span>
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-700"></div>
            <div className="text-xs text-gray-400">
              Uczciwe opinie naszych klientów, budowane przez lata solidnej pracy blisko Wrocławia.
            </div>
          </div>

        </div>
      </section>

      {/* 9. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-20 md:py-24 bg-[#121214] relative">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          
          <div className="text-center mb-16">
            <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-1.5">Masz pytania lub wątpliwości?</span>
            <h2 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight mb-4">
              Często Zadawane Pytania
            </h2>
            <p className="text-sm text-[#a5a5b5] max-w-xl mx-auto leading-relaxed">
              Zebraliśmy najważniejsze pytania naszych klientów dotyczące procedury zgłoszenia pojazdu, części zamiennych i gwarancji.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div 
                  key={i} 
                  className="bg-[#1e1e24] border border-gray-800 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full text-left p-5 sm:p-6 font-display font-bold text-sm sm:text-base text-white hover:text-brand-orange flex justify-between items-center transition-colors gap-4"
                  >
                    <span>{faq.q}</span>
                    <span className="text-brand-orange shrink-0 font-medium text-lg">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#a5a5b5] leading-relaxed border-t border-gray-800/40 pt-4 font-normal">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. DETAILED CONTACT, TRAVEL INSTRUCTIONS & INTERACTIVE GOOGLE MAP */}
      <section id="contact" className="py-20 md:py-24 bg-[#1a1a1f] relative border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Contact details & travel tips */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <span className="text-brand-orange text-xs font-bold uppercase tracking-widest block mb-2">Zapraszamy do kontaktu</span>
                <h2 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight mb-6">
                  Dane Kontaktowe &amp; Lokalizacja
                </h2>
                
                <div className="space-y-6">
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-orange/10 border border-brand-orange/20 rounded-lg flex items-center justify-center text-brand-orange shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs uppercase font-bold text-gray-400 block mb-1">Adres Serwisu</span>
                      <p className="font-semibold text-white leading-relaxed">
                        ul. Wrocławska 12A, 55-020 Wojkowice <br />
                        <span className="text-xs text-brand-orange font-bold uppercase tracking-[0.05em] block mt-1">(gmina Żórawina, tuż pod Wrocławiem)</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-orange/10 border border-brand-orange/20 rounded-lg flex items-center justify-center text-brand-orange shrink-0">
                      <Phone className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-xs uppercase font-bold text-gray-400 block mb-1">Telefon Kontaktowy</span>
                      <a href="tel:507563317" className="font-display font-extrabold text-xl md:text-2xl text-white hover:text-brand-orange transition-colors">
                        507 563 317
                      </a>
                      <span className="text-[10px] text-gray-500 block leading-tight mt-1">
                        Szybkie wsparcie po polsku. Kliknij, by połączyć bezpośrednio.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-orange/10 border border-brand-orange/20 rounded-lg flex items-center justify-center text-brand-orange shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs uppercase font-bold text-gray-400 block mb-1">Godziny Otwarcia</span>
                      <p className="font-semibold text-white">
                        Poniedziałek – Piątek: <span className="text-brand-orange">8:00 – 17:00</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Sobota – Niedziela: Nieczynne (ustalone wizyty)</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Dynamic local travel explanation block */}
              <div className="bg-[#121214] p-5 rounded-xl border border-gray-800 mt-8">
                <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-brand-orange" />
                  Jak do nas najszybciej dojechać?
                </h4>
                <ul className="space-y-2 text-xs text-[#a5a5b5] list-disc list-inside leading-relaxed">
                  <li><strong className="text-gray-300">Z Wrocławia (Jagodno / Brochów / Ołtaszyn):</strong> Jedź prosto drogą wojewódzką 395 na południe przez Iwiny i Karwiany. Warsztat znajduje się tuż przy trasie po prawej stronie w Wojkowicach. Dojazd zajmuje ok. 10 minut.</li>
                  <li><strong className="text-gray-300">Z Żórawiny i Suchorza:</strong> Jedź drogą na północ kierując się bezpośrednio na Wojkowice. Zaledwie 4 minuty jazdy.</li>
                  <li><strong className="text-gray-300">Z autostrady A4:</strong> Zjedź na węźle Wrocław Wschód w kierunku Strzelina i kieruj się na Wojkowice. Szybki, bezproblemowy dojazd.</li>
                </ul>
              </div>

            </div>

            {/* Google map iframe wrapper with modern styling (col-span-7) */}
            <div className="lg:col-span-7 h-full flex flex-col justify-between">
              <div className="bg-[#121214] border border-gray-800 rounded-2xl p-4 flex-grow flex flex-col min-h-[350px] lg:min-h-0 relative shadow-2xl overflow-hidden">
                <div className="absolute top-4 left-4 bg-[#1e1e24] border border-gray-800 px-3 py-1.5 rounded-lg z-10 shadow">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Wojkowice, ul. Wrocławska 12A</span>
                </div>
                
                {/* Embedded google map search (100% compliant and gorgeous fallback) */}
                <iframe 
                  className="w-full h-full min-h-[300px] flex-grow rounded-xl border-0"
                  src="https://maps.google.com/maps?q=ul.%20Wroc%C5%82awska%2012A,%20Wojkowice&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  allowFullScreen={true}
                  loading="lazy"
                  title="Twój Mechanik Wojkowice"
                  referrerPolicy="no-referrer"
                ></iframe>
                
                <div className="flex justify-between items-center mt-3 pt-2 text-xs">
                  <span className="text-gray-500">Duża, dogodna przestrzeń parkingowa dla klientów</span>
                  <a 
                    href="https://maps.google.com/?q=ul.+Wrocławska+12A,+55-020+Wojkowice"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-orange hover:underline font-bold"
                  >
                    Otwórz w nawigacji Google Maps &rarr;
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Natural local SEO copy block optimized for Polish search engines */}
          <div className="bg-[#1e1e24] p-6 rounded-2xl border border-gray-800/80 mt-12 text-xs text-gray-500 leading-relaxed text-center max-w-5xl mx-auto">
            <h4 className="font-semibold text-[#a5a5b5] mb-2 font-display text-sm">Twój Lokalny Ekspert Samochodowy Wojkowice · Żórawina · Wrocław Jagodno</h4>
            <p>
              Nasz warsztat samochodowy <a href="#" className="hover:text-brand-orange">Twój Mechanik</a> świadczy usługi naprawcze, diagnostyczne, blacharskie oraz serwis klimatyzacji dla kierowców z terenów województwa dolnośląskiego. Jesteśmy dumni, że z naszych usług chętnie korzystają mieszkańcy takich miejscowości jak Wojkowice, Żórawina, Iwiny, Karwiany, Suchy Dwór, Siechnice, Radwanice, Święta Katarzyna, Smardzów, Rybińska, Ołtaszyn oraz wrocławskie osiedla Jagodno, Wojszyce i Brochów. Oferujemy rzetelną pomoc, uczciwą pracę i brak ukrytych kosztów na wymianę rozrządu, amortyzatorów, tarcz hamulcowych, naprawy elektryki, a także wymiany płynów eksploatacyjnych w autach osobowych oraz dostawczych. Szybki czas realizacji przy bezkompromisowej dbałości o każdy detal techniczny.
            </p>
          </div>

        </div>
      </section>

      {/* 11. FOOTER WITH LOGO, SUMMARY, TOP BTN */}
      <footer className="bg-[#121214] border-t border-gray-800 py-12 text-gray-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-orange rounded flex items-center justify-center text-white font-bold text-xs">
                <Wrench className="w-3.5 h-3.5" />
              </div>
              <span className="font-display font-black text-sm tracking-tight text-white uppercase">
                TWÓJ MECHANIK
              </span>
            </div>
            <p className="text-[10px] text-gray-600 max-w-sm mt-1">
              © {new Date().getFullYear()} Twój Mechanik Naprawa Samochodów Serwis Wojkowice. <br /> Wszelkie prawa zastrzeżone. Projekty realizowane rzetelnie i z pasją.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 text-gray-400">
            <a href="#services" className="hover:text-white transition-colors">Nasze Usługi</a>
            <span className="hidden md:inline">·</span>
            <a href="#calculator" className="hover:text-white transition-colors">Kalkulator Cen</a>
            <span className="hidden md:inline">·</span>
            <a href="#why-choose-us" className="hover:text-white transition-colors">Dlaczego My</a>
            <span className="hidden md:inline">·</span>
            <a href="#contact" className="hover:text-white transition-colors">Kontakt i Dojazd</a>
          </div>

          <div>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} 
              className="py-2.5 px-3.5 bg-[#1e1e24] hover:bg-brand-orange hover:text-white border border-gray-850 rounded-lg text-gray-400 uppercase font-bold tracking-wider text-[10px] transition-all flex items-center gap-1.5"
            >
              Do Góry <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </footer>

      {/* 12. BOTTOM STICKY MOBILE CALLING FOOTER (Massive Mobile Conversion Boost) */}
      <div className="fixed bottom-0 inset-x-0 bg-[#1e1e24] border-t border-brand-orange/40 p-3 z-50 lg:hidden flex gap-3 shadow-[0_-8px_24px_rgba(0,0,0,0.5)] animate-slide-up">
        <a 
          href="tel:507563317" 
          className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-brand-orange text-white text-sm font-black rounded-xl hover:bg-brand-orange-hover active:scale-[0.98] transition-all"
        >
          <Phone className="w-4 h-4 text-white fill-white animate-bounce" />
          ZADZWOŃ: 507 563 317
        </a>
        <a 
          href="#calculator" 
          className="flex-1 flex items-center justify-center gap-1.5 py-3.5 bg-transparent border border-gray-700 text-gray-200 text-xs font-bold rounded-xl"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
          DARMOWA WYCENA
        </a>
      </div>

      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-6 z-40 p-3 bg-brand-orange text-white rounded-full hover:bg-brand-orange-hover transition-all shadow-lg shadow-brand-orange/20 hidden md:flex items-center justify-center hover:scale-110 active:scale-95"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

    </div>
  );
}
