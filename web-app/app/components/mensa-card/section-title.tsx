interface SectionTitleProps {
  title: string;
  className?: string;
}

export default function SectionTitle({ title }: SectionTitleProps) {
  return (
    <div className="w-full">
      <div className="divider divider-start text-brand text-h2 font-semibold">
        {title}
      </div>
    </div>
  );
}
