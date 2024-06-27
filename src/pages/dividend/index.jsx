import { Space, Form, Button, Table, Card, Modal, message, Input } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { SearchFormItem } from "../components";
import { SearchFormItemEnum } from "@/enum";
import { formItemMap } from "@/data";
import { useAntdTableWithForm, useSearchForm } from "@/hooks";
import { getInterList } from "@/api/other";
import { AddressTailor } from "@/components";
import dayjs from "dayjs";
import USDTImg from '@/assets/usdt_02.png'

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    // align: "center",
  },
  {
    title: "地址",
    dataIndex: "address",
    // align: "center",
    render: (_, record) => (
      <AddressTailor address={record.address} />
    ),
  },
  {
    title: "派息金额",
    dataIndex: "dayIncome",
    // align: "center",
  },
  {
    title: '利率',
    dataIndex: "rate",
    // align: "center",
    render:(_,record)=>{
        return <span>{record?.rate}%</span>
    },
  },
  {
    title: '链类型',
    dataIndex: "chainType",
    // align: "center",
  },
  {
    title: "时间",
    // align: "center",
    width: 160,
    render:(_,record)=><span>{dayjs.unix(record.CreateTime).format("YYYY-MM-DD HH:mm:ss")}</span>
  },
];

const renderSearch = [SearchFormItemEnum.NID,SearchFormItemEnum.USER_ADDRESS,SearchFormItemEnum.DATE];
const AccessRecord = () => {
  const [form] = useSearchForm();
  const { ROW_KEY, data, pagination, handleSearch, loading } = useAntdTableWithForm(
    getInterList,
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
        <div className="flex" style={{alignItems: "center"}}>
            <div className="static-item flex" style={{background: "rgb(233,251,240)"}}>
                <img src={USDTImg} alt="" />
                <div className="static-item-info">
                <span >派息总额</span>
                <span>{data?.other?.amount || 0}</span>
                </div>
            </div>
        </div>
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
