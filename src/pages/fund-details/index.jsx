import { Space, Form, Button, Table, Card } from "antd";
import { 
  SearchOutlined,
  VerticalAlignTopOutlined
} from "@ant-design/icons";
import { SearchFormItem } from "@/components";
import { SearchFormItemEnum } from "@/enum";
import { useAntdTableWithForm, useSearchForm } from "@/hooks";
import { getFundDetailsList, exportFundDetailsList } from "@/api/other";
import { AddressTailor } from "@/components";
import dayjs from "dayjs";

const columns = [
  {
    title: "用户ID",
    dataIndex: "userId",
    width: 60,
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
    title: "链类型",
    dataIndex: "chainType",
    // align: "center",
    // width: 100,
  },
  {
    title: "用户代理",
    dataIndex: "AgercyUser",
    // align: "center",
    // width: 100,
  },
  {
    title: "收支类型",
    dataIndex: "incomeType",
    // align: "center",
    render: (_, record) => (
      <span>{record?.incomeType === "0" ? "收入" : "支出"}</span>
    ),
    // width: 300,
  },
  {
    title: "变动金额",
    dataIndex: "varationAmount",
    // align: "center",
    // width: 300,
  },
  {
    title: "变动后余额",
    dataIndex: "balance",
    // align: "center",
    // width: 300,
  },
  {
    title: "变动说明",
    dataIndex: "explainTXT",
    // align: "center",
    // width: 300,
  },
  {
    title: "创建时间",
    dataIndex: "CreateTime",
    // align: "center",
    render:(_,record)=><span>{dayjs(Number(record?.CreateTime*1000) || "").format('YYYY-MM-DD HH:mm:ss')}</span>,
    width: 180
  },
];

const renderSearch = [
  SearchFormItemEnum.USER_ADDRESS,
  SearchFormItemEnum.ID,
  SearchFormItemEnum.PROXY,
  SearchFormItemEnum.CASH_FLOW_TYPE,
  SearchFormItemEnum.DATE
];

const FundDetails = () => {
  const [form] = useSearchForm();
  const { ROW_KEY, data, pagination, handleSearch, loading } = useAntdTableWithForm(
    getFundDetailsList,
    form
  );



  const handleExport = async() => {
    try{
      let res = await exportFundDetailsList()
      console.log(res)
      // // 将流数据封装到 Blob 对象中
      const blob = new Blob([res], { type: 'application/octet-stream' });

      // 创建一个临时 URL，指向 Blob 对象
      const url = URL.createObjectURL(blob);

      // 创建一个 <a> 元素，设置 href 属性为临时 URL，然后触发点击事件以下载文件
      const link = document.createElement('a');
      link.href = url;
      link.download = '资金明细.xlsx'; // 设置下载文件的名称
      link.click();

      // 释放临时 URL
      URL.revokeObjectURL(url);
    }catch{

    }
  }
  return (
    <Card>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Form layout="inline" form={form}>
          {renderSearch.map((controlType) => (
            <SearchFormItem controlType={controlType} key={controlType} />
          ))}
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />} onClick={()=>{ handleSearch() }}>
              查询
            </Button>
            <Button
              type="primary"
              icon={<VerticalAlignTopOutlined />}
              onClick={() => { handleExport() }}
              style={{background: "rgb(39,94,148)",border: "none",marginLeft: "6px"}}
            >
              数据导出
            </Button>
          </Form.Item>
        </Form>
        {/* <TableAlert
          selectCount={selectCount}
          resetRowSelected={resetRowSelected}
        /> */}
        <Table
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

export default FundDetails;
