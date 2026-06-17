import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Play,
  ShieldCheck,
  Briefcase,
  Users,
  Smile,
  CalendarDays,
} from "lucide-react";

const BASE_URL = import.meta.env.BASE_URL;
const PROFILE = {
  name: "Harshit Saini",
  role: "Flutter Developer | Cross-Platform Mobile Engineer | Cybersecurity Analyst",
  email: "harshitsaini0133@gmail.com",
  phone: "+91 63504 81444",
  phoneHref: "tel:+916350481444",
  location: "Jaipur, India",
  resume: `${BASE_URL}assets/HarshitSaini.pdf`,
  socials: {
    linkedin: "https://www.linkedin.com/in/harshit-saini-8035cy",
    github: "https://github.com/harshitsaini0133",
    tryhackme: "https://tryhackme.com/p/harshitsaini0133",
  },
};

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const HERO_IMAGE =
  "https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png";

const MARQUEE_IMAGES = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

const ABOUT_DECORATIONS = [
  {
    alt: "Moon 3D icon",
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png",
    className:
      "top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]",
    delay: 0.1,
    x: -80,
  },
  {
    alt: "Abstract 3D object",
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png",
    className:
      "bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]",
    delay: 0.25,
    x: -80,
  },
  {
    alt: "Lego 3D icon",
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png",
    className:
      "top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]",
    delay: 0.15,
    x: 80,
  },
  {
    alt: "Grouped 3D shapes",
    src: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png",
    className:
      "bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]",
    delay: 0.3,
    x: 80,
  },
];

/* ---- NEW FIGMA DATA ---- */

const SERVICE_CARDS = [
  {
    title: "Startup & MVP Development",
    description:
      "Quickly validate your concept with a market-ready minimum viable product built for speed and scalability.",
    image: `${BASE_URL}assets/images/service_startup_mvp.png`,
  },
  {
    title: "Full-Cycle Development",
    description:
      "End-to-end app creation: design, development, testing, deployment, and ongoing support.",
    image: `${BASE_URL}assets/images/service_fullcycle.png`,
  },
  {
    title: "Custom Solution",
    description:
      "Bespoke applications tailored to your unique business needs, workflows, and growth goals.",
    image: `${BASE_URL}assets/images/service_custom.png`,
  },
];

const STATS = [
  {
    value: "50+",
    label: "Projects Completed",
    icon: Briefcase,
  },
  {
    value: "250K+",
    label: "Followers across all channels",
    icon: Users,
  },
  {
    value: "30+",
    label: "Happy Clients",
    icon: Smile,
  },
  {
    value: "4+",
    label: "Years of Experience",
    icon: CalendarDays,
  },
];

const STEPS = [
  {
    step: "01",
    title: "Discovery Call",
    description:
      "First, we learn your vision and requirements to define the project scope and goals clearly.",
    image: `${BASE_URL}assets/images/step_discovery.png`,
  },
  {
    step: "02",
    title: "Design",
    description:
      "We begin by understanding your vision and goals to craft intuitive, beautiful app interfaces.",
    image: `${BASE_URL}assets/images/step_design.png`,
  },
  {
    step: "03",
    title: "Development",
    description:
      "Our developers turn your designs into clean, scalable code using modern frameworks and best practices.",
    image: `${BASE_URL}assets/images/step_development.png`,
  },
  {
    step: "04",
    title: "Testing",
    description:
      "Rigorous testing ensures your app is bug-free, responsive, and performs flawlessly on all devices.",
    image: `${BASE_URL}assets/images/step_testing.png`,
  },
  {
    step: "05",
    title: "Deployment",
    description:
      "We handle the launch process, from app store submission to server configuration and go-live support.",
    image: `${BASE_URL}assets/images/step_deployment.png`,
  },
  {
    step: "06",
    title: "Maintenance",
    description:
      "Ongoing monitoring, updates, and improvements keep your app secure, fast, and up to date.",
    image: `${BASE_URL}assets/images/step_maintenance.png`,
  },
];

