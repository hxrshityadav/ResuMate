import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Code2,
  Rocket,
  Briefcase,
  Users,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65 }
  }
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

function About() {
  const skills = [
    "Java",
    "Spring Boot",
    "React.js",
    "JavaScript",
    "MySQL",
    "REST APIs",
    "Git & GitHub",
    "DSA",
    "AI Integration"
  ];

  const stats = [
    {
      number: "1300+",
      label: "LinkedIn Followers"
    },
    {
      number: "5000+",
      label: "Telegram Audience"
    },
    {
      number: "400+",
      label: "X Followers"
    },
    {
      number: "2026",
      label: "Graduation Year"
    }
  ];

  const builds = [
    {
      icon: Rocket,
      title: "AI Products",
      desc: "Resume builders, productivity tools and automation apps."
    },
    {
      icon: Briefcase,
      title: "Full Stack Apps",
      desc: "React + Spring Boot web apps with APIs and databases."
    },
    {
      icon: Users,
      title: "Personal Brand",
      desc: "Content around coding, careers and growth."
    }
  ];

  return (
      <div className="bg-background text-foreground overflow-hidden">

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* LEFT */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
            >
              <motion.div
                  variants={fadeUp}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-muted-foreground mb-6"
              >
                <User className="h-4 w-4" />
                About The Builder
              </motion.div>

              <motion.h1
                  variants={fadeUp}
                  className="text-5xl md:text-6xl font-bold tracking-tight leading-tight"
              >
                Hi, I'm
                <span className="block text-primary">
                Harshit Yadav
              </span>
              </motion.h1>

              <motion.p
                  variants={fadeUp}
                  className="mt-6 text-lg text-muted-foreground leading-8 max-w-xl"
              >
                Final-year Computer Science student building
                AI-powered tools, full-stack products and
                a personal brand around tech growth.
              </motion.p>

              <motion.div
                  variants={fadeUp}
                  className="mt-8 flex flex-wrap gap-4"
              >
                <motion.div
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                >
                  <Button asChild size="lg">
                    <Link to="/create">
                      View Product
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                >
                  <Button
                      variant="outline"
                      size="lg"
                      asChild
                  >
                    <Link to="/contact">
                      Contact Me
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* RIGHT CARD */}
            <motion.div
                initial={{
                  opacity: 0,
                  x: 50
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.2
                }}
                whileHover={{
                  y: -6
                }}
            >
              <Card className="rounded-3xl shadow-xl">
                <CardContent className="p-8 space-y-5">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Code2 className="h-10 w-10 text-primary" />
                  </div>

                  <h3 className="text-2xl font-bold">
                    Full Stack Developer
                  </h3>

                  <p className="text-muted-foreground leading-7">
                    Focused on Java backend systems,
                    React frontends and scalable AI products.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="rounded-2xl bg-muted p-4">
                      <p className="font-bold text-xl">
                        10+
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Projects Built
                      </p>
                    </div>

                    <div className="rounded-2xl bg-muted p-4">
                      <p className="font-bold text-xl">
                        Daily
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Learning Mode
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </section>

        {/* JOURNEY */}
        <section className="bg-muted/30 py-24">
          <motion.div
              initial={{
                opacity: 0,
                y: 40
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.7
              }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto px-4 md:px-6 text-center"
          >
            <h2 className="text-4xl font-bold">
              My Journey
            </h2>

            <p className="mt-5 text-muted-foreground leading-8">
              Started as a student curious about coding.
              Now focused on becoming a world-class engineer
              by mastering Java, systems thinking,
              product building and public growth.
            </p>
          </motion.div>
        </section>

        {/* SKILLS */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-24">
          <motion.div
              initial={{
                opacity: 0,
                y: 30
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.6
              }}
              viewport={{ once: true }}
              className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold">
              Skills & Tech Stack
            </h2>
          </motion.div>

          <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-wrap gap-3 justify-center"
          >
            {skills.map((skill, index) => (
                <motion.span
                    key={index}
                    variants={fadeUp}
                    whileHover={{
                      y: -3
                    }}
                    className="px-4 py-2 rounded-full bg-muted text-sm font-medium"
                >
                  {skill}
                </motion.span>
            ))}
          </motion.div>
        </section>

        {/* WHAT I BUILD */}
        <section className="bg-muted/30 py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-6">

            <motion.div
                initial={{
                  opacity: 0,
                  y: 30
                }}
                whileInView={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  duration: 0.6
                }}
                viewport={{ once: true }}
                className="text-center mb-14"
            >
              <h2 className="text-4xl font-bold">
                What I Build
              </h2>
            </motion.div>

            <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-6"
            >
              {builds.map((item, index) => {
                const Icon = item.icon;

                return (
                    <motion.div
                        key={index}
                        variants={fadeUp}
                        whileHover={{
                          y: -8
                        }}
                    >
                      <Card className="rounded-3xl h-full">
                        <CardContent className="p-8">
                          <Icon className="h-10 w-10 text-primary mb-5" />

                          <h3 className="text-xl font-semibold">
                            {item.title}
                          </h3>

                          <p className="mt-3 text-muted-foreground">
                            {item.desc}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                );
              })}
            </motion.div>

          </div>
        </section>

        {/* STATS */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-24">
          <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-4 gap-6"
          >
            {stats.map((item, index) => (
                <motion.div
                    key={index}
                    variants={fadeUp}
                    whileHover={{
                      y: -6
                    }}
                >
                  <Card className="rounded-3xl text-center">
                    <CardContent className="p-8">
                      <p className="text-4xl font-bold text-primary">
                        {item.number}
                      </p>

                      <p className="mt-2 text-muted-foreground text-sm">
                        {item.label}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA */}
        <section className="pb-24">
          <motion.div
              initial={{
                opacity: 0,
                y: 50
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.8
              }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto px-4 md:px-6"
          >
            <Card className="rounded-3xl bg-primary text-primary-foreground shadow-2xl">
              <CardContent className="p-10 md:p-14 text-center">
                <h2 className="text-4xl font-bold">
                  Let’s Build Something Great
                </h2>

                <p className="mt-4 text-primary-foreground/80">
                  Open to internships, freelance work
                  and growth opportunities.
                </p>

                <motion.div
                    whileHover={{
                      y: -3
                    }}
                    whileTap={{
                      scale: 0.97
                    }}
                    className="mt-8"
                >
                  <Button
                      variant="secondary"
                      size="lg"
                      asChild
                  >
                    <Link to="/contact">
                      Connect Now
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

      </div>
  );
}

export default About;