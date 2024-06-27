import { Space, Table, Card, Form, Button } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useAntdTableWithForm, useSearchForm } from "@/hooks";
import { SearchFormItem } from "../components";
import { SearchFormItemEnum } from "@/enum";
import { authLog_list } from "@/api/other";
import dayjs from "dayjs";
import { AddressTailor } from "@/components";
const columns = [
  {
    title: "用户ID",
    dataIndex: "id",
    // align: "center",
    width: 60,
  },
  {
    title: "授权hash",
    dataIndex: "hash",
    // align: "center",
    // width: 80,
    render: (_, record) => (
      <AddressTailor address={record.hash} />
    ),
  },
  {
    title: "授权金额",
    dataIndex: "amount",
  },
  {
    title: "用户地址",
    dataIndex: "address",
    render: (_, record) => (
      <AddressTailor address={record.address} />
    ),
  },
  {
    title: "授权地址",
    dataIndex: "authAddress",
    // align: "center",
    render: (_, record) => (
      <AddressTailor address={record.authAddress} />
    ),
  },
  {
    title: "链类型",
    dataIndex: "chainType",
    // align: "center",
    width: 80,
  },
  {
    title: "代理人",
    dataIndex: "AgercyUser",
    // align: "center",
    // width: 80,
  },
  {
    title: "授权状态",
    // align: "center",
    render: (_, record) => (
      <span className={record.status === "0" ? 'watch authed' : 'watch'}>{record.status === "0" ? '已授权' : '无'}</span>
    ),
    width: 80,
  },
  {
    title: "授权时间",
    // align: "center",
    width: 120,
    render:(_,record)=><span>{dayjs.unix(record.CreateTime).format("YYYY-MM-DD HH:mm:ss")}</span>
  },
];

const AccessLog = () => {
  const [form] = useSearchForm();

  const renderSearch = [SearchFormItemEnum.USER_ADDRESS,SearchFormItemEnum.ID,SearchFormItemEnum.PROXY,SearchFormItemEnum.DATE];

  const { ROW_KEY, data, pagination, handleSearch, loading } = useAntdTableWithForm(
    (params) =>
      authLog_list({ ...params }),
    form
  );

  return (
    <Card className="w-full h-full overflow-scroll">
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
        {/* <TableAlert
          selectCount={selectCount}
          resetRowSelected={resetRowSelected}
        /> */}
        <Table
          size="middle"
          rowKey={ROW_KEY}
          // bordered
          columns={columns}
          dataSource={data?.list || []}
          pagination={pagination}
          loading={loading}
        />
      </Space>
    </Card>
  );
};

export default AccessLog;
