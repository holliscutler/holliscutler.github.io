---
title: "Topology That Learns: Investigating Mycelial and Physarum Networks as a Conceptual Blueprint for Streaming Time Series Prediction"
collection: publications
category: conferences
permalink: /publication/2026-08-01-alife-topology-that-learns
excerpt: 'Two distant lineages, fungi and slime mould, independently arrived at the same flow-based way of adapting a network. This paper argues that this "double convergence" is an unexplored paradigm for streaming multivariate prediction on edge devices: fungal architecture as the blueprint, the Physarum conductivity equation as the formalism.'
date: 2026-08-01
venue: 'ALIFE 2026 · MIT Press'
location: 'Waterloo, Canada'
status: 'Published &amp; presented'
authors: 'Hollister Cutler, Chih-Hung G. Li'
order: 1
mathjax: true
paperurl: 'https://doi.org/10.1162/isal.a.1038'
citation: 'Cutler, H., &amp; Li, C.-H. G. (2026). &quot;Topology That Learns: Investigating Mycelial and Physarum Networks as a Conceptual Blueprint for Streaming Time Series Prediction.&quot; <i>ALIFE 2026: Proceedings of the 2026 Artificial Life Conference</i>. MIT Press. https://doi.org/10.1162/isal.a.1038'
links:
  - label: "Paper"
    url: "https://doi.org/10.1162/isal.a.1038"
  # - label: "Slides"
  #   url: "/files/alife-2026-slides.pdf"
  # - label: "BibTeX"
  #   url: "/files/alife-2026.bib"
---

With Chih-Hung G. Li, National Taipei University of Technology.

## Abstract

Streaming time series prediction requires models that operate on continuously
arriving, non-stationary data under local resource constraints. This paper
investigates whether biological flow networks, including fungal mycelium and the
amoebozoan *Physarum polycephalum*, offer a design principle for this setting.
These systems store memory in changing network structure: frequently used
pathways strengthen, while unused pathways lose influence. Although biological
flow networks have inspired work in optimization, unconventional computing,
reservoir computing, and neural architecture design, they remain largely
unexplored as a mechanism for streaming time series prediction. We characterize
the core challenges of streaming prediction and reinterpret the physarum
conductivity equation, $$dD/dt = f(|Q|) - \gamma D$$, as a rule for constructing
temporal transition graphs from a data stream. On held-out 2023 temperature
data, a minimal online model improves over a Kalman one-step baseline, reducing
RMSE from 0.815 to 0.638. These results suggest that flow-based reinforcement
and decay can provide a concrete mechanism for streaming predictors whose
structure adapts with the data they process.
