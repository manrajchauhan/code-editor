import React from 'react';
import {
  FileText,
  Terminal as TerminalIcon,
  Settings as SettingsIcon,
  Database,
  Image as ImageIcon,
  FileCode,
} from 'lucide-react';

interface FileIconProps {
  fileName: string;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ fileName, className = 'w-4 h-4 shrink-0' }) => {
  if (!fileName) return <FileText className={`${className} text-text-subtle`} />;

  const parts = fileName.split('.');
  const ext = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : fileName.toLowerCase();

  // 1. TypeScript (.ts)
  if (ext === 'ts') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path d="M11.5 15.5H10v-7H6.5V7h7v1.5H11.5v7zm6.5-1.3c-.4.6-1.1.9-2.1.9-1.3 0-2.2-.6-2.6-1.7l1.3-.6c.2.6.7.9 1.3.9.6 0 1-.2 1-.6 0-.3-.2-.5-.8-.7l-.9-.3c-1.1-.4-1.6-1-1.6-1.9 0-1.1.9-1.9 2.2-1.9 1.1 0 1.9.4 2.3 1.3l-1.2.7c-.2-.4-.6-.6-1.1-.6-.5 0-.8.2-.8.5 0 .3.2.5.7.6l.8.3c1.2.4 1.7 1 1.7 2.1 0 .6-.2 1.1-.5 1.5z" fill="#FFFFFF" />
      </svg>
    );
  }

  // 2. React TSX (.tsx) & React JSX (.jsx)
  if (ext === 'tsx' || ext === 'jsx') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#20232A" />
        <ellipse cx="12" cy="12" rx="7" ry="3.2" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="7" ry="3.2" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(90 12 12)" />
        <ellipse cx="12" cy="12" rx="7" ry="3.2" stroke="#61DAFB" strokeWidth="1.2" transform="rotate(150 12 12)" />
        <circle cx="12" cy="12" r="1.5" fill="#61DAFB" />
      </svg>
    );
  }

  // 3. JavaScript (.js)
  if (ext === 'js') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path d="M12.8 16.5c.4.7 1 1.1 1.9 1.1 1 0 1.6-.5 1.6-1.6 0-1.1-.6-1.5-1.9-2.1l-.7-.3c-1.8-.8-3-1.8-3-3.8 0-2.1 1.6-3.7 4.1-3.7 1.8 0 3.1.7 3.9 2.2l-1.8 1.1c-.4-.8-1.1-1.2-2.1-1.2-1 0-1.6.5-1.6 1.3 0 .9.5 1.3 1.8 1.8l.7.3c2.2.9 3.3 2 3.3 4.1 0 2.4-1.9 3.9-4.7 3.9-2.5 0-4-1.2-4.7-2.7l1.8-1zm-6.2.2c.4.6.8 1 1.5 1 .7 0 1.2-.4 1.2-1.5V8.5h2.5v7.7c0 2.4-1.4 3.6-3.6 3.6-1.9 0-3.1-.9-3.7-2.3l2.1-1.3z" fill="#000000" />
      </svg>
    );
  }

  // 4. HTML (.html, .htm)
  if (ext === 'html' || ext === 'htm') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M4 3l1.5 17L12 22l6.5-2L20 3H4zm13.4 4.5l-.3 3.3H9.4l.2 2.2h7.3l-.6 6.3-4.3 1.2-4.3-1.2-.3-3.3h2.3l.1 1.4 2.2.6 2.2-.6.2-2.3H7.1L6.4 7.5h11.0z" fill="#E34F26" />
      </svg>
    );
  }

  // 5. CSS (.css, .scss, .sass, .less)
  if (ext === 'css' || ext === 'scss' || ext === 'sass' || ext === 'less') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M4 3l1.5 17L12 22l6.5-2L20 3H4zm13.4 4.5l-.8 9.3-4.6 1.3-4.6-1.3-.3-3.3h2.3l.1 1.4 2.5.7 2.5-.7.3-3.3H7.1L6.8 9.7h10.3l.3-2.2H6.6L6.4 5.3h11.3z" fill="#1572B6" />
      </svg>
    );
  }

  // 6. JSON (.json)
  if (ext === 'json') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#F59E0B" fillOpacity="0.15" />
        <text x="5" y="17" fill="#F59E0B" fontSize="13" fontWeight="bold" fontFamily="monospace">{`{ }`}</text>
      </svg>
    );
  }

  // 7. Python (.py)
  if (ext === 'py') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M11.9 2c-4.8 0-4.5 2.1-4.5 2.1v2.2h4.6v.7H5.6S2 6.6 2 11.4c0 4.8 3.1 4.6 3.1 4.6h1.8v-2.6c0-2.9 2.5-2.7 2.5-2.7h4.4s2.6.1 2.6-2.5V5.5S17 2 11.9 2zm-1.3 1.5c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9c0-.5.4-.9.9-.9z" fill="#3776AB" />
        <path d="M12.1 22c4.8 0 4.5-2.1 4.5-2.1v-2.2h-4.6v-.7h6.3s3.6.4 3.6-4.4c0-4.8-3.1-4.6-3.1-4.6h-1.8v2.6c0 2.9-2.5 2.7-2.5 2.7H10s-2.6-.1-2.6 2.5v2.7s-.5 3.5 4.7 3.5zm1.3-1.5c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9c0 .5-.4.9-.9.9z" fill="#FFD43B" />
      </svg>
    );
  }

  // 8. Rust (.rs)
  if (ext === 'rs') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#DEA584" strokeWidth="2" strokeDasharray="2 2" />
        <path d="M8 8h4.5c1.4 0 2.5.8 2.5 2s-1.1 2-2.5 2H8v-4zm0 4h5l2.5 4H13l-2-3.5H9.5V16H8v-4z" fill="#DEA584" />
      </svg>
    );
  }

  // 9. Go (.go)
  if (ext === 'go') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#00ADD8" />
        <text x="3" y="16" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">GO</text>
      </svg>
    );
  }

  // 10. C / C++ (.c, .cpp, .h, .hpp)
  if (ext === 'c' || ext === 'cpp' || ext === 'h' || ext === 'hpp') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#659AD2" />
        <text x="3" y="16" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">{ext.toUpperCase()}</text>
      </svg>
    );
  }

  // 11. Markdown (.md, .markdown)
  if (ext === 'md' || ext === 'markdown') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#0891B2" fillOpacity="0.15" />
        <path d="M4 6h16v12H4V6zm3 9h2v-4l2 2.5 2-2.5v4h2V9h-2l-2 2.5L9 9H7v6zm10-3h-2v3h2v-3z" fill="#0891B2" />
      </svg>
    );
  }

  // 12. Shell (.sh, .bash, .zsh)
  if (ext === 'sh' || ext === 'bash' || ext === 'zsh') {
    return <TerminalIcon className={`${className} text-emerald-400`} />;
  }

  // 13. SQL (.sql)
  if (ext === 'sql') {
    return <Database className={`${className} text-indigo-400`} />;
  }

  // 14. Config (.yml, .yaml, .toml, .env)
  if (ext === 'yml' || ext === 'yaml' || ext === 'toml' || ext === 'env') {
    return <SettingsIcon className={`${className} text-gray-400`} />;
  }

  // 15. Images (.png, .jpg, .jpeg, .gif, .ico, .svg, .webp)
  if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'ico' || ext === 'svg' || ext === 'webp') {
    return <ImageIcon className={`${className} text-emerald-400`} />;
  }

  // Default File Code Icon
  return <FileCode className={`${className} text-text-subtle`} />;
};
