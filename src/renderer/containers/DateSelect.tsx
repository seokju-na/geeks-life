import { css } from '@emotion/core';
import { isAfter, isSameDay, isToday } from 'date-fns';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Composite, CompositeGroup, useCompositeState } from 'reakit';
import {
  CalendarDay,
  dateFormattings,
  dateParsing,
  getCalendarMonth,
  getCalendarWeek,
} from '../../core';
import { selectForeground, styled } from '../colors/theming';
import { ButtonToggle, ButtonToggleGroup } from '../components/ButtonToggle';
import DateSelectDayItem from '../components/DateSelectDayItem';
import { actions } from '../store/actions';
import { selectors } from '../store/selectors';
import { DateDisplayType, dateDisplayTypes, getDateDisplayTypeName, State } from '../store/state';

const dateDisplayTypeOptions = dateDisplayTypes.map((type) => ({
  name: getDateDisplayTypeName(type),
  value: type,
}));

const isFuture = (date: Date) => {
  return !isToday(date) && isAfter(date, new Date());
};

const MonthView = React.memo(
  (props: {
    date: string;
    monthlyLives: State['monthlyLives'];
    onDayClick(day: CalendarDay): void;
  }) => {
    const { date, monthlyLives, onDayClick } = props;

    const composite = useCompositeState({
      loop: true,
      currentId: date,
    });

    const parsedDate = useMemo(() => dateParsing['yyyy-MM-dd'](date), [date]);
    const month = useMemo(() => getCalendarMonth(parsedDate), [parsedDate]);
    const isSelectedDate = useCallback((day: CalendarDay) => isSameDay(parsedDate, day.date), [
      parsedDate,
    ]);

    return (
      <Composite {...composite} role="grid" aria-label="Month Navigation" css={gridCss}>
        {month.weeks.map((week, i) => (
          <CompositeGroup key={i} {...composite} role="row" css={rowCss}>
            {week.days.map((day, j) => {
              const id = dateFormattings['yyyy-MM-dd'](day.date);
              const future = isFuture(day.date);

              return (
                <DateSelectDayItem
                  {...composite}
                  key={id}
                  id={id}
                  aria-label=""
                  scoreLevel={monthlyLives?.[i][j]?.score}
                  selected={isSelectedDate(day)}
                  onClick={() => onDayClick?.(day)}
                  disabled={future || monthlyLives == null}
                  css={cellCss}
                />
              );
            })}
          </CompositeGroup>
        ))}
      </Composite>
    );
  },
);

const WeekView = React.memo(
  (props: {
    date: string;
    weeklyLives: State['weeklyLives'];
    onDayClick(day: CalendarDay): void;
  }) => {
    const { date, weeklyLives, onDayClick } = props;

    const composite = useCompositeState({
      loop: true,
      currentId: date,
    });

    const parsedDate = useMemo(() => dateParsing['yyyy-MM-dd'](date), [date]);
    const week = useMemo(() => getCalendarWeek(parsedDate), [parsedDate]);
    const isSelectedDate = useCallback((day: CalendarDay) => isSameDay(parsedDate, day.date), [
      parsedDate,
    ]);

    return (
      <Composite {...composite} role="grid" aria-label="Week Navigation" css={gridCss}>
        <CompositeGroup {...composite} role="row" css={rowCss}>
          {week.days.map((day, index) => {
            const id = dateFormattings['yyyy-MM-dd'](day.date);
            const future = isFuture(day.date);

            return (
              <DateSelectDayItem
                {...composite}
                key={id}
                id={id}
                aria-label=""
                scoreLevel={weeklyLives?.[index]?.score}
                selected={isSelectedDate(day)}
                onClick={() => onDayClick?.(day)}
                disabled={future || weeklyLives == null}
                css={cellCss}
              />
            );
          })}
        </CompositeGroup>
      </Composite>
    );
  },
);

export default function DateSelect() {
  const dispatch = useDispatch();
  const date = useSelector(selectors.date);
  const dateAsFormatted = useSelector(selectors.dateAsFormatted);
  const dateDisplayType = useSelector(selectors.dateDisplayType);
  const weeklyLives = useSelector(selectors.weeklyLives);
  const monthlyLives = useSelector(selectors.monthlyLives);

  const handleDateDisplayTypeChange = useCallback(
    (value: DateDisplayType) => {
      dispatch(actions.changeDateDisplayType({ value }));
    },
    [dispatch],
  );

  const handleDayClick = useCallback(
    (day: CalendarDay) => {
      dispatch(actions.changeDate({ date: day.date }));
    },
    [dispatch],
  );

  const content = useMemo(() => {
    switch (dateDisplayType) {
      case DateDisplayType.Weekly:
        return <WeekView date={date} weeklyLives={weeklyLives} onDayClick={handleDayClick} />;
      case DateDisplayType.Monthly:
        return <MonthView date={date} monthlyLives={monthlyLives} onDayClick={handleDayClick} />;
    }
  }, [dateDisplayType, date, handleDayClick, weeklyLives, monthlyLives]);

  return (
    <Wrapper>
      <Top>
        <Title>{dateAsFormatted}</Title>
        <ButtonToggleGroup
          name="date-display-type"
          aria-label="Date Display Type"
          size="small"
          value={dateDisplayType}
          onChange={handleDateDisplayTypeChange}
        >
          {dateDisplayTypeOptions.map((option) => (
            <ButtonToggle key={option.value} value={option.value}>
              {option.name}
            </ButtonToggle>
          ))}
        </ButtonToggleGroup>
      </Top>
      <Content>{content}</Content>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  border-bottom: 1px solid ${selectForeground('divider')};
`;

const Top = styled.div`
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  //noinspection CssUnknownProperty
  -webkit-app-region: drag;
`;

const Title = styled.h1`
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
`;

const Content = styled.div`
  padding: 4px 12px 12px 12px;
`;

const gridCss = css`
  margin: -4px;
`;

const rowCss = css`
  display: flex;
  align-items: center;
`;

const cellCss = css`
  flex: 1 1 auto;
  margin: 4px;
`;
