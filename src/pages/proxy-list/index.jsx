import {
  Space,
  Form,
  Button,
  Table,
  Card,
  Modal,
  message,
  Input,
  InputNumber,
} from "antd";
import { 
  SearchOutlined, 
  ReloadOutlined,
  PlusOutlined

} from "@ant-design/icons";
import { useMemo, useState } from "react";
import { SearchFormItem } from "../components";
import { SearchFormItemEnum } from "@/enum";
import { formItemMap } from "@/data";
import { useAntdTableWithForm, useSearchForm } from "@/hooks";
import { useResetState } from "ahooks";
import dayjs from "dayjs";
import {
  getProxyList,
  createAccount,
  update_domainUrl,
  resetPassword,
  deleteAccount
} from "@/api/proxy-list";
import { useEffect } from "react";

const getAuthorizationSystemStr = (key) => {
  return formItemMap[SearchFormItemEnum.AUTH_STATUS].options.find(
    (item) => item.value === key
  ).label;
};
const { TextArea } = Input;

const columns = [
  {
    title: "代理账号",
    dataIndex: "user",
    // align: "center",
    width: 100,
  },
  {
    title: "客户域名",
    dataIndex: "url",
    // align: "center",
    width: 320,
  },
  {
    title: "上级代理",
    dataIndex: "inviter",
    // align: "center",
    render:(_,record)=><span>{record.inviter == "1" ? "" : record.inviter}</span>
  },
  {
    title: "授权数",
    dataIndex: "authNumber",
    // align: "center",
    sorter: true,
  },
  {
    title: "归集金额",
    dataIndex: "amount",
    // align: "center",
    sorter: true,
  },
  {
    title: "分成比例",
    dataIndex: "ratio",
    // align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "ratio",
    // align: "center",
    render:(_,record)=><span>{record?.time ? dayjs(Number(record?.time*1000) || "").format('YYYY-MM-DD HH:mm:ss') : '-'}</span>
  },
];

const renderSearch = [
  SearchFormItemEnum.PROXY,
  SearchFormItemEnum.CLIENT_DOMAIN,
  SearchFormItemEnum.DATE
];

