import {
  Space,
  Form,
  Button,
  Table,
  Card,
  Modal,
  message,
  Input,
  Select,
} from "antd";
import { useState, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { SearchFormItem } from "@/components";
import { SearchFormItemEnum } from "@/enum";
import { getMemberList } from "@/api/member";
import { useAntdTableWithForm, useSearchForm } from "@/hooks";
import dayjs from "dayjs";
import { useEffect } from "react";
import { AddressTailor } from "@/components";

export const UserSelect = ({ value, onChange }) => {
  const [showModal, setShowModal] = useState(false);
  const handleOk = () => {
    setSelectValue(selectedRowKeys);
    onChange?.(selectedRowKeys);
    setShowModal(false);
  };
  const handleCancel = () => {
    setShowModal(false);
  };
  const selectRef = useRef(null);
  const [selectValue, setSelectValue] = useState(value || []);
  const [selectedRowKeys, setSelectedRowKeys] = useState(value || []);
  return (
    <div>
      <Select
        ref={selectRef}
        open={false}
        value={selectValue}
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="选择客户地址"
        onFocus={() => {
          selectRef.current.blur();
          setShowModal(true);
        }}
        onDeselect={(value) => {
          const index = selectedRowKeys.findIndex((item) => item === value);
          if (index !== -1) {
            selectedRowKeys.splice(index, 1);
            setSelectValue([...selectedRowKeys]);
            onChange?.([...selectedRowKeys]);
          }
        }}
      />
      <Modal
        title="选择客户地址"
        open={showModal}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="关闭"
        width={1000}
        destroyOnClose
      >
        <ModalTable setSelectedRowKeys={setSelectedRowKeys} selected={value} />
      </Modal>
    </div>
  );
};

const columns = [
  {
    title: "用户ID",
    dataIndex: "id",
    // align: "center",
  },
  {
    title: "用户地址",
    dataIndex: "address",
    // align: "center",
    render: (_, record) => (
      <AddressTailor address={record.address} />
    ),
  },
  {
    title: "注册时间",
    // align: "center",
    render: (_, record) => (
      <span>{dayjs.unix(record?.createAt).format("YYYY-MM-DD HH:mm:ss")}</span>
    ),
  },
];
const renderSearch = [SearchFormItemEnum.USER_ADDRESS];
const ModalTable = ({ setSelectedRowKeys, selected }) => {
  const [form] = useSearchForm();
  const {
    ROW_KEY,
    data,
    // pagination,
    selectedRowKeys,
    resetRowSelected,
    rowSelection,
    handleSearch,
  } = useAntdTableWithForm(getMemberList, form,selected);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `总共 ${total} 条`
  });

  const handleChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
      showTotal: (total) => `总共 ${total} 条`
    }); // 更新分页信息
  };

  const handlePageSizeChange = (current, newSize) => {
    setPagination({
      ...pagination,
      current: 1, // 重置页码为第一页
      pageSize: newSize, // 更新每页显示的数量
      showTotal: (total) => `总共 ${total} 条`
    });
  };

  const [custList,setCustList] = useState([])

  useEffect(()=>{
    let arr = []
    data?.list.map(item=>{
      let _arr = arr.filter(row=>{return row.address == item.address})
      if(!_arr.length){
        arr.push(item)
      }
    })
    setCustList(arr)
  },[data])


  useEffect(() => {
    setSelectedRowKeys(selectedRowKeys);
  }, [selectedRowKeys]);
  return (
    <Space
      direction="vertical"
      style={{
        width: "100%",
      }}
    >
      <Form layout="inline" form={form}>
        {renderSearch.map((controlType) => (
          <SearchFormItem controlType={controlType} key={controlType} />
        ))}
        <Form.Item>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={()=>{
              console.log(form.getFieldValue());
              handleSearch()
            }}
          >
            查询
          </Button>
        </Form.Item>
      </Form>

      <Table
        rowKey="address"
        bordered
        dataSource={custList || []}
        pagination={pagination}
        columns={columns}
        rowSelection={rowSelection}
        onChange={handleChange}
        onShowSizeChange={handlePageSizeChange}
      />
    </Space>
  );
};

export default UserSelect;
