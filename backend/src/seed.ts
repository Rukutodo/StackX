import mongoose from "mongoose";
import dotenv from "dotenv";
import { AdminUser } from "./models/AdminUser";
import { ServiceCategory } from "./models/ServiceCategory";
import { PortfolioProject } from "./models/PortfolioProject";
import { JobPosting } from "./models/JobPosting";
import { JobApplication } from "./models/JobApplication";
import { Message } from "./models/Message";
import { Testimonial } from "./models/Testimonial";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/stackx");
    console.log("Connected to MongoDB for seeding...");
  } catch (error: any) {
    console.error("Connection error:", error.message);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  const existingAdmin = await AdminUser.findOne({ username: "roshan" });
  if (existingAdmin) {
    console.log("⚠️  Admin user 'roshan' already exists. Skipping.");
    return;
  }
  const admin = new AdminUser({ username: "roshan", password: "roshanmotion" });
  await admin.save();
  console.log("✅ Admin user created! (roshan / roshanmotion)");
};

const seedServices = async () => {
  const count = await ServiceCategory.countDocuments();
  if (count > 0) {
    console.log("⚠️  Services already seeded. Skipping.");
    return;
  }

  const categories = [
    {
      slug: "web-development",
      title: "Web Development",
      tagline: "Custom-built digital experiences",
      pricing: "$3,000",
      techStack: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Vercel"],
      items: [
        {
          title: "Custom Web Applications",
          desc: "Full-stack applications built with modern frameworks like React, Next.js, and Node.js. We deliver scalable, maintainable, and high-performance solutions tailored to your business needs.",
        },
        {
          title: "SaaS Platform Development",
          desc: "End-to-end SaaS products with multi-tenancy, subscription management, user authentication, and analytics dashboards. Built for scale from day one.",
        },
        {
          title: "E-Commerce Solutions",
          desc: "High-converting online stores with seamless checkout experiences, inventory management, payment processing, and order fulfillment integrations.",
        },
        {
          title: "Progressive Web Apps",
          desc: "Native-like experiences on the web with offline capabilities, push notifications, and lightning-fast performance across all devices.",
        },
      ],
      caseStudy: { title: "Communize VIZAG", href: "/portfolio/communize-vizag" },
      status: "active",
      order: 1,
    },
    {
      slug: "automation",
      title: "Business Automation",
      tagline: "Streamline & scale your operations",
      pricing: "$2,500",
      techStack: ["Python", "Zapier", "n8n", "Selenium", "REST APIs", "Webhooks", "Docker"],
      items: [
        {
          title: "Workflow Automation",
          desc: "Eliminate repetitive tasks with intelligent automation pipelines. We connect your tools, automate data flows, and create custom triggers for your business processes.",
        },
        {
          title: "CRM & ERP Integration",
          desc: "Seamless integration between your CRM, ERP, and other business tools. Automated data syncing, report generation, and real-time notifications.",
        },
        {
          title: "Data Pipeline Automation",
          desc: "Automated data collection, transformation, and loading (ETL) pipelines that keep your analytics up-to-date and your team informed.",
        },
        {
          title: "Custom Bot Development",
          desc: "Intelligent chatbots, Slack bots, and notification systems that handle customer queries, internal requests, and routine tasks automatically.",
        },
      ],
      caseStudy: { title: "FlowSync Automation", href: "/portfolio" },
      status: "active",
      order: 2,
    },
    {
      slug: "adtech",
      title: "Ad Tech Solutions",
      tagline: "Data-driven advertising technology",
      pricing: "$5,000",
      techStack: ["Python", "React", "BigQuery", "Google Ads API", "Meta API", "Kafka", "Redis"],
      items: [
        {
          title: "Programmatic Ad Platforms",
          desc: "Custom DSP/SSP platforms for programmatic advertising with real-time bidding, audience targeting, and campaign optimization.",
        },
        {
          title: "Analytics & Reporting Dashboards",
          desc: "Real-time analytics dashboards with custom KPIs, automated reporting, cross-channel attribution, and actionable insights.",
        },
        {
          title: "Ad Campaign Management",
          desc: "Unified campaign management tools that consolidate Google Ads, Meta, TikTok, and other platforms into a single powerful interface.",
        },
        {
          title: "Conversion Tracking & Attribution",
          desc: "Server-side tracking, first-party data solutions, and multi-touch attribution models for accurate campaign performance measurement.",
        },
      ],
      caseStudy: { title: "AdScale Platform", href: "/portfolio" },
      status: "active",
      order: 3,
    },
  ];

  await ServiceCategory.insertMany(categories);
  console.log("✅ Service categories seeded (3 categories, 4 items each)!");
};

