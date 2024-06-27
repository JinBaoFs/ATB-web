import {
  Space,
  Form,
  Button,
  Table,
  Card,
  Modal,
  message,
  Input,
  Radio,
} from "antd";
import { SearchOutlined, ReloadOutlined, VerticalAlignTopOutlined } from "@ant-design/icons";
import { SearchFormItemEnum } from "@/enum";
import { useAntdTableWithForm, useSearchForm } from "@/hooks";
import { getExtractList, extractAudits, editExtractAudits, exportExtractList } from "@/api/withdrawal-logs";
import { TableAlert } from "@/pages/components";
import { useMemo, useState } from "react";
import { useResetState } from "ahooks";
import { SearchFormItem } from "../components";
import { collect_number } from "@/api/other";
import { useEffect } from "react";
import { AddressTailor } from "@/components";
import dayjs from "dayjs";
import "./index.scss"
import USDTImg from '@/assets/usdt_02.png'
const { TextArea } = Input;


const extractStatusOptions = [
  {
    value: "0",
    label: "成功",
  },
  {
    value: "1",
    label: "审核中",
  },
  {
    value: "2",
    label: "失败",
  },
];

const columns = [
  {
    title: "用户ID",
    dataIndex: "userId",
    // align: "center",
    width: 60,
  },
  {
    title: "链类型",
    dataIndex: "chainType",
    // align: "center",
  },
  {
    title: "代理",
    dataIndex: "AgercyUser",
    // align: "center",
  },
  {
    title: "提现金额",
    dataIndex: "amount",
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
    title: "类型",
    // dataIndex: 'extractType', // 0 提现 1 收入
    // align: "center",
    render: (_, record) => {
      switch (record.extractType) {
        case "1":
          return <span>收入</span>;
        default:
          return <span>提现</span>;
      }
    },
  },
  {
    title: "处理时间",
    dataIndex: "CreateTime",
    // align: "center",
    render:(_,record)=><span>{record?.disposeTime?dayjs(Number(record?.disposeTime*1000) || "").format('YYYY-MM-DD HH:mm:ss'):'-'}</span>,
    // width: 120,
  },
  {
    title: "交易hash",
    dataIndex: "hash",
    render: (_, record) => (
      <AddressTailor address={record.hash} />
    ),
  },
  {
    title: "审核状态",
    // dataIndex: 'extractStatus', // 0 通过 1审核中 2审核驳回
    // align: "center",
    render: (_, record) => {
      switch (record.extractStatus) {
        case "1":
          return <span>审核中</span>;
        case "2":
          return <span className="text-red">失败</span>;
        default:
          return <span className="text-green">成功</span>;
      }
    },
  },
  // {
  //   title: "到账状态",
  //   align: "center",
  //   render: (_, record) => {
  //     switch (record.accountStatus) {
  //       case "1":
  //         return <span>未到账</span>;
  //       default:
  //         return <span>已到账</span>;
  //     }
  //   },
  // },
  // {
  //   title: "驳回原因",
  //   dataIndex: "rejectCause",
  //   align: "center",
  // },
  {
    title: "创建时间",
    dataIndex: "CreateTime",
    // align: "center",
    render:(_,record)=><span>{dayjs(Number(record?.CreateTime*1000) || "").format('YYYY-MM-DD HH:mm:ss')}</span>,
    // width: 120,
  },
];

const renderSearch = [
  SearchFormItemEnum.USER_ADDRESS,
  SearchFormItemEnum.ID,
  SearchFormItemEnum.PROXY,
  SearchFormItemEnum.WITHDRAW_STATUS,
  SearchFormItemEnum.SETTLE_STATUS,
  SearchFormItemEnum.DATE,
];

