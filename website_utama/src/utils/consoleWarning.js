// --------------------------------------------------
// CONFIGURATION & INITIALIZATION FLAG
// --------------------------------------------------
let initialized = false;

// --------------------------------------------------
// AUTOMATIC THEME DETECTION
// --------------------------------------------------
const isDark = typeof window !== "undefined" && 
  window.matchMedia && 
  window.matchMedia("(prefers-color-scheme: dark)").matches;

// --------------------------------------------------
// PALETTE SELECTION
// --------------------------------------------------
const palette = isDark ? {
  primary: "#5865F2",
  danger: "#ED4245",
  warning: "#FEE75C",
  text: "#F2F3F5",
  secondary: "#B5BAC1"
} : {
  primary: "#5865F2",
  danger: "#D83A42",
  warning: "#B77900",
  text: "#202225",
  secondary: "#4F5660"
};

// --------------------------------------------------
// STYLES DEFINITION (Discord-inspired Adaptive Theme)
// --------------------------------------------------
const styles = {
  logo: `color: ${palette.primary}; font-family: monospace; font-weight: bold; line-height: 1.2;`,
  logoSub: `color: ${palette.secondary}; font-family: monospace; font-size: 14px; font-weight: bold; letter-spacing: 0.25em;`,
  
  // Headers with solid contrasting backgrounds to guarantee high contrast & readability
  header: `background-color: ${palette.danger}; color: #FFFFFF; font-size: 28px; font-weight: 900; font-family: sans-serif; text-transform: uppercase; padding: 6px 12px; border-radius: 4px; display: inline-block;`,
  subtitle: `background-color: ${palette.primary}; color: #FFFFFF; font-size: 13px; font-weight: bold; font-family: sans-serif; letter-spacing: 0.15em; padding: 4px 8px; border-radius: 2px; margin-top: 6px; display: inline-block;`,
  
  // Warning Alert block (Yellow background + Dark Gray text)
  warning: `background-color: ${palette.warning}; color: #202225; font-size: 15px; font-weight: bold; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.05em; padding: 4px 8px; border-radius: 2px; display: inline-block;`,
  
  textBold: `color: ${palette.text}; font-size: 13px; font-weight: bold; font-family: sans-serif; line-height: 1.6;`,
  textNormal: `color: ${palette.secondary}; font-size: 13px; font-family: sans-serif; line-height: 1.6;`,
  bullet: `color: ${palette.danger}; font-size: 13px; font-weight: bold; font-family: sans-serif;`,
  bulletText: `color: ${palette.text}; font-size: 13px; font-weight: bold; font-family: sans-serif;`,
  
  divider: `color: ${palette.primary}; font-size: 12px; font-weight: bold; font-family: monospace; padding: 6px 0;`,
  footerHeading: `color: ${palette.text}; font-size: 12px; font-weight: 900; font-family: sans-serif; letter-spacing: 0.2em; text-transform: uppercase;`,
  footerSub: `color: ${palette.secondary}; font-size: 11px; font-weight: bold; font-family: sans-serif; letter-spacing: 0.08em; padding-top: 2px;`,
  footerNotice: `color: ${palette.primary}; font-size: 10px; font-family: sans-serif; font-style: italic; padding-top: 4px;`
};

// --------------------------------------------------
// ASCII LOGO ART
// --------------------------------------------------
const asciiLogo = `
 ██████╗ ███╗   ██╗███████╗
██╔═══██╗████╗  ██║██╔════╝
██║   ██║██╔██╗ ██║█████╗  
██║   ██║██║╚██╗██║██╔══╝  
╚██████╔╝██║ ╚████║███████╗
 ╚═════╝ ╚═╝  ╚═══╝╚══════╝

███████╗██╗   ██╗███████╗
██╔════╝╚██╗ ██╔╝██╔════╝
█████╗   ╚████╔╝ █████╗  
██╔══╝    ╚██╔╝  ██╔══╝  
███████╗   ██║   ███████╗
╚══════╝   ╚═╝   ╚══════╝
`;

// --------------------------------------------------
// INITIALIZATION FUNCTION
// --------------------------------------------------
export function initializeConsoleWarning() {
  // Prevent duplicate execution (e.g., in React StrictMode development mounts)
  if (initialized) return;
  initialized = true;

  // Clear console to present warning standalone and cleanly
  console.clear();

  // Print ASCII Logo
  console.log(`%c${asciiLogo}`, styles.logo);
  console.log("%c            PASKUS - 791", styles.logoSub);
  console.log("\n");

  // Print Large Header & Subtitle
  console.log("%cSECURITY WARNING", styles.header);
  console.log("\n%cONE EYE SECURITY SYSTEM", styles.subtitle);
  console.log("\n");

  // Print Warning Message Details
  console.log("%c⚠ SECURITY WARNING", styles.warning);
  console.log(
    "\n%cThis console is intended for developers and system administrators only.",
    styles.textBold
  );
  console.log(
    "%cDo NOT paste, execute, or modify any code inside this console unless you fully understand what it does.",
    styles.textNormal
  );
  console.log("\n");

  console.log(
    "%cAttackers frequently use social engineering techniques to trick users into running malicious JavaScript that can compromise:",
    styles.textNormal
  );
  console.log("%c  • %cRoblox Accounts", styles.bullet, styles.bulletText);
  console.log("%c  • %cDiscord Accounts", styles.bullet, styles.bulletText);
  console.log("%c  • %cAuthentication Tokens", styles.bullet, styles.bulletText);
  console.log("%c  • %cLogin Sessions", styles.bullet, styles.bulletText);
  console.log("%c  • %cPersonal Information", styles.bullet, styles.bulletText);
  console.log("\n");

  console.log(
    "%cIf someone instructs you to open Developer Tools (F12) and paste code into the Console, %cstop immediately %cand verify the request through official PASKUS - 791 staff.",
    styles.textNormal,
    styles.textBold,
    styles.textNormal
  );
  console.log(
    "%cNever execute code received from strangers.",
    styles.textBold
  );
  console.log("\n");

  // Print Divider & Footer Information
  console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", styles.divider);
  console.log("%cSILERE IMPETUM", styles.footerHeading);
  console.log("%cONE EYE • PASKUS - 791", styles.footerSub);
  console.log("%cDeveloper Console Security Notice", styles.footerNotice);
}