const PROJECTS = [
  {
    number: "01",
    title: "Beavr Lifestyle",
    meta: "Published on Google Play",
    description:
      "Production-level lifestyle application with optimized API handling, Firebase push notifications, Supabase integration, Custom Painter work, and smooth UI animations for an enhanced user experience.",
    tags: ["Flutter", "Dart", "Firebase", "Supabase", "Rive", "Lottie"],
    highlights: ["Google Play release", "Push notifications", "Animated UI"],
  },
  {
    number: "02",
    title: "Attendora",
    meta: "Attendance Management App",
    description:
      "Smart attendance tracking system with role-based access, real-time attendance logging, reporting workflows, automated notifications, Firestore Database, and Razorpay integration.",
    tags: ["Flutter", "Dart", "Firebase", "Firestore", "Razorpay"],
    highlights: ["Published app", "Role-based access", "Realtime reports"],
  },
  {
    number: "03",
    title: "Fast2Book",
    meta: "Service Booking App",
    description:
      "On-demand service booking platform where users can browse services, book appointments, complete secure payments, and receive real-time status updates and notifications.",
    tags: ["Flutter", "Dart", "Firebase", "Payments", "Notifications"],
    highlights: ["Published app", "Booking flow", "Payment gateway"],
  },
  {
    number: "04",
    title: "RideFizz",
    meta: "Ride Sharing Application",
    description:
      "Ride-sharing mobile app that lets users post rides, search routes, book seats, communicate through in-app chat, and use rating and review workflows.",
    tags: ["Flutter", "Dart", "Firebase", "Google Maps", "Chat"],
    highlights: ["Route search", "Seat booking", "Reviews"],
  },
  {
    number: "05",
    title: "RideNTour",
    meta: "Ride Booking & Tour Package App",
    description:
      "Mobility application combining real-time cab booking with tour package browsing and booking features, including fare calculation and secure payment processing.",
    tags: ["Flutter", "Dart", "Firebase", "Google Maps", "Payments"],
    highlights: ["Cab booking", "Tour packages", "Fare calculation"],
  },
  {
    number: "06",
    title: "Bhawani Fitness",
    meta: "Yoga & Wellness Subscription App",
    description:
      "Subscription-based fitness platform for purchasing plans, onboarding calls, daily live yoga sessions, attendance tracking, personalized diet plans, and push reminders.",
    tags: ["Flutter", "Dart", "Firebase", "Subscriptions", "Notifications"],
    highlights: ["Live sessions", "Diet plans", "Attendance tracking"],
  },
  {
    number: "07",
    title: "RojAvasar",
    meta: "Labor Marketplace Application",
    description:
      "Two-sided marketplace connecting service providers with customers through location-based job matching, in-app chat, wallet management, ratings, and secure authentication.",
    tags: ["Flutter", "Dart", "Firebase", "Google Maps", "Wallet"],
    highlights: ["Job matching", "Wallet flow", "Secure auth"],
  },
  {
    number: "08",
    title: "Bookzila",
    meta: "Flutter Book-Selling Application",
    description:
      "Cross-platform book-selling app with categorized search, secure API integration, cart management, order tracking, responsive UI design, Razorpay, and Lottie animation.",
    tags: ["Flutter", "Dart", "Firebase", "Razorpay", "Lottie"],
    highlights: ["Cart management", "Order tracking", "Secure APIs"],
    video: `${BASE_URL}assets/screen-20251106-165505.mp4`,
  },
  {
    number: "09",
    title: "Amanti",
    meta: "Escrow Management System",
    description:
      "Secure escrow platform for transparent, tamper-proof transactions between parties. Integrated secure REST APIs and encryption techniques for protected transaction flows.",
    tags: ["Flutter", "Dart", "Firebase", "REST APIs", "Encryption"],
    highlights: ["Escrow workflow", "Encrypted data", "Secure APIs"],
    video: `${BASE_URL}assets/Recording 2025-10-17 165800.mp4`,
  },
  {
    number: "10",
    title: "Mini Projects & Animated UI",
    meta: "Flutter Animation Experiments",
    description:
      "Animated screens collection and multi-step onboarding flows using Hero transitions, fade-in effects, animation controllers, rebuild optimization, and 60 FPS UI motion.",
    tags: ["Flutter", "Hero Animation", "Rive", "Lottie", "60 FPS"],
    highlights: ["6+ micro animations", "Hero transitions", "State sync"],
    video: `${BASE_URL}assets/screen-20251106-170216.mp4`,
  },
];

