---
layout: detail
title: "CV"
permalink: /cv/
back_url: /#background
back_label: "Background"
redirect_from:
  - /resume
---

## Education

**M.S., International Master Program in Mechanical and Automation Engineering**
National Taipei University of Technology, 2024–2026

**B.A., Computer Science and Chinese Language and Literature**
University of Virginia, 2019–2023

## Experience

**Co-Founder & Lead Developer** — Taiwan AI Startups Community
*October 2025 – present*

- Co-founded the community connecting founders, engineers, and researchers
  building AI across Taiwan; program and host talks, panels, workshops, and
  networking events.
- Lead developer of the organization's website — built and maintain the site
  that serves as the community's public home.

**Organic Farmer** — World Wide Opportunities on Organic Farms (WWOOF)
*August 2023 – 2024*

- Lived and worked on host organic farms across Ireland, Scotland, and New
  Zealand; over ten months of diverse agricultural work.

**Back End Developer Intern** — IBM
*May 2022 – August 2022*

- Maintained the CI/CD pipeline for Red Hat Marketplace on OpenShift across a
  12-week agile engagement.
- Reworked business logic in the RabbitMQ messaging layer to reduce duplicate
  messages on the queue, improving throughput reliability.

**Full Stack Engineering Volunteer** — Code for America, Charlottesville
*April 2021 – 2023*

- Built civic technology projects for local nonprofits, from GIS
  sidewalk-accessibility mapping in QGIS and Python to a Joomla scheduling tool
  for a food pantry.

**Research Assistant** — UVA Health Sciences Library
*September 2021 – 2023*

- Developed an indoor wayfinding application in collaboration with the MazeMap
  team for navigation across the UVA Health System.

## Publications

{% assign pubs = site.publications | sort: "date" | reverse %}
{% for p in pubs %}
- **[{{ p.title }}]({{ p.url | relative_url }})** — {{ p.venue }}, {{ p.date | date: "%B %Y" }}
{% endfor %}

## Awards and scholarships

- **Academic Excellence Award** — National Taipei University of Technology, 2026
- **Taiwan Scholarship** — Ministry of Education, Republic of China (Taiwan), 2024–2026
- **Jefferson Trust Grant** — University of Virginia, 2022

## Skills

- **Languages and tooling:** Python, JavaScript, C++, Bash, CUDA, Git, Linux
- **Machine learning:** PyTorch, TensorFlow, Hugging Face Transformers, Ollama
- **Research:** adaptive architecture design, conceptual drift, time-series
  modeling, benchmarking, ablation studies
- **Systems:** edge-native deployment, GIS analysis
- **Languages:** English, Mandarin Chinese
