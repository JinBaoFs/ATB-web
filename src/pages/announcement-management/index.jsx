import { Space, Table, Card, Button, Modal, message } from "antd";
import {
  getBulletinList,
  crateBulletin,
  updateBulletins,
  getBulletin,
  removeBulletins,
} from "@/api/bulletin";
import { 
  SearchOutlined,
  PlusSquareOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from 'react-router-dom';
import { useAntdTableWithForm, useSearchForm } from "@/hooks";

import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { Input, DatePicker, Form } from "antd";
import { getMemberList } from "@/api/member";

import { useResetState } from "ahooks";
import { UserSelect } from "@/components";

import { SearchFormItem } from "../components";
import { SearchFormItemEnum } from "@/enum";
import dayjs from "dayjs";
import moment from "moment"
import { AddressTailor } from "@/components";
const { TextArea } = Input;
const columns = [
  {
    title: "ID",
    dataIndex: "id",
    // align: "center",
    width: 60,
  },
  {
    title: "用户地址",
    dataIndex: "id",
    render: (_, record) => {
      return (
        record.dataAddress.map(item=>{
          return (
              <div>
                <AddressTailor address={item} />
              </div>
          )
        })
      )
    },
  },
  {
    title: "发布人",
    dataIndex: "issue",
    // align: "center",
  },
  {
    title: "开始时间",
    dataIndex: "startTime",
    // align: "center",
    render:(_,record)=><span>{dayjs.unix(record.startTime).format("YYYY-MM-DD HH:mm:ss")}</span>
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
    // align: "center",
    render:(_,record)=><span>{ record.endTime? dayjs.unix(record.endTime).format("YYYY-MM-DD HH:mm:ss") : '-'}</span>
  },
  
];

const AnnouncementManagement = () => {
  const [form] = useSearchForm();
  useEffect(()=>{
    const params = new URLSearchParams(location.search);
    const address = params.get('address');
    form.setFieldsValue({
      address
    })
  },[])
  const { ROW_KEY, pagination,data,handleSearch,loading } = useAntdTableWithForm(
    getBulletinList,
    form
  );
  const renderSearch = [
    SearchFormItemEnum.USER_ADDRESS,
    SearchFormItemEnum.NID,
    SearchFormItemEnum.PROXY,
    SearchFormItemEnum.DATE
  ];
  // const { ROW_KEY, data, pagination } =
  // useAntdTableWithForm(getBulletinList);

  // const [data, setData] = useState([]);

  const getList = async () => {
    const { code, data } = await getBulletinList();
    if (code === 200) {
      setData(data || []);
    }
  };
  useEffect(() => {
    // getList();
  }, []);

  const mergeColumns = useMemo(() => {
    return columns.concat([
      {
        title: "操作",
        width: 160,
        render: (_, record) => (
          <div>
            <span className="btn-text text-warning mr-2 mt-2 cursor-pointer" onClick={() => showModal(record)}>编辑</span>
            <span className="btn-text text-link mr-2 mt-2 cursor-pointer" onClick={() => handleDetail(record)}>查看详情</span>
            <span className="btn-text text-hui mr-2 mt-2 cursor-pointer" onClick={() => handleRemove(record)}>删除</span>
          </div>
        ),
      },
    ]);
  }, [columns]);

  const [record, setRecord, resetRecord] = useResetState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);

  const showModal = async (record) => {
    setIsModalOpen(true);
    if(record){
      const { content, dataAddress, endTime, id, startTime } = record;
      const obj = {
        id,
        // title: decodeURIComponent(title),
        content: content ? decodeURIComponent(content) : '',
        address_s: dataAddress,
        start_time: moment(startTime*1000),
        end_time: endTime ? moment(endTime*1000) : "",
      };
      record && submitForm.setFieldsValue(obj);
      record && setRecord(record);
    }else{
      const params = new URLSearchParams(location.search);
      const address = params.get('address')
      if(address){
        submitForm.setFieldsValue({
          address_s: [address],
        })
      }
    }
  };

  const [submitForm] = Form.useForm();

  const handleOk = () => {
    submitForm.validateFields().then(async (values) => {
      handleSubmit();
      setIsModalOpen(false);
    })
  };

  const handleSubmit = async () => {
    const formValues = submitForm.getFieldsValue(true);
    const data = {
      agency: localStorage.getItem("agency"),
      address_s: formValues.address_s?.length
        ? formValues.address_s.join(",")
        : formValues.address_s,
      start_time:
        typeof formValues.start_time === "string"
          ? formValues.start_time ? new Date(formValues.start_time).getTime() / 1000 : ""
          : formValues.start_time ? new Date(formValues.start_time.format("YYYY-MM-DD HH:mm:ss")).getTime() / 1000 : "",
      end_time:
        typeof formValues.end_time === "string"
          ? (formValues.end_time ? new Date(formValues.end_time).getTime() / 1000: "")
          : (formValues.end_time ? new Date(formValues.end_time.format("YYYY-MM-DD HH:mm:ss")).getTime() / 1000 : ""),
      content: formValues.content
        ? encodeURIComponent(formValues.content)
        : formValues.content,
    };
    if (record && record.id) {
      data.title_id = record.id;
    }
    try {
      const { code } = Object.keys(record).length
        ? await updateBulletins(data)
        : await crateBulletin(data);
      if (code === 200) {
        getList();
        message.success("操作成功");
        submitForm.resetFields()
        handleSearch()
      }
    } catch (error) {
      resetRecord()
      submitForm.resetFields()
      message.error("操作失败");
      console.log(
        `【pages/announcement-management/index.jsx-handleSubmit】error`,
        error
      );
    }
  };

  const handleRemove = async (record) => {
    try {
      const { code } = await removeBulletins({ title_id: record.id });
      if (code === 200) {
        message.success("删除成功");
        handleSearch()
      }
    } catch (error) {
      message.error("删除失败");
      console.log(
        `【pages/announcement-management/index.jsx-handleRemove】error`
      );
    }
  };

  //查看详情
  const handleDetail = (record)=>{
    setRecord(record)
    setDetailsModal(true)
  };

  const detailsModalCancel = ()=>{
    resetRecord()
    setDetailsModal(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    resetRecord();
    submitForm.resetFields()
  };

  return (
    <Card>
      <Space
        direction="vertical"
        style={{
          width: "100%",
        }}
      >
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
        {/* <TableAlert
        selectCount={selectCount}
        resetRowSelected={resetRowSelected}
      /> */}
        <Button type="primary" icon={ <PlusOutlined /> } onClick={() => showModal()} style={{background:"rgb(233,159,70)",border:"none",color: "#fff"}}>
          发布通告
        </Button>
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
        title={Object.keys(record).length ? "编辑通告" : "发布通告"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="关闭"
        width={1000}
        destroyOnClose
      >
        <Form form={submitForm} labelCol={{span:3}} wrapperCol={{span: 19}}>
          {/* <Form.Item 
            label="标题" 
            name="title"
            rules={[
              { required: true, message: '请输入标题'},
            ]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item> */}
          <Form.Item 
            label="用户地址" 
            name="address_s"
            className="select-more"
            rules={[
              { required: true, message: '请选择用户地址'},
            ]}
          >
            <UserSelect/>
          </Form.Item>
          <Form.Item label="开始时间" 
            name="start_time"
            rules={[
              { required: true, message: '请选择开始时间'},
            ]}
          >
            <DatePicker showTime placeholder="选择开始时间" />
          </Form.Item>
          <Form.Item 
            label="结束时间" 
            name="end_time"
          >
            <DatePicker showTime placeholder="选择结束时间" />
          </Form.Item>
          <Form.Item 
            label="内容" 
            name="content"
            rules={[
              { required: true, message: '请输入内容'},
            ]}
          >
            {/* <RichText /> */}
            <TextArea rows={4} placeholder="请输入内容" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="查看详情"
        open={detailsModal}
        onCancel={detailsModalCancel}
        okText=""
        cancelText="关闭"
        width={800}
      >
        <div style={{background: '#f2f2f2',padding: '10px',borderRadius: '6px'}} dangerouslySetInnerHTML={{__html: record.content}}></div>
      </Modal>
    </Card>
  );
};

export default AnnouncementManagement;

const RichText = ({ value, onChange }) => {
  // 编辑器内容
  const [html, setHtml] = useState(value || "");
  const [editor, setEditor] = useState(null);
  const toolbarConfig = {};
  const editorConfig = {
    // JS 语法
    placeholder: "请输入内容...",
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);
  const handleChange = (editor) => {
    setHtml(editor.getHtml());
    onChange?.(editor.getHtml());
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        zIndex: 100,
      }}
    >
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{
          borderBottom: "1px solid #ccc",
        }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        onCreated={setEditor}
        onChange={(editor) => handleChange(editor)}
        mode="default"
        style={{
          height: "200px",
          overflowY: "hidden",
        }}
      />
    </div>
  );
};