/* ---- Shared utility components ---- */

type FadeElement = "div" | "nav" | "p" | "section" | "footer";

const MOTION_ELEMENTS = {
  div: motion.div,
  nav: motion.nav,
  p: motion.p,
  section: motion.section,
  footer: motion.footer,
} as const;

type FadeInProps = {
  as?: FadeElement;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  style?: CSSProperties;
  id?: string;
};

function FadeIn({
  as,
  children,
  className,
  "aria-label": ariaLabel,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  style,
  id,
}: FadeInProps) {
  const Component = MOTION_ELEMENTS[as ?? "div"];

  return (
    <Component
      id={id}
      className={className}
      style={style}
      aria-label={ariaLabel}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Component>
  );
}

type MagnetProps = {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
};

function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate3d(0, 0, 0)");
  const [transition, setTransition] = useState(inactiveTransition);

  function handleMove(event: ReactMouseEvent<HTMLDivElement>) {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const withinBounds =
      event.clientX >= rect.left - padding &&
      event.clientX <= rect.right + padding &&
      event.clientY >= rect.top - padding &&
      event.clientY <= rect.bottom + padding;

    if (!withinBounds) {
      setTransition(inactiveTransition);
      setTransform("translate3d(0, 0, 0)");
      return;
    }

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (event.clientX - centerX) / strength;
    const y = (event.clientY - centerY) / strength;

    setTransition(activeTransition);
    setTransform(`translate3d(${x}px, ${y}px, 0)`);
  }

  function reset() {
    setTransition(inactiveTransition);
    setTransform("translate3d(0, 0, 0)");
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ transform, transition, willChange: "transform" }}
    >
      {children}
    </div>
  );
}

function ContactButton() {
  return (
    <a
      href={`mailto:${PROFILE.email}`}
      className="contact-button inline-flex items-center justify-center rounded-full px-8 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white outline outline-2 -outline-offset-[3px] outline-white transition duration-200 hover:scale-[1.03] focus-visible:outline-offset-4 sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
    >
      Contact Me
    </a>
  );
}

function CTAButtonBlue({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="cta-button-blue">
      {label}
    </a>
  );
}

type WatchDemoButtonProps = {
  href: string;
  title: string;
};

