import { css } from '@emotion/core';
import { useObservable, useSubscription } from 'observable-hooks';
import React, { forwardRef, HTMLProps, useCallback, useState } from 'react';
import { Observable, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, finalize, map, share, switchMap } from 'rxjs/operators';
import { useTheme } from '../colors/theming';
import { coerceCssPixelValue } from '../utils/coercion';

export type IconColor = 'primary' | 'default';

export interface IconProps
  extends Omit<HTMLProps<HTMLElement>, 'name' | 'size' | 'color' | 'children'> {
  name: string;
  size?: number | string;
  color?: IconColor;
  children?: never;
}

export const Icon = forwardRef<HTMLElement, IconProps>(
  ({ name, size = '1em', color = 'default', ...props }, ref) => {
    const theme = useTheme();
    const source$ = useIconSource(name);
    const [html, setHtml] = useState('');

    const handleSource = useCallback(
      (data: string | null | undefined) => {
        if (data == null) {
          return;
        }

        const svg = new DOMParser().parseFromString(data, 'image/svg+xml');

        svg.documentElement.setAttribute(
          'stroke',
          color === 'primary' ? theme.primary['500'] : 'currentColor',
        );

        setHtml(svg.documentElement.outerHTML);
      },
      [theme, color],
    );

    useSubscription(source$, handleSource);

    return (
      <i
        ref={ref}
        css={css`
          display: inline-flex;
          width: ${coerceCssPixelValue(size)};
          height: ${coerceCssPixelValue(size)};

          > svg {
            width: 100%;
            height: 100%;
          }
        `}
        {...props}
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    );
  },
);

const iconSources = new Map<string, string>();
const iconRequests: Record<string, Observable<string | null> | undefined> = {};

export function useIconSource(name: string) {
  return useObservable(
    (input$) =>
      input$.pipe(
        switchMap(([name]) => {
          if (iconSources.has(name)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return of(iconSources.get(name)!);
          } else if (iconRequests[name] != null) {
            return iconRequests[name] as Observable<string | null>;
          }

          const request = ajax({
            url: `../assets/icons/${name}.svg`,
            method: 'GET',
            headers: {
              Accept: 'image/svg+xml',
            },
            responseType: 'text',
          }).pipe(
            map((response) => response.response),
            catchError(() => of(null)),
            share(),
            finalize(() => {
              iconRequests[name] = undefined;
            }),
          );

          iconRequests[name] = request;

          return request;
        }),
      ),
    [name] as const,
  );
}
