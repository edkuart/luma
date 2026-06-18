import Image from "next/image";
import { PageHero } from "@/components/public/page-hero";

export const metadata = {
  title: "Sobre",
  description: "Biografia y statement artistico de Luma Studio.",
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="Sobre"
        title="Una practica visual entre fotografia, archivo y movimiento."
        description="Esta pagina sera editable desde settings para que la artista pueda ajustar bio, statement, disciplinas y redes sin tocar codigo."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="relative min-h-[560px] overflow-hidden rounded-lg border border-white/10">
          <Image
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=82"
            alt="Retrato editorial de una artista mirando hacia la camara."
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
          <p className="text-2xl leading-10 text-foreground">
            Luma Studio nace como una forma de ordenar obra visual sin apagar su
            intensidad: fotografia, albumes, piezas audiovisuales y proyectos
            experimentales en un solo archivo.
          </p>
          <p className="mt-6 leading-8 text-muted">
            En la version final, la artista podra editar esta biografia, elegir
            una imagen de perfil, destacar disciplinas, agregar redes y mantener
            el home actualizado desde el panel administrativo. La idea no es
            dejarla frente a una pantalla vacia, sino darle una propuesta base
            inteligente que ella pueda ajustar.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-muted sm:grid-cols-2">
            {["Fotografia", "Cortometraje", "Direccion visual", "Archivo"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/15 px-4 py-2"
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
