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
		subtitle: "Protección y Regeneración Hepática",
		description: "Enfocado en desintoxicar las células hepáticas, reducir el hígado graso y optimizar el filtro digestivo primordial.",
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
		description: "Ideal para combatir Helicobacter pylori, regular la microbiota, sanar la mucosa gástrica y aliviar colitis y gastritis crónicas.",
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

const VALORES = ["Fe", "Responsabilidad", "Confiabilidad", "Credibilidad", "Integridad", "Honestidad", "Trato humano", "Honradez", "Respeto", "Sinceridad"];

export default function Home() {
	const [selectedPlanIndex, setSelectedPlanIndex] = useState<number>(0);
	const [formState, setFormState] = useState({ name: "", phone: "", email: "", plan: "diabetcare", message: "" });
	const [submitted, setSubmitted] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const mobileMenuRef = useRef<HTMLDivElement>(null);

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

	useGSAP(() => {
		if (!containerRef.current) return;

		// Register CDN-loaded plugins to the imported gsap instance
		const ScrollTrigger = (window as any).ScrollTrigger;
		const ScrollSmoother = (window as any).ScrollSmoother;
		if (ScrollTrigger) {
			if (ScrollSmoother) {
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
		}

		const mm = gsap.matchMedia();

		// Desktop animations (min-width: 1024px)
		mm.add("(min-width: 1024px)", () => {
			const tl = gsap.timeline({
				defaults: {
					ease: "power3.out",
				}
			});

			// 1. Background image: cinematic Ken Burns scale-in
			tl.fromTo(".hero-right-col",
				{ opacity: 0, scale: 1.08 },
				{ opacity: 1, scale: 1, duration: 2.2, ease: "power2.out" }
			)
				// 2. Molecular overlay fades in
				.fromTo(".hero-left-col",
					{ opacity: 0 },
					{ opacity: 1, duration: 1.4, clearProps: "opacity" },
					"-=1.6"
				)
				// 3. Navigation slides down
				.fromTo(".hero-nav",
					{ opacity: 0, y: -20 },
					{ opacity: 1, y: 0, duration: 1.2, ease: "power3.out", clearProps: "all" },
					"-=1.2"
				)
				// 4. Headline sweeps in from below
				.fromTo(".hero-h1",
					{ opacity: 0, y: 50 },
					{ opacity: 1, y: 0, duration: 1.6, ease: "power4.out" },
					"-=1.0"
				)
				// 5. Glassmorphism panel rises up
				.fromTo(".hero-p",
					{ opacity: 0, y: 40 },
					{ opacity: 1, y: 0, duration: 1.4, ease: "power4.out" },
					"-=1.0"
				)
				// 6. CTA buttons
				.fromTo(".hero-a",
					{ opacity: 0, y: 20 },
					{ opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
					"-=0.8"
				)
				// 7. Bottom cards slide up
				.fromTo(".hero-card-desktop",
					{ opacity: 0, y: 30 },
					{ opacity: 1, y: 0, duration: 1.2, ease: "power3.out", stagger: 0.2 },
					"-=0.8"
				);
		});

		// Mobile animations (max-width: 1023px)
		mm.add("(max-width: 1023px)", () => {
			const tl = gsap.timeline({
				defaults: {
					ease: "power4.out",
				}
			});

			// 1. Background image fades + scales in
			tl.fromTo(".hero-right-col",
				{ opacity: 0, scale: 1.05 },
				{ opacity: 1, scale: 1, duration: 1.8, ease: "power2.out" }
			)
				// 2. Content overlay fades in
				.fromTo(".hero-left-col",
					{ opacity: 0 },
					{ opacity: 1, duration: 1.2, clearProps: "opacity" },
					"-=1.2"
				)
				// 3. Nav slides down
				.fromTo(".hero-nav",
					{ opacity: 0, y: -20 },
					{ opacity: 1, y: 0, duration: 1.2, ease: "power3.out", clearProps: "all" },
					"-=0.8"
				)
				// 4. Headline
				.fromTo(".hero-h1",
					{ opacity: 0, y: 30 },
					{ opacity: 1, y: 0, duration: 1.4 },
					"-=1.0"
				)
				// 5. Glass panel
				.fromTo(".hero-p",
					{ opacity: 0, y: 25 },
					{ opacity: 1, y: 0, duration: 1.4 },
					"-=1.0"
				)
				// 6. CTAs
				.fromTo(".hero-a",
					{ opacity: 0, y: 15 },
					{ opacity: 1, y: 0, duration: 1.2 },
					"-=1.0"
				)
				// 7. Mobile bottom cards
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
					stagger: 0.12,
					scrollTrigger: {
						trigger: "#nosotros",
						start: "top 75%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#nosotros .nosotros-left-img",
				{ opacity: 0, scale: 0.96 },
				{
					opacity: 1,
					scale: 1,
					duration: 1.2,
					ease: "power2.out",
					scrollTrigger: {
						trigger: "#nosotros",
						start: "top 70%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#nosotros .nosotros-arrow",
				{ opacity: 0, x: -25 },
				{
					opacity: 1,
					x: 0,
					duration: 0.8,
					ease: "power2.out",
					scrollTrigger: {
						trigger: "#nosotros .nosotros-arrow",
						start: "top 85%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#nosotros .nosotros-list",
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power2.out",
					scrollTrigger: {
						trigger: "#nosotros .nosotros-list",
						start: "top 85%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#nosotros .nosotros-cta",
				{ opacity: 0, y: 25, scale: 0.95 },
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.8,
					ease: "back.out(1.5)",
					scrollTrigger: {
						trigger: "#nosotros .nosotros-cta",
						start: "top 85%",
						toggleActions: "play none none none"
					}
				}
			);

			// Vision, Mision, and Values
			gsap.fromTo("#nosotros .nosotros-card",
				{ opacity: 0, y: 40, scale: 0.98 },
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.8,
					ease: "power3.out",
					stagger: 0.2,
					scrollTrigger: {
						trigger: "#nosotros .nosotros-card",
						start: "top 80%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#nosotros .valores-title",
				{ opacity: 0, y: 20 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power2.out",
					scrollTrigger: {
						trigger: "#nosotros .valores-title",
						start: "top 85%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#nosotros .valor-tag",
				{ opacity: 0, scale: 0.85, y: 15 },
				{
					opacity: 1,
					scale: 1,
					y: 0,
					duration: 0.5,
					ease: "power2.out",
					stagger: 0.05,
					scrollTrigger: {
						trigger: "#nosotros .valores-title",
						start: "top 80%",
						toggleActions: "play none none none"
					}
				}
			);

			// 2. Tratamientos Section
			gsap.fromTo("#tratamientos .tratamientos-reveal",
				{ opacity: 0, y: 30 },
				{
					opacity: 1,
					y: 0,
					duration: 0.8,
					ease: "power3.out",
					stagger: 0.12,
					scrollTrigger: {
						trigger: "#tratamientos",
						start: "top 75%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#tratamientos .terapia-card",
				{ opacity: 0, y: 30, scale: 0.97 },
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.8,
					ease: "power2.out",
					stagger: 0.1,
					scrollTrigger: {
						trigger: "#tratamientos .terapia-card",
						start: "top 80%",
						toggleActions: "play none none none"
					}
				}
			);

			gsap.fromTo("#tratamientos .terapia-banner",
				{ opacity: 0, x: 30 },
				{
					opacity: 1,
					x: 0,
					duration: 1.0,
					ease: "power3.out",
					scrollTrigger: {
						trigger: "#tratamientos .terapia-banner",
						start: "top 80%",
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

	return (
		<div id="smooth-wrapper" ref={containerRef}>
			{/* Navigation */}
			<nav className="hero-nav fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 md:px-12 md:py-4 text-sm bg-[#0a1e30]/30 backdrop-blur-md border-b border-white/10" style={{ opacity: 0 }}>
				<div className="flex items-center">
					<Image
						src="/images/new-life.svg"
						alt="New Life Logo"
						width={200}
						height={60}
						className="h-12 w-auto object-contain brightness-0 invert"
						priority
					/>
				</div>
				<div className="hidden md:flex gap-8 lg:gap-10 font-medium tracking-wide uppercase text-xs">
					<a href="#" className="hover:text-[#c1aa58] text-white/90 transition-colors flex items-center gap-2">
						<span className="w-1.5 h-1.5 rounded-full bg-[#c1aa58]"></span> Inicio
					</a>
					<a href="#nosotros" className="hover:text-[#c1aa58] text-white/90 transition-colors flex items-center gap-2">
						<span className="w-1.5 h-1.5 rounded-full bg-[#c1aa58]"></span> Nosotros
					</a>
					<a href="#tratamientos" className="hover:text-[#c1aa58] text-white/90 transition-colors flex items-center gap-2">
						<span className="w-1.5 h-1.5 rounded-full bg-[#c1aa58]"></span> Tratamientos
					</a>
					<a href="#planes" className="hover:text-[#c1aa58] text-white/90 transition-colors flex items-center gap-2">
						<span className="w-1.5 h-1.5 rounded-full bg-[#c1aa58]"></span> Planes de Salud
					</a>
					<a href="#contacto" className="hover:text-[#c1aa58] text-white/90 transition-colors flex items-center gap-2">
						<span className="w-1.5 h-1.5 rounded-full bg-[#c1aa58]"></span> Contacto
					</a>
				</div>
				<div className="flex items-center gap-4">
					{/* Desktop CTA Button */}
					<a href="#contacto" className="hidden md:inline-block font-medium tracking-wide uppercase text-xs border border-white/40 text-white rounded-full px-6 py-2.5 hover:bg-white/15 hover:border-white/60 transition-all duration-300 shadow-sm hover:shadow-md">
						Agendar Cita
					</a>

					{/* Mobile Hamburger Button */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className="md:hidden w-12 h-12 rounded-full border border-white/40 flex flex-col items-center justify-center gap-1 z-50 relative group focus:outline-none transition-colors duration-300"
						aria-label="Toggle Menu"
					>
						<span className={`h-0.5 w-5 bg-white rounded-sm transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[6px]" : ""}`}></span>
						<span className={`h-0.5 w-5 bg-white rounded-sm transition-all duration-300 ${mobileMenuOpen ? "opacity-0 scale-0" : ""}`}></span>
						<span className={`h-0.5 w-5 bg-white rounded-sm transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`}></span>
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
						href="#tratamientos"
						onClick={() => setMobileMenuOpen(false)}
						className="mobile-menu-item text-4xl font-serif font-black tracking-tight uppercase text-[#054273] hover:text-[#05835d] transition-colors duration-300"
					>
						Tratamientos
					</a>
					<a
						href="#planes"
						onClick={() => setMobileMenuOpen(false)}
						className="mobile-menu-item text-4xl font-serif font-black tracking-tight uppercase text-[#054273] hover:text-[#05835d] transition-colors duration-300"
					>
						Planes de Salud
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
						href="#contacto"
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
						<main className="min-h-screen relative overflow-hidden">
							{/* Full-bleed Hero Background Image */}
							<div className="hero-right-col absolute inset-0 z-0" style={{ opacity: 0 }}>
								<Image
									src="/images/hero-image.jpg"
									alt="Mujer en armonía con la naturaleza — New Life Center"
									fill
									className="object-cover object-[center_15%] lg:object-center"
									priority
									sizes="100vw"
								/>
								{/* Cinematic gradient overlays for text readability */}
								<div className="absolute inset-0 bg-gradient-to-r from-[#0a1e30]/75 via-[#0a1e30]/40 to-transparent z-[1]" />
								<div className="absolute inset-0 bg-gradient-to-t from-[#0a1e30]/60 via-transparent to-[#87CEEB]/15 z-[1]" />
								<div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0a1e30]/50 to-transparent z-[1]" />
							</div>

							{/* Decorative molecular / neural-network SVG nodes */}
							<div className="hero-left-col absolute inset-0 z-[2] pointer-events-none overflow-hidden" style={{ opacity: 0 }}>
								<svg className="absolute right-0 top-1/4 w-[55%] h-[70%] opacity-[0.18] lg:opacity-[0.22]" viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg">
									{/* Connection lines */}
									<line x1="420" y1="80" x2="520" y2="180" stroke="#05835d" strokeWidth="1" strokeOpacity="0.5" />
									<line x1="520" y1="180" x2="480" y2="310" stroke="#05835d" strokeWidth="1" strokeOpacity="0.4" />
									<line x1="480" y1="310" x2="350" y2="380" stroke="#05835d" strokeWidth="1" strokeOpacity="0.35" />
									<line x1="350" y1="380" x2="280" y2="260" stroke="#05835d" strokeWidth="1" strokeOpacity="0.3" />
									<line x1="280" y1="260" x2="420" y2="80" stroke="#05835d" strokeWidth="1" strokeOpacity="0.25" />
									<line x1="520" y1="180" x2="580" y2="300" stroke="#05835d" strokeWidth="0.8" strokeOpacity="0.3" />
									<line x1="350" y1="380" x2="420" y2="460" stroke="#05835d" strokeWidth="0.8" strokeOpacity="0.25" />
									<line x1="280" y1="260" x2="180" y2="200" stroke="#05835d" strokeWidth="0.8" strokeOpacity="0.2" />
									<line x1="180" y1="200" x2="220" y2="100" stroke="#05835d" strokeWidth="0.8" strokeOpacity="0.2" />
									<line x1="480" y1="310" x2="560" y2="400" stroke="#05835d" strokeWidth="0.6" strokeOpacity="0.2" />
									{/* Glowing nodes */}
									<circle cx="420" cy="80" r="8" fill="#05835d" fillOpacity="0.6">
										<animate attributeName="r" values="8;11;8" dur="3s" repeatCount="indefinite" />
										<animate attributeName="fillOpacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite" />
									</circle>
									<circle cx="420" cy="80" r="18" fill="none" stroke="#05835d" strokeWidth="0.5" strokeOpacity="0.25">
										<animate attributeName="r" values="18;24;18" dur="3s" repeatCount="indefinite" />
									</circle>
									<circle cx="520" cy="180" r="10" fill="#c1aa58" fillOpacity="0.5">
										<animate attributeName="r" values="10;14;10" dur="4s" repeatCount="indefinite" />
										<animate attributeName="fillOpacity" values="0.5;0.8;0.5" dur="4s" repeatCount="indefinite" />
									</circle>
									<circle cx="520" cy="180" r="22" fill="none" stroke="#c1aa58" strokeWidth="0.5" strokeOpacity="0.2">
										<animate attributeName="r" values="22;28;22" dur="4s" repeatCount="indefinite" />
									</circle>
									<circle cx="480" cy="310" r="7" fill="#05835d" fillOpacity="0.45">
										<animate attributeName="r" values="7;10;7" dur="3.5s" repeatCount="indefinite" />
									</circle>
									<circle cx="350" cy="380" r="6" fill="#c1aa58" fillOpacity="0.4">
										<animate attributeName="r" values="6;9;6" dur="2.8s" repeatCount="indefinite" />
									</circle>
									<circle cx="280" cy="260" r="5" fill="#05835d" fillOpacity="0.35">
										<animate attributeName="r" values="5;7;5" dur="3.2s" repeatCount="indefinite" />
									</circle>
									<circle cx="580" cy="300" r="4" fill="#c1aa58" fillOpacity="0.3" />
									<circle cx="420" cy="460" r="5" fill="#05835d" fillOpacity="0.25" />
									<circle cx="180" cy="200" r="4" fill="#c1aa58" fillOpacity="0.2" />
									<circle cx="220" cy="100" r="3" fill="#05835d" fillOpacity="0.2" />
									<circle cx="560" cy="400" r="3.5" fill="#c1aa58" fillOpacity="0.15" />
									{/* Subtle floating particles */}
									<circle cx="460" cy="140" r="2" fill="#ffffff" fillOpacity="0.15">
										<animate attributeName="cy" values="140;130;140" dur="5s" repeatCount="indefinite" />
									</circle>
									<circle cx="380" cy="320" r="1.5" fill="#ffffff" fillOpacity="0.12">
										<animate attributeName="cy" values="320;310;320" dur="4s" repeatCount="indefinite" />
									</circle>
									<circle cx="540" cy="240" r="1.5" fill="#ffffff" fillOpacity="0.1">
										<animate attributeName="cx" values="540;550;540" dur="6s" repeatCount="indefinite" />
									</circle>
								</svg>
							</div>

							{/* Content Overlay Layer */}
							<div className="hero-left-col relative z-10 min-h-screen flex flex-col justify-between pt-24 md:pt-28 pb-0 lg:pb-0" style={{ opacity: 0 }}>
								{/* Large Cinematic Headline */}
								<div className="px-6 md:px-12 lg:px-16 xl:px-20">
									<h1 className="hero-h1 text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] 2xl:text-[7.5rem] font-bold tracking-[-0.03em] text-white font-serif uppercase select-none leading-[0.9] max-w-[900px]" style={{ opacity: 0 }}>
										<span className="block">ES MOMENTO</span>
										<span className="block text-right lg:text-left lg:pl-[10%]">DE OPTIMIZAR</span>
										<span className="block text-right lg:text-right">TU VIDA<span className="text-[#c1aa58]">.</span></span>
									</h1>
								</div>

								{/* Bottom Area: Glassmorphism Info Panel + Desktop Info Cards */}
								<div className="mt-auto">
									{/* Glassmorphism Info Panel */}
									<div className="px-6 md:px-12 lg:px-16 xl:px-20 pb-8 lg:pb-12">
										<div className="hero-p relative max-w-xl" style={{ opacity: 0 }}>
											{/* Glass card */}
											<div className="relative backdrop-blur-md bg-white/10 border border-white/15 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
												{/* Inner glow */}
												<div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl pointer-events-none" />

												<div className="relative z-10">
													<h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#c1aa58] mb-3 flex items-center gap-2">
														<span className="w-6 h-[1px] bg-[#c1aa58]" />
														Mejora tu salud desde la molécula
													</h2>
													<p className="text-sm sm:text-base text-white/85 leading-relaxed mb-6 font-light">
														Medicina funcional, regenerativa y terapias avanzadas para tratar enfermedades crónicas, neurológicas y metabólicas desde la causa raíz.
													</p>
													<div className="hero-a flex flex-wrap gap-3" style={{ opacity: 0 }}>
														<a
															href="#contacto"
															className="group inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 hover:border-white/35 text-white text-xs font-semibold uppercase tracking-[0.15em] rounded-full px-6 py-3 transition-all duration-300 backdrop-blur-sm"
														>
															Agendar Cita
															<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
																<path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
															</svg>
														</a>
														<a
															href="#tratamientos"
															className="inline-flex items-center gap-2 text-white/70 hover:text-white text-xs font-semibold uppercase tracking-[0.15em] rounded-full px-6 py-3 border border-white/10 hover:border-white/25 transition-all duration-300"
														>
															Enfermedades que tratamos
														</a>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Desktop Bottom Grid Info Cards */}
									<div className="hidden lg:grid grid-cols-2 border-t border-white/10">
										<div className="hero-card-desktop p-8 border-r border-white/10 relative group cursor-pointer transition-colors duration-300 hover:bg-white/5" style={{ opacity: 0 }}>
											<div className="absolute top-8 right-8 text-[#c1aa58] text-2xl font-bold transition-transform duration-500 group-hover:rotate-90 select-none">*</div>
											<h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-4 text-[#05835d]">Medicina Ortomolecular</h3>
											<p className="text-sm font-medium text-white/70 leading-snug pr-8 group-hover:text-white/90 transition-colors duration-300">
												Limpieza profunda del &quot;filtro interno&quot;, liberando la carga tóxica de órganos vitales.
											</p>
										</div>
										<div className="hero-card-desktop p-8 relative group cursor-pointer transition-colors duration-300 hover:bg-white/5" style={{ opacity: 0 }}>
											<div className="absolute top-8 right-8 text-[#c1aa58] text-2xl font-bold transition-transform duration-500 group-hover:rotate-90 select-none">*</div>
											<h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-4 text-[#05835d]">Regeneración Celular</h3>
											<p className="text-sm font-medium text-white/70 leading-snug pr-8 group-hover:text-white/90 transition-colors duration-300">
												Sueroterapias y terapias complementarias para restaurar tu equilibrio biológico.
											</p>
										</div>
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
									Limpieza profunda del &quot;filtro interno&quot;, liberando la carga tóxica de órganos vitales.
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
						<div className="absolute inset-0 z-0 opacity-35 filter brightness-[0.35] contrast-[1.1]">
							<Image
								src="/images/bg.jpg"
								alt="Fondo bioquímico"
								fill
								className="object-cover object-center"
								sizes="100vw"
								priority
							/>
						</div>
						{/* Decorative overlay gradients */}
						<div className="absolute inset-0 bg-gradient-to-b from-[#054273]/70 via-[#054273]/85 to-[#054273]/95 z-0 mix-blend-multiply"></div>
						<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(193,170,88,0.15),transparent_60%)] z-0"></div>

						{/* Phrases scrollable track */}
						<div className="mask-phrases-scroll absolute top-0 left-0 w-full h-[300%] z-10 flex flex-col">
							{/* Phrase 1 Section */}
							<div className="h-1/3 flex flex-col items-center justify-center px-6 relative z-10 border-b border-[#D9D4CC]/5">
								<div className="flex flex-col items-center gap-6 text-center max-w-3xl">
									<span className="text-[#c1aa58] text-4xl font-bold select-none">*</span>
									<p className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#D9D4CC] leading-[1.3] tracking-wide">
										"La salud no es la ausencia de enfermedad, es la plenitud de tu energía celular."
									</p>
									<span className="text-xs uppercase tracking-[0.25em] text-[#05835d] font-bold">New Life Center</span>
								</div>
							</div>

							{/* Phrase 2 Section */}
							<div className="h-1/3 flex flex-col items-center justify-center px-6 relative z-10 border-b border-[#D9D4CC]/5">
								<div className="flex flex-col items-center gap-6 text-center max-w-3xl">
									<span className="text-[#c1aa58] text-4xl font-bold select-none">*</span>
									<p className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#D9D4CC] leading-[1.3] tracking-wide">
										"Cada célula de tu cuerpo tiene la capacidad innata de sanar y regenerarse."
									</p>
									<span className="text-xs uppercase tracking-[0.25em] text-[#05835d] font-bold">Medicina Celular</span>
								</div>
							</div>

							{/* Phrase 3 Section */}
							<div className="h-1/3 flex flex-col items-center justify-center px-6 relative z-10">
								<div className="flex flex-col items-center gap-6 text-center max-w-3xl">
									<span className="text-[#c1aa58] text-4xl font-bold select-none">*</span>
									<p className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#D9D4CC] leading-[1.3] tracking-wide">
										"El equilibrio bioquímico es el mapa para recuperar tu vitalidad."
									</p>
									<span className="text-xs uppercase tracking-[0.25em] text-[#05835d] font-bold">Bienestar Integral</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Section: Nosotros */}
				<section id="nosotros" className="bg-[#D2CDC5] border-t border-[#054273]/10 relative overflow-hidden">
					{/* Top Part: Split layout inspired by Nervana */}
					<div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[85vh] border-b border-[#054273]/10">
						{/* Left: Image (flushed to edges) */}
						<div className="nosotros-left-img lg:col-span-5 relative min-h-[45vh] lg:min-h-full" style={{ opacity: 0 }}>
							<Image
								src="/images/nosotros.png"
								alt="Equipo New Life"
								fill
								className="object-cover object-center"
								sizes="(max-width: 1024px) 100vw, 42vw"
								priority
							/>
						</div>

						{/* Right: Text and Symptom Arrow Area */}
						<div className="lg:col-span-7 py-16 px-6 md:px-12 lg:py-24 lg:px-20 flex flex-col justify-center bg-[#D2CDC5] border-t lg:border-t-0 lg:border-l border-[#054273]/10">
							<div className="max-w-2xl">
								<h2 className="nosotros-reveal text-xs font-semibold uppercase tracking-[0.25em] text-[#05835d] mb-4" style={{ opacity: 0 }}>Quiénes Somos</h2>
								<h3 className="nosotros-reveal text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#054273] font-serif mb-6 leading-[1.1]" style={{ opacity: 0 }}>
									New Life es para todos
								</h3>
								<p className="nosotros-reveal text-sm md:text-base text-[#1F384D] leading-relaxed max-w-xl font-normal opacity-90 mb-4" style={{ opacity: 0 }}>
									Somos un centro médico especializado en <strong>Medicina Integrativa y Terapias Alternativas</strong>. Abordamos el origen bioquímico de tus padecimientos mediante tratamientos dirigidos a nivel celular.
								</p>
								<p className="nosotros-reveal text-sm md:text-base text-[#1F384D] leading-relaxed max-w-xl font-normal opacity-90" style={{ opacity: 0 }}>
									Nuestro equipo multidisciplinario de médicos y terapeutas se enfoca en restaurar tu salud total sin limitarse a tapar síntomas.
								</p>

								{/* Divider */}
								<div className="nosotros-reveal border-b border-[#054273]/10 my-8 w-full" style={{ opacity: 0 }}></div>

								{/* Middle: Arrow + treated issues list */}
								<div className="grid grid-cols-12 gap-6 sm:gap-12 items-center my-6">
									{/* Straight minimalist line arrow (restored with thinner stroke) */}
									<div className="nosotros-arrow col-span-3 hidden sm:flex justify-center items-center pr-4" style={{ opacity: 0 }}>
										<svg viewBox="0 0 200 40" fill="none" className="w-full text-[#054273] opacity-50">
											<path d="M0 20H190" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
											<path d="M180 10L190 20L180 30" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</div>

									{/* List of treated padecimientos */}
									<div className="nosotros-list col-span-12 sm:col-span-9" style={{ opacity: 0 }}>
										<div className="flex items-center gap-2 mb-4">
											<span className="text-[#c1aa58] text-xl font-bold select-none">*</span>
											<span className="text-xs font-semibold uppercase tracking-wider text-[#05835d]">Tratamos la raíz de:</span>
										</div>
										<div className="grid grid-cols-1 gap-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#1F384D] font-mono">
											<div className="flex items-center gap-2"><span className="text-[#c1aa58] font-bold">•</span> Dolor de Espalda y Articular</div>
											<div className="flex items-center gap-2"><span className="text-[#c1aa58] font-bold">•</span> Fatiga Crónica y Estrés</div>
											<div className="flex items-center gap-2"><span className="text-[#c1aa58] font-bold">•</span> Insomnio y Migrañas</div>
											<div className="flex items-center gap-2"><span className="text-[#c1aa58] font-bold">•</span> Desequilibrio Hormonal</div>
											<div className="flex items-center gap-2"><span className="text-[#c1aa58] font-bold">•</span> Inflamación Celular</div>
											<div className="flex items-center gap-2"><span className="text-[#c1aa58] font-bold">•</span> Desintoxicación Orgánica</div>
										</div>
									</div>
								</div>

								{/* CTA Button */}
								<div className="nosotros-cta mt-8" style={{ opacity: 0 }}>
									<a href="#contacto" className="group relative inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-[#D9D4CC] bg-[#054273] hover:bg-[#05835d] px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
										Agendar Evaluación Celular
										<span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white transition-transform duration-500 group-hover:rotate-90">
											*
										</span>
									</a>
								</div>
							</div>
						</div>
					</div>

					{/* Bottom Part: Mission, Vision, and Values in max-w container */}
					<div className="max-w-7xl mx-auto py-24 px-6 md:px-12">
						{/* Mission & Vision Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
							{/* Vision */}
							<div className="nosotros-card p-8 rounded-2xl border border-[#054273]/10 bg-[#E5E1D8]/60 hover:bg-[#E5E1D8]/95 relative group shadow-sm hover:shadow-md" style={{ opacity: 0 }}>
								<div className="absolute top-8 right-8 text-[#c1aa58] text-2xl font-bold select-none">*</div>
								<h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-[#05835d]">Nuestra Visión</h4>
								<p className="text-lg font-medium text-[#054273] font-serif leading-relaxed mb-4">
									“Ser el centro médico de referencia líder en medicina Ortomolecular y Terapias Alternativas, reconocidos por nuestra excelencia científica y trato humano.”
								</p>
								<p className="text-xs text-[#1F384D]/70 font-semibold tracking-wider uppercase">
									Aspiramos a transformar el paradigma de la salud: optimizando la vida humana, un paciente y una célula a la vez.
								</p>
							</div>

							{/* Mission */}
							<div className="nosotros-card p-8 rounded-2xl border border-[#054273]/10 bg-[#E5E1D8]/60 hover:bg-[#E5E1D8]/95 relative group shadow-sm hover:shadow-md" style={{ opacity: 0 }}>
								<div className="absolute top-8 right-8 text-[#c1aa58] text-2xl font-bold select-none">*</div>
								<h4 className="text-xs font-semibold uppercase tracking-[0.2em] mb-4 text-[#05835d]">Nuestra Misión</h4>
								<p className="text-lg font-medium text-[#054273] font-serif leading-relaxed mb-4">
									“Transformar la calidad de vida de nuestros pacientes a través de la Medicina Ortomolecular y Terapias Alternativas.”
								</p>
								<p className="text-xs text-[#1F384D]/70 font-semibold tracking-wider uppercase">
									Restauramos el equilibrio bioquímico desde la célula para lograr una salud integral, consciente y duradera.
								</p>
							</div>
						</div>

						{/* Values Grid */}
						<div className="pt-12 border-t border-[#054273]/10">
							<h4 className="valores-title text-xs font-semibold uppercase tracking-[0.2em] text-center text-[#054273] mb-8" style={{ opacity: 0 }}>
								Valores que guían nuestra práctica médica
							</h4>
							<div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
								{VALORES.map((val, idx) => (
									<div key={idx} className="valor-tag px-5 py-2.5 rounded-full border border-[#054273]/10 bg-[#D9D4CC]/80 text-[#1F384D] text-xs font-semibold tracking-wide uppercase flex items-center gap-2 hover:bg-[#05835d]/10 hover:text-[#05835d] hover:border-[#05835d]/30" style={{ opacity: 0 }}>
										<span className="w-1.5 h-1.5 rounded-full bg-[#05835d]"></span>
										{val}
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Section: Tratamientos & Terapias */}
				<section id="tratamientos" className="py-24 px-6 md:px-12 bg-[#D9D4CC] relative">
					<div className="max-w-7xl mx-auto">
						<div className="text-center max-w-3xl mx-auto mb-16">
							<h2 className="tratamientos-reveal text-xs font-semibold uppercase tracking-[0.25em] text-[#05835d] mb-4" style={{ opacity: 0 }}>Terapias y Servicios</h2>
							<h3 className="tratamientos-reveal text-4xl sm:text-5xl font-semibold tracking-tight text-[#054273] font-serif mb-6" style={{ opacity: 0 }}>
								El Poder del Equilibrio Molecular
							</h3>
							<p className="tratamientos-reveal text-base text-[#1F384D] opacity-90 leading-relaxed" style={{ opacity: 0 }}>
								En New Life, combinamos precisión científica con terapias biológicas avanzadas. No tapamos síntomas; desintoxicamos y regeneramos la salud celular.
							</p>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
							{/* Left Column: List of therapies in card grids */}
							<div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
								{/* Therapy Card 1 */}
								<div className="terapia-card p-6 rounded-2xl border border-[#054273]/10 bg-[#E5E1D8]/30 hover:bg-[#E5E1D8]/65" style={{ opacity: 0 }}>
									<div className="w-10 h-10 bg-[#05835d]/10 rounded-xl flex items-center justify-center text-[#05835d] mb-4">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
										</svg>
									</div>
									<h4 className="text-base font-semibold text-[#054273] mb-2">Sueroterapias Ortomoleculares</h4>
									<p className="text-xs text-[#1F384D]/90 leading-relaxed">
										Paquete de 4 sesiones de regeneración, revitalización y optimización celular profunda para equilibrar nutrientes directamente en el torrente sanguíneo.
									</p>
								</div>

								{/* Therapy Card 2 */}
								<div className="terapia-card p-6 rounded-2xl border border-[#054273]/10 bg-[#E5E1D8]/30 hover:bg-[#E5E1D8]/65" style={{ opacity: 0 }}>
									<div className="w-10 h-10 bg-[#05835d]/10 rounded-xl flex items-center justify-center text-[#05835d] mb-4">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<circle cx="12" cy="12" r="10"></circle>
											<path d="m4.93 4.93 14.14 14.14M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
										</svg>
									</div>
									<h4 className="text-base font-semibold text-[#054273] mb-2">Terapias de Quelación</h4>
									<p className="text-xs text-[#1F384D]/90 leading-relaxed">
										Paquete de 4 sesiones de terapia endovenosa específica para remover metales pesados y limpiar el sistema circulatorio, reduciendo la calcificación arterial.
									</p>
								</div>

								{/* Therapy Card 3 */}
								<div className="terapia-card p-6 rounded-2xl border border-[#054273]/10 bg-[#E5E1D8]/30 hover:bg-[#E5E1D8]/65" style={{ opacity: 0 }}>
									<div className="w-10 h-10 bg-[#05835d]/10 rounded-xl flex items-center justify-center text-[#05835d] mb-4">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path>
											<path d="M12 6V12L16 14"></path>
										</svg>
									</div>
									<h4 className="text-base font-semibold text-[#054273] mb-2">Desintoxicación Iónica</h4>
									<p className="text-xs text-[#1F384D]/90 leading-relaxed">
										Paquete de 6 sesiones + tratamiento oral para depurar y equilibrar el pH corporal a través de ósmosis iónica en pediluvio.
									</p>
								</div>

								{/* Therapy Card 4 */}
								<div className="terapia-card p-6 rounded-2xl border border-[#054273]/10 bg-[#E5E1D8]/30 hover:bg-[#E5E1D8]/65" style={{ opacity: 0 }}>
									<div className="w-10 h-10 bg-[#05835d]/10 rounded-xl flex items-center justify-center text-[#05835d] mb-4">
										<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
											<path d="M6 6h10M6 10h10"></path>
										</svg>
									</div>
									<h4 className="text-base font-semibold text-[#054273] mb-2">Fitoterapia Avanzada</h4>
									<p className="text-xs text-[#1F384D]/90 leading-relaxed">
										Tratamientos fitoterapéuticos orales con extractos herbales estandarizados y avalados científicamente para corregir problemas fisiológicos.
									</p>
								</div>
							</div>

							{/* Right Column: Visual lounge / pain management therapies banner */}
							<div className="terapia-banner lg:col-span-5 relative group flex flex-col justify-between p-8 rounded-2xl border border-[#054273]/10 bg-[#E5E1D8]/40 overflow-hidden shadow-sm" style={{ opacity: 0 }}>
								<div className="absolute inset-0 z-0">
									<Image
										src="/images/tratamientos.png"
										alt="Sala de Sueroterapia"
										fill
										className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-25 group-hover:opacity-30"
										sizes="(max-width: 1024px) 100vw, 40vw"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-[#E5E1D8] via-[#E5E1D8]/80 to-[#E5E1D8]/20 z-0"></div>
								</div>

								<div className="relative z-10 mb-6">
									<div className="inline-block px-3 py-1 rounded-full bg-[#05835d]/10 text-[#05835d] text-[10px] font-bold uppercase tracking-wider mb-4">
										Terapias Integrales
									</div>
									<h4 className="text-xl font-semibold text-[#054273] font-serif mb-4 leading-snug">
										Manejo y Alivio Clínico del Dolor
									</h4>
									<p className="text-xs text-[#1F384D]/95 leading-relaxed mb-6 font-normal">
										Diseñamos esquemas integrados para el dolor (agudo y crónico) combinando técnicas de alta efectividad médica:
									</p>
									<ul className="grid grid-cols-2 gap-2.5 text-[11px] text-[#1F384D] font-medium">
										<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#05835d]"></span> Acupuntura + Electro</li>
										<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#05835d]"></span> Terapia Neural</li>
										<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#05835d]"></span> Plasma Rico en Plaquetas</li>
										<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#05835d]"></span> Presoterapia</li>
										<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#05835d]"></span> Cupping (Ventosas)</li>
										<li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#05835d]"></span> Autohemoterapia menor</li>
									</ul>
								</div>

								<div className="relative z-10 pt-4 border-t border-[#054273]/10">
									<a href="#contacto" className="text-xs font-semibold uppercase tracking-wider text-[#05835d] hover:text-[#054273] transition-colors flex items-center gap-2 cursor-pointer">
										Solicitar Consulta de Dolor &rarr;
									</a>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Section: Planes de Salud (Interactive Dashboard) */}
				<section id="planes" className="py-24 px-6 md:px-12 bg-[#D2CDC5] border-t border-b border-[#054273]/10 relative">
					<div className="max-w-7xl mx-auto">
						<div className="text-center max-w-3xl mx-auto mb-16">
							<h2 className="planes-reveal text-xs font-semibold uppercase tracking-[0.25em] text-[#05835d] mb-4" style={{ opacity: 0 }}>Planes Clínicos Específicos</h2>
							<h3 className="planes-reveal text-4xl sm:text-5xl font-semibold tracking-tight text-[#054273] font-serif mb-6" style={{ opacity: 0 }}>
								Planes de Salud Celular Específicos
							</h3>
							<p className="planes-reveal text-base text-[#1F384D] opacity-90 leading-relaxed" style={{ opacity: 0 }}>
								Programas médicos de un mes (o más) diseñados meticulosamente con exámenes diagnósticos de laboratorio, consultas, desintoxicación celular y sueroterapias específicas.
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
												: "hover:bg-[#E5E1D8] text-[#1F384D]"
												}`}
										>
											<span>{plan.name}</span>
											{selectedPlanIndex === idx && <span className="w-1.5 h-1.5 rounded-full bg-[#c1aa58]"></span>}
										</button>
									))}
								</div>
							</div>

							{/* Right: Selected Plan details card */}
							<div className="planes-content lg:col-span-8 bg-[#E5E1D8] border border-[#054273]/10 rounded-2xl p-8 shadow-md relative min-h-[550px] flex flex-col justify-between" style={{ opacity: 0 }}>
								<div>
									<div className="flex items-start justify-between flex-wrap gap-4 mb-6">
										<div>
											<span className="inline-block px-3 py-1 rounded-full bg-[#05835d]/10 text-[#05835d] text-[10px] font-bold uppercase tracking-wider mb-2">
												Plan Clínico Stándard
											</span>
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
												<span>{activePlan.medicacion}</span>
											</div>
										</div>
									</div>

									{/* Exámenes de laboratorio list */}
									<div>
										<h5 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#054273] mb-3">
											Batería de Exámenes de Laboratorio Clínico Incluidos:
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
										* Todos los exámenes y terapias se realizan en nuestras instalaciones.
									</span>
									<a
										href="#contacto"
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

				{/* Section: Contacto */}
				<section id="contacto" className="py-24 px-6 md:px-12 bg-[#D9D4CC] relative">
					<div className="max-w-7xl mx-auto">
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
							{/* Left: Contact Info & Map Details */}
							<div className="lg:col-span-5">
								<h2 className="contacto-reveal text-xs font-semibold uppercase tracking-[0.25em] text-[#05835d] mb-4" style={{ opacity: 0 }}>Agenda una cita</h2>
								<h3 className="contacto-reveal text-4xl sm:text-5xl font-semibold tracking-tight text-[#054273] font-serif mb-6 leading-tight" style={{ opacity: 0 }}>
									Comienza Tu Transformación
								</h3>
								<p className="contacto-reveal text-sm text-[#1F384D] opacity-90 leading-relaxed mb-8" style={{ opacity: 0 }}>
									Visítanos en nuestras clínicas para una evaluación integral. Puedes agendar completando el formulario de contacto o llamando directamente a nuestros teléfonos oficiales.
								</p>

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
												<span className="opacity-30">|</span>
												<a href="tel:22023908" className="hover:text-[#05835d] transition-colors">2202-3908</a>
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
								<div className="contacto-horario p-6 rounded-2xl border border-[#054273]/10 bg-[#E5E1D8]/30 flex flex-col justify-center" style={{ opacity: 0 }}>
									<span className="text-[10px] font-bold uppercase tracking-widest text-[#054273] mb-2 block">
										Horario de Atención
									</span>
									<p className="text-xs text-[#1F384D] leading-relaxed">
										Lunes a Viernes: 8:00 AM - 5:00 PM
										<br />
										Sábados: 8:00 AM - 12:00 PM
									</p>
								</div>
							</div>

							{/* Right: Contact Form */}
							<div className="contacto-form-container lg:col-span-7 lg:pl-16" style={{ opacity: 0 }}>
								<h4 className="text-xl sm:text-2xl font-semibold text-[#054273] font-serif mb-8">Formulario de Consulta e Inscripción</h4>

								{submitted ? (
									<div className="py-16 text-center bg-[#E5E1D8]/30 border border-[#054273]/10 rounded-2xl p-8">
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
															{PLANS_DATA.map(plan => (
																<option key={plan.id} value={plan.id} className="bg-[#D9D4CC] text-[#054273]">
																	{plan.name}
																</option>
															))}
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
												className="group relative inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-[#D9D4CC] bg-[#054273] hover:bg-[#05835d] px-10 py-5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
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
							<p className="text-[11px] text-[#D9D4CC]/60 max-w-sm text-center md:text-left leading-relaxed">
								New Life Centro Médico de Medicina Integrativa y Terapias Alternativas. Restaurando el equilibrio biochemical desde la célula. Tegucigalpa, Honduras.
							</p>
						</div>

						<div className="flex flex-col items-center md:items-end gap-3 text-xs font-semibold tracking-wider uppercase">
							<div className="flex gap-8">
								<a href="#nosotros" className="hover:text-[#05835d] transition-colors">Nosotros</a>
								<a href="#tratamientos" className="hover:text-[#05835d] transition-colors">Tratamientos</a>
								<a href="#planes" className="hover:text-[#05835d] transition-colors">Planes</a>
								<a href="#contacto" className="hover:text-[#05835d] transition-colors">Contacto</a>
							</div>
							<span className="text-[10px] text-[#D9D4CC]/40 tracking-normal font-normal">
								&copy; {new Date().getFullYear()} New Life Centro Médico. Todos los derechos reservados.
							</span>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}
