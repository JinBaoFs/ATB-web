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
  import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
  import { SearchFormItemEnum } from "@/enum";
  import { useAntdTableWithForm, useSearchForm } from "@/hooks";
  import { getExtractList, extractAudits, getCollList, editExtractAudits, editCollList } from "@/api/withdrawal-logs";
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
      width: 60,
      // align: "center",
    },
    {
      title: "链类型",
      dataIndex: "chainType",
      // align: "center",
    },
    {
      title: "代理",
      dataIndex: "agencyUser",
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
      dataIndex: 'amountType',
      // align: "center",
    },
    {
      title: "归集金额",
      dataIndex: 'amount',
      // align: "center",
    },
    {
      title: "实际金额",
      dataIndex: 'practicalAmount',
      // align: "center",
    },
    {
      title: "交易hash",
      dataIndex: 'hash',
      // align: "center",
      render: (_, record) => (
        <AddressTailor address={record.hash} />
      ),
    },
    {
      title: "审核状态",
      // dataIndex: 'extractStatus', // 0 通过 1审核中 2审核驳回
      align: "center",
      render: (_, record) => {
        switch (record.statusType) {
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
    {
      title: "创建时间",
      dataIndex: "CreateTime",
      // align: "center",
      render:(_,record)=><span>{dayjs(Number(record?.CreateTime*1000) || "").format('YYYY-MM-DD HH:mm:ss')}</span>,
      width: 120,
    },
  ];
  
  const renderSearch = [
    SearchFormItemEnum.USER_ADDRESS,
    SearchFormItemEnum.ID,
    SearchFormItemEnum.PROXY,
    SearchFormItemEnum.WITHDRAW_STATUS,
    SearchFormItemEnum.DATE,
  ];
  
  const CollLogs = () => {
    const [form] = useSearchForm();
    const authority = localStorage.getItem('authority') || '1'
    const { ROW_KEY, data, pagination, handleSearch, loading } = useAntdTableWithForm(
      getCollList,
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
          width: 80,
          render: (_, record) => (
            <div>
              <div style={{display: 'flex'}}>
                {
                  authority == "0" &&
                  <span className="btn-text text-warning mr-2 mt-2 cursor-pointer" onClick={() => showModal(record,false)}>归集审核</span>
                }
              </div>
            </div>
          ),
        },
      ]);
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = (record) => {
      setRecord(record);
      submitForm.setFieldsValue({
        address: record.address,
        hash: record.hash,
        amount: record.amount,
        practicalAmount: record.practicalAmount,
        status: record.statusType,
      });
      setIsModalOpen(true);
    };
  
    const handleOk = () => {
      submitForm.validateFields().then(async (values) => {
        setIsModalOpen(false);
        handleEditColl();
      })
      
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
      resetCord();
    };
  
    const [record, setRecord, resetCord] = useResetState({});
    const [submitForm] = Form.useForm();
    const handleEditColl = async () => {
      try {
        const formValues = submitForm.getFieldsValue();
        const { code } = await editCollList({
          id: record.id,
          practicalAmount: formValues.practicalAmount,
          status: formValues.status
        });
        if (code === 200) {
          message.success("操作成功");
          handleSearch()
        }
      } catch (error) {
        message.error("操作失败");
        console.log(`【pages/withdrawal-logs/index.jsx-handleAudits】error`);
      }
    };

    const [detailModal,setDetailModal] = useState(false)

    
    const openDetailModal = (record)=>{
      setRecord(record)
      setDetailModal(true)
    }
    const detailModalConfirm = () => {
      setDetailModal(false)
    }
    const detailModalCancel = () => {
      setDetailModal(false)
      
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
                <span >归集金额</span>
                <span>{data?.other?.collectionNumber || 0}</span>
              </div>
            </div>
            <div className="static-item flex" style={{background: "rgb(252,251,223)"}}>
              <img src={USDTImg} alt="" />
              <div className="static-item-info" style={{color: "rgb(83,80,43)"}}>
                <span>实际金额</span>
                <span>{data?.other?.practicalAmount || 0}</span>
              </div>
            </div>
            {/* <div className="static-item flex" style={{background: "rgb(233,251,240)"}}>
              <img src={USDTImg} alt="" />
              <div className="static-item-info">
                <span >派息金额</span>
                <span>{memberData?.sumAuthUsdt}</span>
              </div>
            </div> */}
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
          title={"归集审核"}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText={"确定"}
          cancelText="关闭"
          width={900}
        >
          <Form form={submitForm} labelAlign="right" labelCol={{span:4}} wrapperCol={{span:18}}>
            <Form.Item label="客户地址" name="address">
              <Input disabled></Input>
            </Form.Item>
            <Form.Item label="交易hash" name="hash">
              <Input disabled></Input>
            </Form.Item>
            <Form.Item label="归集金额" name="amount">
              <Input disabled></Input>
            </Form.Item>
            <Form.Item 
              label="实际金额" 
              name="practicalAmount"
              rules={[{required:true,message:"请输入实际金额"}]}
            >
              <Input type="number"></Input>
            </Form.Item>
            <Form.Item label="审核状态" name="status">
              <Radio.Group options={extractStatusOptions} />
            </Form.Item>
          </Form>
        </Modal>
        {/* <Modal 
          title="详情"
          open={detailModal}
          onCancel={detailModalCancel}
          cancelText="关闭"
          okText=""
          width={800}
        >
          <Form form={submitForm} disabled labelAlign="right" labelCol={{span:4}} wrapperCol={{span:18}}>
            <Form.Item label="币种" name="extract_status">
              <Input ></Input>
            </Form.Item>
            <Form.Item label="数量" name="cause">
              <Input defaultValue={"10"}></Input>
            </Form.Item>
            <Form.Item label="手续费" name="cause">
              <Input defaultValue={"10"}></Input>
            </Form.Item>
            <Form.Item label="发送方" name="cause">
              <Input defaultValue={"10"}></Input>
            </Form.Item>
            <Form.Item label="接收方" name="cause">
              <Input defaultValue={"10"}></Input>
            </Form.Item>
            <Form.Item label="交易hash" name="cause">
              <Input defaultValue={"10"}></Input>
            </Form.Item>
            <Form.Item label="审核状态" name="extract_status">
              <Radio.Group options={extractStatusOptions} />
            </Form.Item>
          </Form>
        </Modal> */}
      </Card>
    );
  };
  
  export default CollLogs;
  