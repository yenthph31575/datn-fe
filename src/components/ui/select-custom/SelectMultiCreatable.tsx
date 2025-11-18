import React, { useMemo, useState } from 'react';
import type { Props as StateManagerProps } from 'react-select';
import CreatableSelect from 'react-select/creatable';

interface IData {
  label: string;
  value: string;
  image?: string;
  group?: string;
}

export type SelectMultiCreatableProps = {
  value?: string[];
  height?: string | number;
  data?: IData[];
  onChange?: (data: IData[]) => void;
  onValueChange?: (value: string[]) => void;
} & Omit<StateManagerProps, 'options' | 'onChange' | 'value'>;

const SelectMultiCreatable = ({ value, defaultValue, onValueChange, onChange, data = [], ...props }: SelectMultiCreatableProps) => {
  const [options, setOptions] = useState(data);

  const handleCreateItem = (newValue: string) => {
    const newOptions = [...options, { label: newValue, value: newValue }];
    onValueChange?.(newOptions.map((x: IData) => x.value) || []);
    setOptions(newOptions);
  };

  const _value = useMemo(() => {
    if (!value || !options) return [];

    const optionsMap = new Map(options.map((item) => [item.value, item]));

    const matchedValues = value.map((v) => optionsMap.get(v)).filter(Boolean);

    const unmatchedValues = value.filter((v) => !optionsMap.has(v));

    if (unmatchedValues.length > 0) {
      const newOptions = unmatchedValues.map((v) => ({
        label: v,
        value: v,
      }));
      setOptions((prevOptions) => [...prevOptions, ...newOptions]);
      return [...matchedValues, ...newOptions];
    }

    return matchedValues;
  }, [value, options]);

  return (
    <CreatableSelect
      openMenuOnClick
      isMulti
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          height: props.height || '42px',
          minHeight: '36px !important',
          fontSize: '14px',
          backgroundColor: '#FAFAFA26 !important',
          borderColor: state.isFocused ? '#00A061 !important' : 'var(--input)',
          boxShadow: state.isFocused ? '0px 0px 0px 4px #38E09640 !important' : '',
          borderRadius: '4px',
          overflow: 'hidden',
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          borderRadius: '8px',
          overflow: 'hidden',
        }),
        indicatorSeparator: (baseStyles, state) => ({
          display: 'none',
        }),
        multiValue: (baseStyles, state) => ({
          ...baseStyles,
          overflow: 'hidden',
          maxWidth: '400px',
          display: ' flex',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': 1,
        }),
        placeholder: (defaultStyles) => {
          return {
            ...defaultStyles,
            fontSize: '14px',
            fontWeight: 400,
            color: '#AAB0BB',
          };
        },
        indicatorsContainer: (baseStyles, state) => ({
          ...baseStyles,

          '& > div:first-of-type': {
            padding: '8px 4px',
          },
        }),
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          primary25: '#6AA65B',
          primary: '#38761D',
        },
      })}
      {...props}
      options={options}
      isClearable
      value={_value}
      onChange={(e: any) => {
        onChange?.(e);
        onValueChange?.(e.map((x: IData) => x.value) || []);
      }}
      // onCreateOption={handleCreateItem}
    />
  );
};
export default SelectMultiCreatable;
