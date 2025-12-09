import "./skeleton.css";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" className={className} {...props} />;
}

export { Skeleton };
