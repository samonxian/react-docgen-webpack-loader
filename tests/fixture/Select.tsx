import React, { useState, useMemo } from 'react';
import { Select } from 'antd';
import { SelectProps, SelectValue } from 'antd/lib/select';
import { OptionsType, OptionData, OptionGroupData } from 'rc-select/lib/interface';

export interface SelectItemProps extends SelectProps<SelectValue> {
  /**
   * 使用 options 结构代替 Select.Option 组件。
   *
   * 结构为 `{ label, value, options }[]`
   */
  options: OptionsType;
  /**
   * 是否有全选，只有 mode=multiple 和 options 配置的模式才有效
   * 只支持非 optGroup 的。
   */
  hasSelectAll?: boolean;
}

/**
 * 全选 value 值
 */
const ALL_VALUE = '$__all__$';

/**
 * 和原生的 Antd Select 相比多了以下功能：
 *
 * - 支持同时搜索 value 和 label 值
 * - 支持可选的全选功能（这个可能比较鸡肋，业务上有需要用到的地方）
 * - allowClear 默认为 true
 *
 * 所以请使用这个 Select 组替代 Antd.Select 组件。
 */
export default function SelectItem(props: SelectItemProps) {
  const { hasSelectAll, options, allowClear, onChange, mode, labelInValue, children, ...restProps } = props;
  const _hasSelectAll = mode === 'multiple' && hasSelectAll;
  const [isSelectAll, setIsSelectAll] = useState(false);
  const allValues = useMemo(
    () =>
      options
        ?.reduce((acc: (OptionData | OptionGroupData)[], current) => {
          let option = current;

          if (current.options) {
            option = current.options.map((op: OptionData) => op);
          }

          return acc.concat(option);
        }, [])
        .filter(op => {
          if (op.value === ALL_VALUE || op.disabled) {
            return false;
          }
          return true;
        })
        .map(op => op.value) || [],
    [options]
  );
  const lastOptions = useMemo(() => {
    const _options = [...(options || [])];
    if (_hasSelectAll && _options.length > 1) {
      _options.unshift({
        label: isSelectAll ? '取消全选' : '全选',
        value: ALL_VALUE,
      });
    }
    return _options;
  }, [options, _hasSelectAll, isSelectAll]);

  function onChangeEvent(value: SelectValue, option: OptionsType | OptionData | OptionGroupData) {
    let lastValue = value;

    if (_hasSelectAll && !labelInValue) {
      const selectedAllBtn = (value as (string | number)[]).includes(ALL_VALUE);

      if (selectedAllBtn) {
        if (isSelectAll) {
          lastValue = [];
        } else {
          lastValue = allValues;
        }
      }

      setIsSelectAll((lastValue as (string | number)[]).length === allValues.length);
    }
    onChange?.(lastValue, option);
  }

  return (
    <Select
      filterOption={(inputValue, option) => {
        const value = option?.value || option?.id;

        if (value === ALL_VALUE) {
          return true;
        }

        // showSearch=true 才有效，默认是查询 value
        if (option?.children?.toLowerCase().includes(inputValue.toLowerCase())) {
          return true;
        }

        if (String(value).includes(inputValue)) {
          return true;
        }

        return false;
      }}
      allowClear={allowClear}
      onChange={onChangeEvent}
      mode={mode}
      options={lastOptions.length > 0 ? lastOptions : undefined}
      labelInValue={labelInValue}
      {...restProps}
    >
      {children}
    </Select>
  );
}
SelectItem.displayName = 'Select';
SelectItem.defaultProps = {
  hasSelectAll: false,
  allowClear: true,
  labelInValue: false,
};
SelectItem.Option = Select.Option;
SelectItem.OptGroup = Select.OptGroup;