const seedPortfolio = async () => {
  const count = await PortfolioProject.countDocuments();
  if (count > 0) {
    console.log("⚠️  Portfolio projects already seeded. Skipping.");
    return;
  }

  const projects = [
    {
      slug: "communize-vizag",
      title: "Communize VIZAG",
      category: "Web Development",
      description: "Complete digital platform for community engagement and event management in Visakhapatnam.",
      techStack: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
      result: "3x engagement increase",
      featured: true,
      status: "completed",
      order: 1,
      caseStudy: {
        subtitle: "Case Study — Web Development",
        overview: "A comprehensive digital platform designed to bring communities together in Visakhapatnam through events, engagement, and local networking.",
        problem: "Communize VIZAG had no unified digital platform to manage their growing community of 5,000+ members. Event management was done through scattered WhatsApp groups, engagement tracking was non-existent, and their previous website was outdated, slow, and not mobile-friendly. They needed a modern, scalable platform that could handle real-time interactions — but previous quotes from agencies were far beyond their budget.",
        solution: "StackX built a comprehensive Next.js-powered platform with real-time community feeds, event management, integrated payments, and an admin dashboard — all at 45% less cost than competing quotes. We leveraged serverless architecture on AWS to minimize infrastructure costs while maintaining 99.9% uptime. The mobile-first design ensured seamless access across all devices.",
        features: [
          "Responsive event management dashboard",
          "Real-time community feed and notifications",
          "Integrated payment processing for events",
          "SEO-optimized landing pages for each community",
          "Admin panel with analytics and reporting",
          "Mobile-first design across all device sizes",
        ],
        results: [
          { metric: "3x", label: "Community Engagement Increase" },
          { metric: "45%", label: "Cost Savings vs. Competitors" },
          { metric: "99.9%", label: "Platform Uptime" },
          { metric: "2.1s", label: "Average Page Load Time" },
        ],
        testimonial: {
          name: "Rajesh Kumar",
          company: "Communize VIZAG",
          feedback: "StackX transformed our digital presence completely. Their attention to detail and cost-effective approach saved us over 35% compared to other agencies while delivering superior quality. The platform has tripled our community engagement.",
          rating: 5,
          projectType: "Web Development",
        },
      },
    },
    {
      slug: "adscale-platform",
      title: "AdScale Platform",
      category: "Ad Tech",
      description: "Real-time programmatic advertising platform processing millions of daily impressions.",
      techStack: ["React", "Python", "BigQuery", "Kafka"],
      result: "10M+ daily impressions",
      featured: false,
      status: "active",
      order: 2,
    },
    {
      slug: "flowsync-automation",
      title: "FlowSync Automation",
      category: "Automation",
      description: "End-to-end business process automation reducing manual tasks by 60%.",
      techStack: ["Python", "n8n", "REST APIs", "Docker"],
      result: "60% efficiency gain",
      featured: false,
      status: "active",
      order: 3,
    },
    {
      slug: "technova-dashboard",
      title: "TechNova Dashboard",
      category: "Web Development",
      description: "Enterprise analytics dashboard with real-time data visualization and reporting.",
      techStack: ["React", "D3.js", "Node.js", "MongoDB"],
      result: "50% faster reporting",
      featured: false,
      status: "completed",
      order: 4,
    },
    {
      slug: "databridge-sync",
      title: "DataBridge Sync",
      category: "Automation",
      description: "Multi-platform data synchronization system for enterprise resource planning.",
      techStack: ["Python", "Celery", "Redis", "PostgreSQL"],
      result: "99.9% sync accuracy",
      featured: false,
      status: "active",
      order: 5,
    },
    {
      slug: "nexgen-ads-manager",
      title: "NexGen Ads Manager",
      category: "Ad Tech",
      description: "Unified cross-platform campaign management for digital advertising teams.",
      techStack: ["React", "Node.js", "Google Ads API", "Meta API"],
      result: "35% ROAS improvement",
      featured: false,
      status: "active",
      order: 6,
    },
  ];

  await PortfolioProject.insertMany(projects);
  console.log("✅ Portfolio projects seeded (6 projects, 1 with case study)!");
};

