import { ChevronRight, FileText, AlertCircle } from "lucide-react";
import { Link } from "react-router";

interface Mensa {
  id: string;
  name: string;
  image: string;
  isPublished: boolean;
}

const mensas: Mensa[] = [
  {
    id: "castelfidardo",
    name: "Castelfidardo",
    image: "https://www.edisu.piemonte.it/sites/default/files/styles/anteprima_galleria/public/sedi-mense-universitarie-immagini/castelfidardo/castelfidardo%205.jpg?itok=Zbb4GXkk",
    isPublished: true,
  },
  {
    id: "borsellino",
    name: "Borsellino",
    image: "https://www.edisu.piemonte.it/sites/default/files/styles/anteprima_galleria/public/sedi-mense-universitarie-immagini/castelfidardo/castelfidardo%205.jpg?itok=Zbb4GXkk",
    isPublished: true,
  },
  {
    id: "agnelli",
    name: "Agnelli",
    image: "https://www.edisu.piemonte.it/sites/default/files/styles/anteprima_galleria/public/sedi-mense-universitarie-immagini/castelfidardo/castelfidardo%205.jpg?itok=Zbb4GXkk",
    isPublished: false,
  },
  {
    id: "galliari",
    name: "Galliari",
    image: "https://www.edisu.piemonte.it/sites/default/files/styles/anteprima_galleria/public/sedi-mense-universitarie-immagini/castelfidardo/castelfidardo%205.jpg?itok=Zbb4GXkk",
    isPublished: true,
  },
  {
    id: "villa-claretta",
    name: "Villa Claretta",
    image: "https://www.edisu.piemonte.it/sites/default/files/styles/anteprima_galleria/public/sedi-mense-universitarie-immagini/castelfidardo/castelfidardo%205.jpg?itok=Zbb4GXkk",
    isPublished: false,
  },
  {
    id: "principi-acaja",
    name: "Principi d'Acaja",
    image: "https://www.edisu.piemonte.it/sites/default/files/styles/anteprima_galleria/public/sedi-mense-universitarie-immagini/castelfidardo/castelfidardo%205.jpg?itok=Zbb4GXkk",
    isPublished: true,
  },
  {
    id: "pracchiardo",
    name: "Pracchiardo",
    image: "https://www.edisu.piemonte.it/sites/default/files/styles/anteprima_galleria/public/sedi-mense-universitarie-immagini/castelfidardo/castelfidardo%205.jpg?itok=Zbb4GXkk",
    isPublished: true,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-1 px-1">
        <h2 className="text-display font-bold text-text tracking-tight">Locations</h2>
        <p className="text-body-sm text-text-muted font-semibold uppercase tracking-widest">Pick a canteen</p>
      </div>

      <div className="flex flex-col gap-8">
        {mensas.map((mensa) => (
          <div
            key={mensa.id}
            className={`w-full transition-all duration-200 ${mensa.isPublished ? "active:scale-[0.98]" : "opacity-60"}`}
          >
            {mensa.isPublished ? (
              <Link to={`/mensa/${mensa.id}`} className="block group">
                <MensaCardContent mensa={mensa} />
              </Link>
            ) : (
              <div className="block cursor-not-allowed">
                <MensaCardContent mensa={mensa} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MensaCardContent({ mensa }: { mensa: Mensa }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-44 w-full rounded-4xl overflow-hidden shadow-sm">
        <img
          src={mensa.image}
          alt={mensa.name}
          className={`w-full h-full object-cover ${!mensa.isPublished && 'grayscale'}`}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
      </div>
      
      <div className="flex flex-row items-center justify-between px-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-h1 font-bold text-text tracking-tight">{mensa.name}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            {mensa.isPublished ? (
              <div className="flex items-center gap-1.5 text-green-600">
                <FileText className="w-3.5 h-3.5" />
                <span className="text-body-sm font-black uppercase tracking-widest">Menu Available</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-text-muted">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-body-sm font-bold uppercase tracking-widest italic">Not Published Yet</span>
              </div>
            )}
          </div>
        </div>
        
        {mensa.isPublished && (
          <div className="bg-brand w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20 group-active:translate-x-1 transition-transform">
            <ChevronRight className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
