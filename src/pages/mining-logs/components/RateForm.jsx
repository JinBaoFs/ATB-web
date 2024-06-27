import { Form, Input } from 'antd';
const RateForm = () => {
  return (
    <>
      <Form.Item label='利率' name='rate'>
        <Input type="number" placeholder='请输入利率' />
      </Form.Item>
      <Form.Item label='质押金额' name='PledgeAmount'>
        <Input type="number" placeholder='请输入质押金额' />
      </Form.Item>
    </>
  );
};

export default RateForm;
