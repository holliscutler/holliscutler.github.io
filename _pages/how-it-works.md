---
layout: detail
title: "How it works"
excerpt: "A forecaster whose memory is the shape of a graph, next to the architectures it was measured against."
permalink: /how-it-works/
back_url: /#research
back_label: "Research"
mathjax: true
wide: true
redirect_from:
  - /research/
---

Every forecaster has to put its memory of the past somewhere. Almost all of them
put it in the *weights* of a structure that is decided before deployment and
never changes shape again. This one puts it in the structure itself.

What follows is the model running — not a diagram of it — and then the same
model set beside the three architectures it was benchmarked against, so the
difference is visible rather than asserted.

## The model, running

Three months of hourly temperature, starting from an empty graph on 1 May 2020.
Every frame is a real snapshot taken during a single causal pass: nothing is
staged, re-ordered, or run twice.

<figure class="network-viz" data-network-viz data-viz-state="loading">
  <div class="network-viz__stage">
    <canvas height="520" aria-label="Animated three-dimensional view of the model's graph growing over three months"></canvas>
    <p data-viz-status class="network-viz__status">Loading the animation…</p>
    <img data-viz-fallback hidden src="/images/network-still.png"
         alt="The graph after three months: a dense cloud of nodes with one bright reinforced circuit running through it.">
  </div>
  <div class="network-viz__controls" data-viz-controls>
    <button type="button" data-viz-play disabled aria-pressed="false">Play</button>
    <input type="range" data-viz-scrub min="0" max="0" value="0" step="1" disabled
           aria-label="Scrub through the animation">
    <span data-viz-readout class="network-viz__readout"></span>
  </div>
  <figcaption>
    Drag to rotate. Each point is a recurring state of the signal; each line is a
    transition between two of them. Line brightness is <strong>conductivity</strong> —
    faint grey means seen once and fading, bright teal means re-traversed and
    reinforced. The axes are the delay embedding <em>v(t)</em>, <em>v(t−L)</em>,
    <em>v(t−2L)</em>.
  </figcaption>
</figure>

Watch for three things. It **wanders** at first — a few days of data look like a
line, not a cycle. Then the laps **fold** onto each other and the tangle
collapses into a loop. From then on the bright circuit is the day the signal
actually keeps living, and new structure only appears where the weather does
something it has not done before.

That last point is the one that matters: nothing is deleted. A path that stops
being used decays toward zero conductivity and goes dormant, but it stays in the
graph. When its season comes back around, it lights up again instead of being
relearned.

## What it is measured against

The thesis benchmarks this against three standard forecasters. Drawn at the same
scale and in the same left-to-right form, the family resemblance between them is
the point.

<div class="arch">
  <figure class="arch__item">
    {% include diagram-dlinear.html %}
    <figcaption>
      <strong>DLinear.</strong> The window is split into trend and seasonal
      parts and pushed through a single linear map. Fast and famously hard to
      beat — but the window length and the weight grid are both chosen before
      the first observation arrives.
    </figcaption>
  </figure>

  <figure class="arch__item">
    {% include diagram-lstm.html %}
    <figcaption>
      <strong>LSTM.</strong> One cell, applied over and over, carrying a
      hidden state of fixed width. Everything the model remembers has to be
      compressed into that vector, and the cell's weights are frozen once
      training ends.
    </figcaption>
  </figure>

  <figure class="arch__item">
    {% include diagram-patchtst.html %}
    <figcaption>
      <strong>PatchTST.</strong> The series is cut into a fixed grid of
      patches, each becomes a token, and attention relates every token to
      every other. Powerful, and still a fixed grid with fixed weights.
    </figcaption>
  </figure>

  <figure class="arch__item arch__item--wide">
    {% include diagram-mycomorph.html %}
    <figcaption>
      <strong>MycoMorph.</strong> The same left-to-right pipeline — smooth,
      embed, then a graph — except the last stage is not fixed. The lower row
      is that one stage at three moments: it gains nodes as the signal visits
      new states, folds repeated laps onto each other, and thickens the
      circuit it keeps re-traversing.
    </figcaption>
  </figure>
</div>

## The difference, stated plainly

The three diagrams above would look **identical** after one observation and
after a hundred thousand. Only the numbers inside the boxes would differ, and
only if you retrained. That is not a criticism — it is what makes them fast,
analysable, and easy to deploy. It is also what makes them brittle when the
process generating the data changes shape.

| | Conventional | This model |
| --- | --- | --- |
| **Where memory lives** | weights inside a fixed graph | the graph itself |
| **Shape over time** | constant by construction | grows, folds, reinforces, decays |
| **Adapting to new dynamics** | retrain or fine-tune, offline | happens during the stream |
| **Cost of a new pattern** | adjust every weight | add a branch |
| **An unused pattern** | overwritten by later training | kept dormant, reactivates |

## The mechanism, in four steps

**1 · Smooth.** A Matérn-5/2 Kalman filter denoises the stream causally, and a
fixed-lag smoother refines the recent past using data up to now — never beyond.

**2 · Embed.** Velocity is lifted into a delay embedding,
`e(t) = [v(t), v(t−L), v(t−2L)]`. A repeating one-dimensional signal becomes a
closed orbit in three dimensions, which is why a daily cycle can look like a
loop at all.

**3 · Consolidate.** Settled points are appended to a chain. On a slow cadence
the aged end of that chain is folded onto itself: each lap is either folded onto
the established cycle it best matches, or kept as a new one. Repetition
collapses; novelty branches.

**4 · Reinforce and decay.** Every edge carries a conductivity following the
Physarum rule

$$\frac{dD}{dt} = f(|Q|) - \gamma D$$

so an edge gains strength in proportion to the flow across it and loses a fixed
fraction continuously. Prediction then reads the graph: the recent trail is
matched against nearby nodes, each contributes its conductivity-weighted forward
increment, and the blend is added to the filtered current value.

<div class="notice" markdown="1">
The animation is an illustrative three-month run, chosen to make the mechanism
legible — it is not the benchmark reported in the paper. Full results are in the
[thesis](/publication/2026-08-02-thesis-topology-that-learns).
</div>

<script src="/assets/js/network-viz.js" defer></script>
