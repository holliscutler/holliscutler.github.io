---
title: "Topology That Learns: A Bio-Inspired Streaming Forecaster for Time-Series Under Categorical Drift"
collection: publications
category: theses
permalink: /publication/2026-08-02-thesis-topology-that-learns
excerpt: "A full four-stage architecture built on that blueprint, together with an evaluation framework that tests it against modern deep-learning forecasters — DLinear, LSTM and PatchTST — across synthetic drift and measured sensor records. The motivating case is mechanical engineering and robotics, where sensor data shifts with load, wear and operating regime, and a model with fixed structure degrades as the machine it monitors changes."
date: 2026-08-02
venue: 'M.S. thesis, National Taipei University of Technology'
authors: 'Hollister Cutler'
status: 'Published &amp; presented'
order: 3
paperurl: 'https://drive.google.com/file/d/1Cy7BOzzoVXdKqAUUqZVIMVdT65cFqLwp/view?usp=sharing'
slidesurl: '/files/thesis-defense-slides.pptx'
citation: 'Cutler, H. (2026). &quot;Topology That Learns: A Bio-Inspired Streaming Forecaster for Time-Series Under Categorical Drift.&quot; M.S. thesis, National Taipei University of Technology.'
---

## Abstract

Forecasting models trained on a fixed historical window can lose accuracy when
signal dynamics change after deployment. This thesis investigates whether
adaptation can occur through evolving computational structure rather than
repeated optimization of a shared parameter vector. Inspired by selected
principles of decentralized biological networks, MycoMorph is a strictly causal
one-step forecaster in which recurring behavior is stored in persistent graph
topology and its current influence is regulated through local reinforcement and
decay. A Matérn-5/2 state-space front end produces a smoothed derivative trace;
delay-coordinate embedding converts the trace into a trajectory; a directed
graph records transitions and consolidates recurring cycles; and cycle-level
period projection supports graph-based and harmonic prediction tracks.

MycoMorph is compared with persistence, a constant-velocity Kalman filter,
DLinear, LSTM, and PatchTST on ten synthetic signals spanning four drift axes at
three noise levels and three seeds, and on fifteen measured sensor records. It
achieves the lowest mean absolute error on six synthetic signals, including all
four period-drift signals, and on eight real-world records, including all five
photoplethysmography and all three reported mechanical records.

Structural analysis shows persistent pathways, selective activation,
conductivity-mediated dormancy and reactivation, and an association between
stronger alignment and lower prediction error. The results provide initial
evidence that topology-mediated memory can support forecasting under changing
recurrent dynamics and that unconventional biological principles can inform
alternative adaptive network designs.

## How it was evaluated

| | |
| --- | --- |
| **Baselines** | Persistence, constant-velocity Kalman, DLinear, LSTM, PatchTST |
| **Synthetic** | 10 signals across 4 drift axes × 3 noise levels × 3 seeds |
| **Real** | 15 measured sensor records |
| **Lowest MAE on** | 6 of 10 synthetic signals — including all 4 period-drift signals |
| | 8 of 15 real records — including all 5 PPG and all 3 mechanical |

The mechanism is set out conceptually in the companion
[ALIFE 2026 paper](/publication/2026-08-01-alife-topology-that-learns), and
there's a visual walkthrough — the graph building itself from an empty state,
and what happens to its structure when a season turns — under
[how it works](/how-it-works/).
