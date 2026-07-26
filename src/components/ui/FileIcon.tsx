import React from 'react';
import {
  FileCode,
  FileJson,
  FileText,
  Globe,
  Palette,
  Terminal as TerminalIcon,
  Settings as SettingsIcon,
  Database,
  Image as ImageIcon,
  Cpu,
  Code2,
} from 'lucide-react';

interface FileIconProps {
  fileName: string;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ fileName, className = 'w-3.5 h-3.5 shrink-0' }) => {
  if (!fileName) return <FileText className={`${className} text-text-subtle`} />;

  const parts = fileName.split('.');
  const ext = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : filenameLower(fileName);

  if (ext === 'ts' || ext === 'tsx') {
    return <FileCode className={`${className} text-sky-400`} />;
  }

  if (ext === 'js' || ext === 'jsx') {
    return <FileCode className={`${className} text-amber-400`} />;
  }

  if (ext === 'json') {
    return <FileJson className={`${className} text-yellow-400`} />;
  }

  if (ext === 'css' || ext === 'scss' || ext === 'less' || ext === 'sass') {
    return <Palette className={`${className} text-pink-400`} />;
  }

  if (ext === 'html' || ext === 'htm' || ext === 'svg') {
    return <Globe className={`${className} text-orange-400`} />;
  }

  if (ext === 'md' || ext === 'markdown') {
    return <FileText className={`${className} text-teal-400`} />;
  }

  if (ext === 'rs') {
    return <Cpu className={`${className} text-red-400`} />;
  }

  if (ext === 'py') {
    return <Code2 className={`${className} text-blue-400`} />;
  }

  if (ext === 'go') {
    return <FileCode className={`${className} text-cyan-400`} />;
  }

  if (ext === 'c' || ext === 'cpp' || ext === 'h' || ext === 'hpp') {
    return <Code2 className={`${className} text-purple-400`} />;
  }

  if (ext === 'sql') {
    return <Database className={`${className} text-indigo-400`} />;
  }

  if (ext === 'sh' || ext === 'bash' || ext === 'zsh') {
    return <TerminalIcon className={`${className} text-emerald-400`} />;
  }

  if (ext === 'yml' || ext === 'yaml' || ext === 'toml' || ext === 'env') {
    return <SettingsIcon className={`${className} text-gray-400`} />;
  }

  if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif' || ext === 'ico' || ext === 'webp') {
    return <ImageIcon className={`${className} text-emerald-400`} />;
  }

  return <FileText className={`${className} text-text-subtle`} />;
};

function filenameLower(name: string): string {
  const l = name.toLowerCase();
  if (l === 'dockerfile') return 'dockerfile';
  return '';
}
