interface ContactFormBlockProps {
  data: {
    heading?: string;
    description?: string;
    fields?: Array<{ label: string; type: string; required: boolean }>;
    submitText?: string;
  };
}

export function ContactFormBlock({ data }: ContactFormBlockProps) {
  const {
    heading = "Contact Us",
    description,
    fields = [
      { label: "Name", type: "text", required: true },
      { label: "Email", type: "email", required: true },
      { label: "Message", type: "textarea", required: true },
    ],
    submitText = "Send Message",
  } = data;

  return (
    <div className="max-w-lg mx-auto">
      {heading && <h3 className="text-xl font-bold mb-1">{heading}</h3>}
      {description && <p className="text-muted-foreground mb-4">{description}</p>}
      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        {fields.map((field, i) => (
          <div key={i}>
            <label className="text-sm font-semibold block mb-1">
              {field.label}
              {field.required && <span className="text-destructive ml-0.5">*</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea className="w-full h-24 px-3 py-2 border rounded-md" placeholder={`Your ${field.label.toLowerCase()}`} />
            ) : (
              <input type={field.type} className="w-full h-10 px-3 border rounded-md" placeholder={`Your ${field.label.toLowerCase()}`} />
            )}
          </div>
        ))}
        <button type="submit" className="w-full h-10 bg-primary text-primary-foreground rounded-md font-medium">
          {submitText}
        </button>
      </form>
    </div>
  );
}
