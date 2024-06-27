import { Space, Form, Button, Table, Card, Modal, message, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { SearchFormItem } from '../components';
import { SearchFormItemEnum } from '@/enum';
import { useAntdTableWithForm ,useSearchForm} from '@/hooks';
import { getMiningLogs, updateRate, dividend, miningStatusUpdate } from '@/api/mining-logs';
import { collect } from "@/api/member";
import RateForm from './components/RateForm';
import { useState, useMemo } from 'react';
import { useResetState } from 'ahooks';
import { formItemMap } from '@/data';
import dayjs from "dayjs";
import { AddressTailor } from "@/components";
import { calculate } from '@/utils/index'



const getBusinessTypeStr = (key) => {
  return formItemMap[SearchFormItemEnum.MINING_TYPE].options.find(
    (item) => item.value === key
  )?.label;
};

const getCollectionStatusStr = (key) => {
  return formItemMap[SearchFormItemEnum.COLLECT_STATUS].options.find(
    (item) => item.value === key
  )?.label;
};

// const getStatusStr = (key) => {
//   return formItemMap[SearchFormItemEnum.COLLECT_STATUS].options.find(
//     (item) => item.value === key
//   ).label;
// };

const columns = [
  {
    title: "用户ID",
    dataIndex: 'userId',
    // align: 'center',
    width: 60,
  },
  {
    title: '链类型',
    dataIndex: 'chainType',
    // align: 'center',
    // width: 80,
  },
  {
    title: '用户地址',
    dataIndex: 'address',
    // align: 'center',
    render: (_, record) => (
      <AddressTailor address={record.address} />
    ),
  },
  {
    title: '代理',
    dataIndex: 'AgercyUser',
    // align: 'center',
    // width: 60,
  },

  // {
  //   title: '质押挖矿总资金',
  //   dataIndex: 'PledgeAmount',
  //   // align: 'center',
  //   width: 80,
  // },

  {
    title: '参与金额',
    dataIndex: 'participation',
    // align: 'center',
    // width: 60,
  },
  
  {
    title: '类型',
    // dataIndex: 'businessType',
    // align: 'center',
    render:(_,record)=><span>{getBusinessTypeStr(record?.businessType)}</span>,
    // width: 100,
  },

  // {
  //   title: '已派发收益',
  //   dataIndex: 'getEarnings',
  //   // align: 'center',
  //   width: 100,
  // },

  // {
  //   title: '派息次数',
  //   dataIndex: 'rateNumber',
  //   // align: 'center',
  //   width: 80,
  // },
  // {
  //   title: '质押天数',
  //   dataIndex: 'mineDay',
  //   // align: 'center',
  //   width: 80,
  // },
  // {
  //   title: '挖矿天数',
  //   dataIndex: 'timeDay',
  //   // align: 'center',
  //   render:(_,record)=>{
  //     return <span>{filterTime(record.CreateTime)}</span>
  //   },
  //   width: 80,
  // },
  // {
  //   title: '归集状态',
  //   // dataIndex: 'collectionStatus',
  //   // align: 'center',
  //   render:(_,record)=><span>{getCollectionStatusStr(record?.collectionStatus)}</span>,
  //   width: 80,
  // },
  // {
  //   title: '挖矿状态',
  //   // dataIndex: 'collectionStatus',
  //   // align: 'center',
  //   render:(_,record)=><span>{record?.status == "0" ? "进行中" : "已结束"}</span>,
  //   width: 80,
  // },
  // {
  //   title: '利率',
  //   dataIndex: 'rate',
  //   // align: 'center',
  //   width: 60,
  // },
  // {
  //   title: '收益',
  //   dataIndex: 'collection',
  //   // align: 'center',
  //   width: 60,
  //   render:(_,record)=><span>{calculate('*',calculate('*',(record.participation*1 + record.getEarnings*1),record.rate),filterTime(record.CreateTime))}</span>
  // },
  {
    title: '申请时间',
    dataIndex: 'createTime',
    // align: 'center',
    width: 160,
    render:(_,record)=><span>{dayjs(Number(record?.CreateTime*1000) || "").format('YYYY-MM-DD HH:mm:ss')}</span>
  },
];

const renderSearch = [
  SearchFormItemEnum.USER_ADDRESS,
  SearchFormItemEnum.ID,
  SearchFormItemEnum.PROXY,
  SearchFormItemEnum.DATE,
  // SearchFormItemEnum.MINING_TYPE,
  // SearchFormItemEnum.COLLECT_STATUS,
];

const RowAction = {
  RATE: 'RATE',
  DIVIDEND: 'DIVIDEND',
};
const filterTime = (time)=> {
  if(!time) return
  let nowData = new Date().getTime() / 1000
  let _time = nowData - time
  return Math.floor(_time/86400)
}
const MiningLogs = () => {
  const [form] = useSearchForm();
  const authority = localStorage.getItem('authority') || '1'
  const { ROW_KEY, data, pagination, handleSearch, loading } = useAntdTableWithForm(getMiningLogs,form);
  const mergeColumns = useMemo(() => {
    return columns.concat([
      // {
      //   title: '操作',
      //   // align: 'center',
      //   fixed: 'right',
      //   width: 80,
      //   render: (_, record) => (
      //     <div>
      //       {
      //         (authority == '0' && record.businessType == "1" && record.collectionStatus == "1") ?
      //         <span className="text-btn text-red mr-2 cursor-pointer mt-2" onClick={() => handleCollect(record)}>归集</span> : null
      //       }
      //     </div>
      //   ),
      // },
    ]);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitForm] = Form.useForm();
  const [interForm] =  Form.useForm();
  const [collForm] = Form.useForm()
  const showModal = (record, action) => {
    setRecord(record);
    setAction(action);
    setIsModalOpen(true);
    submitForm.setFieldsValue({
      ...record,
      PledgeAmount: record.participation || '0.00'
    });
  };

  const handleOk = () => {
    handleUpdateRate();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    resetRecord();
  };

  const [action, setAction] = useState('');
  const [record, setRecord, resetRecord] = useResetState({});
  const [amount, setAmount, resetAmount] = useResetState("");
  const [collModal,setCollModal] = useState(false)
  const [interestModal, setInterestModal] = useState(false)

  //打开归集弹窗
  const openCollModal = (record) =>{
    setRecord(record)
    setCollModal(true)
  }

  //确认归集
  const collModalConfirm = () => {
    setCollModal(false);
    handleCollect();
    collForm.resetFields()
  };

  //归集弹窗取消
  const collModalCancel = () => {
    setCollModal(false);
    resetRecord();
    resetAmount();
    collForm.resetFields()
  };
  // 归集
  const handleCollect = async (record) => {
    let collectionAddress = localStorage.getItem("collectionAddress")
    if(!collectionAddress){
      message.error("系统未设置归集地址，请先设置归集地址");
      return
    }
    try {
      console.log(record,"record")
      const { code, data } = await miningStatusUpdate({mineId: record?.id || "",})
      if (code === 200) {
        if(data){
          message.success("归集成功");
          handleSearch()
        }else{
          message.error("归集失败");
        } 
      }
    } catch (error) {
      message.error("归集失败");
      console.log(`【pages/member/index.jsx-handleCollect】error`);
    }
  };

  // const handleUpdateMinStatus = async (record)=> {
  //   miningStatusUpdate({mineId: record?.id || "",}).then(res=>{
  //     if(res.code == 200){
  //       handleSearch()
  //     }
  //   })
  // }

  const handleUpdateRate = async () => {
    try {
      const formValues = submitForm.getFieldsValue(true);
      const { code } = await updateRate({ ...formValues, mine_id: record.id });
      if (code === 200) {
        message.success('修改利率成功');
        handleSearch()
      }
    } catch (error) {
      message.error('修改利率失败');
      console.log(`【pages/mining-logs/index.jsx-handleUpdateRate】error`);
    }
  };

  //打开派息弹窗
  const openInterestModal = (record) => {
    setRecord(record)
    setAmount(((record.PledgeAmount || 0) * record.rate))
    setInterestModal(true)
    interForm.setFieldsValue({
      participation: record.participation,
      getEarnings: record.getEarnings,
      amount: calculate('*',(record.participation*1 + record.getEarnings*1),record.rate), 
      tipsAmount: calculate('*',(record.participation*1 + record.getEarnings*1),record.rate),
    })
  }

  //派息弹窗确认
  const interestModalConfirm = () => {
    handleDividend(record)
    resetAmount();
    setInterestModal(false)
    resetRecord();
  }

  //派息弹窗取消
  const interestModalCancel = () => {
    setInterestModal(false)
    resetRecord();
    resetAmount();
  }

  //派息
  const handleDividend = async (record) => {
    const formValues = interForm.getFieldsValue(true);
    try {
      const { code } = await dividend({ 
        miner_id: record.id,
        amount: formValues.amount
      });
      if (code === 200) {
        message.success('派息成功');
        handleSearch()
      }
    } catch (error) {
      message.error('派息失败');
      console.log(`【pages/mining-logs/index.jsx-handleDividend】error`);
    }
  };

  return (
    <Card>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Form layout='inline' form={form}>
          {renderSearch.map((controlType) => (
            <SearchFormItem controlType={controlType} key={controlType} />
          ))}
          <Form.Item>
            <Button type='primary' icon={<SearchOutlined />} onClick={()=>{handleSearch()}}>
              查询
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
        title='修改利率'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText='确定'
        cancelText='关闭'
        width={800}
      >
        <Form form={submitForm}  labelCol={{span:4}} wrapperCol={{span: 18}}>
          <RateForm />
        </Form>
      </Modal>
      <Modal
        title="归集余额操作"
        open={collModal}
        onOk={collModalConfirm}
        onCancel={collModalCancel}
        okText="确定"
        cancelText="关闭"
        width={800}
      >
        <Form form={collForm} labelCol={{span:4}} wrapperCol={{span: 18}}>
          <Form.Item label="客户地址">
            <div>{record?.address}</div>
          </Form.Item>
          <Form.Item label="归集USDT数量" name="amount">
            <Input
              placeholder="请输入归集USDT数量"
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="派发收益"
        open={interestModal}
        onOk={interestModalConfirm}
        onCancel={interestModalCancel}
        okText="确定"
        cancelText="关闭"
        width={800}
      >
        <Form form={interForm} labelCol={{span: 4}} wrapperCol={{span: 18}}>
          <Form.Item label="质押USDT" name="participation">
            <Input disabled/>
          </Form.Item>
          <Form.Item label="已派发USDT" name="getEarnings">
            <Input disabled/>
          </Form.Item>
          <Form.Item label="系统计算的收益" name="tipsAmount">
            <Input disabled/>
          </Form.Item>
          <Form.Item label="算式">
            <span style={{color: 'red'}}>{record.rate} * ({record.participation} + {record.getEarnings})</span>
          </Form.Item>
          <Form.Item label="派发USDT" name="amount">
            <Input type="number" onChange={(e)=>setAmount(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default MiningLogs;
