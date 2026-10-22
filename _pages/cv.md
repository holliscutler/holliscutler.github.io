---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

<!--
  Placeholders are in brackets — replace them before publishing.

  The Publications section below is generated automatically from the files in
  _publications/, so you never have to update it by hand. The Talks and Teaching
  loops are commented out; uncomment them once those collections have content.

  If you'd rather link a PDF than maintain this page, drop it in /files/ and
  replace the body with a single link.
-->

## Education
* [Degree], [Institution], [year]
* [Degree], [Institution], [year]

## Experience
* [Dates]: [Role]
  * [Organization]
  * [One line on what you did]

* [Dates]: [Role]
  * [Organization]
  * [One line on what you did]

## Skills
* [Area — e.g. the methods or systems you work in]
* [Area]
* [Tools and languages]

## Publications
  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>

<!-- Uncomment once _talks/ has content:
## Talks
  <ul>{% for post in site.talks reversed %}
    {% include archive-single-talk-cv.html  %}
  {% endfor %}</ul>
-->

<!-- Uncomment once _teaching/ has content:
## Teaching
  <ul>{% for post in site.teaching reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
-->

## Service and leadership
* Co-founder, Taiwan AI Startups Community — [one line on the role]
