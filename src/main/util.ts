import fileUrl from 'file-url';
import path from 'path';

export function encodePathAsUrl(...pathSegments: string[]) {
  const resolvedPath = path.resolve(...pathSegments);

  return fileUrl(resolvedPath);
}
