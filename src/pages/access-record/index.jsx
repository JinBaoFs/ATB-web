import { Space, Form, Button, Table, Card, Modal, message, Input } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { SearchFormItem } from "../components";
import { SearchFormItemEnum } from "@/enum";
import { formItemMap } from "@/data";
import { useAntdTableWithForm, useSearchForm } from "@/hooks";
import { access_record_list } from "@/api/other";
import { AddressTailor } from "@/components";
import dayjs from "dayjs";

const columns = [
  {
    title: "用户ID",
    dataIndex: "id",
    // align: "center",
    width: 60,
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
    title: "IP地址",
    dataIndex: "IpAddress",
    // align: "center",
  },
  {
    title: '代理用户',
    dataIndex: "AgercyUser",
    // align: "center",
  },
  {
    title: "代理地址",
    dataIndex: "IpAddress",
    // align: "center",
  },
  {
    title: "IP位置",
    dataIndex: "IpPlace",
    // align: "center",
  },
  {
    title: "记录页面",
    dataIndex: "log",
    // align: "center",
  },
  {
    title: "时间",
    // align: "center",
    width: 120,
    render:(_,record)=><span>{dayjs.unix(record.CreateTime).format("YYYY-MM-DD HH:mm:ss")}</span>
  },
];

const renderSearch = [SearchFormItemEnum.USER_ADDRESS,SearchFormItemEnum.PROXY,SearchFormItemEnum.DATE];
const AccessRecord = () => {
  const [form] = useSearchForm();
  const { ROW_KEY, data, pagination, handleSearch, loading } = useAntdTableWithForm(
    access_record_list,
    form
  );

  return (
    <Card className="w-full h-full">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Form layout="inline" form={form}>
          {renderSearch.map((controlType) => (
            <SearchFormItem controlType={controlType} key={controlType} />
          ))}
          <Form.Item>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={()=>{handleSearch()}}
            >
              查询
            </Button>
          </Form.Item>
        </Form>

        <Table
          size="middle"
          rowKey={ROW_KEY}
          // bordered
          columns={columns}
          dataSource={data?.list || []}
          pagination={pagination}
          // rowSelection={rowSelection}
          loading={loading}
        />
      </Space>
    </Card>
  );
};

export default AccessRecord;
