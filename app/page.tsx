"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Types
interface Plan {
	id: string;
	name: string;
	subtitle: string;
	description: string;
	consultas: string;
	desintoxicacion: string;
	sueroterapia: string;
	medicacion: string;
	examenes: string[];
}

// Data matching the official PDF profile
const PLANS_DATA: Plan[] = [
	{
		id: "diabetcare",
		name: "DIABETCARE",
		subtitle: "Tratamiento Integral de la Diabetes Mellitus Tipo 2",
		description: "Diseñado para controlar la glucosa, reducir la resistencia a la insulina y restaurar el metabolismo celular desde la raíz.",
		consultas: "2 consultas médicas completas (evaluación inicial y control final)",
		desintoxicacion: "Desintoxicación celular profunda oral o intravenosa (IV)",
		sueroterapia: "4 sesiones de Sueroterapia Ortomolecular (1 sesión semanal durante 1 mes)",
		medicacion: "Medicación fitoterapéutica y ortomolecular oral para control glucémico",
		examenes: [
			"Glucosa en ayunas", "Hemoglobina Glicosilada", "EGO (Examen General de Orina)", "Creatinina",
			"BUN (Nitrógeno Ureico)", "Ácido Úrico", "TGO (Transaminasa Glutámico Oxalacética)", "TGP (Transaminasa Glutámico Pirúvica)",
			"Colesterol LDL", "Colesterol HDL", "Colesterol Total", "Triglicéridos", "Hemograma completo", "Vitamina D", "Vitamina B12"
		]
	},
	{
		id: "higacare",
		name: "HIGACARE",
		subtitle: "Depuración, regeneración, optimización y protección hepática",
		description: "Enfocado en desintoxicar las células hepáticas, reducir el hígado graso y optimizar el funcionamiento del hígado",
		consultas: "2 consultas médicas completas (evaluación inicial y control final)",
		desintoxicacion: "Desintoxicación celular profunda oral o intravenosa (IV)",
		sueroterapia: "4 sesiones de Sueroterapia Ortomolecular (1 sesión semanal durante 1 mes)",
		medicacion: "Medicación fitoterapéutica y de soporte hepático oral",
		examenes: [
			"TGO", "TGP", "Bilirrubina Directa", "Bilirrubina Indirecta", "Bilirrubina Total",
			"Fosfatasa Alcalina", "Gama Glutamil Transpeptidasa (GGT)", "Proteínas Totales",
			"Colesterol LDL", "Colesterol HDL", "Colesterol Total", "Triglicéridos", "Creatinina",
			"Vitamina D", "Ultrasonido Abdominal total"
		]
	},
	{
		id: "articular",
		name: "ARTICULAR",
		subtitle: "Salud Articular y Alivio del Dolor (Artritis / Artrosis)",
		description: "Protocolo especializado en reducir la inflamación articular, frenar el desgaste de cartílago y restaurar la movilidad activa.",
		consultas: "2 consultas médicas completas (evaluación inicial y control final)",
		desintoxicacion: "Desintoxicación celular profunda oral o intravenosa (IV)",
		sueroterapia: "4 sesiones de Sueroterapia Ortomolecular (1 sesión semanal durante 1 mes)",
		medicacion: "Medicación oral antiinflamatoria y regeneradora articular",
		examenes: [
			"Factor Reumatoideo", "PCR Ultrasensible", "Magnesio", "Calcio", "Fósforo", "Creatinina",
			"Fosfatasa Alcalina", "PTH (Hormona Paratiroidea)", "Ácido Úrico", "ASO (Antiestreptolisina O)",
			"Colesterol LDL", "Colesterol HDL", "Colesterol Total", "Triglicéridos", "Vitamina D"
		]
	},
	{
		id: "digest",
		name: "DIGEST",
		subtitle: "Restauración del Sistema Gastrointestinal",
		description: "Ideal para combatir Helicobacter pylori, regular la microbiota, sanar la mucosa gástrica, aliviar colitis, gastritis crónica y otras enfermedades del sistema digestivo.",
		consultas: "2 consultas médicas completas (evaluación inicial y control final)",
		desintoxicacion: "Desintoxicación celular profunda oral o intravenosa (IV)",
		sueroterapia: "4 sesiones de Sueroterapia Ortomolecular (1 sesión semanal durante 1 mes)",
		medicacion: "Tratamiento fitoterapéutico y probióticos orales",
		examenes: [
			"Helicobacter pylori en heces", "EGH (Examen General de Heces)", "Sangre oculta en heces",
			"Fehling en heces", "Creatinina", "TGO", "TGP", "Colesterol LDL", "Colesterol HDL",
			"Colesterol Total", "Triglicéridos", "Hemograma completo", "Vitamina D", "Ultrasonido Abdominal total"
		]
	},
	{
		id: "dpr",
		name: "DPR",
		subtitle: "Salud Mental: Depresión, Ansiedad e Insomnio",
		description: "Apoyo neurotransmisor para restaurar el equilibrio del sistema nervioso central, optimizar el sueño y reducir el estrés oxidativo.",
		consultas: "2 consultas médicas completas (evaluación inicial y control final)",
		desintoxicacion: "Desintoxicación celular profunda oral o intravenosa (IV)",
		sueroterapia: "4 sesiones de Sueroterapia Ortomolecular (1 sesión semanal durante 1 mes)",
		medicacion: "Precursores de neurotransmisores y fitoterapia adaptógena oral",
		examenes: [
			"Hemograma completo", "TSH", "T3 total", "T4 total", "Ácido Fólico", "Vitamina B12",
			"Electrolitos (Sodio, Potasio, Magnesio)", "Creatinina", "BUN", "TGO", "TGP", "Vitamina D"
		]
	},
	{
		id: "metabolic",
		name: "METABOLIC",
		subtitle: "Control y Regulación del Síndrome Metabólico",
		description: "Combate la hipertensión, resistencia a la insulina y colesterol elevado para prevenir el riesgo cardiovascular.",
		consultas: "2 consultas médicas completas (evaluación inicial y control final)",
		desintoxicacion: "Desintoxicación celular profunda oral o intravenosa (IV)",
		sueroterapia: "4 sesiones de Sueroterapia Ortomolecular (1 sesión semanal durante 1 mes)",
		medicacion: "Medicación fitoterapéutica y ortomolecular oral",
		examenes: [
			"Glucosa en ayunas", "Insulina basal", "Hemoglobina Glicosilada", "Creatinina",
			"TGO", "TGP", "Colesterol LDL", "Colesterol HDL", "Colesterol Total", "Triglicéridos", "Vitamina D"
		]
	},
	{
		id: "respiratory",
		name: "RESPIRATORY",
		subtitle: "Inmunidad y Vías Respiratorias (Asma, Rinitis, Sinusitis)",
		description: "Fortalece las defensas pulmonares, desinflama las mucosas del tracto respiratorio y reduce la hipersensibilidad alérgica.",
		consultas: "2 consultas médicas completas (evaluación inicial y control final)",
		desintoxicacion: "Desintoxicación celular profunda oral o intravenosa (IV)",
		sueroterapia: "4 sesiones de Sueroterapia Ortomolecular (1 sesión semanal durante 1 mes)",
		medicacion: "Inmunomoduladores fitoterapéuticos orales",
		examenes: [
			"PCR (Proteína C Reactiva)", "Hemograma completo", "Creatinina", "TGO", "TGP",
			"Colesterol LDL", "Colesterol HDL", "Colesterol Total", "Triglicéridos", "Vitamina D"
		]
	},
	{
		id: "tyroid",
		name: "TYROID",
		subtitle: "Regulación de Tiroides (Hipo / Hipertiroidismo y Hashimoto)",
		description: "Equilibra la producción hormonal y corrige síntomas como fatiga crónica, desajustes de peso y desequilibrio térmico.",
		consultas: "2 consultas médicas completas (evaluación inicial y control final)",
		desintoxicacion: "Desintoxicación celular profunda oral o intravenosa (IV)",
		sueroterapia: "4 sesiones de Sueroterapia Ortomolecular (1 sesión semanal durante 1 mes)",
		medicacion: "Soporte metabólico y oligoelementos orales",
		examenes: [
			"TSH", "T3 total", "T4 total", "T3 libre", "T4 libre", "Creatinina",
			"Calcio", "TGO", "TGP", "Hemograma completo", "Vitamina D"
		]
	},
	{
		id: "varicare",
		name: "VARICARE",
		subtitle: "Insuficiencia Venosa y Arañitas Vasculares",
		description: "Activa la microcirculación, fortalece las paredes venosas y previene la formación de edemas y pesadez.",
		consultas: "2 consultas médicas completas (evaluación inicial y control final)",
		desintoxicacion: "Desintoxicación celular profunda oral o intravenosa (IV)",
		sueroterapia: "4 sesiones de Sueroterapia Ortomolecular (1 sesión semanal durante 1 mes)",
		medicacion: "Fitofármacos flebotónicos orales",
		examenes: [
			"Dímero D", "Hemograma completo", "Glucosa en ayunas", "Creatinina", "BUN",
			"TGO", "TGP", "Colesterol LDL", "Colesterol HDL", "Colesterol Total", "Triglicéridos", "Vitamina D"
		]
	},
	{
		id: "fibromialgia",
		name: "FIBROMIALGIA",
		subtitle: "Alivio y Control Integral de la Fibromialgia",
		description: "Abordaje del dolor muscular difuso, fatiga crónica y desajustes de sueño mediante modulación celular y reducción del estrés biológico.",
		consultas: "2 consultas médicas completas (evaluación inicial y control final)",
		desintoxicacion: "Desintoxicación celular profunda oral o intravenosa (IV)",
		sueroterapia: "4 sesiones de Sueroterapia Ortomolecular (1 sesión semanal durante 1 mes)",
		medicacion: "Medicación fitoterapéutica y soporte ortomolecular específico",
		examenes: [
			"PCR", "Hemograma completo", "Factor Reumatoideo", "Creatinina", "TSH",
			"T3 total", "T4 total", "TGO", "TGP", "Colesterol LDL", "Colesterol HDL", "Colesterol Total", "Triglicéridos", "Vitamina D"
		]
	},
	{
		id: "menopausecare",
		name: "MENOPAUSE CARE",
		subtitle: "Soporte Hormonal, Climatério y Libido",
		description: "Mitiga los bochornos y el cansancio, restaurando el equilibrio endocrino y la vitalidad de manera natural.",
		consultas: "2 consultas médicas completas (evaluación inicial y control final)",
		desintoxicacion: "Desintoxicación celular profunda oral o intravenosa (IV)",
		sueroterapia: "4 sesiones de Sueroterapia Ortomolecular (1 sesión semanal durante 1 mes)",
		medicacion: "Soporte hormonal fitoestrogénico oral personalizado",
		examenes: [
			"FSH", "Estradiol", "Hemograma completo", "Creatinina", "TSH", "T3 total", "T4 total",
			"TGO", "TGP", "Colesterol LDL", "Colesterol HDL", "Colesterol Total", "Triglicéridos", "Glucosa en ayunas", "EGO", "Vitamina D"
		]
	},
	{
		id: "prostacare",
		name: "PROSTACARE",
		subtitle: "Salud Prostática y Vitalidad Masculina (HPB / Prostatitis)",
		description: "Tratamiento preventivo y complementario para reducir la inflamación prostática y optimizar el vigor general.",
		consultas: "2 consultas médicas completas (evaluación inicial y control final)",
		desintoxicacion: "Desintoxicación celular profunda oral o intravenosa (IV)",
		sueroterapia: "4 sesiones de Sueroterapia Ortomolecular (1 sesión semanal durante 1 mes)",
		medicacion: "Fitoterapia antiinflamatoria prostática oral",
		examenes: [
			"PCR", "Hemograma completo", "Factor Reumatoideo", "Creatinina", "TSH", "T3 total", "T4 total",
			"TGO", "TGP", "Colesterol LDL", "Colesterol HDL", "Colesterol Total", "Triglicéridos", "Vitamina D"
		]
	},
	{
		id: "dermacare",
		name: "DERMACARE",
		subtitle: "Salud y Regeneración de la Piel (Dermatosis)",
		description: "Combate enfermedades dermatológicas crónicas como psoriasis, dermatitis y eccemas actuando desde el interior celular.",
		consultas: "2 consultas médicas completas (evaluación inicial y control final)",
		desintoxicacion: "Desintoxicación celular profunda oral o intravenosa (IV)",
		sueroterapia: "4 sesiones de Sueroterapia Ortomolecular (1 sesión semanal durante 1 mes)",
		medicacion: "Medicación oral moduladora celular y protectora cutánea",
		examenes: [
			"PCR", "Hemograma completo", "Factor Reumatoideo", "Creatinina", "TSH", "T3 total", "T4 total",
			"TGO", "TGP", "Colesterol LDL", "Colesterol HDL", "Colesterol Total", "Triglicéridos", "Vitamina D"
		]
	},
	{
		id: "weightcontrol",
		name: "WEIGHT CONTROL",
		subtitle: "Reducción de Peso y Control Metabólico",
		description: "Protocolo metabólico acelerado que limpia tus filtros internos para facilitar la pérdida de grasa y aumentar la vitalidad.",
		consultas: "2 consultas médicas completas (evaluación inicial y control final)",
		desintoxicacion: "Desintoxicación celular profunda oral o intravenosa (IV)",
		sueroterapia: "6 sesiones de Sueroterapia Ortomolecular (1 sesión semanal por 1 mes y medio)",
		medicacion: "Tratamiento fitoterapéutico termogénico y regulador oral",
		examenes: [
			"Glucosa en ayunas", "Hemoglobina Glicosilada", "EGO", "Creatinina", "BUN", "Ácido Úrico",
			"TGO", "TGP", "Colesterol LDL", "Colesterol HDL", "Colesterol Total", "Triglicéridos", "Hemograma completo", "Vitamina D", "Vitamina B12"
		]
	},
	{
		id: "abierto",
		name: "PLAN ABIERTO",
		subtitle: "Plan de Salud Abierto Personalizado",
		description: "Un plan de salud diseñado a la medida para abordar patologías específicas no incluidas en los tratamientos estándares.",
		consultas: "Consultas de valoración continua según evolución clínica",
		desintoxicacion: "Desintoxicación celular profunda adaptada",
		sueroterapia: "Sesiones de Sueroterapia Ortomolecular según requerimiento del paciente",
		medicacion: "Tratamiento fitoterapéutico oral específico",
		examenes: ["Exámenes de laboratorio clínicos específicos definidos por el médico especialista en la primera consulta"]
	}
];