const seedJobs = async () => {
  const count = await JobPosting.countDocuments();
  if (count > 0) {
    console.log("⚠️  Jobs already seeded. Skipping.");
    return;
  }

  const jobs = [
    {
      title: "Senior Full-Stack Developer",
      department: "Engineering",
      type: "Full-time",
      location: "Remote / Visakhapatnam",
      description: "We're looking for an experienced full-stack developer proficient in React, Node.js, and cloud technologies. You'll lead development of client projects and mentor junior developers.",
      requirements: [
        "5+ years experience with React/Next.js and Node.js",
        "Experience with cloud platforms (AWS/GCP)",
        "Strong understanding of databases (PostgreSQL, MongoDB)",
        "Excellent communication and mentoring skills",
      ],
      status: "active",
      order: 1,
    },
    {
      title: "Frontend Developer",
      department: "Engineering",
      type: "Full-time",
      location: "Remote",
      description: "Join our frontend team to build beautiful, performant user interfaces. You'll work closely with designers and backend engineers to deliver exceptional digital experiences.",
      requirements: [
        "3+ years experience with React/Next.js",
        "Strong CSS/Tailwind skills with responsive design expertise",
        "Experience with animation libraries (Framer Motion, GSAP)",
        "Eye for design and attention to detail",
      ],
      status: "active",
      order: 2,
    },
    {
      title: "Python Automation Engineer",
      department: "Automation",
      type: "Full-time / Contract",
      location: "Remote",
      description: "Help our clients automate their business processes with intelligent Python solutions. You'll design and implement workflow automation, data pipelines, and integration systems.",
      requirements: [
        "3+ years experience with Python",
        "Experience with automation tools (Selenium, Scrapy, n8n)",
        "Knowledge of REST APIs and webhook integrations",
        "Problem-solving mindset with attention to edge cases",
      ],
      status: "active",
      order: 3,
    },
    {
      title: "UI/UX Designer",
      department: "Design",
      type: "Full-time",
      location: "Remote / Visakhapatnam",
      description: "Create stunning interfaces and seamless user experiences for our web and mobile projects. You'll collaborate with developers and clients to translate business goals into beautiful designs.",
      requirements: [
        "3+ years of UI/UX design experience",
        "Proficiency in Figma and modern design tools",
        "Understanding of design systems and component libraries",
        "Portfolio showcasing web and mobile design work",
      ],
      status: "active",
      order: 4,
    },
  ];

  await JobPosting.insertMany(jobs);

  // Seed sample applications
  const appCount = await JobApplication.countDocuments();
  if (appCount === 0) {
    const apps = [
      {
        fullName: "Alex Turner",
        email: "alex@gmail.com",
        phone: "+91 98765 43210",
        position: "Senior Full-Stack Developer",
        experience: "6 years",
        coverLetter: "I'm an experienced full-stack developer with expertise in React, Node.js, and AWS. I'd love to bring my skills to StackX.",
        linkedIn: "linkedin.com/in/alexturner",
        status: "new",
      },
      {
        fullName: "Lisa Wang",
        email: "lisa.wang@outlook.com",
        phone: "+1 555 123 4567",
        position: "UI/UX Designer",
        experience: "4 years",
        coverLetter: "With 4 years of UI/UX experience and a strong portfolio in web and mobile design, I'm excited about the opportunity at StackX.",
        linkedIn: "linkedin.com/in/lisawang",
        portfolioLink: "https://lisawang.design",
        status: "reviewed",
      },
      {
        fullName: "Raj Patel",
        email: "raj@protonmail.com",
        phone: "+91 87654 32100",
        position: "Frontend Developer",
        experience: "5 years",
        coverLetter: "I specialize in React/Next.js with strong Tailwind CSS and Framer Motion skills. I'd love to create exceptional experiences at StackX.",
        linkedIn: "linkedin.com/in/rajpatel",
        status: "new",
      },
      {
        fullName: "Emma Clark",
        email: "emma.c@yahoo.com",
        phone: "+44 7700 900123",
        position: "Python Automation Engineer",
        experience: "7 years",
        coverLetter: "I have deep experience in Python automation, Selenium, and building data pipelines. Looking forward to automating business processes for StackX clients.",
        linkedIn: "linkedin.com/in/emmaclark",
        status: "rejected",
      },
    ];
    await JobApplication.insertMany(apps);
  }

  console.log("✅ Jobs seeded (4 postings + 4 sample applications)!");
};

