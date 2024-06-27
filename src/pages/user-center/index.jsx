import { Space, Card, message } from "antd";
import { getAgencyInfo } from "@/api/user-center";
import {useEffect,useState, } from "react";
import { CopyOutlined } from "@ant-design/icons";
import copy from "copy-to-clipboard"
import "./index.scss"
export default function UserCenter() {
	const [agentList, setAgentList] =
		useState({
			user: [],
			url: [],
			agnecy: "",
		});
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

	const handleCopy = (addr) => {
		copy(addr)
        message.success("复制成功")
	}
	useEffect(() => {
		getData();
	}, []);
	return (
		<Card title="个人中心">
			<Space
				direction="vertical"
				style={{
					width: "100%",
				}}>
				{/* <div className="p-4 text-lg">
					<section className="mt-10 flex justify-center flex-col gap-8">
						<ul className="m-auto list-none flex justify-center gap-4">
							<li>
								客户域名
							</li>
							<div>
								{agentList.user.map(
									(item,index) => (
										<li key={index}>{item}</li>
									)
								)}
							</div>
						</ul>
						<p className="flex justify-center gap-4">
							<p>代理账号:</p>
							<p>{ agentList.agnecy}</p>
						</p>
						<ul className="m-auto list-none flex justify-center gap-4">
							<li>我的分享链接:</li>
							<div>
								{agentList.url.map(
									(item,index) => (
										<li key={ index } className="">
											<a className="cursot-pointer text-blue-600">{ item }</a>
										</li>
									)
								)}
							</div>
						</ul>
					</section>
				</div> */}
				<section className="container">
					<div className="center-box">
						<div className="cust-label">客户域名:</div>
						<div className="cust-list">
							{agentList.user.map(
								(item,index) => (<div className="item" key={index}>{item}</div>)
							)}
						</div>
					</div>
					<div className="center-box">
						<div className="cust-label">代理账号:</div>
						<div className="cust-list">
							<div className="item text-warning" style={{fontWeight: "bold"}}>{ agentList.agency}</div>
						</div>
					</div>
					<div className="center-box">
						<div className="cust-label">我的分享链接:</div>
						<div className="cust-list">
							{agentList.url.map(
								(item,index) => (<div className="item text-green flex" style={{alignItems: "center"}} key={index}>
									<span>https://{item}</span>
									<span className="ml-2 cursor-pointer text-link" onClick={()=>{handleCopy(`https://${item}`)}}><CopyOutlined /></span>
								</div>)
							)}
						</div>
					</div>
				</section>
			</Space>
		</Card>
	);
}
