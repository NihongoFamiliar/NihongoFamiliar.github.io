---
layout: page
title: "Insights"
subtitle: "The big-boi list of things we've found along the way while studying Japanese. As your Nihongo Familiar, I share this with you!"
permalink: "/insights/"
---

<div class="notice">
  <p><strong>Notice:</strong></p>
  <p>
    Insights won't be posted for the year of 2023. <em>Sorry about that!</em>
  </p>
  <p>
    Right now, there are some important setbacks occurring, but I'll get things set back up as soon as I can.
  </p>
</div>

<ul class="post-previews">
{% if site.posts.size > 0 %}
  {% for post in site.posts %}
    {% include postcard.html %}
  {% endfor %}
{% else %}
  <li><p>Uh-oh! There are no insights yet.</p></li>
{% endif %}
</ul>