const ProxyList = () => {
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
    } = useAntdTableWithForm(getProxyList, form);

  const mergeColumns = useMemo(() => {
    return columns.concat([
      {
        title: "操作",
        // align: "center",
        // fixed: "right",
        width: 180,
        render: (_, record) => (
          <div style={{display: "flex",flexWrap:"wrap"}}>
            <span onClick={() => showModal(record)} className="text-link mr-2 mt-2">修改域名</span>
            {
              record.user != agency && (
                <>
                  <span onClick={() => openPwd(record)} className="text-link mr-2 mt-2 cursor-pointer">重置密码</span>
                  {/* <span onClick={() => handleDelete(record)} className="text-red mr-2 mt-2 cursor-pointer">删除</span> */}
                </>
              )
            }
          </div>
          
        ),
      },
    ]);
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (record) => {
    setRecord(record);
    submitForm.setFieldsValue({
      address: record.user,
      domainUrl: record.url,
      password_id: record.passwordId,
    });
    setIsModalOpen(true);
  };

  const handleOk = () => {
    submitForm.validateFields().then(async (values) => {
      setIsModalOpen(false);
      Object.keys(record).length ? handleUpdateDomain() : handleCreate();
      submitForm.resetFields()
    }).catch()
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    resetCord();
    submitForm.resetFields()
  };

  const [record, setRecord, resetCord] = useResetState({});
  const [pwdShow,setPwdShow] = useState(false);
  const [pwdForm] = Form.useForm();
  const [submitForm] = Form.useForm();

  const handleCreate = async () => {
    try {
      const result = submitForm.validateFields();
      if (!result) {
        return;
      }
      const formValues = submitForm.getFieldsValue(true);
      const { code, data } = await createAccount({
        ...formValues,
        inviter: localStorage.getItem('agency')
      });
      if(data){
        message.success("创建代理账号成功")
      }else{
        message.error("创建失败,账户已存在!")
      }
      handleSearch()
    } catch (error) {
      message.error("创建代理账号失败");
      console.log(`【pages/proxy-list/index.jsx-handleCreate】error`);
    }
  };

  const handleUpdateDomain = async () => {
    try {
      const formValues = submitForm.getFieldsValue(true);
      const { code } = await update_domainUrl({
        password_id: formValues.password_id,
        domainUrl: formValues.domainUrl,
      });
      if (code === 200) {
        message.success("更新客户域名成功");
        handleSearch()
      }
    } catch (error) {}
  };

  const handleChangeTab = (p, f, { field, order }) => {
    console.log(f,p,field,order)
    let authAmount = ''
    let authNumber = ''
    if(field == 'authNumber'){
        if(order == 'descend'){
          authNumber = 1
        }else if(order == 'ascend'){
          authNumber = 0
        }else{
          authNumber = ''
        }
    }else if(field == 'amount'){
      if(order == 'descend'){
        authAmount = 1
      }else if(order == 'ascend'){
        authAmount = 0
      }else{
        authAmount = ''
      }
    }
    if(p.current != pagination.current){return}
    if(field && order){
      handleSearch({authAmount,authNumber})
    }
  }

  const openPwd = (record) => {
    setRecord(record)
    setPwdShow(true)
    pwdForm.setFieldsValue({
      address: record.user
    })
  }
  const handlePwdConfirm = async () => {
    pwdForm.validateFields().then(async (values) => {
      try{
        let { code, data } = await resetPassword({
          newPassword: values.password,
          id: record.passwordId
        })
        if(code == 200){
          if(data){
            message.success("重置密码成功")
          }else{ 
            message.error("重置密码失败")
          }
        }
        pwdForm.resetFields()
        setPwdShow(false)
      }catch{
        message.error("重置密码失败")
      }
    }).catch((error)=>{
      console.log(err)
    })
    // let values = pwdForm.getFieldsValue()
    
  }

  const handlePwdCancel = () => {
    setPwdShow(false)
    pwdForm.resetFields()
  }

  // 删除代理
  const handleDelete = async (record) => {
    try{
      const { data } = await deleteAccount({id:record.id})
      if(data){
        message.success("操作成功")
      }else{
        message.error("操作失败")
      }
      handleSearch()
    }catch{
      message.error("操作失败")
    }
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
              新增代理
            </Button>
        </div>
        <Table
          size="middle"
          rowKey="passwordId"
          columns={mergeColumns}
          dataSource={data?.list || []}
          loading={ loading }
          onChange={handleChangeTab}
          pagination={
            pagination
          }
        />
      </Space>
      <Modal
        title={isEdit ? "修改域名" : "新增代理"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="关闭"
        width={800}
      >
        <Form form={submitForm} labelCol={{span:4}} wrapperCol={{span: 18}}>
          <Form.Item
            label="代理账号"
            name="address"
            rules={[{ required: true, message: "请输入代理账号!" }]}
          >
            <Input placeholder="请输入" disabled={isEdit} />
          </Form.Item>
          <Form.Item label="客户域名" name="domainUrl">
            <TextArea rows={4} placeholder="请输入客户域名,以,号隔开" />
          </Form.Item>

          {!isEdit && (
            <>
              <Form.Item label="分成比例" name="ratio">
                <InputNumber placeholder="分成比例" />
              </Form.Item>
              <Form.Item
                label="初始密码"
                name="password"
                rules={[{ required: true, message: "请输入初始密码!" }]}
              >
                <Input.Password placeholder="请输入初始密码" disabled={isEdit} />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
      <Modal
        title={"重置密码"}
        open={pwdShow}
        onOk={handlePwdConfirm}
        onCancel={handlePwdCancel}
        okText="确定"
        cancelText="关闭"
        width={800}
      >
        <Form form={pwdForm} labelCol={{span:4}} wrapperCol={{span: 18}}>
            <Form.Item
              label="代理账号"
              name="address"
            >
            <Input placeholder="请输入" disabled={true} />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="password"
            rules={[{ required: true, message: "请输入密码",}]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProxyList;