interface Terapia {
	id: string;
	name: string;
	medicamento: string;
	sesiones: number;
	duracionFrecuencia: string;
}

const TERAPIAS_DATA: Terapia[] = [
	{
		id: "acupuntura",
		name: "Acupuntura + Electroterapia",
		medicamento: "Traumeel tabs + CBD Cream",
		sesiones: 6,
		duracionFrecuencia: "30 minutos, 3 veces a la semana"
	},
	{
		id: "autohemoterapia",
		name: "Autohemoterapia menor",
		medicamento: "Ninguno",
		sesiones: 4,
		duracionFrecuencia: "30 minutos, cada 5 días"
	},
	{
		id: "desintoxicacion",
		name: "Desintoxicación Iónica",
		medicamento: "Body Detox",
		sesiones: 6,
		duracionFrecuencia: "40 minutos, 3 veces a la semana"
	},
	{
		id: "prp-patelar",
		name: "Plasma Rico en Plaquetas para dolor patelar en rodilla (1 rodilla)",
		medicamento: "Osteocartil para rodillas",
		sesiones: 4,
		duracionFrecuencia: "1 1/2 hora, frecuencia a criterio médico"
	},
	{
		id: "prp-alopecia",
		name: "Plasma Rico en Plaquetas para alopecia y caída de cabello",
		medicamento: "Biotina + AH + CH + Vit. C",
		sesiones: 4,
		duracionFrecuencia: "1 1/2 hora, frecuencia a criterio médico"
	},
	{
		id: "presoterapia",
		name: "Presoterapia",
		medicamento: "Circu-Act + varicream",
		sesiones: 6,
		duracionFrecuencia: "40 minutos, 3 veces a la semana"
	},
	{
		id: "cupping",
		name: "Terapia de Cupping (Ventosas)",
		medicamento: "Traumeel tabs + CBD Cream",
		sesiones: 4,
		duracionFrecuencia: "30 minutos, 1 semanal x 1 mes"
	},
	{
		id: "neural",
		name: "Terapia Neural",
		medicamento: "4 inyecciones de Neurobion 50000 IM + Traumeel tabs",
		sesiones: 4,
		duracionFrecuencia: "30 minutos, frecuencia a criterio médico"
	},
	{
		id: "antiestres",
		name: "Terapia Antiestrés",
		medicamento: "4 inyecciones de Neurobion 50000 IM + Nervoheel tabs",
		sesiones: 4,
		duracionFrecuencia: "1 hora, 1 semanal x 1 mes"
	}
];

const VALORES = ["Fe", "Responsabilidad", "Confiabilidad", "Credibilidad", "Integridad", "Honestidad", "Trato humano", "Honradez", "Respeto", "Sinceridad"];

