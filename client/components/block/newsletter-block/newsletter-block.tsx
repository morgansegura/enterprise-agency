interface NewsletterBlockProps {
  data: {
    heading?: string;
    description?: string;
    placeholder?: string;
    buttonText?: string;
    variant?: "inline" | "stacked";
  };
}

export function NewsletterBlock({ data }: NewsletterBlockProps) {
  const { heading = "Subscribe", description, placeholder = "Enter your email", buttonText = "Subscribe", variant = "inline" } = data;

  return (
    <div className="max-w-md mx-auto text-center">
      {heading && <h3 className="text-lg font-bold mb-1">{heading}</h3>}
      {description && <p className="text-muted-foreground mb-4">{description}</p>}
      <form className={variant === "inline" ? "flex gap-2" : "space-y-2"} onSubmit={(e) => e.preventDefault()}>
        <input type="email" className="flex-1 h-10 px-3 border rounded-md" placeholder={placeholder} />
        <button type="submit" className="h-10 px-6 bg-primary text-primary-foreground rounded-md font-medium whitespace-nowrap">{buttonText}</button>
      </form>
    </div>
  );
}
