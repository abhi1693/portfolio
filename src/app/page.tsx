"use client";

import {
  AtSign,
  BookOpen,
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  Network,
  Server,
  Terminal,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const projects = [
  {
    title: "ShipYard HQ",
    href: "http://shipyardhq.dev/",
    windowTitle: "shipyard_hq.v2.exe",
    status: "STATUS: DEPLOYED",
    statusClass: "border-primary/20 bg-primary/10 text-primary",
    description:
      "Full-scale platform for builders to coordinate and launch high-velocity web products with automated CI/CD flows.",
    metrics: [
      ["COMMITS", "+1,242", "text-green-600"],
      ["BUILD", "00:42 SEC", "text-primary"],
    ],
    linkLabel: "VIEW_LIVE_INSTANCE",
    tags: ["NEXT.JS", "POSTGRES", "HOMELAB"],
  },
  {
    title: "GitRank",
    href: "https://git-rank.dev/",
    windowTitle: "gitrank_v1.0.exe",
    status: "TRAFFIC: HIGH",
    statusClass: "border-green-200 bg-green-100 text-green-700",
    description:
      "Data visualization tool for open-source maintainers to track visibility metrics across the GitHub ecosystem.",
    metrics: [
      ["RESOURCES", "82% OPTIMIZED", "text-orange-600"],
      ["API_REQ", "2.4M / MO", "text-foreground"],
    ],
    linkLabel: "LAUNCH_ANALYTICS",
    tags: ["REACT", "GITHUB_API", "TAILWIND"],
  },
  {
    title: "Engineering Blog",
    href: "https://blog.abhimanyu-saharan.com/",
    windowTitle: "eng_logs.md",
    status: "UPDATED: 2h AGO",
    statusClass: "border-orange-200 bg-orange-100 text-orange-700",
    description:
      "In-depth documentation of infrastructure experiments, homelab configurations, and technical learnings.",
    metrics: [
      ["ARTICLES", "42 TOTAL", "text-foreground"],
      ["READ_TIME", "8 MIN AVG", "text-foreground"],
    ],
    linkLabel: "READ_MANIFESTO",
    tags: ["DEVOPS", "TERRAFORM", "HOMELAB"],
  },
];

const expertise = [
  {
    title: "Infrastructure",
    icon: Network,
    copy: "Expertise in K8s orchestration, CI/CD pipelines, and Infrastructure as Code for scalable ecosystems.",
  },
  {
    title: "Development",
    icon: Code2,
    copy: "Fullstack engineering with a focus on high-performance APIs and reactive frontend architectures.",
  },
  {
    title: "Automation",
    icon: Zap,
    copy: "Scripting custom solutions for process optimization and system reliability engineering.",
  },
  {
    title: "Homelab",
    icon: Server,
    copy: "Self-hosting high-availability storage, virtualization, and advanced network security layers.",
  },
  {
    title: "Writing & Documentation",
    icon: BookOpen,
    copy: "Communicating complex technical concepts through clear, structured documentation and case studies. Bridging the gap between code and human understanding.",
    wide: true,
  },
];

const socials = [
  {
    label: "GITHUB",
    href: "https://github.com/abhi1693",
    icon: Code2,
  },
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/abhimanyu-saharan",
    icon: BriefcaseBusiness,
  },
  {
    label: "TWITTER",
    href: "https://x.com/abhi16_93",
    icon: AtSign,
  },
  {
    label: "YOUTUBE",
    href: "https://www.youtube.com/@AbhimanyuSaharanOfficial",
    icon: Video,
  },
];