const seedMessages = async () => {
  const count = await Message.countDocuments();
  if (count > 0) {
    console.log("⚠️  Messages already seeded. Skipping.");
    return;
  }

  const msgs = [
    {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 555 234 5678",
      company: "TechVentures Inc.",
      service: "Web Development",
      budget: "$10,000 – $25,000",
      description: "Hi StackX team, I'm interested in redesigning our company website. We're looking for a modern, responsive design with e-commerce capabilities. Could we schedule a call to discuss the project scope and timeline?",
      timeline: "2-3 months",
      status: "unread",
    },
    {
      name: "Michael Chen",
      email: "michael@techcorp.io",
      phone: "+1 555 345 6789",
      company: "TechCorp",
      service: "Web Development",
      budget: "$25,000 – $50,000",
      description: "Hello, I represent TechCorp and we'd love to explore a partnership opportunity with StackX for our upcoming SaaS platform launch. We are impressed by your portfolio and would like to discuss terms.",
      timeline: "3-4 months",
      status: "unread",
    },
    {
      name: "Emily Davis",
      email: "emily@startup.co",
      phone: "",
      company: "StartupCo",
      service: "Web Development",
      budget: "$3,000 – $10,000",
      description: "We are a seed-stage startup looking for a cross-platform mobile app. The app is a marketplace for local services. Can you provide a ballpark estimate and timeline?",
      timeline: "ASAP",
      status: "unread",
    },
    {
      name: "James Wilson",
      email: "james@agency.com",
      phone: "+44 7700 900456",
      company: "Digital Agency Ltd",
      service: "Ad Tech Solutions",
      budget: "$10,000 – $25,000",
      description: "We need help integrating a programmatic ad platform into our existing website. We're currently serving ~2M impressions/month and need to scale. What solutions can you offer?",
      timeline: "1-2 months",
      status: "read",
    },
    {
      name: "Priya Sharma",
      email: "priya@fintech.in",
      phone: "+91 98765 11111",
      company: "FinTech Solutions",
      service: "Business Automation",
      budget: "$10,000 – $25,000",
      description: "Our fintech company needs a custom CRM with automated lead scoring and email workflows. We have about 5,000 leads per month. Looking for an end-to-end solution.",
      timeline: "2-3 months",
      status: "read",
    },
  ];

  await Message.insertMany(msgs);
  console.log("✅ Messages seeded (5 sample messages)!");
};

const runSeed = async () => {
  try {
    await connectDB();
    await seedAdmin();
    await seedServices();
    await seedPortfolio();
    await seedJobs();
    await seedMessages();
    await seedTestimonials();

    // Link some data to Web Development service for testing
    const webDev = await ServiceCategory.findOne({ slug: "web-development" });
    if (webDev) {
      const projects = await PortfolioProject.find({ category: "Web Development" }).limit(3);
      const testimonials = await Testimonial.find().limit(3);
      
      webDev.featuredProjects = projects.map(p => p._id);
      webDev.testimonials = testimonials.map(t => t._id);
      await webDev.save();
      console.log("✅ Linked featured projects and testimonials to Web Development service!");
    }

    process.exit(0);
  } catch (error: any) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

const seedTestimonials = async () => {
  const count = await Testimonial.countDocuments();
  if (count > 0) {
    console.log("⚠️  Testimonials already seeded. Skipping.");
    return;
  }

  const testimonials = [
    {
      name: "Sarah Jenkins",
      company: "TechFlow",
      role: "CTO",
      feedback: "StackX transformed our outdated monolith into a lightning-fast modern web app. Their engineering rigor is unmatched.",
      rating: 5,
      projectType: "Web Development",
      status: "active",
    },
    {
      name: "Marcus Chen",
      company: "Elevate SaaS",
      role: "Founder",
      feedback: "The best development agency we've partnered with. Flawless execution and incredible communication throughout.",
      rating: 5,
      projectType: "SaaS",
      status: "active",
    },
    {
      name: "Emma Watson",
      company: "Nova",
      role: "Marketing Dir",
      feedback: "Conversion rates doubled in the first month post-launch purely thanks to their UX optimizations.",
      rating: 5,
      projectType: "UX Design",
      status: "active",
    },
  ];

  await Testimonial.insertMany(testimonials);
  console.log("✅ Testimonials seeded (3 samples)!");
};

runSeed();
