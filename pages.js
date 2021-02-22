const m = require('motionless');

const t = m.dom(m.load("index.html"));

const navlinks = ["cases", "apps", "cheatsheets", "samples-and-patches", "tutorials"];

// add the nav section
t.$("header").after(
  t.h("nav", {},
    navlinks.map(l=>t.h("a", {"href": "/pocket-operator-" + l + ".html"}, l.split("-")[0].replace(/^\w/, c=>c.toUpperCase())))));

m.dir("pages").forEach(function(pagefile) {
  const lines = m.load("pages/" + pagefile).split("\n");
  const body = t.$("body");
  const main = t.$("main");
  const title = pagefile.replace(/\-/g, " ")
    .replace(".md", "")
    .replace(/(^\w{1})|(\s+\w{1})/g, l => l.toUpperCase());

  t.$("title").textContent = title;
  t.$("h1").textContent = title;

  const [description, page] = extract_description(lines, title);

  t.$("meta[name=description]").setAttribute("content", description);
  t.$("meta[name='twitter:description']").setAttribute("content", description);
  t.$("meta[property='og:description']").setAttribute("content", description);
  t.$("meta[property='og:url']").setAttribute("content", "https://pocketoperations.com/" + pagefile.replace(".md", ""));

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
    // grab the first p element which is a description of what's on the page
    const p = t.$("p");
    // prepend the table of contents inside the <main> tag
    p.after(toc);
    p.after(t.h("h2", {}, "Contents"));
  }

  // write it back to the html file
  m.save(pagefile.replace(".md", ".html"), t.render());
});

function extract_description(lines, title) {
  // meta description
  if (lines[0].indexOf("###") == "0") {
    return [
      lines[0].replace("### ", ""),
      lines.slice(1).join("\n"),
    ];
  } else {
    return [
      title,
      lines.join("\n"),
    ];
  }

}
