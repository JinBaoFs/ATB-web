import { Space, Card, message, Form, Input, Button } from "antd";
import { getAgencyInfo } from "@/api/user-center";
import {useEffect,useState, } from "react";
export default function Robot() {
	const [agentList, setAgentList] = useState({
        user: [],
        url: [],
        agnecy: "",
    });
    const [authForm] = Form.useForm()
	const getData = async () => {
		const agency = localStorage.getItem("agency");
		const res = await getAgencyInfo({ agency });
		if (res && res.data) {
			setAgentList({
				user: res.data.url.split(","),
				url: res.data.domain.split(","),
				agency,
			});
		}
	};
	useEffect(() => {
		// getData();
	}, []);
	return (
		<Card>
            <section className="container-1">
                <Form form={authForm} labelCol={{span:2}} wrapperCol={{span: 20}}>
                    <div className="f-title mb-5">机器人设置</div>
                    <Form.Item
                        name="chatId"
                        label="Chat ID"
                        rules={[
                            { required: true, message: '请输入Chat ID!'},
                        ]}
                    >
                        <Input placeholder="请输入Chat ID" style={{width: "520px"}} />
                    </Form.Item>
                    <Form.Item
                        label=""
                    >
                        <Button type="primary"onClick={()=>{ }}>保存</Button>
                    </Form.Item>
                </Form>
            </section>
		</Card>
	);
}
