import { StructuredData } from "@/components/structured-data";
import { origin, owner, pageMetadata } from "@/lib/seo";
import { PortfolioHeader } from "@/components/portfolio-header";
import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, BookOpen, Layers, Radio, ShieldCheck } from "lucide-react";
import { getGithubActivity } from "@/lib/github-activity";

export const dynamic = "force-dynamic";

const github = "https://github.com/abhi1693";
const blog = "https://blog.abhimanyu-saharan.com";
const linkedin = "https://www.linkedin.com/in/abhimanyu-saharan";
export const metadata = pageMetadata(
  "/", "Abhimanyu Saharan — Software & Infrastructure",
  "Explore Abhimanyu Saharan’s developer tools, open-source projects, and field notes from running a Raspberry Pi Kubernetes homelab.",
  "/portfolio-card.jpg",
);

const projects = [
  { name: "DevFeed", url: "https://devfeed.tech", icon: Radio, color: "clay", detail: "Developer news, tutorials and releases in a reading feed you can also explore through MCP." },
  { name: "Wardn AI", url: github + "/wardn-ai", icon: ShieldCheck, color: "moss", detail: "A control plane for AI agents with scoped credentials, human approvals and an audit trail for tool calls." },
  { name: "ShipyardHQ", url: "https://shipyardhq.dev", icon: Layers, color: "ink", detail: "A product directory with rankings and launch analytics that help builders find an audience." },
];
const articles = [
  ["Keeping a Raspberry Pi Cluster Cool", "keeping-a-raspberry-pi-cluster-cool"],
  ["Running a Homelab Made Me Rethink My Network", "running-a-homelab-made-me-rethink-my-network"],
  ["Why Most Homelabs Never Become Real Infrastructure", "why-most-homelabs-never-become-real-infrastructure"],
];
const dateLabel = (date: string) => new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

function referralUrl(destination: string, placement: string) {
  const url = new URL(destination);
  url.searchParams.set("utm_source", "portfolio");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "personal_portfolio");
  url.searchParams.set("utm_content", placement);
  return url.href;
}

export default async function Home() {
  const activity = await getGithubActivity();
  return <div className="sheet">
    <a className="skip" href="#main">Skip to content</a>
    <PortfolioHeader />
    <StructuredData data={{ "@graph": [
      { "@type": "WebSite", "@id": origin + "/#website", url: origin + "/", name: owner },
      {
        "@type": "ProfilePage", "@id": origin + "/#profile", url: origin + "/",
        name: owner, isPartOf: { "@id": origin + "/#website" },
        mainEntity: { "@id": origin + "/#person" },
      },
      {
        "@type": "Person", "@id": origin + "/#person", name: owner, url: origin + "/",
        image: origin + "/abhimanyu.png",
        sameAs: [github, linkedin, "https://x.com/abhi16_93", "https://www.youtube.com/@AbhimanyuSaharanOfficial"],
      },
    ] }} />
    <main id="main">
      <section className="intro" aria-labelledby="name">
        <p className="role"><i/> Software &amp; infrastructure</p>
          <h1 id="name">Abhimanyu<br/><em>Saharan.</em></h1>
          <p className="bio">I build developer tools and the infrastructure that runs them. My Raspberry Pi homelab is where I try things, break things, and figure out what holds up.</p>
          <a className="primary" href="#projects">Explore my work <ArrowDownRight size={17}/></a>
        <div className="portrait"><Image src="/abhimanyu.png" alt="Abhimanyu Saharan" width={320} height={320} sizes="(max-width: 640px) 17vw, (min-width: 1440px) 210px, 164px" preload /></div>
      </section>
      <section className="activity" aria-labelledby="activity-title">
        <div className="sectionhead"><h2 id="activity-title">GitHub activity</h2><a href={referralUrl(github, "activity_profile")}>@abhi1693 <ArrowUpRight/></a></div>
        <div className="calendar" role="img" aria-label={activity.total.toLocaleString("en-US") + " contributions from " + activity.start + " to " + activity.end}>
          {activity.weeks.map((week, index) => <div className="week" key={index}>{Array.from(week, (level, day) => <i key={day} data-level={level}/>)}</div>)}
        </div>
        <div className="legend"><span><strong>{activity.total.toLocaleString("en-US")}</strong> contributions</span><span>{dateLabel(activity.start)} – {dateLabel(activity.end)}</span></div>
      </section>
      <section id="projects"><div className="sectionhead"><h2>Selected projects</h2><a href={referralUrl(github + "?tab=repositories", "projects_all")}>All repositories <ArrowUpRight/></a></div>
        <div className="projects">{projects.map(({name,url,color,detail,icon:Icon}) => <a className="project" href={referralUrl(url, "project_" + name.toLowerCase().replaceAll(" ", "_"))} key={name}><div className={'art '+color}><Icon aria-hidden="true"/></div><div className="projectname"><h3>{name}</h3><ArrowUpRight size={16}/></div><p>{detail}</p></a>)}</div>
      </section>
      <section id="writing"><div className="sectionhead"><h2>Selected writing</h2><a href={referralUrl(blog, "writing_blog")}>Visit the blog <ArrowUpRight/></a></div>
        {articles.map(([title,slug]) => <a className="article" href={referralUrl(blog + "/posts/" + slug, "writing_" + slug)} key={slug}><BookOpen size={18}/><span>{title}</span><ArrowUpRight size={17}/></a>)}
      </section>
    </main>
    <footer id="contact"><div><h2>Get in touch</h2><a href={referralUrl(linkedin, "contact_linkedin")}>LinkedIn <ArrowUpRight/></a></div><div className="socials"><a href={referralUrl(github, "contact_github")}>GitHub</a><a href={referralUrl("https://www.youtube.com/@AbhimanyuSaharanOfficial", "contact_youtube")}>YouTube</a><a href={referralUrl("https://x.com/abhi16_93", "contact_x")}>X</a></div></footer>
  </div>;
}
