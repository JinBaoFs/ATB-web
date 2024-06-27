import { Button,Form, Input, Switch, Modal, message } from "antd";
import { useEffect, useState } from "react";
import * as echarts from "echarts";
import { CaretUpOutlined } from '@ant-design/icons'
import { editRelation, getTokenStatus, updateTokenStatus } from "@/api/other";
import "./dashboard.scss"

const Dashboard = () => {

  const [updateForm] = Form.useForm()
  const [ btnLoading, setBtnLoading ] = useState(false)
  const [ switchLoading, setSwitchLoading ] = useState(false)
  const [ atbValue, setAtbValue ] = useState(0)
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('');

  const handleEdit = () => {
    updateForm.validateFields().then(async (values) => {
      setBtnLoading(true)
        try{
            let { data } = await editRelation(values)
            if(data){
                message.success("修改成功")
                updateForm.resetFields()
            }else{
                message.error("修改失败")
            }
            setBtnLoading(false)
        }catch{
            message.error("修改失败")
            setBtnLoading(false)
        }
    })
  }

  const switchChange = (e) => {
    setSwitchLoading(true)
    if(e == true){
      setModalText("是否开启ATB")
    }else{
      setModalText("是否关闭ATB")
    }
    setAtbValue(e ? 0 : 1)
    setOpen(true)
  }

  const handleOk = async() => {
    setConfirmLoading(true);
    let { data } = await updateTokenStatus({
      status: atbValue
    })
    if(data){
      message.success("操作成功")
    }else{
      message.error("操作失败")
    }
    handleGetTokenStatus()
    setOpen(false)
    setConfirmLoading(false)
    setSwitchLoading(false)
  }


  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(()=>{
    handleGetTokenStatus()
  },[])

  const handleGetTokenStatus = async() => {
    let { data } = await getTokenStatus()
    setAtbValue(Number(data))
  }
  return (
    <>
      <section className="static-box">
        <div className="static-item">
          <div className="title">推荐关系修改</div>
          <Form form={updateForm} labelAlign="2">
              <Form.Item
                  name="address"
                  label="钱包地址"
                  rules={[
                      { required: true, message: '请输入钱包地址!'},
                  ]}
              >
                  <Input placeholder="请输入钱包地址" style={{width: "520px"}} />
              </Form.Item>
              <Form.Item
                  name="inviter"
                  label="上级地址"
                  rules={[
                      { required: true, message: '请输入推荐人!'},
                  ]}
              >
                  <Input placeholder="请输入推荐人" style={{width: "520px"}} />
              </Form.Item>
          </Form>
          <Button type="primary" onClick={handleEdit} loading={btnLoading}>修改</Button>
        </div>
        <div className="static-item">
          <div className="title">ATB开关配置</div>
          <Switch checkedChildren="开启" loading={switchLoading} unCheckedChildren="关闭" checked={atbValue == 0 ? true: false} onChange={ switchChange } />
        </div>
        <Modal
          title="提示"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <p>{modalText}</p>
        </Modal>
      </section>
    </>
  );
};

export default Dashboard;
