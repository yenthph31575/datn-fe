import React, { useMemo } from 'react';
import Select, { type Props as StateManagerProps } from 'react-select';

interface IData {
  label: React.ReactNode;
  value: string;
  image?: string;
  group?: string;
}

export type SelectCustomProps = {
  height?: string | number;
  data?: IData[];
  onChange?: (data: IData) => void;
  onChangeValue?: (value: string) => void;
  isError?: boolean;
} & Omit<StateManagerProps, 'options' | 'onChange'>;

const SelectCustom = ({ isError, value, defaultValue, onChangeValue, onChange, data = [], maxMenuHeight, ...props }: SelectCustomProps) => {
  const _value: any = useMemo(() => {
    if (!value || !data) return null;
    // eslint-disable-next-line consistent-return
    return data.find((x) => x.value === value) || null;
  }, [value, data]);

  const _defaultValue: any = useMemo(() => {
    if (!defaultValue || !data) return null;
    // eslint-disable-next-line consistent-return
    return data.find((x) => x.value === defaultValue) || null;
  }, [defaultValue, data]);

  return (
    <Select
      openMenuOnClick
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          height: props.height || '42px',
          minHeight: '36px !important',
          fontSize: '14px',
          backgroundColor: '#ffffff !important',
          borderColor: isError ? '#E0384B' : state.isFocused ? '#00A061 !important' : '#FFFFFF26 !important',
          boxShadow: isError
            ? '0px 0px 0px 4px #E0384B40'
            : state.isFocused
              ? '0px 0px 0px 4px #38E09640 !important'
              : '0px 1px 2px 0px #1018280D !important',
          borderRadius: '8px',
          overflow: 'hidden',
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          borderRadius: '8px',
          overflow: 'hidden',
        }),
        menuList: (baseStyles) => ({
          ...baseStyles,
          maxHeight: maxMenuHeight ? `${maxMenuHeight}px !important` : undefined,
        }),
        singleValue: (baseStyles, state) => ({
          ...baseStyles,
          color: '#333333 !important',
        }),
        indicatorSeparator: (baseStyles, state) => ({
          display: 'none',
        }),
        placeholder: (defaultStyles) => {
          return {
            ...defaultStyles,
            fontSize: '14px',
            fontWeight: 400,
            color: '#8a5136',
          };
        },
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          primary25: '#dfcea8',
          primary: '#8a5136',
        },
      })}
      {...props}
      options={data}
      value={_value}
      defaultValue={_defaultValue}
      onChange={(e: any) => {
        onChange?.(e);
        onChangeValue?.(e?.value || '');
      }}
    />
  );
};
export default SelectCustom;
