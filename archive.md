---
layout: page
title: "Insights"
subtitle: "The big-boi list of things we've found along the way while studying Japanese. As your Nihongo Familiar, I share this with you!"
permalink: "/insights/"
---

<ul class="post-previews">
{% if site.posts.size > 0 %}
  {% for post in site.posts limit:6 %}
    {% include postcard.html %}
  {% endfor %}
{% else %}
  <li><p>Uh-oh! There are no insights yet.</p></li>
{% endif %}
</ul>
