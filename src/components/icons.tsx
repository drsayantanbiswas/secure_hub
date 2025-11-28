import type { SVGProps } from "react";

export function SecureHubLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect
        x="3"
        y="11"
        width="18"
        height="11"
        rx="2"
        ry="2"
        className="fill-primary/20 stroke-primary"
      ></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4" className="stroke-primary"></path>
    </svg>
  );
}
