import { ChevronRight, Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router";
import LanguageSelector from "~/components/language-selector";

interface Mensa {
  id: string;
  name: string;
  image: string;
  status: string;
  isPublished: boolean;
}

const mensas: Mensa[] = [
  {
    id: "castelfidardo",
    name: "Castelfidardo",
    image: "https://www.edisu.piemonte.it/sites/default/files/styles/anteprima_galleria/public/sedi-mense-universitarie-immagini/castelfidardo/castelfidardo%205.jpg?itok=Zbb4GXkk",
    status: "Open until 15:00",
    isPublished: true,
  },
  {
    id: "borsellino",
    name: "Borsellino",
    image: "https://www.edisu.piemonte.it/sites/default/files/styles/anteprima_galleria/public/sedi-mense-universitarie-immagini/castelfidardo/castelfidardo%205.jpg?itok=Zbb4GXkk",
    status: "Open until 14:30",
    isPublished: true,
  },
  {
    id: "agnelli",
    name: "Agnelli",
    image: "https://www.edisu.piemonte.it/sites/default/files/styles/anteprima_galleria/public/sedi-mense-universitarie-immagini/castelfidardo/castelfidardo%205.jpg?itok=Zbb4GXkk",
    status: "Closed",
    isPublished: false,
  },
  {
    id: "galliari",
    name: "Galliari",
    image: "https://www.edisu.piemonte.it/sites/default/files/styles/anteprima_galleria/public/sedi-mense-universitarie-immagini/castelfidardo/castelfidardo%205.jpg?itok=Zbb4GXkk",
    status: "Open until 14:30",
    isPublished: true,
  },
  {
    id: "villa-claretta",
    name: "Villa Claretta",
    image: "https://www.edisu.piemonte.it/sites/default/files/styles/anteprima_galleria/public/sedi-mense-universitarie-immagini/castelfidardo/castelfidardo%205.jpg?itok=Zbb4GXkk",
    status: "Closed",
    isPublished: false,
  },
  {
    id: "principi-acaja",
    name: "Principi d'Acaja",
    image: "https://www.edisu.piemonte.it/sites/default/files/styles/anteprima_galleria/public/sedi-mense-universitarie-immagini/castelfidardo/castelfidardo%205.jpg?itok=Zbb4GXkk",
    status: "Open until 15:00",
    isPublished: true,
  },
  {
    id: "pracchiardo",
    name: "Pracchiardo",
    image: "https://www.edisu.piemonte.it/sites/default/files/styles/anteprima_galleria/public/sedi-mense-universitarie-immagini/castelfidardo/castelfidardo%205.jpg?itok=Zbb4GXkk",
    status: "Open until 14:30",
    isPublished: true,
  },
];

export default function Home() {
  return (
    <main className="w-full h-full max-w-md mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-row items-center justify-between mb-8">
        <h1 className="text-display font-bold text-text">Choose your Mensa</h1>
        <LanguageSelector />
      </div>

      <div className="flex flex-col gap-4">
        {mensas.map((mensa) => (
          <div
            key={mensa.id}
            className={`relative w-full rounded-2xl overflow-hidden shadow-sm transition-all duration-200 
              ${mensa.isPublished ? "active:scale-[0.98] cursor-pointer" : "opacity-60 grayscale-[0.5]"}
            `}
          >
            {mensa.isPublished ? (
              <Link to={`/mensa/${mensa.id}`} className="block">
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
    </main>
  );
}

function MensaCardContent({ mensa }: { mensa: Mensa }) {
  return (
    <>
      <div className="relative h-32 w-full">
        <img
          src={mensa.image}
          alt={mensa.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10 flex items-end p-4">
          <div className="w-full flex items-end justify-between">
            <div>
              <h2 className="text-white font-bold text-h1">{mensa.name}</h2>
              <div className="flex items-center gap-2 text-white/90 text-body mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{mensa.status}</span>
              </div>
            </div>
            {mensa.isPublished ? (
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="bg-brand/80 px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-white" />
                <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                  Menu not published
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