type Particle = {
  baseX: number;
  baseY: number;
  density: number;
  size: number;
  x: number;
  y: number;
};

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, radius: 150 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const particleCount = Math.max(
        40,
        Math.floor((rect.width * rect.height) / 9000),
      );
      particlesRef.current = Array.from({ length: particleCount }, () => {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        return {
          baseX: x,
          baseY: y,
          density: Math.random() * 30 + 1,
          size: Math.random() * 2 + 1,
          x,
          y,
        };
      });
    };

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle, index) => {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRef.current.radius) {
          const force = (mouseRef.current.radius - distance) / mouseRef.current.radius;
          particle.x -= (dx / Math.max(distance, 1)) * force * particle.density;
          particle.y -= (dy / Math.max(distance, 1)) * force * particle.density;
        } else {
          particle.x -= (particle.x - particle.baseX) / 20;
          particle.y -= (particle.y - particle.baseY) / 20;
        }

        ctx.fillStyle = "#0058be";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        for (let next = index + 1; next < particlesRef.current.length; next += 1) {
          const other = particlesRef.current[next];
          const lineDistance = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (lineDistance < 100) {
            ctx.strokeStyle = `rgba(0, 88, 190, ${(1 - lineDistance / 100) * 0.2})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      animationFrame = requestAnimationFrame(draw);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" />;
}

function TypingText() {
  const text =
    "DevOps architect & full-stack builder. Specializing in high-availability infrastructure and performance-driven internet products. Currently operating at the intersection of reliability and creative engineering.";
  const [visible, setVisible] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setVisible(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(interval);
      }
    }, 15);

    return () => window.clearInterval(interval);
  }, []);

  return <span className="typing-cursor">{visible}</span>;
}

function WindowControls() {
  return (
    <div className="flex gap-1.5">
      <span className="size-3 rounded-full border border-black/20 bg-[#ff5f56]" />
      <span className="size-3 rounded-full border border-black/20 bg-[#ffbd2e]" />
      <span className="size-3 rounded-full border border-black/20 bg-[#27c93f]" />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-black bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-4 py-4 md:px-12">
        <Link href="#" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-sm bg-black font-mono text-xs font-bold text-white">
            A.OS
          </span>
          <span className="text-xl font-black uppercase italic tracking-tight">
            ABHIMANYU
          </span>
        </Link>
        <Button
          asChild
          size="sm"
          className="h-auto bg-primary px-5 py-2 font-mono text-[11px] uppercase text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black"
        >
          <Link
            href="https://www.linkedin.com/in/abhimanyu-saharan"
            target="_blank"
            rel="noreferrer"
          >
            EXEC: CONNECT
          </Link>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-[85vh] w-full flex-col items-start justify-center overflow-hidden border-b border-black/10 py-20">
      <ParticleCanvas />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-primary/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-px bg-primary/10" />
      <div className="pointer-events-none absolute right-10 top-10 z-10 hidden w-48 space-y-1 font-mono text-[10px] uppercase text-black/40 2xl:right-[calc((100vw-1500px)/2+2.5rem)] lg:block">
        <div className="flex justify-between border-b border-black pb-1">
          <span>CPU_LOAD</span>
          <span className="text-primary">12.4%</span>
        </div>
        <div className="flex justify-between border-b border-black pb-1">
          <span>SYS_UPTIME</span>
          <span>102:44:12</span>
        </div>
        <div className="flex justify-between border-b border-black pb-1">
          <span>NETWORK_IO</span>
          <span className="text-green-600">ACTIVE</span>
        </div>
      </div>
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-[1500px] px-4 md:px-12">
        <div className="pointer-events-auto mb-6 inline-flex items-center gap-3 rounded-sm bg-black px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-white">
          <span className="animate-[heartbeat_2s_ease-in-out_infinite] text-primary">
            ●
          </span>
          SYSTEM_INITIALIZED: V2.4.0
        </div>
        <h1
          className="glitch-text pointer-events-auto mb-6 text-[64px] font-black leading-none tracking-tight text-foreground sm:text-[86px] lg:text-[100px]"
          data-text="Abhimanyu Saharan"
        >
          Abhimanyu
          <br />
          Saharan
        </h1>
        <Card className="pointer-events-auto relative max-w-xl overflow-hidden border-2 border-black bg-white shadow-[8px_8px_0_rgba(0,0,0,0.10)]">
          <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
          <CardContent className="p-6">
            <p className="min-h-[138px] text-xl leading-relaxed text-muted-foreground">
              <TypingText />
            </p>
            <div className="mt-6 font-mono text-xs font-bold uppercase text-primary">
              [LOADING_ASSETS... 100%]
            </div>
          </CardContent>
        </Card>
        <div className="pointer-events-auto mt-12 flex flex-wrap gap-6">
          <Button asChild size="lg" className="font-mono text-sm uppercase">
            <Link href="#projects">
              INITIALIZE_PROJECTS.SH
              <Terminal />
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="font-mono text-sm uppercase shadow-[6px_6px_0px_rgba(0,0,0,0.10)]"
          >
            <Link href="https://github.com/abhi1693" target="_blank" rel="noreferrer">
              GITHUB_MIRROR
              <ExternalLink />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
}: {
  project: (typeof projects)[number];
}) {
  return (
    <Link
      href={project.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${project.title}`}
      className="group block"
    >
      <Card className="flex h-full cursor-pointer flex-col overflow-hidden border-2 border-black bg-white transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[8px_8px_0_rgba(0,88,190,0.25)]">
        <div className="flex items-center justify-between border-b-2 border-black bg-black p-3 text-white">
          <WindowControls />
          <span className="font-mono text-[10px] uppercase tracking-tight">
            {project.windowTitle}
          </span>
        </div>
        <CardContent className="flex flex-1 flex-col p-6">
          <div className="mb-4">
            <Badge className={project.statusClass}>{project.status}</Badge>
          </div>
          <h3 className="mb-3 text-2xl font-black tracking-tight text-foreground">
            {project.title}
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>
          <div className="mt-auto rounded-sm border border-black/5 bg-muted p-4 font-mono text-[11px] leading-tight">
            {project.metrics.map(([label, value, color]) => (
              <div key={label} className="mb-1 flex justify-between last:mb-0">
                <span>{label}</span>
                <span className={color}>{value}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <div className="flex flex-wrap gap-2 border-t border-black/10 p-4">
          {project.tags.map((tag, index) => (
            <span
              key={tag}
              className={cn(
                "px-2 py-1 font-mono text-[9px] font-bold uppercase",
                index === 0 && "bg-black text-white",
                index === 1 && "bg-muted text-black",
                index === 2 && "bg-primary text-white",
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      </Card>
    </Link>
  );
}

function Projects() {
  return (
    <section
      id="projects"
      className="mx-auto w-full max-w-[1500px] border-t-2 border-black px-4 py-16 md:px-12"
    >
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="mb-2 block font-mono text-sm font-bold uppercase tracking-widest text-primary">
            {"// DIRECTORY: /SHIPS/SELECTED"}
          </span>
          <h2 className="text-6xl font-black leading-none tracking-tight text-foreground">
            Ships
          </h2>
        </div>
        <div className="border-l-2 border-primary pl-4 text-left font-mono text-xs text-muted-foreground md:text-right">
          TOTAL_DEPLOYMENTS: 12
          <br />
          SUCCESS_RATE: 100%
          <br />
          STATUS: RUNNING
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}

function Expertise() {
  const currentYear = new Date().getFullYear();

  return (
    <section
      id="expertise"
      className="relative mx-auto w-full max-w-[1500px] px-4 py-32 md:px-12"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden opacity-20 lg:block">
        <div className="absolute left-0 top-1/2 h-[2px] w-full bg-black" />
        <div className="absolute left-1/4 top-1/2 h-32 w-[2px] -translate-y-full bg-black" />
        <div className="absolute left-2/4 top-1/2 h-32 w-[2px] bg-black" />
        <div className="absolute left-3/4 top-1/2 h-32 w-[2px] -translate-y-full bg-black" />
      </div>
      <div className="mb-20 text-center">
        <h2 className="mb-4 text-5xl font-black uppercase tracking-tight text-foreground">
          Stack Architecture
        </h2>
        <div className="inline-block border-y-2 border-primary px-4 py-1 font-mono text-xs font-bold uppercase text-primary">
          SYS_CAPABILITIES_REPORT_{currentYear}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {expertise.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.title}
              className={cn(
                "group relative border-2 border-black bg-white p-8 transition-all hover:bg-primary hover:text-white",
                item.wide && "md:col-span-2",
              )}
            >
              <div className="absolute -left-3 -top-3 flex size-6 items-center justify-center border-2 border-black bg-white font-mono text-[10px] font-bold text-black">
                {String(index + 1).padStart(2, "0")}
              </div>
              <Icon className="mb-4 size-7 text-primary group-hover:text-white" />
              <h4 className="mb-4 text-xl font-black">{item.title}</h4>
              <p className="text-base leading-relaxed opacity-80">{item.copy}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t-4 border-black bg-white">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-8 px-4 py-8 md:px-12">
        <div>
          <div>
            <span className="mb-3 block font-mono text-[10px] font-bold uppercase text-primary">
              {"// SOCIALS"}
            </span>
            <nav className="flex flex-wrap gap-x-6 gap-y-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 font-mono text-sm font-bold text-muted-foreground transition-all hover:text-primary"
                  >
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">
                      {"->"}
                    </span>
                    <Icon className="size-4" />
                    {social.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="h-px w-full bg-black/10" />
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="font-mono text-[11px] font-bold uppercase tracking-tight text-foreground">
            © {currentYear} ABHIMANYU SAHARAN
            <span className="mx-2 text-primary">|</span>
            BUILT FOR PRECISION
            <span className="mx-2 text-primary">|</span>
            ALL_RIGHTS_RESERVED
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase opacity-40">
            <span>VER: 3.2.1-STABLE</span>
            <span>ENC: UTF-8</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="grid-bg relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="scanline" />
      <Header />
      <Hero />
      <Projects />
      <Expertise />
      <Footer />
    </main>
  );
}
