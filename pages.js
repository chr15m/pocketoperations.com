m = require('motionless');

t = m.dom(m.load("index.html"));

m.dir("pages").forEach(function(pagefile) {
  const page = m.load("pages/" + pagefile);
  const body = t.$("body");
  const main = t.$("main");
  const title = pagefile.replace(/\-/g, " ").replace(".md", "");

  t.$("title").textContent = title;
  t.$("h1").textContent = title;
  body.className = "page";
  main.innerHTML = m.md(page);
  // build the table of contents
  // get a list of the h2 headers in the page
  const headers = t.$$("h2");
  if (headers.length) {
    // build a list of <ul> tags with an <a> link for every header
    const items = headers.map((h2)=>{
      // add a named href the TOC can link to
      h2.appendChild(t.h("a", {"className": "pilcrow", "name": m.slug(h2.textContent)}, " "))
      // create the TOC <li> link tag
      return t.h("li", {}, t.h("a", {"href": "#" + m.slug(h2.textContent)}, h2.textContent));
    });
    // create the top level <ul> tag containing the items
    const toc = t.h("ul", {"className": "toc"}, items);
    // prepend the table of contents inside the <main> tag
    t.$("main").prepend(toc);
    t.$("main").prepend(t.h("h2", {}, "Contents"));
  }
  // TODO: extract first image for socials

  // write it back to the html file
  m.save(pagefile.replace(".md", ".html"), t.render());
});
