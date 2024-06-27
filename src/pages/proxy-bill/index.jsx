import {
    Space,
    Form,
    Button,
    Table,
    Card,
    Modal,
    message,
    Input,
    DatePicker,
    Radio
  } from "antd";
  import { 
    SearchOutlined,
    PlusOutlined
  } from "@ant-design/icons";
  import { useMemo, useState } from "react";
  import { SearchFormItem } from "../components";
  import { SearchFormItemEnum } from "@/enum";
  import { useAntdTableWithForm, useSearchForm } from "@/hooks";
  import { useResetState } from "ahooks";
  import dayjs from "dayjs";
  import { getBillList, createBill, editBill, deleteBill } from "@/api/proxy-bill";
  import { getProxyListOptions } from "@/api/proxy-list";
  import { useEffect } from "react";
  const { TextArea } = Input;
  
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 60,
    },
    {
      title: "账单编号",
      dataIndex: "checkId",
    },
    {
      title: "代理",
      dataIndex: "agencyUser",
    },
    {
      title: "账期",
      dataIndex: "",
      render:(_,record)=>{
        return (
            <div className="flex flex-col">
                <span>{record?.startBillTime ? dayjs(Number(record?.startBillTime*1000) || "").format('YYYY-MM-DD') : '-'}</span>
                <span>{record?.endBillTime ? dayjs(Number(record?.endBillTime*1000) || "").format('YYYY-MM-DD') : '-'}</span>
            </div>
        )
      }
    },
    {
      title: "本级",
      render:(_,record)=>{
        return (
            <div className="flex flex-col">
                <span>收入: {record.presentIncome}</span>
                <span>成本: {record.presentCost}</span>
                <span>利润: {record.presentProfit}</span>
            </div>
        )
      }
    },
    {
        title: "下级",
        render:(_,record)=>{
            return (
                <div className="flex flex-col">
                    <span>收入: {record.nextIncome}</span>
                    <span>成本: {record.nextCost}</span>
                    <span>利润: {record.nextProfit}</span>
                </div>
            )
        }
    },
    {
        title: "最终利润",
        dataIndex: "lastProfit",
    },
    {
        title: "备注",
        dataIndex: "textEx",
        render:(_,record)=><span>{decodeURIComponent(record.textEx)}</span>
    },
    {
        title: "状态",
        dataIndex: "",
        render: (_, record) => {
            switch (record.checkBillStatus) {
                case "1":
                    return <span className="text-link">待确认</span>;
                case "2":
                    return <span className="text-hui">取消</span>;
                default:
                    return <span className="text-green">确认</span>;
            }
        },
    },
    {
      title: "创建时间",
      dataIndex: "ratio",
      width: 150,
      render:(_,record)=><span>{record?.CreateTime ? dayjs(Number(record?.CreateTime*1000) || "").format('YYYY-MM-DD HH:mm:ss') : '-'}</span>
    },
  ];
  
  const renderSearch = [
    SearchFormItemEnum.ACCOUNT_NO,
    SearchFormItemEnum.DATE
  ];

  const statusOptions = [
    {
      value: "0",
      label: "确认",
    },
    {
      value: "1",
      label: "待确认",
    },
    {
      value: "2",
      label: "取消",
    },
  ]
  
  const ProxyBill = () => {
    let agency = localStorage.getItem("agency") || ""
    const authority = localStorage.getItem('authority') || '1' //权限状态
    const [form] = useSearchForm();
    const {
        ROW_KEY,
        data,
        pagination,
        selectCount,
        resetRowSelected,
        rowSelection,
        handleSearch,
        loading,
    } = useAntdTableWithForm(getBillList, form);
    const mergeColumns = useMemo(() => {
      return columns.concat([
        {
          title: "操作",
          // align: "center",
          width: 100,
          render: (_, record) => (
            <div style={{display: "flex",flexWrap:"wrap",justifyContent: "center"}}>
              <span onClick={() => showModal(record)} className="text-link">处理</span>
              <span onClick={() => openDel(record)} className="text-red ml-2 cursor-pointer">删除</span>
            </div>
          ),
        },
      ]);
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [proxyOptions,setProxyOptions] = useState([]);
    const [record, setRecord, resetCord] = useResetState({});
    const [tipsShow, setTipsShow] = useState(false);
    const [submitForm] = Form.useForm();

    useEffect(()=>{
        handleGetProxyOptions()
    },[])

    const handleGetProxyOptions = async () => {
        let { data } = await getProxyListOptions()
        setProxyOptions(data)
    }

    const showModal = (record) => {
      setRecord(record);
      submitForm.setFieldsValue({
        lastProfit: record.lastProfit,
        checkBillStatus: record.checkBillStatus,
        textEx: decodeURIComponent(record.textEx),
      });
      setIsModalOpen(true);
    };

    
  
    const handleOk = () => {
      submitForm.validateFields().then(async (values) => {
        console.log(values)
        setIsModalOpen(false);
        Object.keys(record).length ? handleEdit(values) : handleCreate(values);
        submitForm.resetFields()
        resetCord()
      }).catch()
    };

    const handleCreate = async (values) => {
        let { data } = await createBill({
            id: proxyOptions[0].passwordId,
            startTime: new Date(values.startTime.format('YYYY-MM-DD 00:00:00')).getTime() / 1000,
            endTime: new Date(values.endTime.format('YYYY-MM-DD 23:59:59')).getTime() / 1000
        })
        if(data){
            message.success("创建成功")  
        }else{
            message.error("创建失败")
        }
        handleSearch()
        setIsModalOpen(false)
    }

    const handleEdit = async (values) => {
        let { data } = await editBill({
            id: record.id,
            lastProfit: values.lastProfit,
            checkBillStatus: values.checkBillStatus,
            textEx: encodeURIComponent(values.textEx),
        })
        if(data){
            message.success("修改成功")  
        }else{
            message.error("修改失败")
        }
        handleSearch()
        setIsModalOpen(false)
    }
  
    const handleCancel = () => {
      setIsModalOpen(false);
      resetCord();
      submitForm.resetFields()
    };

    const openDel = async(record) => {
      setRecord(record)
      setTipsShow(true)
    }
    
    const handleDel = async () =>{
      try{
        let {data} = await deleteBill({
          id: record.id
        })
        if(data){
          message.success("删除成功")
          handleSearch()
        }else{
          message.error("删除失败")
        }
        setTipsShow(false)
      }catch{}
    }
    const isEdit = useMemo(() => {
      return Object.keys(record).length > 0;
    }, [record]);
    return (
      <Card className="w-full h-full">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Form layout="inline" form={form}>
            {renderSearch.map((controlType) => (
              <SearchFormItem controlType={controlType} key={controlType} />
            ))}
            <Form.Item>
              <Button type="primary" icon={<SearchOutlined />} onClick={() => { handleSearch() }}>
                查询
              </Button>
            </Form.Item>
          </Form>
          <div>
              <Button type="warning" icon={ <PlusOutlined /> } onClick={() => {submitForm.setFieldsValue({ratio:0});setIsModalOpen(true)}} style={{background:"rgb(233,159,70)",border:"none",color: "#fff"}}>
                创建账单
              </Button>
          </div>
          <Table
            size="middle"
            rowKey={ROW_KEY}
            columns={mergeColumns}
            dataSource={data?.list || []}
            loading={ loading }
            pagination={pagination}
          />
        </Space>
        <Modal
          title={isEdit ? "编辑账单" :"创建账单"}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="确定"
          cancelText="关闭"
          width={800}
        >
          <Form form={submitForm} labelCol={{span:4}} wrapperCol={{span: 18}}>
            {!isEdit && (
                <>
                    <Form.Item
                        label="开始账期"
                        name="startTime"
                        rules={[{ required: true, message: "请选择开始账期!" }]}
                    >
                        <DatePicker placeholder="选择开始账期" style={{width:"300px"}} />
                    </Form.Item>
                    <Form.Item
                        label="结束账期"
                        name="endTime"
                        rules={[{ required: true, message: "请选择结束账期!" }]}
                        >
                        <DatePicker placeholder="选择结束账期" style={{width:"300px"}} />
                    </Form.Item>
                </>
            )}
            {isEdit && (
                <>
                    <Form.Item
                        label="最终利润"
                        name="lastProfit"
                        rules={[{ required: true, message: "请输入最终利润!" }]}
                    >
                        <Input type="number" placeholder="请输入最终利润"/>
                    </Form.Item>
                    <Form.Item label="备注信息" name="textEx">
                        <TextArea rows={6} placeholder="请输入备注信息" />
                    </Form.Item>
                    <Form.Item label="状态" name="checkBillStatus">
                        <Radio.Group options={statusOptions} />
                    </Form.Item>
                </>
            )}
          </Form>
        </Modal>
        <Modal okText="确定" cancelText="关闭" title="提示" open={tipsShow} onOk={handleDel} onCancel={()=>{setTipsShow(false)}}>
          <div className="text-center text-red">是否确定删除该总账单?</div>
        </Modal>
      </Card>
    );
  };
  
  export default ProxyBill;
  