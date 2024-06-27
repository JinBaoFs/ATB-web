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
  import { getSysDomainList, addSysDomain, editSysDomain } from "@/api/sys"
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
      title: "域名",
      dataIndex: "url",
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
    SearchFormItemEnum.DOMAIN,
    SearchFormItemEnum.DOMAIN_STATUS,
    SearchFormItemEnum.DATE
  ];
  
  const SysDomain = () => {
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
      } = useAntdTableWithForm(getSysDomainList, form)
  
    const mergeColumns = useMemo(() => {
      return columns.concat([
        {
          title: "操作",
          width: 140,
          render: (_, record) => (
            <div style={{display: "flex",flexWrap:"wrap"}}>
              <span onClick={() => showModal(record)} className="text-link mr-2">编辑</span>
            </div>
          ),
        },
      ]);
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = (record) => {
      setRecord(record);
      submitForm.setFieldsValue({
        systemDomain: record.url,
        systemType: record.statusType
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
  
    const handleCreate = async () => {
      try {
        const formValues = submitForm.getFieldsValue(true);
        const { code } = await addSysDomain({
          systemDomain: formValues.systemDomain
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
        const { code } = await editSysDomain({
          systemDomain: formValues.systemDomain,
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
    };

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
              <Button type="warning" icon={ <PlusOutlined /> } onClick={() => {submitForm.setFieldsValue({systemType:"0"});setIsModalOpen(true)}} style={{background:"rgb(233,159,70)",border:"none",color: "#fff"}}>
                添加域名
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
          title={isEdit ? "修改域名" : "添加系统域名"}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="确定"
          cancelText="关闭"
          width={800}
        >
          <Form form={submitForm} labelCol={{span:4}} wrapperCol={{span: 18}}>
            <Form.Item
              label="一级域名"
              name="systemDomain"
              rules={[{ required: true, message: "请输入一级域名!" }]}
            >
              <Input placeholder="请输入" disabled={isEdit} />
            </Form.Item>
            <Form.Item label="状态" name="systemType">
              <Radio.Group options={domainStatusOptions} disabled={!isEdit} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    );
  };
  
  export default SysDomain;
  