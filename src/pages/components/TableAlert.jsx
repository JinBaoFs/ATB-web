import { Alert, Button } from 'antd';
const TableAlert = ({ selectCount = 0, resetRowSelected }) => {
  return (
    <Alert
      message={
        <div>
          已选择{selectCount}项{' '}
          <Button type='link' onClick={resetRowSelected}>
            清空
          </Button>
        </div>
      }
      type='info'
    />
  );
};

export default TableAlert;