function WatchDemoButton({ href, title }: WatchDemoButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Watch demo for ${title}`}
      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-[0.18em] text-[#D7E2EA] transition duration-200 hover:bg-[#D7E2EA]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D7E2EA] sm:px-10 sm:py-3.5 sm:text-base"
    >
      <Play className="h-4 w-4" fill="currentColor" strokeWidth={2} aria-hidden="true" />
      Watch Demo
    </a>
  );
}

/* ---- Animated counter for stats ---- */
function AnimatedCounter({ target }: { target: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState("0");
  const numericPart = parseInt(target.replace(/[^0-9]/g, ""), 10);
  const suffix = target.replace(/[0-9]/g, "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1800;
          const startTime = performance.now();

          function animate(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            start = Math.round(eased * numericPart);
            setDisplayed(`${start}${suffix}`);
            if (progress < 1) requestAnimationFrame(animate);
          }

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [numericPart, suffix]);

  return <span ref={ref}>{displayed}</span>;
}

/* ---- HERO SECTION (kept dark) ---- */

function HeroSection() {
  return (
    <section className="relative flex h-screen min-h-[620px] flex-col overflow-x-clip bg-[#0C0C0C]">
      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="relative z-20 flex justify-between px-6 pt-6 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] md:px-10 md:pt-8 md:text-lg lg:text-[1.4rem]"
        aria-label="Primary navigation"
      >
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="transition duration-200 hover:opacity-70"
          >
            {item.label}
          </a>
        ))}
      </FadeIn>

      <div className="relative z-0 mt-6 min-h-[12vw] w-full overflow-hidden sm:mt-4 sm:min-h-[12vw] md:-mt-5">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading w-full whitespace-nowrap text-[10.6vw] font-black uppercase leading-none tracking-tight font-kanit sm:text-[10.5vw] md:text-[11vw] lg:text-[11.8vw]">
            Hi, i&apos;m harshit
          </h1>
        </FadeIn>
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[360px] sm:translate-y-0 md:w-[440px] lg:w-[520px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet padding={150} strength={3}>
            <img
              src={HERO_IMAGE}
              alt="Harshit Saini stylized developer portrait"
              className="block w-full select-none object-contain"
              draggable={false}
            />
          </Magnet>
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="max-w-[160px] text-[clamp(0.75rem,1.4vw,1.5rem)] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]"
        >
          flutter developer building secure, high-performance mobile products
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}

/* ---- MARQUEE SECTION ---- */

function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  const rowOne = useMemo(() => MARQUEE_IMAGES.slice(0, 11), []);
  const rowTwo = useMemo(() => MARQUEE_IMAGES.slice(11), []);

  useEffect(() => {
    function updateOffset() {
      const section = sectionRef.current;
      if (!section) return;
      const sectionTop = section.offsetTop;
      const nextOffset =
        (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setOffset(nextOffset);
    }

    updateOffset();
    window.addEventListener("scroll", updateOffset, { passive: true });
    window.addEventListener("resize", updateOffset);

    return () => {
      window.removeEventListener("scroll", updateOffset);
      window.removeEventListener("resize", updateOffset);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40"
      aria-label="Selected motion work preview"
    >
      <MarqueeRow
        images={rowOne}
        translateX={offset - 200}
        directionLabel="right"
      />
      <MarqueeRow
        images={rowTwo}
        translateX={-(offset - 200)}
        directionLabel="left"
      />
    </section>
  );
}

type MarqueeRowProps = {
  images: string[];
  translateX: number;
  directionLabel: string;
};

function MarqueeRow({ images, translateX, directionLabel }: MarqueeRowProps) {
  const repeated = [...images, ...images, ...images];

  return (
    <div
      className="flex gap-3 py-1.5"
      style={{ transform: `translateX(${translateX}px)`, willChange: "transform" }}
      aria-label={`Marquee moving ${directionLabel}`}
    >
      {repeated.map((src, index) => (
        <img
          key={`${src}-${index}`}
          src={src}
          alt=""
          loading="lazy"
          className="h-[270px] w-[420px] shrink-0 rounded-2xl object-cover"
        />
      ))}
    </div>
  );
}

/* ---- ABOUT SECTION (kept dark) ---- */

function AnimatedText({ text }: { text: string }) {
  const targetRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.8", "end 0.2"],
  });
  const totalCharacters = text.replace(/\s/g, "").length;
  const tokens = useMemo(() => {
    const parts = text.split(/(\s+)/);

    return parts.map((part, partIndex) => {
      if (/^\s+$/.test(part)) {
        return {
          type: "space" as const,
          value: part,
          key: `space-${partIndex}`,
        };
      }

      return {
        type: "word" as const,
        value: part,
        key: `word-${part}-${partIndex}`,
        characters: part.split("").map((character, characterOffset) => {
          const baseIndex = parts
            .slice(0, partIndex)
            .join("")
            .replace(/\s/g, "").length;

          return {
            character,
            index: baseIndex + characterOffset,
            key: `${character}-${baseIndex + characterOffset}`,
          };
        }),
      };
    });
  }, [text]);

  return (
    <p
      ref={targetRef}
      className="relative max-w-[560px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed text-[#D7E2EA]"
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {tokens.map((token) => {
          if (token.type === "space") {
            return token.value;
          }

          return (
            <span key={token.key} className="inline-block">
              {token.characters.map(({ character, index, key }) => (
                <AnimatedCharacter
                  key={key}
                  character={character}
                  index={index}
                  total={totalCharacters}
                  progress={scrollYProgress}
                />
              ))}
            </span>
          );
        })}
      </span>
    </p>
  );
}

type AnimatedCharacterProps = {
  character: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

function AnimatedCharacter({
  character,
  index,
  total,
  progress,
}: AnimatedCharacterProps) {
  const start = index / total;
  const end = Math.min(start + 0.12, 1);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  const glyph = character === " " ? "\u00A0" : character;

  return (
    <motion.span className="inline-block" style={{ opacity }}>
      {glyph}
    </motion.span>
  );
}

function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0C0C0C] px-5 py-20 sm:px-8 md:px-10"
    >
      {ABOUT_DECORATIONS.map((item) => (
        <FadeIn
          key={item.src}
          delay={item.delay}
          duration={0.9}
          x={item.x}
          y={0}
          className={`pointer-events-none absolute z-0 ${item.className}`}
        >
          <img src={item.src} alt={item.alt} loading="lazy" className="w-full" />
        </FadeIn>
      ))}

      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight font-kanit">
            About me
          </h2>
        </FadeIn>
        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
          <AnimatedText text="Flutter Developer with 1.5+ years of experience building scalable cross-platform mobile applications, including published apps on Google Play. I work with Flutter, Dart, Firebase, REST APIs, Provider/BLoC, payments, maps, notifications, and secure coding to ship fast, stable, user-centric products." />
          <ContactButton />
        </div>
      </div>
    </section>
  );
}

/* ---- SERVICES WE PROVIDE SECTION (light, #F5F6FA) ---- */

function ServicesWeProvideSection() {
  return (
    <section
      id="services"
      className="bg-[#F5F6FA] px-4 py-24"
    >
      <div className="mx-auto max-w-container">
        <FadeIn y={30}>
          <h2 className="section-heading">Services We Provide</h2>
          <p className="section-subtitle">
            We build robust apps through collaborative development, ensuring every
            feature is polished, performant, and ready for scale.
          </p>
        </FadeIn>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CARDS.map((card, index) => (
            <FadeIn key={card.title} delay={index * 0.12} y={40}>
              <div className="figma-card h-full">
                <img
                  src={card.image}
                  alt={card.title}
                  className="figma-card-image"
                  loading="lazy"
                />
                <div className="figma-card-body">
                  <h3 className="figma-card-title">{card.title}</h3>
                  <p className="figma-card-desc">{card.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- WHY US SECTION (white) ---- */

function WhyUsSection() {
  return (
    <section className="bg-white px-4 py-24">
      <div className="mx-auto" style={{ maxWidth: "722px" }}>
        <FadeIn y={30}>
          <h2 className="section-heading">Why Us</h2>
          <p className="section-subtitle" style={{ maxWidth: "576px" }}>
            Passionate app developers dedicated to empowering businesses with
            beautiful, functional, and high-performance mobile solutions.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {STATS.map((stat, index) => (
            <FadeIn key={stat.label} delay={index * 0.1} y={30}>
              <div className="stat-card">
                <div className="stat-card-left">
                  <div className="stat-card-icon">
                    <stat.icon size={24} strokeWidth={1.5} color="#4E80EE" />
                  </div>
                  <p className="stat-card-label">{stat.label}</p>
                </div>
                <div className="stat-card-right">
                  <span className="stat-card-value">
                    <AnimatedCounter target={stat.value} />
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- HOW IT WORKS SECTION (light, #F5F6FA) ---- */

function HowItWorksSection() {
  return (
    <section className="bg-[#F5F6FA] px-4 py-24">
      <div className="mx-auto max-w-container">
        <FadeIn y={30}>
          <h2 className="section-heading">How It Works</h2>
          <p className="section-subtitle">
            Our streamlined process for building high-quality mobile applications,
            from concept to launch and beyond.
          </p>
        </FadeIn>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <FadeIn key={step.step} delay={index * 0.1} y={40}>
              <div className="step-card h-full">
                <div className="relative">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="step-card-image"
                    loading="lazy"
                  />
                  <span
                    className="absolute left-6 top-6 text-xs font-medium text-[#4F80FF]"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    • Step - {step.step}
                  </span>
                </div>
                <div className="step-card-body">
                  <h3 className="step-card-title">{step.title}</h3>
                  <p className="step-card-desc">{step.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- FEATURED PROJECTS SECTION (dark, kept similar) ---- */

type ProjectCardProps = {
  project: (typeof PROJECTS)[number];
  index: number;
  totalCards: number;
};

function ProjectCard({ project, index, totalCards }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const targetScale = Math.max(0.86, 1 - (totalCards - 1 - index) * 0.015);
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div ref={cardRef} className="relative h-[85vh] min-h-[760px]">
      <motion.article
        className="sticky top-[calc(6rem+var(--stack-offset))] overflow-hidden rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 text-[#D7E2EA] sm:rounded-[50px] sm:p-6 md:top-[calc(8rem+var(--stack-offset))] md:rounded-[60px] md:p-8"
        style={
          {
            "--stack-offset": `${index * 28}px`,
            scale,
          } as CSSProperties
        }
      >
        <div className="grid items-end gap-5 pb-6 md:grid-cols-[auto_1fr_auto] md:gap-8 md:pb-8">
          <span className="text-[clamp(3rem,10vw,140px)] font-black leading-none font-kanit">
            {project.number}
          </span>
          <div className="space-y-1">
            <p className="text-sm font-light uppercase tracking-[0.22em] opacity-70 sm:text-base">
              {project.meta}
            </p>
            <h3 className="text-[clamp(1.45rem,4vw,4.5rem)] font-black uppercase leading-none tracking-tight font-kanit">
              {project.title}
            </h3>
          </div>
          <div className="justify-self-start md:justify-self-end">
            {"video" in project && project.video ? (
              <WatchDemoButton href={project.video} title={project.title} />
            ) : (
              <ProjectStatusLabel label="Resume Project" />
            )}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.38fr_0.62fr] lg:items-stretch">
          <div className="flex flex-col justify-between gap-6 rounded-[32px] border border-[#D7E2EA]/20 p-5 sm:rounded-[40px] sm:p-6">
            <p className="text-[clamp(0.95rem,1.35vw,1.35rem)] font-light leading-relaxed text-[#D7E2EA]/75">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#D7E2EA]/30 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[#D7E2EA]/85 sm:text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {"video" in project && project.video ? (
            <div className="overflow-hidden rounded-[40px] border border-[#D7E2EA]/20 bg-black sm:rounded-[50px] md:rounded-[60px]">
              <video
                src={project.video}
                title={`${project.title} demo preview`}
                className="h-[clamp(330px,44vw,590px)] w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
            </div>
          ) : (
            <ProjectHighlights project={project} />
          )}
        </div>
      </motion.article>
    </div>
  );
}

function ProjectStatusLabel({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-[0.18em] text-[#D7E2EA] sm:px-10 sm:py-3.5 sm:text-base">
      {label}
    </span>
  );
}

function ProjectHighlights({ project }: { project: (typeof PROJECTS)[number] }) {
  return (
    <div className="flex min-h-[clamp(330px,44vw,590px)] flex-col justify-between rounded-[40px] border border-[#D7E2EA]/20 bg-[#D7E2EA]/[0.03] p-6 sm:rounded-[50px] sm:p-8 md:rounded-[60px]">
      <div>
        <p className="text-sm font-light uppercase tracking-[0.22em] text-[#D7E2EA]/50">
          Focus Areas
        </p>
        <div className="mt-8 grid gap-4">
          {project.highlights.map((highlight) => (
            <div
              key={highlight}
              className="rounded-[28px] border border-[#D7E2EA]/20 px-5 py-4 text-[clamp(1.2rem,2.2vw,2rem)] font-black uppercase leading-tight tracking-tight text-[#D7E2EA] font-kanit"
            >
              {highlight}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-8 max-w-xl text-[clamp(0.9rem,1.2vw,1.1rem)] font-light uppercase leading-relaxed tracking-[0.14em] text-[#D7E2EA]/55">
        Listed from resume. Demo media not attached for this project.
      </p>
    </div>
  );
}

function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative z-10 bg-[#0C0C0C] px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32"
    >
      <FadeIn y={40}>
        <h2 className="hero-heading mb-14 text-center text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight font-kanit sm:mb-20 md:mb-28">
          Project
        </h2>
      </FadeIn>
      <div className="mx-auto max-w-7xl">
        {PROJECTS.map((project, index) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={index}
            totalCards={PROJECTS.length}
          />
        ))}
      </div>
    </section>
  );
}

/* ---- CONTACT SECTION (light version) ---- */

function ContactSection() {
  return (
    <footer
      id="contact"
      className="bg-white px-5 pb-12 pt-16 text-[#1B202C] sm:px-8 md:px-10 md:pt-24"
    >
      <div className="mx-auto grid max-w-7xl gap-8 border-t border-[#BBBCC0]/40 pt-10 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <div>
          <h2 className="font-phudu text-[clamp(3rem,10vw,120px)] font-black uppercase leading-none tracking-tight text-[#1B202C]">
            Contact
          </h2>
          <p className="mt-5 max-w-2xl text-[clamp(1rem,1.8vw,1.35rem)] font-light leading-relaxed text-[#6A7282]">
            Available for Flutter app development, Firebase integrations,
            secure API workflows, real-time features, payment flows, and
            performance-focused mobile UI.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
          <ContactLinkLight
            href={`mailto:${PROFILE.email}`}
            label={PROFILE.email}
            icon={<Mail className="h-4 w-4" aria-hidden="true" />}
          />
          <ContactLinkLight
            href={PROFILE.phoneHref}
            label={PROFILE.phone}
            icon={<Phone className="h-4 w-4" aria-hidden="true" />}
          />
          <ContactLinkLight
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              PROFILE.location
            )}`}
            label={PROFILE.location}
            icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
          />
          <ContactLinkLight
            href={PROFILE.socials.linkedin}
            label="LinkedIn"
            icon={<Linkedin className="h-4 w-4" aria-hidden="true" />}
          />
          <ContactLinkLight
            href={PROFILE.socials.github}
            label="GitHub"
            icon={<Github className="h-4 w-4" aria-hidden="true" />}
          />
          <ContactLinkLight
            href={PROFILE.socials.tryhackme}
            label="TryHackMe"
            icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
          />
          <ContactLinkLight
            href={PROFILE.resume}
            label="Download Resume"
            icon={<Download className="h-4 w-4" aria-hidden="true" />}
          />
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl border-t border-[#BBBCC0]/30 pt-6 text-center text-sm text-[#6A7282]">
        © {new Date().getFullYear()} Harshit Saini. All rights reserved.
      </div>
    </footer>
  );
}

type ContactLinkLightProps = {
  href: string;
  label: string;
  icon: ReactNode;
};

function ContactLinkLight({ href, label, icon }: ContactLinkLightProps) {
  const isExternal = href.startsWith("http") || href.endsWith(".pdf");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className="group flex items-center justify-between gap-4 rounded-full border border-[#BBBCC0]/50 px-5 py-3 text-sm font-medium uppercase tracking-[0.16em] text-[#1B202C] transition duration-200 hover:border-[#4F80FF] hover:bg-[#EFF6FF] sm:text-base"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="shrink-0 text-[#6A7282] transition group-hover:text-[#4E80EE]">
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </span>
      <span className="text-[#BBBCC0] transition group-hover:text-[#4E80EE]">
        →
      </span>
    </a>
  );
}

/* ---- APP ROOT ---- */

function App() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#0A0A0A]">
      {/* Dark sections */}
      <HeroSection />
      <MarqueeSection />
      <AboutSection />

      {/* Light sections (Figma design) */}
      <ServicesWeProvideSection />
      <WhyUsSection />
      <HowItWorksSection />

      {/* Projects (dark) */}
      <ProjectsSection />

      {/* Contact (light) */}
      <ContactSection />
    </main>
  );
}

export default App;
