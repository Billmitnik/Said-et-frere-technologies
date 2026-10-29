type BrandProps = {
  href: string;
  label: string;
};

export function Brand({ href, label }: BrandProps) {
  return (
    <a className="brand" href={href} aria-label={label}>
      <span className="brand-mark" aria-hidden="true">S<span>+</span></span>
      <span className="brand-name">
        SAID <span>&amp; FRÈRES</span><small>TECHNOLOGIES</small>
      </span>
    </a>
  );
}
