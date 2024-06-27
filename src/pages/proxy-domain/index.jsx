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
    Select
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
  import { 
    getSysDomainList, 
    getProxyDomainList,
    addProxyDomain,
    editProxyDomain,
} from "@/api/sys"
  import { useEffect } from "react";

  const domainStatusOptions = [
    {
      value: "0",
      label: "开启",
    },
    {
      value: "1",
      label: "关闭",
    }
  ]

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 80,
    },
    {
      title: "代理域名",
      dataIndex: "agencyURL",
    },
    {
      title: "状态",
      dataIndex: "statusType",
      render: (_, record) => {
        switch (record.statusType) {
          case "0":
            return <span className="text-green">可用</span>;
          case "1":
            return <span className="text-hui">禁用</span>;
        }
      },
    },
    {
      title: "创建时间",
      dataIndex: "ratio",
      width: 160,
      render:(_,record)=><span>{record?.CreateTime ? dayjs(Number(record?.CreateTime*1000) || "").format('YYYY-MM-DD HH:mm:ss') : '-'}</span>
    },
  ];
  
  const renderSearch = [
    SearchFormItemEnum.DOMAIN_STATUS,
    SearchFormItemEnum.DATE
  ];
  
  const ProxyDomain = () => {
    let agency = localStorage.getItem("agency") || ""
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
      } = useAntdTableWithForm(getProxyDomainList, form)
    
  
    const mergeColumns = useMemo(() => {
      return columns.concat([
        {
          title: "操作",
          width: 80,
          render: (_, record) => (
            <div style={{display: "flex",flexWrap:"wrap"}}>
              <span onClick={() => showModal(record)} className="text-link mr-2">编辑</span>
            </div>
          ),
        },
      ]);
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sysDomainList, setSysDomainList] = useState([]);
    const [sysDomainListTow, setSysDomainListTow] = useState([]);

    useEffect(()=>{
        handleGetSysDomainList()
    },[])

    const handleGetSysDomainList = async() => {
        let { data } = await getSysDomainList()
        let arr = []
        let select_arr = []
        if(data.length){
            data.map(item=>{
                arr.push({label:item.url,value:item.id})
                select_arr.push({label:item.url,value:item.id,disabled:item.statusType == "1"})
            })
            setSysDomainList(arr)
            setSysDomainListTow(select_arr)
        }
    }

    const showModal = (record) => {
      setRecord(record);
      sysDomainList.map(item=>{
        if(item.value == record.id) setSysDomainUrl(item.label)
      })
      submitForm.setFieldsValue({
        agencyDomain: record.agencyURL,
        systemType: record.statusType,
        systemDomainId: record.systemID
      });
      setIsModalOpen(true);
    };
  
    const handleOk = () => {
      submitForm.validateFields().then(async (values) => {
        setIsModalOpen(false);
        Object.keys(record).length ? handleEdit() : handleCreate();
        submitForm.resetFields()
      }).catch()
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
      resetCord();
      submitForm.resetFields()
    };
  
    const [record, setRecord, resetCord] = useResetState({});
    const [submitForm] = Form.useForm();
    const [sysDomainUrl, setSysDomainUrl] = useState("")
  
    const handleCreate = async () => {
      try {
        const formValues = submitForm.getFieldsValue(true);
        const { code } = await addProxyDomain({
            agencyDomain: formValues.agencyDomain + `.${sysDomainUrl}`,
            systemDomainId: formValues.systemDomainId
        })
        if (code === 200) {
          message.success("添加域名成功");
          handleSearch()
        }
      } catch (error) {
        message.error("添加域名失败");
        console.log(`【pages/proxy-list/index.jsx-handleCreate】error`);
      }
    };

    const handleEdit = async () => {
      try {
        const formValues = submitForm.getFieldsValue(true);
        const { code } = await editProxyDomain({
          id: record.id,
          systemType: formValues.systemType,
        })
        if (code === 200) {
          message.success("修改域名成功");
          handleSearch()
        }
      } catch (error) {
        message.error("修改域名失败");
        console.log(`【pages/proxy-list/index.jsx-handleCreate】error`);
      }
      resetCord();
    };

    const isEdit = useMemo(() => {
      return Object.keys(record).length > 0;
    }, [record]);

    return (
      <Card className="w-full h-full">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Form layout="inline" form={form}>
            <Form.Item name="systemDomainId" className='!mb-4 width300'>
                <Select
                    options={sysDomainList}
                    placeholder={"请选择系统域名"}
                    allowClear
                />
            </Form.Item>
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
              <Button type="warning" icon={ <PlusOutlined /> } onClick={() => {
                    submitForm.setFieldsValue({systemType:"0"});
                    setSysDomainUrl("");
                    setIsModalOpen(true)}} style={{background:"rgb(233,159,70)",border:"none",color: "#fff"}}>
                创建代理域名
              </Button>
          </div>
          <Table
            size="middle"
            rowKey={ROW_KEY}
            pagination={pagination}
            columns={mergeColumns}
            dataSource={data?.list || []}
            loading={loading}
          />
        </Space>
        <Modal
          title={isEdit ? "修改域名" : "创建代理域名"}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="确定"
          cancelText="关闭"
          width={800}
        >
          <Form form={submitForm} labelCol={{span:4}} wrapperCol={{span: 18}}>
            <Form.Item
              label="系统域名"
              name="systemDomainId"
              rules={[{ required: true, message: "请选择系统域名" }]}
            >
                <Select
                    options={sysDomainListTow}
                    placeholder={"请选择系统域名"}
                    allowClear
                    disabled={isEdit}
                    style={{width: "300px"}}
                    onChange={(value,option)=>{
                        setSysDomainUrl(option.label)
                    }}
                />
            </Form.Item>
            <Form.Item label="代理域名" 
                name="agencyDomain"
                rules={[{ required: true, message: ""}]}
                style={{marginBottom: "0"}}
            >
                <div className="flex">
                    <Form.Item
                        name="agencyDomain"
                        rules={[{ required: true, message: "请输入代理域名" }]}
                    >
                        <Input 
                            placeholder="请输入"
                            disabled={isEdit}
                            style={{width: "100px",height: "36px",lineHeight:"36px"}}
                        />
                    </Form.Item>
                    <div className="w-[120px] ml-2" style={{lineHeight: "32px"}}>{sysDomainUrl && '.'}{sysDomainUrl}</div>
                </div>
            </Form.Item>
            
            <Form.Item label="状态" name="systemType">
              <Radio.Group options={domainStatusOptions} disabled={!isEdit} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    );
  };
  
  export default ProxyDomain;
  