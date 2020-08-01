import { css } from '@emotion/core';
import React, { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { DailyLogCategory, Emoji as EmojiModel } from '../../core/domain';
import { styled } from '../colors/theming';
import { Button } from './Button';
import { Emoji } from './Emoji';
import { FormField, FormFieldInput } from './Form';
import { Icon } from './Icon';
import NativeSelect from './NativeSelect';
import Popover, { PopoverProps } from './Popover';

export interface DailyLogModifyFormValue {
  categoryId: string;
  content: string;
}

type Props = Omit<PopoverProps, 'children' | 'onSubmit'> & {
  categories: DailyLogCategory[];
  emojis: EmojiModel[];
  initialCategoryId?: DailyLogCategory['id'];
  initialLogContent?: string;
  children?: never;
  ctaIcon?: string;
  ctaTitle?: string;
  onSubmit?(formSubmitValue: DailyLogModifyFormValue): void;
};

export default function DailyLogModifyPopover(props: Props) {
  const {
    categories,
    emojis,
    onSubmit,
    initialCategoryId,
    initialLogContent,
    ctaIcon = 'plus',
    ctaTitle = 'Add Log',
    ...popoverProps
  } = props;

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        displayValue: category.title,
      })),
    [categories],
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<DailyLogCategory['id'] | undefined>(
    undefined,
  );
  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
  }, []);

  const [logContent, setLogContent] = useState('');
  const handleLogContextInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setLogContent(event.target.value);
  }, []);

  useEffect(() => {
    if (props.popover.visible) {
      setSelectedCategoryId(initialCategoryId);
      setLogContent(initialLogContent ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.popover.visible]);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (selectedCategoryId == null) {
        return;
      }

      onSubmit?.({ categoryId: selectedCategoryId, content: logContent });
    },
    [selectedCategoryId, logContent, onSubmit],
  );

  return (
    <Popover
      hideOnEsc={true}
      {...popoverProps}
      css={css`
        width: 90vw;
        max-width: 360px;
      `}
    >
      <Form onSubmit={handleSubmit}>
        <NativeSelect
          options={categoryOptions}
          value={selectedCategoryId}
          onChange={handleCategoryChange}
        >
          {(value) => {
            const category = categories.find((category) => category.id === value);
            const emoji = emojis.find((emoji) => emoji.key === category?.emojiKey);

            if (category == null) {
              return 'Not Selected';
            }

            return (
              <>
                {emoji != null ? (
                  <Emoji
                    emoji={emoji}
                    css={css`
                      margin-right: 8px;
                    `}
                  />
                ) : null}
                {category.title}
              </>
            );
          }}
        </NativeSelect>
        <FormField style={{ marginTop: '8px' }}>
          <FormFieldInput
            value={logContent}
            onChange={handleLogContextInput}
            autoComplete="off"
            placeholder="New log"
          />
        </FormField>
        <Button
          type="submit"
          size="small"
          color="primary"
          disabled={selectedCategoryId == null || logContent.trimRight().length === 0}
          style={{ marginTop: '8px' }}
        >
          <Icon name={ctaIcon} aria-hidden={true} />
          {ctaTitle}
        </Button>
      </Form>
    </Popover>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
