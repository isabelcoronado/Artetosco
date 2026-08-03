import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

// El sitio ARTETOSCO es estático (HTML/CSS/JS puro) y vive en /site/.
// Esta ruta solo redirige la raíz hacia esa entrada.
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARTETOSCO | Muebles con identidad y refugios confortables" },
      {
        name: "description",
        content:
          "Taller artesanal chileno de muebles exclusivos, construcciones rústicas de alto confort y creaciones especiales en madera.",
      },
      { property: "og:title", content: "ARTETOSCO | Muebles con identidad y refugios confortables" },
      {
        property: "og:description",
        content: "Diseño y fabricación artesanal de muebles y refugios en madera natural.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/site/index.html");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <a href="/site/index.html" className="text-sm tracking-widest uppercase">
        Entrar a ARTETOSCO
      </a>
    </div>
  );
}
