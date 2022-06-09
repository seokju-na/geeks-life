interface Props<Case extends string> {
  value: Case;
  caseBy: Record<Case, JSX.Element | null>;
}

export function Switch<Case extends string>({ value, caseBy }: Props<Case>) {
  return <>{caseBy[value]}</>;
}
