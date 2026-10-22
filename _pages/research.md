---
layout: single
title: "Research"
excerpt: "A streaming forecaster whose memory lives in the shape of a graph."
permalink: /research/
author_profile: true
toc: true
toc_label: "Contents"
toc_sticky: true
redirect_from:
  - /how-it-works/
  - /publications/
---

Most forecasters keep a fixed structure and learn weights inside it. This one
does the opposite: the structure *is* the memory. Paths the signal keeps taking
get stronger; paths it stops taking fade. Nothing is deleted, so a pattern that
disappears for months can come back when its season returns.

The idea comes from biological flow networks — fungal mycelium and the slime
mould *Physarum polycephalum* — which solve routing problems with no brain and
no central controller, purely by reinforcing the tubes that carry flow and
letting the rest decay.

## Watch it build

Below is the real model running on three months of hourly temperature from
Sacramento, starting from an empty graph on 1 May 2020. Every frame is an
actual snapshot taken during a single causal pass — nothing here is staged or
re-ordered.

<figure class="network-viz" data-network-viz data-viz-state="loading">
  <div class="network-viz__stage">
    <canvas height="440" aria-label="Animated 3-D view of the model's graph growing over three months"></canvas>
    <p data-viz-status class="network-viz__status">Loading the animation…</p>
    <img data-viz-fallback hidden
         src="/images/research/network-timeline.png"
         alt="The embedded network across three years, swelling in summer and contracting in winter.">
  </div>
  <div class="network-viz__controls" data-viz-controls>
    <button type="button" data-viz-play disabled aria-pressed="false">Play</button>
    <input type="range" data-viz-scrub min="0" max="0" value="0" step="1" disabled
           aria-label="Scrub through the animation">
    <span data-viz-readout class="network-viz__readout"></span>
  </div>
  <figcaption>
    Drag to rotate. Each point is a recurring state of the signal; each line is
    a transition between states. Line brightness is <strong>conductivity</strong> —
    faint grey transitions have been seen once and are fading, bright teal ones
    are being re-traversed and reinforced. Axes are the delay embedding
    <em>v(t)</em>, <em>v(t−L)</em>, <em>v(t−2L)</em>.
  </figcaption>
</figure>

What to look for: the chain wanders at first, because a few days of data look
like a line, not a cycle. Once the daily rhythm repeats enough times, those laps
fold onto each other and the tangle collapses into a loop. From then on the
bright path is the day the signal actually keeps living, and new structure only
appears where the weather does something it hasn't done before.

## The mechanism, in four steps

![The four-layer architecture: Kalman front end, base graph, cycle layer and meta-graph, prediction.](/images/research/architecture.png)

**1 · Smooth.** A Matérn-5/2 Kalman filter denoises the raw stream causally, and
a fixed-lag smoother refines the recent past using data up to now — never
beyond. The output is a filtered position and velocity.

**2 · Embed.** Velocity is lifted into a Takens delay embedding,
`e(t) = [v(t), v(t−L), v(t−2L)]`. A one-dimensional signal that repeats becomes
a closed orbit in three dimensions. This is why a daily cycle can look like a
loop at all.

**3 · Consolidate.** Settled points are appended to a chain. On a slow cadence
the aged end of that chain is folded onto itself: the dominant period is found
by self-alignment, and each lap is either folded onto the established cycle it
best matches, or kept as a new one. Repetition collapses; novelty branches.

**4 · Reinforce and decay.** Every edge carries a conductivity that follows the
Physarum rule

$$\frac{dD}{dt} = f(|Q|) - \gamma D$$

so an edge gains strength in proportion to the flow across it and loses a fixed
fraction continuously. A cycle re-traversed over many aligned passes accumulates
conductivity; one left unused decays toward zero and goes **dormant — kept, not
pruned**. When its season returns, it reactivates.

Prediction then reads the graph: the recent trail is matched against nearby
nodes, each contributes its conductivity-weighted forward increment, and the
blend is added to the filtered current value.

## Why a loop and not a line

The same signal produces completely different structure depending on how
regularly it repeats.

![January versus July 2021: the raw temperature series beside the 3-D network state.](/images/research/signal-vs-network.png)

> January vs July 2021: the raw temperature series beside the 3-D network state,
> shaded by conductivity. The in-season loop is bright and dense; off-season
> structure fades to dormancy — the same memory, differently active.

Winter days are erratic, so the orbit never quite closes and the graph stays a
knot. Summer days repeat cleanly, so laps align, fold, and light up into a
single dominant cycle.

## Memory that breathes

Run it for years and the structure starts behaving like a seasonal organism.

![The embedded network across three years in a bimonthly grid, swelling in summer and contracting in winter.](/images/research/network-timeline.png)

> The Takens-embedded network across three years (bimonthly grid). The active
> loop "breathes" — swelling in summer, contracting in winter — as consolidated
> structure reactivates seasonally.

This is the part that makes the biological analogy more than decoration. The
model is not re-learning summer every year. Summer's structure was never thrown
away; it was sitting at near-zero conductivity, waiting for flow to return.

## Where it helps

The payoff shows up under **drift** — when the process generating the stream
changes rather than just its parameters. Period drift is the hardest case, and
the one a fixed representation handles worst.

![Mean MAE grouped by drift axis, one bar per model, on a log scale.](/images/research/mae-by-drift-axis.png)

> Synthetic-panel mean MAE grouped by drift axis (log scale). On the *period*
> axis DLinear and PatchTST degrade by roughly 10–20×, while MycoMorph stays
> lowest; on the shape/amplitude/position axes the models converge and MycoMorph
> remains best-or-tied.

It carries to real hardware too, winning on the modalities whose period actually
moves, and losing only where a frozen representation is perfectly adequate.

![Real-record mean MAE, one panel per modality.](/images/research/mae-by-modality.png)

> Real-record mean MAE, one panel per modality, each on its own linear scale.
> MycoMorph is lowest on PPG, Vibration and Motor speed, while PatchTST edges
> the fixed-period Electricity and Air temperature records.

## Publications

{% assign groups = site.publication_category %}
{% for category in groups %}
  {% assign items = site.publications | where: "category", category[0] | sort: "date" | reverse %}
  {% if items.size > 0 %}
<h3 class="pub-group">{{ category[1].title }}</h3>
    {% for post in items %}
<div class="pub-entry">
  <h4 class="pub-entry__title"><a href="{{ post.url }}">{{ post.title }}</a></h4>
  <p class="pub-entry__meta">{{ post.venue }} &middot; {{ post.date | date: "%B %Y" }}</p>
  <p class="pub-entry__excerpt">{{ post.excerpt | markdownify | remove: "<p>" | remove: "</p>" }}</p>
</div>
    {% endfor %}
  {% endif %}
{% endfor %}

<p class="notice--info" markdown="1">
The animation is an illustrative three-month run shown to make the mechanism
legible; it is not the benchmark reported in the paper. Figures are from the
thesis and the accepted paper.
</p>

<script src="/assets/js/network-viz.js" defer></script>
