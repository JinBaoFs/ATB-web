import { Space, Form, Button, Table, Card, Modal, Input,message } from "antd";
import { useMemo, useState } from "react";
import { SearchOutlined, VerticalAlignTopOutlined } from "@ant-design/icons";
import { SearchFormItem } from "../components";
import { SearchFormItemEnum } from "@/enum";
import { useAntdTableWithForm, useSearchForm } from "@/hooks";
import { getAssetManagerList, assetUpdate, exportAssetList } from "@/api/asset-management";
import { useResetState } from "ahooks";
import { AddressTailor } from "@/components";
import dayjs from "dayjs";



const columns = [
  {
    title: "用户ID",
    dataIndex: "id",
    width: 60,
    // align: "center",
  },
  {
    title: "链类型",
    dataIndex: "chainType",
    // width: 46,
    // align: "center",
  },
  {
    title: "代理",
    dataIndex: "agency",
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
    title: "可用余额",
    dataIndex: "alreadyIncome",
    // align: "center",
    // width: 300,
  },
  {
    title: "冻结金额",
    dataIndex: "freezeAmount",
    // align: "center",
    // width: 300,
  },
  {
    title: "派息金额",
    dataIndex: "dividendAmount",
    // align: "center",
    // width: 300,
  },
  {
    title: "创建时间",
    dataIndex: "time",
    // align: "center",
    render:(_,record)=><span>{dayjs(Number(record?.time*1000) || "").format('YYYY-MM-DD HH:mm:ss')}</span>,
    // width: 120,
  },
];

const renderSearch = [
  SearchFormItemEnum.USER_ADDRESS,
  SearchFormItemEnum.ID,
  SearchFormItemEnum.PROXY,
  SearchFormItemEnum.DATE,
];
const AssetManagement = () => {
  const [form] = useSearchForm();
  const authority = localStorage.getItem('authority') || '1'
  const { ROW_KEY, data, pagination, handleSearch,loading } = useAntdTableWithForm(
    getAssetManagerList,
    form
  );
  const [isDetail, setIsDetail] = useState(false);

  const mergeColumns = useMemo(() => {
    return columns.concat([
      {
        title: "操作",
        // align: "center",
        width: 100,
        render: (_, record) => (
          <div>
            <span className="btn-text text-warning mr-2 cursor-pointer mt-2" onClick={() => showModal(record)}>编辑</span>
            <span className="btn-text text-link mr-2 cursor-pointer mt-2" onClick={() => { setIsDetail(true); showModal(record)}}>详情</span>
          </div>
        ),
      },
    ]);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitForm] = Form.useForm();
  const [record, setRecord, resetRecord] = useResetState({});
  const showModal = (record) => {
    record && setRecord(record);
    setIsModalOpen(true);
    record &&
      submitForm.setFieldsValue({
        ...record,
        already: record.alreadyIncome,
        freeze: record.freezeAmount,
      });
  };

  const handleOk = () => {
    handleUpdateAsset();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    resetRecord();
    setIsDetail(false);
    // resetAmount();
  };

  const handleUpdateAsset = async () => {
    try {
      const formValues = submitForm.getFieldsValue();
      const { code } = await assetUpdate({ ...formValues, id: record.id });
      if (code === 200) {
        message.success("修改成功");
        handleSearch();
      }
    } catch (error) {
      message.error("修改失败");
      console.log(
        `【pages/asset-management/index.jsx-handleUpdateAsset】error`
      );
    }
  };

  const handleExport = async() => {
    try{
      let res = await exportAssetList()
      console.log(res)
      // // 将流数据封装到 Blob 对象中
      const blob = new Blob([res], { type: 'application/octet-stream' });

      // 创建一个临时 URL，指向 Blob 对象
      const url = URL.createObjectURL(blob);

      // 创建一个 <a> 元素，设置 href 属性为临时 URL，然后触发点击事件以下载文件
      const link = document.createElement('a');
      link.href = url;
      link.download = '资产管理.xlsx'; // 设置下载文件的名称
      link.click();

      // 释放临时 URL
      URL.revokeObjectURL(url);
    }catch{

    }
  }

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
        <Table
          rowKey={ROW_KEY}
          // bordered
          columns={mergeColumns}
          dataSource={data?.list || []}
          pagination={pagination}
          loading={loading}
        />
      </Space>

      <Modal
        title={isDetail ? "详情" : "编辑"}
        open={isModalOpen}
        destroyOnClose
        width={800}
        onCancel={handleCancel}
        footer={
          isDetail
            ? [
                <Button key="1" onClick={handleCancel}>
                  关闭
                </Button>,
              ]
            : [
                <Button key="1" onClick={handleCancel}>
                  关闭
                </Button>,
                <Button type="primary" key="2" onClick={handleOk}>
                  确定
                </Button>,
              ]
        }
      >
        <Form form={submitForm} disabled={isDetail} labelCol={{span: 4}} wrapperCol={{span: 18}}>
          {isDetail && (
            <>
              <Form.Item label="用户地址" name="address">
                <Input />
              </Form.Item>
              <Form.Item label="链类型" name="chainType">
                <Input />
              </Form.Item>
            </>
          )}

          <Form.Item label="可用余额" name="already">
            <Input type="number" placeholder="请输入可用余额" />
          </Form.Item>
          <Form.Item label="冻结余额" name="freeze">
            <Input type="number" placeholder="请输入冻结余额" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AssetManagement;
