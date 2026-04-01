interface SectionTitleProps {
  title: string;
  className?: string;
}

export default function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="w-full">
      <div className="divider divider-start before:bg-brand after:bg-brand text-brand text-h2 font-bold tracking-widest opacity-90">
        {title}
      </div>
    </div>
  );
}
