m = require('motionless');

t = m.dom(m.read("index.html"));

m.dir("pages").forEach(function(pagefile) {
  const page = m.read("pages/" + pagefile);
  const main = m.$(t.doc, "main");
  const title = pagefile.replace(/\-/g, " ").replace(".md", "");
  const $ = m.$.bind(m, t.doc);
  const $$ = m.$$.bind(m, t.doc);

  $("title").textContent = title;
  $("h1").textContent = title;
  main.className = "page";
  main.innerHTML = m.md(page);
  // build the table of contents
  const toc = t.h("ul", {"className": "toc"},
      $$("h2").map(h2=>t.h("li", {}, t.h("a", {"href": "#" + m.slug(h2.textContent)}, h2.textContent))));
  $("main").insertBefore(toc, $("h2"));
  $("main").insertBefore(t.h("h2", {}, "Contents"), toc);
  // decorate every h2 with an internal link
  $$("h2").forEach(h2=>{
    h2.appendChild(t.h("a", {"className": "pilcrow", "name": m.slug(h2.textContent)}, " "));
  });
  // write it back to the html file
  m.write(pagefile.replace(".md", ".html"), t.serialize());
});
