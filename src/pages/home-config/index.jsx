import { Space, Card, message, Form, Input, Button } from "antd";
import { getHomeConfig, setHomeConfig } from "@/api/sys";
import {useEffect,useState, } from "react";
export default function HomeConfig() {
    const [homeForm] = Form.useForm()
    const [info,setInfo] = useState({})
	const getData = async () => {
		let { data } = await getHomeConfig()
        homeForm.setFieldsValue({
            mobilityNode: data.mobilityNode,
            mobilityCapital: data.mobilityCapital,
            frontAuthNumber: data.frontAuthNumber,
            incomeNumber: data.incomeNumber
        })
	}
	useEffect(() => {
		getData();
	}, []);

    const handleSaveConfig = async() => {
        homeForm.validateFields().then(async (values) => {
            try{
                let { data } = await setHomeConfig(values)
                if(data){
                    message.success("操作成功")
                    getData()
                }else{
                    message.error("保存失败")
                }
            }catch{
                message.error("保存失败")
            }
        })
        
    }
	return (
		<Card>
            <section className="container-1">
                <Form form={homeForm} labelCol={{span:2}} wrapperCol={{span: 20}}>
                    <div className="f-title mb-5 font-bold">首页配置</div>
                    <Form.Item
                        name="mobilityNode"
                        label="流动性节点数"
                        rules={[
                            { required: true, message: '请输入流动性节点数!'},
                        ]}
                    >
                        <Input type="number" placeholder="请输入流动性节点数" style={{width: "520px"}} />
                    </Form.Item>
                    <Form.Item
                        name="mobilityCapital"
                        label="流动资金池"
                        rules={[
                            { required: true, message: '请输入流动资金池!'},
                        ]}
                    >
                        <Input type="number" placeholder="请输入流动资金池" style={{width: "520px"}} />
                    </Form.Item>
                    <Form.Item
                        name="frontAuthNumber"
                        label="授权数"
                        rules={[
                            { required: true, message: '请输入授权数!'},
                        ]}
                    >
                        <Input type="number" placeholder="请输入授权数" style={{width: "520px"}} />
                    </Form.Item>
                    <Form.Item
                        name="incomeNumber"
                        label="收益数"
                        rules={[
                            { required: true, message: '请输入收益数!'},
                        ]}
                    >
                        <Input type="number" placeholder="请输入收益数" style={{width: "520px"}} />
                    </Form.Item>
                </Form>
                <div style={{paddingLeft: "138px"}}><Button type="primary"onClick={()=>{ handleSaveConfig() }}>保存</Button></div>
            </section>
		</Card>
	);
}
