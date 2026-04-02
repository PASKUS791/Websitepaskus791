function IconShell({ children, className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function resolveIconKey(category) {
  if (category?.iconKey) {
    return category.iconKey;
  }

  const lookup = `${category?.icon ?? ""} ${category?.name ?? ""}`.toLowerCase();

  if (lookup.includes("outpost")) {
    return "hostile-outpost";
  }
  if (lookup.includes("objective")) {
    return "objective";
  }
  if (lookup.includes("anti-air") || lookup.includes("mortar") || lookup.includes("warning")) {
    return "anti-air";
  }
  if (lookup.includes("resource")) {
    return "resources";
  }
  if (lookup.includes("friendly")) {
    return "friendly";
  }
  if (lookup.includes("bunker")) {
    return "bunker";
  }
  if (lookup.includes("hostile")) {
    return "hostile-location";
  }

  return null;
}

export function MarkerCategoryGlyph({
  category,
  fallbackText = "?",
  className = "h-4 w-4",
}) {
  const iconKey = resolveIconKey(category);

  if (iconKey === "hostile-location") {
    return (
      <IconShell className={className}>
        <path d="M10 2.5 17 6v8L10 17.5 3 14V6L10 2.5Z" />
        <path d="M10 6v8" />
        <path d="M6.5 8h7" />
      </IconShell>
    );
  }

  if (iconKey === "hostile-outpost") {
    return (
      <IconShell className={className}>
        <path d="M4 16V6.5L10 4l6 2.5V16" />
        <path d="M4 16h12" />
        <path d="M7.5 9.5h5" />
        <path d="M10 6.5v6" />
      </IconShell>
    );
  }

  if (iconKey === "objective") {
    return (
      <IconShell className={className}>
        <circle cx="10" cy="10" r="6.2" />
        <circle cx="10" cy="10" r="2.3" />
        <path d="M10 3v2.2" />
        <path d="M10 14.8V17" />
        <path d="M3 10h2.2" />
        <path d="M14.8 10H17" />
      </IconShell>
    );
  }

  if (iconKey === "anti-air") {
    return (
      <IconShell className={className}>
        <path d="M10 2.8 17 15H3L10 2.8Z" />
        <path d="M10 7v3.9" />
        <circle cx="10" cy="13.2" r="0.65" fill="currentColor" stroke="none" />
      </IconShell>
    );
  }

  if (iconKey === "resources") {
    return (
      <IconShell className={className}>
        <path d="M4 7.5 10 4l6 3.5-6 3L4 7.5Z" />
        <path d="M4 7.5V13l6 3 6-3V7.5" />
        <path d="M10 10.5V16" />
      </IconShell>
    );
  }

  if (iconKey === "friendly") {
    return (
      <IconShell className={className}>
        <path d="M10 3.5 15.5 6v4.2c0 3.1-2 5.5-5.5 6.8-3.5-1.3-5.5-3.7-5.5-6.8V6L10 3.5Z" />
        <path d="m7.2 10.1 1.8 1.8 3.8-4" />
      </IconShell>
    );
  }

  if (iconKey === "bunker") {
    return (
      <IconShell className={className}>
        <path d="M3.5 12.5 10 5l6.5 7.5" />
        <path d="M5.5 12.5V16h9v-3.5" />
        <path d="M8 16v-3.2h4V16" />
      </IconShell>
    );
  }

  return (
    <span className={`grid place-items-center font-bold uppercase ${className}`}>
      {fallbackText}
    </span>
  );
}
