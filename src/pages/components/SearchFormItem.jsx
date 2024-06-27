import { Input, Select, DatePicker, Form } from 'antd';
import { SearchFormItemEnum } from '../../enum';
import { formItemMap } from '../../data';
const { RangePicker } = DatePicker;

const SearchFormItem = ({ controlType = SearchFormItemEnum.USER_ADDRESS }) => {
  const { name, label, placeholder, options } = formItemMap[controlType];
  if (inputControl.includes(controlType)) {
    return (
      <ControlWrap name={name} label={label}>
        <Input addonBefore={label} placeholder={placeholder ? placeholder : `请输入${label}`} allowClear />
      </ControlWrap>
    );
  } else if (selectControl.includes(controlType)) {
    return (
      <ControlWrap name={name} label={label}>
        <Select
          options={options}
          placeholder={placeholder ? placeholder : `请选择${label}`}
          allowClear
        />
      </ControlWrap>
    );
  } else {
    return (
      <ControlWrap name={name} label={label}>
        <RangePicker
          placeholder={['开始日期','结束日期']}
        />
      </ControlWrap>
    );
  }
};

export default SearchFormItem;

const ControlWrap = ({ name, label, children }) => {
  return (
    <Form.Item name={name} className='!mb-4 width300'>
      {children}
    </Form.Item>
  );
};
const inputControl = [
  SearchFormItemEnum.USER_ADDRESS,
  SearchFormItemEnum.PROXY,
  SearchFormItemEnum.ID,
  SearchFormItemEnum.NID,
  SearchFormItemEnum.PROXY_ACCOUNT,
  SearchFormItemEnum.CLIENT_DOMAIN,
  SearchFormItemEnum.ASSETS_NAME,
  SearchFormItemEnum.TITLE,
  SearchFormItemEnum.DOMAIN,
  SearchFormItemEnum.ACCOUNT_NO
];

const selectControl = [
  SearchFormItemEnum.AUTH_STATUS,
  SearchFormItemEnum.SORT_BY,
  SearchFormItemEnum.MINING_TYPE,
  SearchFormItemEnum.COLLECT_STATUS,
  SearchFormItemEnum.CHAIN_TYPE,
  SearchFormItemEnum.STATUS,
  SearchFormItemEnum.ASSETS_TYPE,
  SearchFormItemEnum.CASH_FLOW_TYPE,
  SearchFormItemEnum.DIVIDEND_TYPE,
  SearchFormItemEnum.COIN_NAME,
  SearchFormItemEnum.WITHDRAW_STATUS,
  SearchFormItemEnum.SETTLE_STATUS,
  SearchFormItemEnum.DOMAIN_STATUS,
  SearchFormItemEnum.USER_TYPE
];

export const getSelectLabel = (field, value) => {
  const { options } = formItemMap[field];
  if (!options) {
    return '';
  }

  return options.find((item) => item.value === value)?.label ?? '';
};
