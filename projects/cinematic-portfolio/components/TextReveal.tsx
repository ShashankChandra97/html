type TextRevealProps = {
  as?: "h1" | "h2" | "h3" | "p";
  children: string;
  className?: string;
  label?: string;
};

export function TextReveal({
  as: Tag = "h2",
  children,
  className = "",
  label,
}: TextRevealProps) {
  return (
    <Tag className={`text-reveal ${className}`} aria-label={label ?? children}>
      {children.split(" ").map((word, index) => (
        <span className="word-mask" aria-hidden="true" key={`${word}-${index}`}>
          <span className="reveal-word">{word}</span>
        </span>
      ))}
    </Tag>
  );
}