export default function Home() {
	const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(0);
	const [selectedTerapiaIndex, setSelectedTerapiaIndex] = useState<number>(0);
	const [formState, setFormState] = useState({ name: "", phone: "", email: "", plan: "diabetcare", message: "" });
	const [submitted, setSubmitted] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [navScrolled, setNavScrolled] = useState(false);

	// Scroll listener to toggle navbar transparency
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 300) {
				setNavScrolled(true);
			} else {
				setNavScrolled(false);
			}
		};
		handleScroll();
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const containerRef = useRef<HTMLDivElement>(null);
	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasNosotrosRef = useRef<HTMLCanvasElement>(null);

	// GSAP Fullscreen Mobile Menu Animation Effect
	useEffect(() => {
		if (!mobileMenuRef.current) return;

		const ScrollSmoother = (window as any).ScrollSmoother;
		const smoother = ScrollSmoother ? ScrollSmoother.get() : null;

		if (mobileMenuOpen) {
			// Pause background smooth scroll interactions
			if (smoother) smoother.paused(true);
			document.body.style.overflow = "hidden";

			// Fullscreen fade-in + scale zoom-in
			gsap.to(mobileMenuRef.current, {
				opacity: 1,
				scale: 1,
				pointerEvents: "auto",
				duration: 0.5,
				ease: "power3.out"
			});

			// Staggered menu items fade-in + translate
			gsap.fromTo(mobileMenuRef.current.querySelectorAll(".mobile-menu-item"),
				{ opacity: 0, y: 30, scale: 0.95 },
				{ opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power2.out", stagger: 0.08, delay: 0.15 }
			);
		} else {
			// Resume background smooth scroll interactions
			if (smoother) smoother.paused(false);
			document.body.style.overflow = "";

			// Fullscreen fade-out + scale zoom-out
			gsap.to(mobileMenuRef.current, {
				opacity: 0,
				scale: 0.95,
				pointerEvents: "none",
				duration: 0.4,
				ease: "power3.inOut"
			});
		}
	}, [mobileMenuOpen]);

	// Particle system for glowing cell-like particles
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationFrameId: number;
		let particles: Array<{
			x: number;
			y: number;
			size: number;
			speedX: number;
			speedY: number;
			opacity: number;
			color: string;
			pulseSpeed: number;
			pulseDir: number;
			update: () => void;
			draw: () => void;
		}> = [];
		const particleCount = 20;

		// Mouse coordinates relative to canvas
		const mouse = { x: null as number | null, y: null as number | null, radius: 120 };

		const handleMouseMove = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;
		};

		const handleMouseLeave = () => {
			mouse.x = null;
			mouse.y = null;
		};

		window.addEventListener("mousemove", handleMouseMove);
		canvas.addEventListener("mouseleave", handleMouseLeave);

		class CellParticle {
			x: number;
			y: number;
			size: number;
			speedX: number;
			speedY: number;
			opacity: number;
			color: string;
			pulseSpeed: number;
			pulseDir: number;

			constructor() {
				// 80% chance to spawn on the right half (from 45% width to 100%), 20% on the left half (0% to 45%)
				if (Math.random() < 0.8) {
					this.x = (Math.random() * 0.55 + 0.45) * canvas!.width;
				} else {
					this.x = Math.random() * 0.45 * canvas!.width;
				}
				this.y = Math.random() * canvas!.height;
				this.size = Math.random() * 32 + 8; // size 8px to 40px
				this.speedX = (Math.random() - 0.5) * 0.3; // slow drift
				this.speedY = (Math.random() - 0.5) * 0.3;
				this.opacity = Math.random() * 0.25 + 0.55; // higher baseline opacity (0.55 to 0.8)
				// Luminous cyan/teal colors matching the user's screenshot
				const colors = [
					"rgba(89, 132, 194, ",   // Base Blue (#5984C2)
					"rgba(122, 158, 209, ",  // Slate Blue (#7A9ED1)
					"rgba(155, 185, 224, ",  // Soft Baby Blue (#9BB9E0)
					"rgba(189, 211, 240, ",  // Powder Blue (#BDD3F0)
					"rgba(222, 238, 255, ",  // Ice Blue (#DEEEFF)
					"rgba(89, 194, 178, ",   // Mint Teal (#59C2B2)
					"rgba(255, 255, 255, "   // Pure White (#FFFFFF)
				];
				this.color = colors[Math.floor(Math.random() * colors.length)];
				this.pulseSpeed = Math.random() * 0.01 + 0.003;
				this.pulseDir = Math.random() > 0.5 ? 1 : -1;
			}

			update() {
				// Drift
				this.x += this.speedX;
				this.y += this.speedY;

				// Boundary recycling (keeping the 80/20 right-skewed distribution)
				if (this.x > canvas!.width || this.x < 0 || this.y > canvas!.height || this.y < 0) {
					if (Math.random() < 0.8) {
						this.x = (Math.random() * 0.55 + 0.45) * canvas!.width;
					} else {
						this.x = Math.random() * 0.45 * canvas!.width;
					}
					this.y = Math.random() * canvas!.height;
					this.speedX = (Math.random() - 0.5) * 0.3;
					this.speedY = (Math.random() - 0.5) * 0.3;
				}

				// Pulse opacity gently
				this.opacity += this.pulseSpeed * this.pulseDir;
				if (this.opacity > 0.85 || this.opacity < 0.45) {
					this.pulseDir *= -1;
				}

				// Interaction with mouse cursor
				if (mouse.x !== null && mouse.y !== null) {
					const dx = this.x - mouse.x;
					const dy = this.y - mouse.y;
					const distance = Math.sqrt(dx * dx + dy * dy);
					if (distance < mouse.radius) {
						const force = (mouse.radius - distance) / mouse.radius;
						const angle = Math.atan2(dy, dx);
						// Gently push particles away
						this.x += Math.cos(angle) * force * 1.5;
						this.y += Math.sin(angle) * force * 1.5;
					}
				}
			}

			draw() {
				if (!ctx) return;

				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

				// Create a radial gradient with late falloff for sharper, solid-looking edges
				const gradient = ctx.createRadialGradient(
					this.x, this.y, 0,
					this.x, this.y, this.size
				);
				gradient.addColorStop(0, `${this.color}${this.opacity})`);
				gradient.addColorStop(0.7, `${this.color}${this.opacity * 0.95})`);
				gradient.addColorStop(0.9, `${this.color}${this.opacity * 0.4})`);
				gradient.addColorStop(1, `${this.color}0)`);

				ctx.fillStyle = gradient;
				ctx.shadowColor = "rgba(45, 212, 191, 0.35)";
				ctx.shadowBlur = 6;
				ctx.fill();
			}
		}

		const resizeCanvas = () => {
			canvas!.width = window.innerWidth;
			canvas!.height = window.innerHeight;
			initParticles();
		};

		const initParticles = () => {
			particles = [];
			for (let i = 0; i < particleCount; i++) {
				particles.push(new CellParticle());
			}
		};

		window.addEventListener("resize", resizeCanvas);
		resizeCanvas();

		const animate = () => {
			ctx.clearRect(0, 0, canvas!.width, canvas!.height);

			// Draw subtle connections between close-by particles to make them look like cell structures/molecules
			for (let i = 0; i < particles.length; i++) {
				for (let j = i + 1; j < particles.length; j++) {
					const dx = particles[i].x - particles[j].x;
					const dy = particles[i].y - particles[j].y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < 190) {
						ctx.beginPath();
						ctx.moveTo(particles[i].x, particles[i].y);
						ctx.lineTo(particles[j].x, particles[j].y);
						const lineOpacity = (1 - distance / 190) * 0.36;
						ctx.strokeStyle = `rgba(155, 185, 224, ${lineOpacity})`; // Soft blue connection lines matching particle shades (#9BB9E0)
						ctx.lineWidth = 1.3;
						ctx.stroke();
					}
				}
			}

			particles.forEach(p => {
				p.update();
				p.draw();
			});

			animationFrameId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			window.removeEventListener("mousemove", handleMouseMove);
			canvas.removeEventListener("mouseleave", handleMouseLeave);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	// DNA and Cellular Membrane Animation Loop for Nosotros Section
	useEffect(() => {
		const canvas = canvasNosotrosRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationFrameId: number;
		let rotationPhase = 0;

		// Floating molecules parameters
		const floatingMolecules = [
			{ xA: 28, yA: 36, xB: 33, yB: 28, rA: 1.5, rB: 1.0, speed: 0.015, angle: Math.random() * Math.PI },
			{ xA: 72, yA: 34, xB: 66, yB: 28, rA: 1.0, rB: 1.8, speed: 0.012, angle: Math.random() * Math.PI },
			{ xA: 68, yA: 68, xB: 74, yB: 62, rA: 1.5, rB: 1.0, speed: 0.018, angle: Math.random() * Math.PI }
		];

		const resizeCanvas = () => {
			const parent = canvas!.parentElement;
			if (!parent) return;
			// Use clientWidth to obtain accurate inner width (excluding border shifts)
			const size = Math.round(parent.clientWidth);
			const dpr = window.devicePixelRatio || 1;
			canvas!.width = size * dpr;
			canvas!.height = size * dpr;
			ctx!.scale(dpr, dpr);
			canvas!.style.width = `${size}px`;
			canvas!.style.height = `${size}px`;
		};

		window.addEventListener("resize", resizeCanvas);
		resizeCanvas();

		const drawBlueprint = (width: number) => {
			if (!ctx) return;
			const c = width / 2;

			ctx.clearRect(0, 0, width, width);

			ctx.strokeStyle = "rgba(5, 66, 115, 0.15)";
			ctx.lineWidth = 0.5;

			ctx.beginPath();
			ctx.arc(c, c, width * 0.46, 0, Math.PI * 2);
			ctx.stroke();

			ctx.save();
			ctx.strokeStyle = "rgba(5, 66, 115, 0.3)";
			ctx.setLineDash([3, 3]);
			ctx.beginPath();
			ctx.arc(c, c, width * 0.40, 0, Math.PI * 2);
			ctx.stroke();

			ctx.strokeStyle = "rgba(5, 66, 115, 0.2)";
			ctx.setLineDash([1, 5]);
			ctx.beginPath();
			ctx.arc(c, c, width * 0.30, 0, Math.PI * 2);
			ctx.stroke();
			ctx.restore();

			ctx.save();
			ctx.strokeStyle = "rgba(5, 66, 115, 0.25)";
			ctx.setLineDash([2, 4]);

			ctx.beginPath();
			ctx.moveTo(c, width * 0.04);
			ctx.lineTo(c, width * 0.96);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(width * 0.04, c);
			ctx.lineTo(width * 0.96, c);
			ctx.stroke();
			ctx.restore();

			ctx.strokeStyle = "rgba(5, 66, 115, 0.08)";
			ctx.beginPath();
			ctx.moveTo(width * 0.18, width * 0.18);
			ctx.lineTo(width * 0.82, width * 0.82);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(width * 0.18, width * 0.82);
			ctx.lineTo(width * 0.82, width * 0.18);
			ctx.stroke();

			ctx.strokeStyle = "rgba(5, 66, 115, 0.4)";
			ctx.lineWidth = 0.8;
			ctx.save();
			ctx.setLineDash([12, 4]);
			ctx.beginPath();
			ctx.arc(c, c, width * 0.24, 0, Math.PI * 2);
			ctx.stroke();
			ctx.restore();

			ctx.strokeStyle = "rgba(5, 66, 115, 0.15)";
			ctx.lineWidth = 0.4;
			ctx.beginPath();
			ctx.arc(c, c, width * 0.23, 0, Math.PI * 2);
			ctx.stroke();
		};

		const animate = () => {
			const size = canvas.width / (window.devicePixelRatio || 1);
			drawBlueprint(size);

			ctx.fillStyle = "rgba(5, 131, 93, 0.35)";
			ctx.strokeStyle = "rgba(5, 131, 93, 0.35)";
			ctx.lineWidth = 0.5;

			floatingMolecules.forEach(mol => {
				mol.angle += mol.speed;
				const driftX = Math.sin(mol.angle) * 1.5;
				const driftY = Math.cos(mol.angle) * 1.5;

				const xA = (mol.xA + driftX) * (size / 100);
				const yA = (mol.yA + driftY) * (size / 100);
				const xB = (mol.xB + driftX) * (size / 100);
				const yB = (mol.yB + driftY) * (size / 100);

				ctx.beginPath();
				ctx.moveTo(xA, yA);
				ctx.lineTo(xB, yB);
				ctx.stroke();

				ctx.beginPath();
				ctx.arc(xA, yA, mol.rA, 0, Math.PI * 2);
				ctx.fill();

				ctx.beginPath();
				ctx.arc(xB, yB, mol.rB, 0, Math.PI * 2);
				ctx.fill();
			});

			rotationPhase += 0.015;
			const nodeCount = 14;
			const dnaPoints: Array<{ xA: number; y: number; zA: number; xB: number; zB: number }> = [];

			const frequency = (3 * Math.PI) / (nodeCount - 1);
			for (let i = 0; i < nodeCount; i++) {
				const yPercent = 15 + i * (70 / (nodeCount - 1));
				const y = yPercent * (size / 100);
				const angle = i * frequency + rotationPhase;

				const sinVal = Math.sin(angle);
				const cosVal = Math.cos(angle);

				const xA = (50 + 13 * sinVal) * (size / 100);
				const xB = (50 - 13 * sinVal) * (size / 100);

				dnaPoints.push({ xA, y, zA: cosVal, xB, zB: -cosVal });
			}

			dnaPoints.forEach((pt, idx) => {
				ctx.strokeStyle = `rgba(5, 66, 115, ${0.35 + pt.zA * 0.2})`;
				ctx.lineWidth = 0.8;
				ctx.beginPath();
				ctx.moveTo(pt.xA, pt.y);
				ctx.lineTo(pt.xB, pt.y);
				ctx.stroke();
			});

			ctx.beginPath();
			ctx.strokeStyle = "rgba(5, 66, 115, 0.45)";
			ctx.lineWidth = 1.2;
			ctx.moveTo(dnaPoints[0].xA, dnaPoints[0].y);
			for (let i = 1; i < dnaPoints.length; i++) {
				const xc = (dnaPoints[i - 1].xA + dnaPoints[i].xA) / 2;
				const yc = (dnaPoints[i - 1].y + dnaPoints[i].y) / 2;
				ctx.quadraticCurveTo(dnaPoints[i - 1].xA, dnaPoints[i - 1].y, xc, yc);
			}
			ctx.lineTo(dnaPoints[dnaPoints.length - 1].xA, dnaPoints[dnaPoints.length - 1].y);
			ctx.stroke();

			ctx.beginPath();
			ctx.strokeStyle = "rgba(74, 66, 56, 0.6)";
			ctx.lineWidth = 1.2;
			ctx.moveTo(dnaPoints[0].xB, dnaPoints[0].y);
			for (let i = 1; i < dnaPoints.length; i++) {
				const xc = (dnaPoints[i - 1].xB + dnaPoints[i].xB) / 2;
				const yc = (dnaPoints[i - 1].y + dnaPoints[i].y) / 2;
				ctx.quadraticCurveTo(dnaPoints[i - 1].xB, dnaPoints[i - 1].y, xc, yc);
			}
			ctx.lineTo(dnaPoints[dnaPoints.length - 1].xB, dnaPoints[dnaPoints.length - 1].y);
			ctx.stroke();

			dnaPoints.forEach((pt, idx) => {
				const sizeFactorA = pt.zA * 0.35 + 1.0;
				const sizeFactorB = pt.zB * 0.35 + 1.0;

				const rA = sizeFactorA * 2.2;
				const rB = sizeFactorB * 2.2;

				const opacityA = pt.zA * 0.3 + 0.65;
				const opacityB = pt.zB * 0.3 + 0.65;

				const isGreenA = idx % 3 === 0;
				const isGreenB = idx % 3 === 2;

				ctx.fillStyle = isGreenA
					? `rgba(5, 131, 93, ${opacityA})`
					: `rgba(5, 66, 115, ${opacityA})`;
				ctx.beginPath();
				ctx.arc(pt.xA, pt.y, rA, 0, Math.PI * 2);
				ctx.fill();

				ctx.fillStyle = isGreenB
					? `rgba(5, 131, 93, ${opacityB})`
					: `rgba(5, 66, 115, ${opacityB})`;
				ctx.beginPath();
				ctx.arc(pt.xB, pt.y, rB, 0, Math.PI * 2);
				ctx.fill();

				if (Math.abs(pt.xA - pt.xB) < 2.5) {
					ctx.fillStyle = `rgba(5, 66, 115, 0.8)`;
					ctx.beginPath();
					ctx.arc((pt.xA + pt.xB) / 2, pt.y, 2.2, 0, Math.PI * 2);
					ctx.fill();
				}
			});

			animationFrameId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);



	useGSAP(() => {
		if (!containerRef.current) return;

		// Register CDN-loaded plugins to the imported gsap instance
		const ScrollTrigger = (window as any).ScrollTrigger;
		const ScrollSmoother = (window as any).ScrollSmoother;
		if (ScrollTrigger) {
			const isMobile = window.matchMedia("(max-width: 1024px)").matches || ScrollTrigger.isTouch === 1;

			if (ScrollSmoother && !isMobile) {
				gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
				const smoother = ScrollSmoother.create({
					wrapper: "#smooth-wrapper",
					content: "#smooth-content",
					smooth: 1.2,
					effects: true,
				});

				// Custom smooth scroll handler for all hash links (600ms)
				document.querySelectorAll("a[href^='#']").forEach(link => {
					link.addEventListener("click", (e) => {
						const href = link.getAttribute("href");
						if (href) {
							e.preventDefault();
							let targetPosition = 0;
							if (href !== "#") {
								const targetElement = document.querySelector(href);
								if (targetElement) {
									targetPosition = smoother.offset(targetElement, "top top");
								}
							}
							if (smoother) smoother.paused(false);
							gsap.to(smoother, {
								scrollTop: targetPosition,
								duration: 0.6,
								ease: "power2.out",
								overwrite: "auto"
							});
						}
					});
				});
			} else {
				gsap.registerPlugin(ScrollTrigger);

				// Fallback scroll handler for hash links when ScrollSmoother is disabled on mobile
				document.querySelectorAll("a[href^='#']").forEach(link => {
					link.addEventListener("click", (e) => {
						const href = link.getAttribute("href");
						if (href) {
							e.preventDefault();
							if (href === "#") {
								window.scrollTo({ top: 0, behavior: "smooth" });
							} else {
								const targetElement = document.querySelector(href);
								if (targetElement) {
									targetElement.scrollIntoView({ behavior: "smooth" });
								}
							}
						}
					});
				});
			}

			// Scroll-driven shrinking mask timeline centered on pinning Section 2
			const maskTl = gsap.timeline({
				scrollTrigger: {
					trigger: ".mask-section-2",
					start: "top top",
					// The pinning duration connects to the ScrollTrigger 'end' value.
					// We set 'end' to '+=300%' which means Section 2 remains pinned 
					// for exactly 300% of the viewport height (approx 3 full mouse wheels/scroll heights).
					// This translates to a longer, controlled, and immersive scrolling experience:
					// - The first 100% of scroll shrinks the nested Section 1 down into a central circle mask.
					// - The next 200% scroll sequentially reveals and translates the 3 phrases of Section 2.
					end: "+=300%",
					pin: true,
					pinSpacing: true,
					scrub: 1.2, // Connects the timeline playhead to scroll speed with a smooth catch-up delay
					invalidateOnRefresh: true, // Recalculates sizes on window resize to ensure layout remains stable
				}
			});

			// 1. Shrink Section 1 (Hero) into a perfect central circle mask
			maskTl.to(".mask-section-1", {
				scale: 0.65,
				clipPath: "circle(18% at 50% 50%)",
				duration: 2.0,
				ease: "power2.inOut"
			})
				// 2. Shrink completely to 0 and fade out to reveal Section 2 underneath
				.to(".mask-section-1", {
					scale: 0.0,
					clipPath: "circle(0% at 50% 50%)",
					opacity: 0,
					duration: 1.0,
					ease: "power2.in"
				})
				// 3. Scroll Section 2's phrases up to reveal Phrase 2 (translates from 0 to -33.33% height)
				.to(".mask-phrases-scroll", {
					yPercent: -33.33,
					duration: 2.5,
					ease: "power1.inOut"
				})
				// 4. Scroll Section 2's phrases up to reveal Phrase 3 (translates from -33.33% to -66.66% height)
				.to(".mask-phrases-scroll", {
					yPercent: -66.66,
					duration: 2.5,
					ease: "power1.inOut"
				});

			// Subtle parallax movement of Section 2 background image (spans the entire 8.0 scroll timeline duration)
			maskTl.fromTo(".section2-bg-image",
				{ yPercent: 10 },
				{ yPercent: -10, ease: "none", duration: 8.0 },
				0
			);


		}

		// Target the image and animate its Y position on scroll
		gsap.to(".section4-bg-image", {
			yPercent: 30, // Moves the image down by 30% relative to its height as you scroll
			ease: "none", // Must be "none" to keep the movement linear with the scrollbar
			scrollTrigger: {
				trigger: ".section4-bg-image",
				start: "top bottom", // Start when the top of the section hits the bottom of the viewport
				end: "bottom top", // End when the bottom of the section leaves the viewport
				scrub: true, // Ties the animation exactly to the scrollbar
				invalidateOnRefresh: true // Ensures responsiveness on window resize
			}
		});


		const mm = gsap.matchMedia();

		// Desktop animations (min-width: 1024px)
		mm.add("(min-width: 1024px)", () => {
			const tl = gsap.timeline({
				defaults: {
					ease: "power4.inOut",
				}
			});

			tl.fromTo(".hero-right-col",
				{
					scale: 1.05,
					opacity: 0
				},
				{
					scale: 1,
					opacity: 1,
					duration: 2.0,
					ease: "power2.out",
					clearProps: "all"
				}
			)
				.fromTo(".hero-left-col",
					{ opacity: 0 },
					{ opacity: 1, duration: 1.2, ease: "power3.out", clearProps: "opacity" },
					"<"
				)
				.fromTo(".hero-nav",
					{ opacity: 0, y: -20 },
					{ opacity: 1, y: 0, duration: 1.2, ease: "power3.out", clearProps: "all" },
					"<+=0.3"
				)
				.fromTo(".hero-h1",
					{ opacity: 0, x: -60 },
					{ opacity: 1, x: 0, duration: 1.6, ease: "power4.out" },
					"-=1.0"
				)
				.fromTo(".hero-p",
					{ opacity: 0, x: -40 },
					{ opacity: 1, x: 0, duration: 1.6, ease: "power4.out" },
					"-=1.2"
				)
				.fromTo(".hero-a",
					{ opacity: 0, x: -30 },
					{ opacity: 1, x: 0, duration: 1.4, ease: "power4.out" },
					"-=1.2"
				)
				.fromTo(".hero-card-desktop",
					{ opacity: 0, y: 30 },
					{ opacity: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.2 },
					"-=1.0"
				);
		});

		// Mobile animations (max-width: 1023px)
		mm.add("(max-width: 1023px)", () => {
			const tl = gsap.timeline({
				defaults: {
					ease: "power4.out",
				}
			});

			tl.fromTo(".hero-left-col",
				{ opacity: 0 },
				{ opacity: 1, duration: 1.2, clearProps: "opacity" }
			)
				.fromTo(".hero-nav",
					{ opacity: 0, y: -20 },
					{ opacity: 1, y: 0, duration: 1.2, ease: "power3.out", clearProps: "all" },
					"<+=0.3"
				)
				.fromTo(".hero-right-col",
					{ opacity: 0, scale: 1.05 },
					{ opacity: 1, scale: 1, duration: 1.6, ease: "power2.out", clearProps: "all" },
					"-=0.8"
				)
				.fromTo(".hero-h1",
					{ opacity: 0, x: -30 },
					{ opacity: 1, x: 0, duration: 1.4 },
					"-=1.0"
				)
				.fromTo(".hero-p",
					{ opacity: 0, x: -20 },
					{ opacity: 1, x: 0, duration: 1.4 },
					"-=1.0"
				)
				.fromTo(".hero-a",
					{ opacity: 0, x: -15 },
					{ opacity: 1, x: 0, duration: 1.2 },
					"-=1.0"
				)
				.fromTo(".hero-card-mobile",
					{ opacity: 0, y: 30 },
					{ opacity: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.2 },
					"-=0.8"
				);
		});

		// --- Scroll Reveal Animations for all sections ---
		if (ScrollTrigger) {
			// 1. Nosotros Section
			gsap.fromTo("#nosotros .nosotros-reveal",
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power3.out",
					stagger: 0.15,
					scrollTrigger: {
						trigger: "#nosotros",
						start: "top 75%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#nosotros .nosotros-cta",
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power2.out",
					scrollTrigger: {
						trigger: "#nosotros .nosotros-cta",
						start: "top 85%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#nosotros .nosotros-particles-container",
				{ opacity: 0, scale: 0.95 },
				{
					opacity: 1,
					scale: 1,
					duration: 1.0,
					ease: "power2.out",
					scrollTrigger: {
						trigger: "#nosotros",
						start: "top 70%",
						toggleActions: "play none none none"
					}
				}
			);


			// 3. Enfermedades Section (Pin & Stagger Curtain reveal)
			gsap.fromTo("#enfermedades .enfermedades-reveal",
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power2.out",
					scrollTrigger: {
						trigger: "#enfermedades",
						start: "top 95%",
						toggleActions: "play none none none"
					}
				}
			);

			const enfermedadesTl = gsap.timeline({
				scrollTrigger: {
					trigger: "#enfermedades",
					start: "top top",
					end: "+=120%",
					pin: true,
					pinSpacing: true,
					scrub: 1.2,
					invalidateOnRefresh: true,
				}
			});

			enfermedadesTl.fromTo("#enfermedades .enfermedades-card",
				{ opacity: 0, yPercent: 120 },
				{
					opacity: 1,
					yPercent: 0,
					duration: 2.0,
					stagger: 0.6,
					ease: "power3.out"
				}
			);

			gsap.fromTo("#tratamientos .enfermedades-2-reveal",
				{ opacity: 0, y: -40 },
				{
					opacity: 1,
					y: 0,
					duration: 1.0,
					ease: "power3.out",
					scrollTrigger: {
						trigger: "#tratamientos",
						start: "top 80%",
						toggleActions: "restart none none none"
					}
				}
			);

			gsap.fromTo("#tratamientos .list-card",
				{ opacity: 0, y: 50 },
				{
					opacity: 1,
					y: 0,
					duration: 1.0,
					ease: "power3.out",
					stagger: 0.18,
					scrollTrigger: {
						trigger: "#tratamientos",
						start: "top 75%",
						toggleActions: "play none none none"
					}
				}
			);

			// 3. Planes Section
			gsap.fromTo("#planes .planes-reveal",
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power3.out",
					stagger: 0.12,
					scrollTrigger: {
						trigger: "#planes",
						start: "top 75%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#planes .planes-tabs",
				{ opacity: 0, x: -30 },
				{
					opacity: 1,
					x: 0,
					duration: 0.8,
					ease: "power2.out",
					scrollTrigger: {
						trigger: "#planes .planes-tabs",
						start: "top 80%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#planes .planes-content",
				{ opacity: 0, x: 30 },
				{
					opacity: 1,
					x: 0,
					duration: 0.8,
					ease: "power2.out",
					scrollTrigger: {
						trigger: "#planes .planes-content",
						start: "top 80%",
						toggleActions: "play none none none"
					}
				}
			);

			// 3b. Terapias Section
			gsap.fromTo("#terapias .terapias-reveal",
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power3.out",
					stagger: 0.12,
					scrollTrigger: {
						trigger: "#terapias",
						start: "top 75%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#terapias .terapias-tabs",
				{ opacity: 0, x: -30 },
				{
					opacity: 1,
					x: 0,
					duration: 0.8,
					ease: "power2.out",
					scrollTrigger: {
						trigger: "#terapias .terapias-tabs",
						start: "top 80%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#terapias .terapias-content",
				{ opacity: 0, x: 30 },
				{
					opacity: 1,
					x: 0,
					duration: 0.8,
					ease: "power2.out",
					scrollTrigger: {
						trigger: "#terapias .terapias-content",
						start: "top 80%",
						toggleActions: "play none none none"
					}
				}
			);

			// 3c. Team Section
			gsap.fromTo("#team .team-reveal",
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power3.out",
					stagger: 0.12,
					scrollTrigger: {
						trigger: "#team",
						start: "top 75%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#team .team-card",
				{ opacity: 0, y: 40 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power2.out",
					stagger: 0.15,
					scrollTrigger: {
						trigger: "#team",
						start: "top 75%",
						toggleActions: "play none none none"
					}
				}
			);

			// Call to action Section
			gsap.fromTo("#cta-orientacion .cta-reveal",
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power3.out",
					stagger: 0.12,
					scrollTrigger: {
						trigger: "#cta-orientacion",
						start: "top 75%",
						toggleActions: "play none none none"
					}
				}
			);

			// 4. Contacto Section
			gsap.fromTo("#contacto .contacto-reveal",
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power3.out",
					stagger: 0.12,
					scrollTrigger: {
						trigger: "#contacto",
						start: "top 75%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#contacto .info-block",
				{ opacity: 0, x: -30 },
				{
					opacity: 1,
					x: 0,
					duration: 0.6,
					ease: "power2.out",
					stagger: 0.1,
					scrollTrigger: {
						trigger: "#contacto .info-block",
						start: "top 85%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#contacto .contacto-horario",
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power2.out",
					scrollTrigger: {
						trigger: "#contacto .contacto-horario",
						start: "top 85%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#contacto .contacto-form-container",
				{ opacity: 0, x: 40 },
				{
					opacity: 1,
					x: 0,
					duration: 1.0,
					ease: "power3.out",
					scrollTrigger: {
						trigger: "#contacto .contacto-form-container",
						start: "top 80%",
						toggleActions: "play none none none"
					}
				}
			);
		}
	}, { scope: containerRef });

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitted(true);
		setTimeout(() => {
			setSubmitted(false);
			setFormState({ name: "", phone: "", email: "", plan: "diabetcare", message: "" });
		}, 4000);
	};

	const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const name = e.target.name;
		const value = e.target.value;
		setFormState(prev => ({ ...prev, [name]: value }));
	};

	const activePlan = PLANS_DATA[selectedPlanIndex];
	const activeTerapia = TERAPIAS_DATA[selectedTerapiaIndex];

	return (
		<div id="smooth-wrapper" ref={containerRef}>
			{/* Navigation */}
			<nav
				className={`hero-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 md:px-12 md:py-4 text-sm transition-all duration-300 ${navScrolled
					? "bg-[#faf6eb]/70 backdrop-blur-xl"
					: "bg-transparent"
					}`}
				style={{ opacity: 0 }}
			>
				<div className="flex items-center">
					<Image
						src="/images/new-life.svg"
						alt="New Life Logo"
						width={200}
						height={60}
						className="h-12 w-auto object-contain transition-all duration-300"
						style={{ filter: navScrolled ? "none" : "brightness(0) invert(1)" }}
						priority
					/>
				</div>
				<div className={`hidden md:flex gap-8 lg:gap-10 font-medium tracking-wide uppercase text-xs transition-colors duration-300 ${navScrolled ? "text-[#1F384D]" : "text-white"
					}`}>
					<a href="#" className={`transition-colors flex items-center gap-2 ${navScrolled ? "hover:text-[#05835d]" : "hover:text-[#c1aa58]"}`}>
						<span className="w-1.5 h-1.5 rounded-full bg-[#c1aa58]"></span> Inicio
					</a>
					<a href="#nosotros" className={`transition-colors flex items-center gap-2 ${navScrolled ? "hover:text-[#05835d]" : "hover:text-[#c1aa58]"}`}>
						<span className="w-1.5 h-1.5 rounded-full bg-[#c1aa58]"></span> Nosotros
					</a>
					<a href="#terapias" className={`transition-colors flex items-center gap-2 ${navScrolled ? "hover:text-[#05835d]" : "hover:text-[#c1aa58]"}`}>
						<span className="w-1.5 h-1.5 rounded-full bg-[#c1aa58]"></span> Terapias Alternativas
					</a>
					<a href="#planes" className={`transition-colors flex items-center gap-2 ${navScrolled ? "hover:text-[#05835d]" : "hover:text-[#c1aa58]"}`}>
						<span className="w-1.5 h-1.5 rounded-full bg-[#c1aa58]"></span> Planes de salud integral
					</a>
					<a href="#contacto" className={`transition-colors flex items-center gap-2 ${navScrolled ? "hover:text-[#05835d]" : "hover:text-[#c1aa58]"}`}>
						<span className="w-1.5 h-1.5 rounded-full bg-[#c1aa58]"></span> Contacto
					</a>
				</div>
				<div className="flex items-center gap-4">
					{/* Desktop CTA Button */}
					<a
						href="https://wa.me/50498580298?text=Hola!%20Me%20interesa%20agendar%20una%20cita."
						target="_blank"
						rel="noopener noreferrer"
						className={`hidden md:inline-block font-medium tracking-wide uppercase text-xs border rounded-full px-6 py-2.5 transition-all duration-300 shadow-sm hover:shadow-md ${navScrolled
							? "border-[#054273] text-[#054273] hover:bg-[#054273] hover:text-[#D9D4CC]"
							: "border-white/40 text-white hover:bg-white hover:text-[#054273]"
							}`}
					>
						Agendar Cita
					</a>


					{/* Mobile Hamburger Button */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className={`md:hidden w-12 h-12 rounded-full border flex flex-col items-center justify-center gap-1 z-50 relative group focus:outline-none transition-colors duration-300 ${navScrolled ? "border-[#054273]" : "border-white/30"
							}`}
						aria-label="Toggle Menu"
					>
						<span className={`h-0.5 w-5 rounded-sm transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[6px]" : ""} ${navScrolled || mobileMenuOpen ? "bg-[#054273]" : "bg-white"
							}`}></span>
						<span className={`h-0.5 w-5 rounded-sm transition-all duration-300 ${mobileMenuOpen ? "opacity-0 scale-0" : ""} ${navScrolled ? "bg-[#054273]" : "bg-white"
							}`}></span>
						<span className={`h-0.5 w-5 rounded-sm transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[6px]" : ""} ${navScrolled || mobileMenuOpen ? "bg-[#054273]" : "bg-white"
							}`}></span>
					</button>
				</div>
			</nav>

			{/* Fullscreen Mobile Menu Overlay */}
			<div
				ref={mobileMenuRef}
				className="fixed inset-0 z-40 bg-[#D2CDC5] flex flex-col items-center justify-center py-16 pointer-events-none opacity-0 scale-95"
				style={{ willChange: "transform, opacity" }}
			>
				{/* Background decorative elements */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,131,93,0.06),transparent_70%)] pointer-events-none"></div>
				<div className="absolute top-1/3 left-1/4 text-[#054273]/5 text-[14rem] font-bold select-none pointer-events-none font-serif">*</div>

				{/* Mobile Menu Links */}
				<div className="flex flex-col items-center gap-6 z-10 text-center pb-12">
					<a
						href="#"
						onClick={() => setMobileMenuOpen(false)}
						className="mobile-menu-item text-4xl font-serif font-black tracking-tight uppercase text-[#054273] hover:text-[#05835d] transition-colors duration-300"
					>
						Inicio
					</a>
					<a
						href="#nosotros"
						onClick={() => setMobileMenuOpen(false)}
						className="mobile-menu-item text-4xl font-serif font-black tracking-tight uppercase text-[#054273] hover:text-[#05835d] transition-colors duration-300"
					>
						Nosotros
					</a>
					<a
						href="#terapias"
						onClick={() => setMobileMenuOpen(false)}
						className="mobile-menu-item text-4xl font-serif font-black tracking-tight uppercase text-[#054273] hover:text-[#05835d] transition-colors duration-300"
					>
						Terapias Alternativas
					</a>
					<a
						href="#planes"
						onClick={() => setMobileMenuOpen(false)}
						className="mobile-menu-item text-4xl font-serif font-black tracking-tight uppercase text-[#054273] hover:text-[#05835d] transition-colors duration-300"
					>
						Planes de salud integral
					</a>
					<a
						href="#contacto"
						onClick={() => setMobileMenuOpen(false)}
						className="mobile-menu-item text-4xl font-serif font-black tracking-tight uppercase text-[#054273] hover:text-[#05835d] transition-colors duration-300"
					>
						Contacto
					</a>
				</div>

				{/* Mobile Menu CTA at the bottom */}
				<div className="z-10 w-full px-6 text-center">
					<a
						href="https://wa.me/50498580298?text=Hola!%20Me%20interesa%20agendar%20una%20cita."
						target="_blank"
						rel="noopener noreferrer"
						onClick={() => setMobileMenuOpen(false)}
						className="mobile-menu-item font-serif font-black tracking-widest uppercase text-xs bg-[#054273] text-[#D9D4CC] rounded-full px-8 py-3.5 hover:bg-[#05835d] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
					>
						Agenda tu cita
					</a>
				</div>
			</div>

			<div id="smooth-content" className="relative min-h-screen bg-[#D9D4CC] text-[#1F384D] font-sans overflow-hidden">
				{/* Section 2: Revealed Underneath (the parent wrapper that pins using ScrollTrigger) */}
				<div className="mask-section-2 relative w-full h-screen z-10 bg-[#054273] text-[#D9D4CC] overflow-hidden">
					{/* Section 1: Hero (nested inside, absolute inset-0 on top of the parent) */}
					<div className="mask-section-1 absolute inset-0 z-20 overflow-hidden bg-[#D9D4CC]" style={{ clipPath: "circle(100% at 50% 50%)", transformOrigin: "center center", willChange: "transform, clip-path, opacity" }}>
						<main className="min-h-screen relative flex flex-col justify-between overflow-hidden">
							{/* Background Image Container */}
							<div className="hero-right-col absolute inset-0 z-0 overflow-hidden" style={{ opacity: 0 }}>
								<Image
									src="/images/hero-image.jpg"
									alt="New Life Center"
									fill
									className="object-cover object-center"
									priority
									sizes="100vw"
								/>
								{/* Dark overlay gradients for contrast */}
								<div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/15 to-transparent z-10 pointer-events-none" />

								{/* Glassmorphic vertical panel overlay on the right to frame molecular graphics */}
								{/* <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[45%] xl:w-[50%] bg-[#054273]/10 backdrop-blur-[1px] border-l border-white/5 z-10 pointer-events-none" /> */}

								{/* Interactive Particle System Canvas for Cell Simulation (covers full screen) */}
								<div className="absolute inset-0 z-20 pointer-events-auto overflow-hidden">
									<canvas
										ref={canvasRef}
										className="absolute top-0 left-0 w-screen h-screen opacity-80 pointer-events-auto"
									/>
								</div>
							</div>

							{/* Foreground Content Area */}
							<div className="hero-left-col z-10 flex-1 flex flex-col justify-between px-6 md:px-12 pt-36 pb-12 lg:pt-48 lg:pb-32 relative" style={{ opacity: 0 }}>

								{/* Upper Section: Main Title */}
								<div className="max-w-7xl w-full mb-8">
									<h1 className="hero-h1 text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-light tracking-wider text-white leading-tight font-serif uppercase select-none" style={{ opacity: 0 }}>
										Es momento de <br className="hidden sm:inline" />
										<span className="font-semibold text-[#D9D4CC] drop-shadow-sm">optimizar tu vida</span>
									</h1>
								</div>

								{/* Middle Section: Text Block & Buttons (aligned to the left) */}
								<div className="max-w-2xl w-full mb-12 sm:mb-20">
									<div className="hero-p mb-8" style={{ opacity: 0 }}>
										<h2 className="text-[#c1aa58] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-3 drop-shadow-sm">
											MEJORA TU SALUD DESDE LA MOLÉCULA
										</h2>
										<p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-xl font-normal drop-shadow-xs">
											Medicina funcional, regenerativa y terapias avanzadas para tratar enfermedades crónicas, neurológicas y metabólicas desde la causa raíz.
										</p>
									</div>

									{/* Action Buttons */}
									<div className="hero-a flex flex-col gap-6" style={{ opacity: 0 }}>
										<div className="flex flex-wrap gap-4 items-center">
											<a
												href="https://wa.me/50498580298?text=Hola!%20Me%20interesa%20agendar%20una%20cita."
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest text-white bg-black/70 backdrop-blur-md border border-white/20 hover:bg-[#05835d] hover:border-[#05835d] shadow-lg hover:shadow-xl transition-all duration-300"
											>
												Agendar cita
											</a>
											<a
												href="#enfermedades"
												className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest text-white bg-black/60 backdrop-blur-md border border-white/25 hover:bg-white hover:text-[#054273] shadow-md transition-all duration-300"
											>
												Enfermedades que tratamos
											</a>
										</div>
										{/* Redes Sociales */}
										<div className="flex gap-3">
											<a
												href="https://www.facebook.com/NewLifeCMO?locale=es_LA"
												target="_blank"
												rel="noopener noreferrer"
												className="w-10 h-10 rounded-full bg-black/65 hover:bg-[#05835d] border border-white/20 flex items-center justify-center text-white transition-all duration-300 backdrop-blur-md hover:scale-105"
												aria-label="Facebook"
											>
												<svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
													<path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
												</svg>
											</a>
											<a
												href="https://www.instagram.com/newlifecmoterapiasalternativas/?utm_source=ig_web_button_share_sheet"
												target="_blank"
												rel="noopener noreferrer"
												className="w-10 h-10 rounded-full bg-black/65 hover:bg-[#05835d] border border-white/20 flex items-center justify-center text-white transition-all duration-300 backdrop-blur-md hover:scale-105"
												aria-label="Instagram"
											>
												<svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
													<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
													<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
													<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
												</svg>
											</a>
											<a
												href="https://www.tiktok.com/@new.life.centro.m?is_from_webapp=1&sender_device=pc"
												target="_blank"
												rel="noopener noreferrer"
												className="w-10 h-10 rounded-full bg-black/65 hover:bg-[#05835d] border border-white/20 flex items-center justify-center text-white transition-all duration-300 backdrop-blur-md hover:scale-105"
												aria-label="TikTok"
											>
												<svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
													<path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.99-1.72-.08 2.54-.01 5.08-.07 7.62-.03 1.86-.47 3.75-1.58 5.21-1.39 1.89-3.79 3.01-6.14 2.91-2.99-.04-5.83-2.07-6.72-4.91-.98-3.04.14-6.61 2.76-8.23 1.41-.91 3.12-1.22 4.76-1.02.01 1.39-.02 2.77-.01 4.16-1.12-.22-2.38-.07-3.26.68-.86.72-1.14 1.95-.79 3 .35 1.16 1.58 1.97 2.79 1.87 1.25-.03 2.37-.99 2.59-2.22.13-1.63.04-3.27.06-4.91.01-4.08-.02-8.16.02-12.24z" />
												</svg>
											</a>
										</div>
									</div>
								</div>

								{/* Bottom Grid Info: restyled as modern glassmorphic cards */}
								<div className="absolute bottom-0 left-0 w-full hidden lg:grid grid-cols-2 z-20">
									<div className="hero-card-desktop p-8 border-t border-white/10 border-r border-white/10 relative group cursor-pointer bg-black/10 backdrop-blur-md hover:bg-[#054273]/30 transition-all duration-500" style={{ opacity: 0 }}>
										<div className="absolute top-8 right-8 text-[#c1aa58] text-2xl font-bold transition-transform duration-500 group-hover:rotate-90 select-none">*</div>
										<h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-4 text-[#c1aa58]">Medicina Ortomolecular</h3>
										<p className="text-sm font-medium text-white/80 leading-snug pr-8">
											Limpieza profunda del "filtro interno", liberando la carga tóxica de órganos vitales.
										</p>
									</div>
									<div className="hero-card-desktop p-8 relative border-t border-white/10 group cursor-pointer bg-black/10 backdrop-blur-md hover:bg-[#054273]/30 transition-all duration-500" style={{ opacity: 0 }}>
										<div className="absolute top-8 right-8 text-[#c1aa58] text-2xl font-bold transition-transform duration-500 group-hover:rotate-90 select-none">*</div>
										<h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-4 text-[#c1aa58]">Regeneración Celular</h3>
										<p className="text-sm font-medium text-white/80 leading-snug pr-8">
											Sueroterapias y terapias complementarias para restaurar tu equilibrio biológico.
										</p>
									</div>
								</div>
							</div>
						</main>

						{/* Mobile Bottom Info */}
						<div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 border-t border-[#054273]/10">
							<div className="hero-card-mobile p-6 border-b sm:border-b-0 sm:border-r border-[#054273]/10 relative group bg-[#E5E1D8]/20" style={{ opacity: 0 }}>
								<div className="absolute top-6 right-6 text-[#c1aa58] text-xl font-bold select-none">*</div>
								<h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-3 text-[#05835d]">Medicina Ortomolecular</h3>
								<p className="text-sm font-medium text-[#1F384D] leading-snug pb-12">
									Limpieza profunda del "filtro interno", liberando la carga tóxica de órganos vitales.
								</p>
							</div>
							<div className="hero-card-mobile p-6 relative group bg-[#E5E1D8]/20" style={{ opacity: 0 }}>
								<div className="absolute top-6 right-6 text-[#c1aa58] text-xl font-bold select-none">*</div>
								<h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-3 text-[#05835d]">Regeneración Celular</h3>
								<p className="text-sm font-medium text-[#1F384D] leading-snug pb-12">
									Sueroterapias y terapias complementarias para restaurar tu equilibrio biológico.
								</p>
							</div>
						</div>
					</div>

					{/* Section 2 Content layer (positioned underneath Section 1) */}
					<div className="absolute inset-0 z-10 flex flex-col bg-[#054273] text-[#D9D4CC] overflow-hidden">
						{/* Background Image with reduced brightness and overlay */}
						<div className="section2-bg-image absolute inset-0 z-0 opacity-35 filter brightness-[0.35] contrast-[1.1] scale-125">
							<Image
								src="/images/bg-newlife.jpg"
								alt="Fondo bioquímico"
								fill
								className="object-cover object-center"
								sizes="100vw"
								priority
							/>
						</div>
						{/* Decorative overlay gradients */}
						{/* <div className="absolute inset-0 bg-gradient-to-b from-[#054273]/70 via-[#054273]/85 to-[#054273]/95 z-0 mix-blend-multiply"></div> */}
						<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(193,170,88,0.15),transparent_60%)] z-0"></div>

						{/* Phrases scrollable track */}
						<div className="mask-phrases-scroll absolute top-0 left-0 w-full h-[300%] z-10 flex flex-col">
							{/* Phrase 1 Section */}
							<div className="h-1/3 flex flex-col items-center justify-center px-6 relative z-10 border-b border-[#D9D4CC]/5">
								<div className="flex flex-col items-center gap-4 text-center max-w-6xl">
									<span className="text-[#c1aa58] text-3xl font-bold select-none mb-1">*</span>
									<h4 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-wider text-[#c1aa58] font-serif">
										Es momento de optimizar tu vida
									</h4>
									<p className="text-lg sm:text-2xl lg:text-3xl font-serif text-[#D9D4CC] leading-relaxed max-w-3xl">
										Somos un Centro Médico de Medicina Ortomolecular y Homeopática. Nos especializamos en tratar las enfermedades desde la célula.
									</p>
								</div>
							</div>

							{/* Phrase 2 Section */}
							<div className="h-1/3 flex flex-col items-center justify-center px-6 relative z-10 border-b border-[#D9D4CC]/5">
								<div className="flex flex-col items-center gap-4 text-center max-w-6xl">
									<span className="text-[#c1aa58] text-3xl font-bold select-none mb-1">*</span>
									<h4 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-wider text-[#c1aa58] font-serif">
										Experimenta una transformación profunda
									</h4>
									<p className="text-lg sm:text-2xl lg:text-3xl font-serif text-[#D9D4CC] leading-relaxed max-w-3xl">
										Desde un sueño reparador, hasta un aumento notable en tu vitalidad y enfoque mental.
									</p>
								</div>
							</div>

							{/* Phrase 3 Section */}
							<div className="h-1/3 flex flex-col items-center justify-center px-6 relative z-10">
								<div className="flex flex-col items-center gap-4 text-center max-w-6xl">
									<span className="text-[#c1aa58] text-3xl font-bold select-none mb-1">*</span>
									<h4 className="text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-wider text-[#c1aa58] font-serif">
										Abordamos el origen del problema desde la célula
									</h4>
									<p className="text-lg sm:text-2xl lg:text-3xl font-serif text-[#D9D4CC] leading-relaxed max-w-3xl">
										Desintoxicación celular profunda con precisión científica, para liberar de toxinas tu cuerpo.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<section id="nosotros" className="bg-[#F5F0E5] relative overflow-hidden pt-24 px-6 md:px-12 lg:px-24 min-h-[85vh] flex items-center">
					<div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
						{/* Left: Text Content */}
						<div className="lg:col-span-6 flex flex-col justify-center">
							{/* Category Tag with Line */}
							<div className="flex items-center gap-4 mb-6 nosotros-reveal" style={{ opacity: 0 }}>
								<span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#05835d] font-mono">QUIÉNES SOMOS</span>
								<div className="h-[1.2px] bg-[#054273]/10 flex-grow"></div>
							</div>

							{/* Consistent serif title */}
							<h2 className="nosotros-reveal text-5xl sm:text-6xl lg:text-[68px] font-semibold tracking-tight text-[#054273] font-serif leading-[1.15] mb-10" style={{ opacity: 0 }}>
								Medicina 100%<br />Natural
							</h2>

							{/* Monospace Subtitle */}
							<span className="nosotros-reveal text-[10px] font-bold tracking-[0.25em] text-[#05835d] uppercase font-mono mb-2" style={{ opacity: 0 }}>
								Restauración celular
							</span>

							{/* Dotted separator line */}
							<div className="nosotros-reveal text-[#054273]/30 tracking-widest font-mono text-sm mb-18 select-none" style={{ opacity: 0 }}>
								......................
							</div>

							{/* Body Paragraphs in dark text */}
							<p className="nosotros-reveal text-sm md:text-base text-[#1F384D]/90 leading-relaxed font-normal mb-8 max-w-xl" style={{ opacity: 0 }}>
								Nos enfocamos en medicina integrativa y terapias alternativas, diseñadas para apoyar el equilibrio y bienestar de tu cuerpo de manera personalizada.
							</p>

							<div className="nosotros-cta mt-2" style={{ opacity: 0 }}>
								<a
									href="https://wa.me/50498580298?text=Hola!%20Me%20interesa%20agendar%20una%20cita."
									target="_blank"
									rel="noopener noreferrer"
									className="inline-block text-center text-xs font-bold uppercase tracking-widest text-white bg-[#054273] hover:bg-[#05835d] transition-colors duration-300 px-10 py-4 rounded-full shadow-md hover:shadow-lg"
								>
									AGENDAR CITA
								</a>
							</div>
						</div>

						{/* Right: Circular Blueprint Graphic Box */}
						<div className="lg:col-span-6 w-full flex justify-center items-center">
							<div className="nosotros-particles-container w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] lg:w-[460px] lg:h-[460px] rounded-full bg-[#ECE7DC]/40 border border-[#054273]/15 flex items-center justify-center relative shadow-sm hover:shadow-md transition-shadow duration-300" style={{ opacity: 0 }}>
								<canvas
									ref={canvasNosotrosRef}
									className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 rounded-full"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Section: Enfermedades que tratamos (Cortina Transition) */}
				<section id="enfermedades" className="w-full relative overflow-hidden bg-[#F5F0E5] p-0 h-screen flex flex-col justify-between">

					<div className="flex items-center justify-center z-20 pointer-events-none pt-24 pb-8 flex-shrink-0">
						<h2 className="enfermedades-reveal text-4xl sm:text-5xl lg:text-[64px] font-semibold tracking-tight text-[#054273] font-serif text-center px-4 py-12" style={{ opacity: 0 }}>
							Enfermedades que tratamos
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 w-full flex-grow gap-0 overflow-hidden">
						{/* Card 1: Knee pain */}
						<div className="enfermedades-card group relative w-full h-full overflow-hidden cursor-pointer" style={{ opacity: 0 }}>
							<Image
								src="/images/knee.jpg"
								alt="Dolor Articular"
								fill
								className="object-cover transition-transform duration-700 group-hover:scale-105"
								sizes="(max-width: 768px) 100vw, 33vw"
								priority
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10 transition-opacity duration-300 group-hover:opacity-40" />
						</div>

						{/* Card 2: Woman with inhalation mask */}
						<div className="enfermedades-card group relative w-full h-full overflow-hidden cursor-pointer" style={{ opacity: 0 }}>
							<Image
								src="/images/woman.jpg"
								alt="Alergias y Asma"
								fill
								className="object-cover transition-transform duration-700 group-hover:scale-105"
								sizes="(max-width: 768px) 100vw, 33vw"
								priority
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10 transition-opacity duration-300 group-hover:opacity-40" />
						</div>

						{/* Card 3: Legs in sauna */}
						<div className="enfermedades-card group relative w-full h-full overflow-hidden cursor-pointer" style={{ opacity: 0 }}>
							<Image
								src="/images/leg.jpg"
								alt="Insuficiencia Venosa"
								fill
								className="object-cover transition-transform duration-700 group-hover:scale-105"
								sizes="(max-width: 768px) 100vw, 33vw"
								priority
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10 transition-opacity duration-300 group-hover:opacity-40" />
						</div>
					</div>
				</section>

				{/* Section: List of enfermedades treated */}
				<section id="tratamientos" className="py-28 px-6 md:px-12 relative overflow-hidden bg-[#F5F0E5] flex items-center min-h-screen">
					{/* Background Image */}
					<div className="section4-bg-image absolute inset-0 z-0 scale-125">
						<Image
							src="/images/enfermedades.jpg"
							alt="Patologías Tratadas Background"
							fill
							className="object-cover pointer-events-none select-none"
							priority
						/>
						{/* Soft overlay to ensure readability */}
						<div className="absolute inset-0 bg-[#f5f0e5]/90 mix-blend-multiply z-0" />
						<div className="absolute inset-0 bg-gradient-to-b from-[#f5f0e5]/80 via-[#f5f0e5]/20 to-[#f5f0e5]/90 z-0" />
					</div>

					<div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
						{/* Row 1: 3 columns */}
						<div className="flex items-center justify-center z-20 pointer-events-none pt-8 pb-8 flex-shrink-0">
							<h2 className="enfermedades-2-reveal text-4xl sm:text-5xl lg:text-[64px] font-semibold tracking-tight text-[#054273] font-serif text-center px-4 py-12" style={{ opacity: 0 }}>
								Enfermedades que tratamos
							</h2>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mb-12 auto-rows-fr auto-cols-fr">
							{/* Card 1: Diábetes */}
							<div className="list-card h-full group flex flex-col items-center text-center hover:-translate-y-2" style={{ opacity: 0 }}>
								{/* Icon */}
								<div className="w-full bg-[#F5F0E5]/50 backdrop-blur-sm border border-[#054273]/8 rounded-2xl p-6 min-h-[160px] flex flex-col justify-center items-center shadow-sm group-hover:shadow-md group-hover:bg-[#F5F0E5] transition-all duration-300">
									<div className="mb-4 w-10 h-10 flex items-center justify-center text-[#05835d] group-hover:scale-110 transition-transform duration-300">
										<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
											<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 12 2 12 2C12 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
											<path d="M12 2v20" />
											<path d="M12 7C9.5 9 9.5 13 12 15" />
											<path d="M12 11C14.5 13 14.5 17 12 19" />
										</svg>
									</div>
									<h3 className="text-[#054273] text-xl font-bold mb-3 uppercase tracking-tight">
										Diábetes
									</h3>
								</div>
							</div>

							{/* Card 2: Hígado Graso */}
							<div className="list-card h-full group flex flex-col items-center text-center hover:-translate-y-2" style={{ opacity: 0 }}>
								{/* Icon */}
								<div className="w-full bg-[#F5F0E5]/50 backdrop-blur-sm border border-[#054273]/8 rounded-2xl p-6 min-h-[160px] flex flex-col justify-center items-center shadow-sm group-hover:shadow-md group-hover:bg-[#F5F0E5] transition-all duration-300">
									<div className="mb-4 w-10 h-10 flex items-center justify-center text-[#05835d] group-hover:scale-110 transition-transform duration-300">
										<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
											<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
											<path d="M12 6a6 6 0 0 0-6 6c0 3 6 6 6 6s6-3 6-6a6 6 0 0 0-6-6z" />
											<circle cx="12" cy="12" r="2" />
										</svg>
									</div>
									<h3 className="text-[#054273] text-xl font-bold mb-3 uppercase tracking-tight">
										Hígado Graso
									</h3>
								</div>
							</div>

							{/* Card 3: Hipotiroidismo */}
							<div className="list-card h-full group flex flex-col items-center text-center hover:-translate-y-2" style={{ opacity: 0 }}>
								{/* Icon */}
								<div className="w-full bg-[#F5F0E5]/50 backdrop-blur-sm border border-[#054273]/8 rounded-2xl p-6 min-h-[160px] flex flex-col justify-center items-center shadow-sm group-hover:shadow-md group-hover:bg-[#F5F0E5] transition-all duration-300">
									<div className="mb-4 w-10 h-10 flex items-center justify-center text-[#05835d] group-hover:scale-110 transition-transform duration-300">
										<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
											<path d="M12 5C11 3.5 8 2 6 2C3 2 2 4 2 7C2 12 7 15 12 21C17 15 22 12 22 7C22 4 21 2 18 2C16 2 13 3.5 12 5Z" />
											<path d="M12 5V21" />
											<path d="M7 9C9 10 10 12 7 15" />
											<path d="M17 9C15 10 14 12 17 15" />
										</svg>
									</div>
									<h3 className="text-[#054273] text-xl font-bold mb-3 uppercase tracking-tight">
										Hipo e Hipertiroidismo
									</h3>
								</div>
							</div>
						</div>

						{/* Row 2: 3 columns */}
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mb-16 auto-rows-fr">
							{/* Card 4: Dolor Articulaciones */}
							<div className="list-card group flex flex-col items-center text-center hover:-translate-y-2" style={{ opacity: 0 }}>
								<div className="w-full bg-[#F5F0E5]/50 backdrop-blur-sm border border-[#054273]/5 rounded-2xl p-6 min-h-[160px] flex flex-col justify-center items-center shadow-sm group-hover:shadow-md group-hover:bg-[#F5F0E5] transition-all duration-300">
									<div className="mb-4 w-10 h-10 flex items-center justify-center text-[#05835d] group-hover:scale-110 transition-transform duration-300">
										<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
											<circle cx="12" cy="12" r="3" />
											<path d="M12 2v7M12 15v7M2 12h7M15 12h7M19 5l-5 5M10 14l-5 5" />
										</svg>
									</div>
									<h3 className="text-[#054273] text-xl font-bold mb-3 uppercase tracking-tight">Dolor en Articulaciones</h3>
								</div>
							</div>

							{/* Card 5: Respiratorias */}
							<div className="list-card group flex flex-col items-center text-center hover:-translate-y-2" style={{ opacity: 0 }}>
								<div className="w-full bg-[#F5F0E5]/50 backdrop-blur-sm border border-[#054273]/5 rounded-2xl p-6 min-h-[160px] flex flex-col justify-center items-center shadow-sm group-hover:shadow-md group-hover:bg-[#F5F0E5] transition-all duration-300">
									<div className="mb-4 w-10 h-10 flex items-center justify-center text-[#05835d] group-hover:scale-110 transition-transform duration-300">
										<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
											<path d="M12 2v7" />
											<path d="M12 9a4 4 0 0 0-4-4c-2.5 0-5 2-5 5s2.5 6 5 6a4 4 0 0 0 4-4Z" />
											<path d="M12 9a4 4 0 0 1 4-4c2.5 0 5 2 5 5s-2.5 6-5 6a4 4 0 0 1-4-4Z" />
											<path d="M9 18c0 2 1.5 3 3 3s3-1 3-3" />
										</svg>
									</div>
									<h3 className="text-[#054273] text-xl font-bold mb-3 uppercase tracking-tight">Enfermedades Respiratorias</h3>
								</div>
							</div>

							{/* Card 6: Enfermedades de la piel */}
							<div className="list-card group flex flex-col items-center text-center hover:-translate-y-2" style={{ opacity: 0 }}>
								<div className="w-full bg-[#F5F0E5]/50 backdrop-blur-sm border border-[#054273]/5 rounded-2xl p-6 min-h-[160px] flex flex-col justify-center items-center shadow-sm group-hover:shadow-md group-hover:bg-[#F5F0E5] transition-all duration-300">
									<div className="mb-4 w-10 h-10 flex items-center justify-center text-[#05835d] group-hover:scale-110 transition-transform duration-300">
										<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
											<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
											<path d="M8 11h8M12 7v8" />
										</svg>
									</div>
									<h3 className="text-[#054273] text-xl font-bold mb-3 uppercase tracking-tight">Enfermedades de la piel</h3>
								</div>
							</div>
						</div>

						{/* CTA Button */}
						<div className="list-card" style={{ opacity: 0 }}>
							<a href="#planes" className="inline-block text-center text-xs font-bold uppercase tracking-widest text-[#FAF7F0] bg-[#054273] hover:bg-[#05835d] transition-colors duration-300 px-12 py-5 rounded-full shadow-lg hover:shadow-2xl">
								VER TODOS PLANES
							</a>
						</div>
					</div>
				</section>


				{/* Section: Terapias Alternativas (Interactive Dashboard) */}
				<section id="terapias" className="py-24 px-6 md:px-12 bg-[#FCFAF7] border-t border-[#054273]/10 relative">
					<div className="max-w-7xl mx-auto">
						<div className="text-center max-w-3xl mx-auto mb-16">
							<h2 className="terapias-reveal text-xs font-semibold uppercase tracking-[0.25em] text-[#05835d] mb-4" style={{ opacity: 0 }}>Terapias Alternativas Especializadas</h2>
							<h3 className="terapias-reveal text-4xl sm:text-5xl font-semibold tracking-tight text-[#054273] font-serif mb-6" style={{ opacity: 0 }}>
								Terapias Alternativas y Complementarias
							</h3>
							<p className="terapias-reveal text-base text-[#1F384D] opacity-90 leading-relaxed" style={{ opacity: 0 }}>
								Ofrecemos procedimientos diseñados meticulosamente para estimular la autocuración, aliviar el dolor, mejorar la circulación y regenerar tejidos desde la raíz biológica.
							</p>
						</div>

						{/* Interactive plan board wrapper */}
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
							{/* Left: Tab selection list */}
							<div className="terapias-tabs lg:col-span-4 max-h-[550px] overflow-y-auto border border-[#054273]/10 rounded-2xl bg-[#E5E1D8]/45 p-4 pr-2 scrollbar-thin scrollbar-thumb-[#054273]/20" style={{ opacity: 0 }}>
								<span className="text-[10px] font-bold uppercase tracking-wider text-[#054273]/70 px-2 pb-2 block border-b border-[#054273]/5">
									Seleccione una terapia
								</span>
								<div className="flex flex-col gap-1 mt-2">
									{TERAPIAS_DATA.map((terapia, idx) => (
										<button
											key={terapia.id}
											onClick={() => setSelectedTerapiaIndex(idx)}
											className={`text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between text-xs font-semibold tracking-wide uppercase ${selectedTerapiaIndex === idx
												? "bg-[#054273] text-[#D9D4CC] shadow-md"
												: "hover:bg-white/50 text-[#1F384D]"
												}`}
										>
											<span className="pr-2">{terapia.name}</span>
											{selectedTerapiaIndex === idx && <span className="w-1.5 h-1.5 rounded-full bg-[#c1aa58] shrink-0"></span>}
										</button>
									))}
								</div>
							</div>

							{/* Right: Selected Terapia details card */}
							<div className="terapias-content lg:col-span-8 bg-white/60 border border-[#054273]/10 rounded-2xl p-8 shadow-md relative min-h-[400px] flex flex-col justify-between" style={{ opacity: 0 }}>
								<div>
									<div className="flex items-start justify-between flex-wrap gap-4 mb-6">
										<div>
											<h4 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#054273] font-serif">
												{activeTerapia.name}
											</h4>
										</div>
										<div className="text-[#c1aa58] text-2xl font-bold select-none">*</div>
									</div>

									{/* Terapia Components info */}
									<div className="mb-8 border-t border-b border-[#054273]/10 py-6">
										<h5 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#054273] mb-4">
											Detalles de la Terapia
										</h5>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium text-[#1F384D]/90">
											<div className="flex flex-col gap-1.5">
												<span className="text-[10px] uppercase tracking-wider text-[#05835d]">Medicamento de Soporte</span>
												<div className="flex items-start gap-2.5">
													<svg className="w-4 h-4 text-[#05835d] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
														<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
													</svg>
													<span className="font-semibold text-sm">{activeTerapia.medicamento}</span>
												</div>
											</div>
											<div className="flex flex-col gap-1.5">
												<span className="text-[10px] uppercase tracking-wider text-[#05835d]">Número de Sesiones Recomendadas</span>
												<div className="flex items-start gap-2.5">
													<svg className="w-4 h-4 text-[#05835d] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
														<path d="M9 11l3 3L22 4"></path>
														<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
													</svg>
													<span className="font-semibold text-sm">{activeTerapia.sesiones} {activeTerapia.sesiones === 1 ? 'sesión' : 'sesiones'}</span>
												</div>
											</div>
											<div className="flex flex-col gap-1.5 md:col-span-2">
												<span className="text-[10px] uppercase tracking-wider text-[#05835d]">Duración por Sesión / Frecuencia</span>
												<div className="flex items-start gap-2.5">
													<svg className="w-4 h-4 text-[#05835d] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
														<circle cx="12" cy="12" r="10"></circle>
														<polyline points="12 6 12 12 16 14"></polyline>
													</svg>
													<span className="font-semibold text-sm">{activeTerapia.duracionFrecuencia}</span>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Booking CTA button */}
								<div className="mt-8 pt-6 border-t border-[#054273]/10 flex items-center justify-between flex-wrap gap-4">
									<span className="text-xs text-[#1F384D]/75 font-semibold">
										* Todos los tratamientos se realizan bajo estricta supervisión médica en nuestras instalaciones.
									</span>
									<a
										href={`https://wa.me/50498580298?text=${encodeURIComponent(`Hola! Me interesa agendar una cita para la terapia: ${activeTerapia.name}.`)}`}
										target="_blank"
										rel="noopener noreferrer"
										className="px-6 py-2.5 rounded-full bg-[#05835d] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#054273] transition-colors shadow-sm cursor-pointer"
									>
										Solicitar Terapia {activeTerapia.name}
									</a>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Section: Planes de Salud (Interactive Dashboard) */}
				<section id="planes" className="py-24 px-6 md:px-12 bg-[#FAF7F0] border-t border-b border-[#054273]/10 relative">
					<div className="max-w-7xl mx-auto">
						<div className="text-center max-w-3xl mx-auto mb-16">
							<h2 className="planes-reveal text-xs font-semibold uppercase tracking-[0.25em] text-[#05835d] mb-4" style={{ opacity: 0 }}>Planes Clínicos Específicos</h2>
							<h3 className="planes-reveal text-4xl sm:text-5xl font-semibold tracking-tight text-[#054273] font-serif mb-6" style={{ opacity: 0 }}>
								Planes de Salud Celular Integrales
							</h3>
							<p className="planes-reveal text-base text-[#1F384D] opacity-90 leading-relaxed" style={{ opacity: 0 }}>
								Programas médicos diseñados meticulosamente con exámenes diagnósticos de laboratorio, consultas, desintoxicación celular y sueroterapias específicas.
							</p>
						</div>

						{/* Interactive plan board wrapper */}
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
							{/* Left: Tab selection list */}
							<div className="planes-tabs lg:col-span-4 max-h-[550px] overflow-y-auto border border-[#054273]/10 rounded-2xl bg-[#E5E1D8]/45 p-4 pr-2 scrollbar-thin scrollbar-thumb-[#054273]/20" style={{ opacity: 0 }}>
								<span className="text-[10px] font-bold uppercase tracking-wider text-[#054273]/70 px-2 pb-2 block border-b border-[#054273]/5">
									Seleccione un plan de salud
								</span>
								<div className="flex flex-col gap-1 mt-2">
									{PLANS_DATA.map((plan, idx) => (
										<button
											key={plan.id}
											onClick={() => setSelectedPlanIndex(idx)}
											className={`text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between text-xs font-semibold tracking-wide uppercase ${selectedPlanIndex === idx
												? "bg-[#054273] text-[#D9D4CC] shadow-md"
												: "hover:bg-white/50 text-[#1F384D]"
												}`}
										>
											<span>{plan.name}</span>
											{selectedPlanIndex === idx && <span className="w-1.5 h-1.5 rounded-full bg-[#c1aa58]"></span>}
										</button>
									))}
								</div>
							</div>

							{/* Right: Selected Plan details card */}
							<div className="planes-content lg:col-span-8 bg-white/60 border border-[#054273]/10 rounded-2xl p-8 shadow-md relative min-h-[550px] flex flex-col justify-between" style={{ opacity: 0 }}>
								<div>
									<div className="flex items-start justify-between flex-wrap gap-4 mb-6">
										<div>
											<h4 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#054273] font-serif">
												{activePlan.name}
											</h4>
										</div>
										<div className="text-[#c1aa58] text-2xl font-bold select-none">*</div>
									</div>

									<p className="text-sm font-semibold text-[#05835d] uppercase tracking-wider mb-4">
										{activePlan.subtitle}
									</p>

									<p className="text-xs text-[#1F384D] leading-relaxed mb-6 font-normal">
										{activePlan.description}
									</p>

									{/* Plan Components checklist */}
									<div className="mb-8 border-t border-b border-[#054273]/10 py-6">
										<h5 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#054273] mb-4">
											¿Qué incluye el plan?
										</h5>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-[#1F384D]/90">
											<div className="flex items-start gap-2.5">
												<svg className="w-4 h-4 text-[#05835d] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
													<polyline points="20 6 9 17 4 12"></polyline>
												</svg>
												<span>{activePlan.consultas}</span>
											</div>
											<div className="flex items-start gap-2.5">
												<svg className="w-4 h-4 text-[#05835d] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
													<polyline points="20 6 9 17 4 12"></polyline>
												</svg>
												<span>{activePlan.desintoxicacion}</span>
											</div>
											<div className="flex items-start gap-2.5">
												<svg className="w-4 h-4 text-[#05835d] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
													<polyline points="20 6 9 17 4 12"></polyline>
												</svg>
												<span>{activePlan.sueroterapia}</span>
											</div>
											<div className="flex items-start gap-2.5">
												<svg className="w-4 h-4 text-[#05835d] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
													<polyline points="20 6 9 17 4 12"></polyline>
												</svg>
												<span>Medicación Oral</span>
											</div>
										</div>
									</div>

									{/* Exámenes de laboratorio list */}
									<div>
										<h5 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#054273] mb-3">
											Paquete de Exámenes de Laboratorio Clínico Incluidos:
										</h5>
										<div className="flex flex-wrap gap-1.5">
											{activePlan.examenes.map((ex, idx) => (
												<span
													key={idx}
													className="px-2.5 py-1 rounded bg-[#D9D4CC]/75 border border-[#054273]/5 text-[#1F384D] text-[10px] font-semibold tracking-wide"
												>
													{ex}
												</span>
											))}
										</div>
									</div>
								</div>

								{/* Booking CTA button */}
								<div className="mt-8 pt-6 border-t border-[#054273]/10 flex items-center justify-between flex-wrap gap-4">
									<span className="text-xs text-[#1F384D]/75 font-semibold">
										* Todos los tratamientos se realizan en nuestras instalaciones.
									</span>
									<a
										href={`https://wa.me/50498580298?text=${encodeURIComponent(`Hola! Me interesa agendar una cita para el plan de salud: ${activePlan.name} (${activePlan.subtitle}).`)}`}
										target="_blank"
										rel="noopener noreferrer"
										onClick={() => setFormState(prev => ({ ...prev, plan: activePlan.id }))}
										className="px-6 py-2.5 rounded-full bg-[#05835d] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#054273] transition-colors shadow-sm cursor-pointer"
									>
										Solicitar Plan {activePlan.name}
									</a>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Section: Nuestro Equipo */}
				<section id="team" className="py-24 px-6 md:px-12 bg-[#FAF7F0] border-t border-b border-[#054273]/10 relative">
					<div className="max-w-7xl mx-auto">
						<div className="text-center max-w-3xl mx-auto mb-16">
							<h2 className="team-reveal text-xs font-semibold uppercase tracking-[0.25em] text-[#05835d] mb-4" style={{ opacity: 0 }}>Especialistas en Salud</h2>
							<h3 className="team-reveal text-4xl sm:text-5xl font-semibold tracking-tight text-[#054273] font-serif mb-6" style={{ opacity: 0 }}>
								Nuestro Equipo Médico
							</h3>
							<p className="team-reveal text-base text-[#1F384D] opacity-90 leading-relaxed" style={{ opacity: 0 }}>
								Contamos con profesionales altamente capacitados y comprometidos en brindarte un tratamiento integral y personalizado para restaurar tu salud.
							</p>
						</div>

						{/* Grid of Team Members */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
							{/* Member 1 */}
							<div className="team-card flex flex-col items-center text-center group" style={{ opacity: 0 }}>
								<div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-[#054273]/10 shadow-md bg-[#E5E1D8]/20 transition-all duration-500 hover:shadow-lg">
									<Image
										src="/images/team/team1.jpeg"
										alt="Dra. Norma Godoy"
										fill
										className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
										sizes="(max-width: 768px) 100vw, 33vw"
									/>
								</div>
								<h4 className="text-2xl font-serif font-semibold text-[#054273] mt-6 mb-1.5">
									Dra. Norma Godoy
								</h4>
								<span className="text-xs font-semibold text-[#05835d] uppercase tracking-wider">
									Médico General e Integrativo
								</span>
							</div>

							{/* Member 2 */}
							<div className="team-card flex flex-col items-center text-center group" style={{ opacity: 0 }}>
								<div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-[#054273]/10 shadow-md bg-[#E5E1D8]/20 transition-all duration-500 hover:shadow-lg">
									<Image
										src="/images/team/team2.jpeg"
										alt="Mayela Rodríguez"
										fill
										className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
										sizes="(max-width: 768px) 100vw, 33vw"
									/>
								</div>
								<h4 className="text-2xl font-serif font-semibold text-[#054273] mt-6 mb-1.5">
									Mayela Rodríguez
								</h4>
								<span className="text-xs font-semibold text-[#05835d] uppercase tracking-wider max-w-[280px]">
									Terapeuta en Medicina Integrativa y Terapias Alternativas
								</span>
							</div>

							{/* Member 3 */}
							<div className="team-card flex flex-col items-center text-center group" style={{ opacity: 0 }}>
								<div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-[#054273]/10 shadow-md bg-[#E5E1D8]/20 transition-all duration-500 hover:shadow-lg">
									<Image
										src="/images/team/team3.jpeg"
										alt="Jessica Mineros"
										fill
										className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
										sizes="(max-width: 768px) 100vw, 33vw"
									/>
								</div>
								<h4 className="text-2xl font-serif font-semibold text-[#054273] mt-6 mb-1.5">
									Jessica Mineros
								</h4>
								<span className="text-xs font-semibold text-[#05835d] uppercase tracking-wider">
									Enfermera
								</span>
							</div>
						</div>
					</div>
				</section>


				{/* Section: Call to action */}
				<section id="cta-orientacion" className="py-20 px-6 md:px-12 bg-[#054273] text-[#FAF7F0] relative overflow-hidden border-b border-[#FAF7F0]/10">
					{/* Background decorative elements */}
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(193,170,88,0.15),transparent_50%)] z-0"></div>
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(5,131,93,0.12),transparent_50%)] z-0"></div>

					<div className="max-w-6xl mx-auto text-center relative z-10 flex flex-col items-center">
						{/* Decorative mark */}
						<span className="cta-reveal text-[#c1aa58] text-2xl font-bold select-none mb-4" style={{ opacity: 0 }}>*</span>

						{/* Tagline */}
						<span className="cta-reveal text-[10px] font-bold tracking-[0.25em] text-[#c1aa58] uppercase font-mono mb-3 block" style={{ opacity: 0 }}>
							¿No estás seguro de qué plan elegir?
						</span>

						{/* Title */}
						<h2 className="cta-reveal text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-[#FAF7F0] font-serif leading-tight mb-6" style={{ opacity: 0 }}>
							Te ayudamos a elegir el mejor tratamiento para ti
						</h2>

						{/* Description */}
						<p className="cta-reveal text-sm sm:text-base text-[#D9D4CC]/90 leading-relaxed max-w-2xl mb-10 font-normal" style={{ opacity: 0 }}>
							Cada cuerpo es diferente. Contáctanos hoy mismo y uno de nuestros asesores médicos te guiará personalmente para identificar el plan o terapia que mejor se adapte a tus necesidades y objetivos de salud.
						</p>

						{/* CTA Button */}
						<div className="cta-reveal" style={{ opacity: 0 }}>
							<a
								href="https://wa.me/50498580298?text=Hola!%20No%20estoy%20seguro%20de%20qué%20servicio%20o%20plan%20elegir.%20Me%20gustaría%20recibir%20orientación%20para%20agendar%20mi%20cita."
								target="_blank"
								rel="noopener noreferrer"
								className="inline-block text-center text-xs font-bold uppercase tracking-widest text-[#FAF7F0] bg-[#05835d] hover:bg-[#c1aa58] hover:text-[#054273] transition-all duration-300 px-10 py-4.5 rounded-full shadow-lg hover:shadow-2xl cursor-pointer"
							>
								Agendar cita
							</a>
						</div>
					</div>
				</section>


				{/* Section: Contacto */}
				<section id="contacto" className="py-24 px-6 md:px-12 bg-[#F3EFE3] relative">
					<div className="max-w-7xl mx-auto">
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
							{/* Left: Contact Info & Map Details */}
							<div className="lg:col-span-5">
								<h2 className="contacto-reveal text-xs font-semibold uppercase tracking-[0.25em] text-[#05835d] mb-4" style={{ opacity: 0 }}>Agenda una cita</h2>
								<h3 className="contacto-reveal text-4xl sm:text-5xl font-semibold tracking-tight text-[#054273] font-serif mb-6 leading-tight" style={{ opacity: 0 }}>
									Comienza tu transformación
								</h3>
								<p className="contacto-reveal text-sm text-[#1F384D] opacity-90 leading-relaxed mb-8" style={{ opacity: 0 }}>
									Visítanos en nuestras clínicas para una evaluación integral. Puedes agendar completando el formulario de contacto o llamando directamente a nuestros teléfonos oficiales.
								</p>

								{/* Edificio Image */}
								<div
									className="contacto-reveal mb-8 overflow-hidden rounded-2xl border border-[#054273]/15 shadow-md relative h-96 w-full cursor-pointer group/img"
									style={{ opacity: 0 }}
									onClick={() => setLightboxOpen(true)}
								>
									<Image
										src="/images/edificio.jpg"
										alt="Edificio Clínicas San Francisco"
										fill
										className="object-cover object-center transition-transform duration-700 group-hover/img:scale-105"
										sizes="(max-width: 768px) 100vw, 30vw"
									/>
									<div className="absolute inset-0 bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
										<div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white scale-90 group-hover/img:scale-100 transition-all duration-300">
											<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
												<circle cx="11" cy="11" r="8"></circle>
												<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
												<line x1="11" y1="8" x2="11" y2="14"></line>
												<line x1="8" y1="11" x2="14" y2="11"></line>
											</svg>
										</div>
									</div>
								</div>

								{/* Info Blocks */}
								<div className="flex flex-col gap-6 mb-8">
									{/* Dirección */}
									<div className="info-block flex items-start gap-4" style={{ opacity: 0 }}>
										<div className="w-10 h-10 rounded-xl bg-[#054273]/5 border border-[#054273]/10 flex items-center justify-center text-[#05835d] shrink-0">
											<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
												<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
												<circle cx="12" cy="10" r="3"></circle>
											</svg>
										</div>
										<div>
											<h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#054273] mb-1">Ubicación de la Clínica</h4>
											<p className="text-xs text-[#1F384D] leading-relaxed">
												Barrio La Ronda, Ave. Cristóbal Colón, Casa Fiallos / Clínicas San Francisco.
												<br />
												Primer piso, local 111, Tegucigalpa MDC, Honduras.
											</p>
											<a
												href="https://www.google.com/maps/search/?api=1&query=Clinicas+San+Francisco+Barrio+La+Ronda+Tegucigalpa"
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#05835d] hover:text-[#054273] transition-colors mt-2"
											>
												Ver en Google Maps &rarr;
											</a>
										</div>
									</div>

									{/* Teléfonos */}
									<div className="info-block flex items-start gap-4" style={{ opacity: 0 }}>
										<div className="w-10 h-10 rounded-xl bg-[#054273]/5 border border-[#054273]/10 flex items-center justify-center text-[#05835d] shrink-0">
											<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
												<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
											</svg>
										</div>
										<div>
											<h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#054273] mb-1">Teléfonos de Atención</h4>
											<div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-[#1F384D]">
												<a href="tel:98580298" className="hover:text-[#05835d] transition-colors">9858-0298</a>
												<span className="opacity-30">|</span>
												<a href="tel:22223749" className="hover:text-[#05835d] transition-colors">2222-3749</a>
											</div>
										</div>
									</div>

									{/* Correo */}
									<div className="info-block flex items-start gap-4" style={{ opacity: 0 }}>
										<div className="w-10 h-10 rounded-xl bg-[#054273]/5 border border-[#054273]/10 flex items-center justify-center text-[#05835d] shrink-0">
											<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
												<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
												<polyline points="22,6 12,13 2,6"></polyline>
											</svg>
										</div>
										<div>
											<h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#054273] mb-1">Correo Electrónico</h4>
											<a href="mailto:Newlifecmohn@gmail.com" className="text-xs font-semibold text-[#1F384D] hover:text-[#05835d] transition-colors">
												Newlifecmohn@gmail.com
											</a>
										</div>
									</div>
								</div>

								{/* Styled static layout map element */}
								<div className="contacto-horario p-6 rounded-2xl border border-[#054273]/10 bg-white/40 flex flex-col justify-center" style={{ opacity: 0 }}>
									<span className="text-[10px] font-bold uppercase tracking-widest text-[#054273] mb-2 block">
										Horario de Atención
									</span>
									<p className="text-xs text-[#1F384D] leading-relaxed">
										Lunes a Viernes: 8:00 A.M. - 4:00 P.M.
										<br />
										Sábados: 8:00 A.M. - 12:00 P.M.
									</p>
								</div>
							</div>

							{/* Right: Contact Form */}
							<div className="contacto-form-container lg:col-span-7 lg:pl-16" style={{ opacity: 0 }}>
								<h4 className="text-xl sm:text-2xl font-semibold text-[#054273] font-serif mb-8">Formulario de consulta e inscripción</h4>

								{submitted ? (
									<div className="py-16 text-center bg-white/40 border border-[#054273]/10 rounded-2xl p-8">
										<div className="w-16 h-16 bg-[#05835d]/10 rounded-full flex items-center justify-center text-[#05835d] mx-auto mb-4">
											<svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
												<polyline points="20 6 9 17 4 12"></polyline>
											</svg>
										</div>
										<h5 className="text-lg font-semibold text-[#054273] font-serif mb-2">¡Solicitud Enviada!</h5>
										<p className="text-xs text-[#1F384D] max-w-sm mx-auto leading-relaxed">
											Hemos recibido su mensaje. Uno de nuestros coordinadores médicos se comunicará con usted por teléfono o correo para confirmar su cita.
										</p>
									</div>
								) : (
									<form onSubmit={handleSubmit} className="flex flex-col mt-4">
										<div className="border-t border-[#054273]/20">
											{/* Row 1 */}
											<div className="grid grid-cols-1 sm:grid-cols-2 border-b border-[#054273]/20">
												<div className="flex flex-col py-6 sm:border-r border-[#054273]/20 sm:pr-10">
													<label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-[#054273]/70 mb-2">
														Nombre Completo
													</label>
													<input
														type="text"
														id="name"
														required
														placeholder="Ej. Carlos Rivera"
														value={formState.name}
														onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
														className="w-full bg-transparent text-base sm:text-lg font-semibold text-[#054273] placeholder-[#054273]/30 focus:outline-none py-1.5"
													/>
												</div>
												<div className="flex flex-col py-6 sm:pl-10">
													<label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-[#054273]/70 mb-2">
														Teléfono / WhatsApp
													</label>
													<input
														type="tel"
														id="phone"
														required
														placeholder="Ej. 9858-0000"
														value={formState.phone}
														onChange={e => setFormState(prev => ({ ...prev, phone: e.target.value }))}
														className="w-full bg-transparent text-base sm:text-lg font-semibold text-[#054273] placeholder-[#054273]/30 focus:outline-none py-1.5"
													/>
												</div>
											</div>

											{/* Row 2 */}
											<div className="grid grid-cols-1 sm:grid-cols-2 border-b border-[#054273]/20">
												<div className="flex flex-col py-6 sm:border-r border-[#054273]/20 sm:pr-10">
													<label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-[#054273]/70 mb-2">
														Correo Electrónico
													</label>
													<input
														type="email"
														id="email"
														required
														placeholder="Ej. correo@dominio.com"
														value={formState.email}
														onChange={e => setFormState(prev => ({ ...prev, email: e.target.value }))}
														className="w-full bg-transparent text-base sm:text-lg font-semibold text-[#054273] placeholder-[#054273]/30 focus:outline-none py-1.5"
													/>
												</div>
												<div className="flex flex-col py-6 sm:pl-10 relative">
													<label htmlFor="plan" className="text-xs font-semibold uppercase tracking-wider text-[#054273]/70 mb-2">
														Plan o Tratamiento de Interés
													</label>
													<div className="relative flex items-center">
														<select
															id="plan"
															name="plan"
															value={formState.plan}
															onChange={handlePlanChange}
															className="w-full bg-transparent text-base sm:text-lg font-semibold text-[#054273] focus:outline-none py-1.5 cursor-pointer appearance-none pr-8"
														>
															<optgroup label="Planes de Salud" className="bg-[#FAF7F0] text-[#054273] font-bold">
																{PLANS_DATA.map(plan => (
																	<option key={plan.id} value={plan.id} className="bg-[#FAF7F0] text-[#054273] font-normal">
																		{plan.name}
																	</option>
																))}
															</optgroup>
															<optgroup label="Terapias Alternativas" className="bg-[#FAF7F0] text-[#054273] font-bold">
																{TERAPIAS_DATA.map(terapia => (
																	<option key={terapia.id} value={terapia.id} className="bg-[#FAF7F0] text-[#054273] font-normal">
																		{terapia.name}
																	</option>
																))}
															</optgroup>
														</select>
														<span className="absolute right-0 pointer-events-none text-[#054273] text-lg font-bold">+</span>
													</div>
												</div>
											</div>

											{/* Row 3 */}
											<div className="flex flex-col py-6 border-b border-[#054273]/20">
												<label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-[#054273]/70 mb-2">
													Mensaje / Síntomas o Patologías
												</label>
												<textarea
													id="message"
													rows={3}
													placeholder="Describa brevemente cómo podemos ayudarle..."
													value={formState.message}
													onChange={e => setFormState(prev => ({ ...prev, message: e.target.value }))}
													className="w-full bg-transparent text-base sm:text-lg font-semibold text-[#054273] placeholder-[#054273]/30 focus:outline-none py-1.5 resize-none"
												></textarea>
											</div>
										</div>

										<div className="mt-10 flex justify-end">
											<button
												type="submit"
												className="group relative inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-white bg-[#054273] hover:bg-[#05835d] px-10 py-5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
											>
												Enviar Solicitud de Cita
												<span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white transition-transform duration-500 group-hover:rotate-90">
													+
												</span>
											</button>
										</div>
									</form>
								)}
							</div>
						</div>
					</div>
				</section>

				{/* Footer */}
				<footer className="py-12 px-6 md:px-12 bg-[#1F384D] text-[#D9D4CC] border-t border-[#054273]/10">
					<div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
						<div className="flex items-center flex-col md:items-start">
							<Image
								src="/images/new-life.svg"
								alt="New Life Logo"
								width={160}
								height={48}
								className="h-10 w-auto object-contain brightness-0 invert opacity-90 mb-3"
							/>
							<div className="flex gap-3 mb-4">
								<a
									href="https://www.facebook.com/NewLifeCMO?locale=es_LA"
									target="_blank"
									rel="noopener noreferrer"
									className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#05835d] flex items-center justify-center text-[#D9D4CC] transition-all duration-300 hover:scale-105"
									aria-label="Facebook"
								>
									<svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
										<path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
									</svg>
								</a>
								<a
									href="https://www.instagram.com/newlifecmoterapiasalternativas/?utm_source=ig_web_button_share_sheet"
									target="_blank"
									rel="noopener noreferrer"
									className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#05835d] flex items-center justify-center text-[#D9D4CC] transition-all duration-300 hover:scale-105"
									aria-label="Instagram"
								>
									<svg className="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
										<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
										<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
										<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
									</svg>
								</a>
								<a
									href="https://www.tiktok.com/@new.life.centro.m?is_from_webapp=1&sender_device=pc"
									target="_blank"
									rel="noopener noreferrer"
									className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#05835d] flex items-center justify-center text-[#D9D4CC] transition-all duration-300 hover:scale-105"
									aria-label="TikTok"
								>
									<svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
										<path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.99-1.72-.08 2.54-.01 5.08-.07 7.62-.03 1.86-.47 3.75-1.58 5.21-1.39 1.89-3.79 3.01-6.14 2.91-2.99-.04-5.83-2.07-6.72-4.91-.98-3.04.14-6.61 2.76-8.23 1.41-.91 3.12-1.22 4.76-1.02.01 1.39-.02 2.77-.01 4.16-1.12-.22-2.38-.07-3.26.68-.86.72-1.14 1.95-.79 3 .35 1.16 1.58 1.97 2.79 1.87 1.25-.03 2.37-.99 2.59-2.22.13-1.63.04-3.27.06-4.91.01-4.08-.02-8.16.02-12.24z" />
									</svg>
								</a>
							</div>
							<p className="text-[11px] text-[#D9D4CC]/60 max-w-sm text-center md:text-left leading-relaxed">
								New Life Centro Médico de Medicina Integrativa y Terapias Alternativas. Restaurando el equilibrio biochemical desde la célula. Tegucigalpa, Honduras.
							</p>
						</div>

						<div className="flex flex-col items-center md:items-end gap-3 text-xs font-semibold tracking-wider uppercase">
							<div className="flex gap-8">
								<a href="#nosotros" className="hover:text-[#05835d] transition-colors">Nosotros</a>
								<a href="#terapias" className="hover:text-[#05835d] transition-colors">Terapias Alternativas</a>
								<a href="#planes" className="hover:text-[#05835d] transition-colors">Planes de salud integral</a>
								<a href="#contacto" className="hover:text-[#05835d] transition-colors">Contacto</a>
							</div>
							<span className="text-[10px] text-[#D9D4CC]/40 tracking-normal font-normal">
								&copy; {new Date().getFullYear()} New Life Centro Médico. Todos los derechos reservados.
							</span>
						</div>
					</div>
				</footer>
			</div>

			{/* Lightbox Modal */}
			{lightboxOpen && (
				<div
					className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
					onClick={() => setLightboxOpen(false)}
				>
					{/* Close Button */}
					<button
						className="absolute top-6 right-6 text-white hover:text-gray-300 text-3xl font-light focus:outline-none cursor-pointer w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all z-10"
						onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
						aria-label="Close Lightbox"
					>
						&times;
					</button>

					{/* Lightbox Content Container */}
					<div
						className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="relative w-full h-full max-h-[85vh] aspect-[4/3] sm:aspect-auto">
							<Image
								src="/images/edificio.jpg"
								alt="Edificio Clínicas San Francisco"
								fill
								className="object-contain rounded-lg"
								sizes="90vw"
								priority
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