const WithdrawalLogs = () => {
  const [form] = useSearchForm();
  const authority = localStorage.getItem('authority') || '1'
  const { ROW_KEY, data, pagination, handleSearch, loading } = useAntdTableWithForm(
    getExtractList,
    form
  );
  useEffect(() => {
    getCollectNumber();
  }, []);

  const [collectInfo, setCollectInfo] = useState({});
  const getCollectNumber = async () => {
    try {
      const { code, data } = await collect_number();
      if (code === 200) {
        setCollectInfo(data);
      }
    } catch (error) {}
  };
  const mergeColumns = useMemo(() => {
    return columns.concat([
      {
        title: "操作",
        // align: "center",
        // fixed: "right",
        width: 100,
        render: (_, record) => (
          <div style={{display: 'flex'}}>
            <span className="btn-text text-warning mr-2 mt-2 cursor-pointer" onClick={() => showModal(record,false)}>编辑</span>
            <span className="btn-text text-link mr-2 mt-2 cursor-pointer" onClick={() => showModal(record,true)}>详情</span>
          </div>
        ),
      },
    ]);
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormDisabled,setIsFormDisabled] = useState(false);
  const showModal = (record,_bool) => {
    setIsFormDisabled(_bool)
    setRecord(record);
    submitForm.setFieldsValue({
      send: record.send,
      from: record.address,
      id: record.id,
      amount: record.amount,
      hash: record.hash,
      extractStatus: record.extractStatus,
    });
    console.log(record)
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const formValues = submitForm.getFieldsValue();
    // if(formValues.extractStatus == '0'){
    //   submitForm.validateFields().then(async (values) => {

    //   })
    //   return
    // }
    setIsModalOpen(false);
    handleAudits();
    submitForm.resetFields()
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    resetCord();
    submitForm.resetFields()
  };

  const [record, setRecord, resetCord] = useResetState({});
  const [submitForm] = Form.useForm();
  const handleAudits = async () => {
    const formValues = submitForm.getFieldsValue();
    try {
      const { code } = await editExtractAudits({
        id:record.id,
        ...formValues,
      });
      if (code === 200) {
        message.success("修改成功");
        handleSearch()
      }
    } catch (error) {
      message.error("修改失败");
      console.log(`【pages/withdrawal-logs/index.jsx-handleAudits】error`);
    }
  };

  const handleExport = async() => {
    try{
      let res = await exportExtractList()
      console.log(res)
      // // 将流数据封装到 Blob 对象中
      const blob = new Blob([res], { type: 'application/octet-stream' });

      // 创建一个临时 URL，指向 Blob 对象
      const url = URL.createObjectURL(blob);

      // 创建一个 <a> 元素，设置 href 属性为临时 URL，然后触发点击事件以下载文件
      const link = document.createElement('a');
      link.href = url;
      link.download = '提现记录.xlsx'; // 设置下载文件的名称
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
            <Button type="primary" onClick={()=>{handleSearch()}} icon={<SearchOutlined />}>
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
        {/* <div className="flex gap-8">
          <span>归集:{collectInfo.collection}</span>
          <span>提现:{collectInfo.withdraw}</span>
          <span>实际:{collectInfo.practical}</span>
          <span>派息:{collectInfo.interest}</span>
        </div> */}
        <div className="flex" style={{alignItems: "center"}}>
            <div className="static-item flex" style={{background: "rgb(233,251,240)"}}>
              <img src={USDTImg} alt="" />
              <div className="static-item-info">
                <span >提现金额</span>
                <span>{data?.other?.amount || 0}</span>
              </div>
            </div>
          </div>
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
        title={isFormDisabled ? "详情" : "编辑提现"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={isFormDisabled?"":"确定"}
        cancelText="关闭"
        width={900}
      >
        <Form form={submitForm} labelAlign="right" labelCol={{span:4}} wrapperCol={{span:18}} disabled={isFormDisabled ? true : false}>
          <Form.Item label="数量" name="amount">
            <Input disabled></Input>
          </Form.Item>
          <Form.Item label="发送方" name="send">
            <Input ></Input>
          </Form.Item>
          <Form.Item label="接收方" name="from">
            <Input></Input>
          </Form.Item>
          
          <Form.Item 
            label="交易hash" name="hash"
            // rules={[
            //   { required: true, message: '请输入交易哈希'},
            // ]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item label="审核状态" name="extractStatus">
            <Radio.Group options={extractStatusOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default WithdrawalLogs;
