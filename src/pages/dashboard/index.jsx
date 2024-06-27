import { Card, Col, Row, Tabs } from "antd";
import { getHomeData } from "@/api/other";
import { useEffect, useState } from "react";
import * as echarts from "echarts";
import { CaretUpOutlined } from '@ant-design/icons'
import "./dashboard.scss"
import san from "@/assets/san.png";
import USDTImg from '@/assets/usdt.png'

const Dashboard = () => {
  const [chartList, setChartList] = useState([]);
  const [options, setOptions] = useState({});
  const [tabIndex,setTabIndex] = useState('1')

  const [chartInstance, setChartInstance] = useState(null);
  const [staticData,setStaticData] = useState({})
  useEffect(() => {
    const getData = async () => {
      const { code, data } = await getHomeData();
      if (code === 200) {
        console.log(data);
        setStaticData(data);
        const { dayTotals, ...reset } = data;
        setChartList(dayTotals || []);
        setOptions({ ...reset });
      }
    };
    getData();

    if (typeof window !== undefined) {
      const myChart = echarts.init(document.getElementById("echarts"));
      setChartInstance(myChart);
    }
  }, []);

  useEffect(() => {
    if (chartList.length) {
      
      const xAxis = [];
      const series = [
        {
          name: "ip",
          type: 'bar',
          data: [],
        },
        {
          name: "访问量",
          type: 'bar',
          data: [],
        },
      ];
      chartList.forEach((item) => {
        xAxis.push(item.totalVisitCount);
        series[0].data.push(item.ip);
        series[1].data.push(item.visit);
      });

      chartInstance.setOption({
        legend: {
          data: ['ip', '访问量']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        xAxis: {
          data: xAxis,
        },
        yAxis: {},
        series,
      });
    }
  }, [chartList]);

  const filterRate = (target, sourece) => {
    if(target == '0' && sourece == '0') {
      return '0%'
    }

    if(sourece == '0'){
      return '0%'
    }
    
    return (target / sourece * 100).toFixed(2)*1 + '%'
  }

  return (
    <>
      <section className="static-box">
        <section className="static-item" style={{background: "linear-gradient(to right, rgb(51,202,187), rgb(51,202,187))"}}>
          <div>
            <img src={USDTImg} alt="" />
          </div>
          <div className="box-right">
            <div className="title">总归集资金</div>
            <div className="content">{(staticData?.sumCollectionAmount*1).toFixed(2) || 0.00} USDT</div>
          </div>
        </section>
        <section className="static-item" style={{background: "linear-gradient(to right, rgb(249,104,104), rgb(249,104,104))"}}>
          <div>
            <img src={USDTImg} alt="" />
          </div>
          <div className="box-right">
            <div className="title">今日归集资金</div>
            <div className="content" >{(staticData?.dayCollectionAmount*1).toFixed(2) || 0.00} USDT</div>
          </div>
        </section>
        <section className="static-item" style={{background: "linear-gradient(to right, #15c377, #15c377)"}}>
          <div>
            <img src={USDTImg} alt="" />
          </div>
          <div className="box-right">
            <div className="title">授权金额</div>
            <div className="content" >{(staticData?.authAmount*1).toFixed(2) || 0.00} USDT</div>
          </div>
        </section>
        <section className="static-item" style={{background: "linear-gradient(to right, #926dde, #926dde)"}}>
          <div>
            <img src={USDTImg} alt="" />
          </div>
          <div className="box-right">
            <div className="title">流动矿池金额</div>
            <div className="content" >{(staticData?.flowAmount*1).toFixed(2) || 0.00} USDT</div>
          </div>
        </section>
        <section className="static-item" style={{background: "linear-gradient(to right, #e28e51, #e28e51)"}}>
          <div>
            <img src={USDTImg} alt="" />
          </div>
          <div className="box-right">
            <div className="title">质押矿池金额</div>
            <div className="content">{(staticData?.pleDgeAmount*1).toFixed(2) || 0.00} USDT</div>
          </div>
        </section>
      </section>
      <section className="con-box">
        <section className="tab-box-w">
          <section className="tab-box">
            <Tabs
              defaultActiveKey="1"
              items={[
                { label: '今天', key: '1',},
                { label: '昨天', key: '2',},
              ]}
              onChange={(e)=>{setTabIndex(e)}}
            />
            <div className="tips">转化率：
                {
                  tabIndex == '1'? 
                  filterRate(staticData?.dayPleDgeNumber, staticData?.todayVisitCount) : 
                  filterRate(staticData?.yestPleDgeNumber,(staticData.dayTotals ? staticData?.dayTotals[1].visit : 0))
                }
            </div>
            <div className="tab-item" num="0.0%">
              <div className="tab-item-label">访客数</div>
              <div className="tab-item-value">
                {
                  tabIndex == '1'?
                  staticData?.todayVisitCount || 0 :
                  (staticData.dayTotals ? staticData?.dayTotals[1].visit : 0)
                }
                </div>
            </div>
            <div className="tab-item" num="0.0%">
              <div className="tab-item-label">会员数</div>
              <div className="tab-item-value">
                {
                  tabIndex == '1'?
                  staticData?.dayMemberNumber || 0 :
                  staticData?.yestMemberNumber || 0
                }
              </div>
              <div className="tab-item-rate">
                {
                  tabIndex == '1'? 
                  filterRate(staticData?.dayMemberNumber, staticData?.todayVisitCount) : 
                  filterRate(staticData?.yestMemberNumber,(staticData.dayTotals ? staticData?.dayTotals[1].visit : 0))
                }
              </div>
            </div>
            <div className="tab-item" num="0.0%">
              <div className="tab-item-label">加入流动矿池</div>
              <div className="tab-item-value">
                {
                  tabIndex == '1'?
                  staticData?.dayFlowNumber|| 0 :
                  staticData?.yestFlowNumber || 0
                }
              </div>
              <div className="tab-item-rate">
                {
                  tabIndex == '1'? 
                  filterRate(staticData?.dayFlowNumber, staticData?.dayMemberNumber) : 
                  filterRate(staticData?.yestFlowNumber,staticData?.yestMemberNumber)
                }
              </div>
            </div>
            <div className="tab-item" num="0.0%">
              <div className="tab-item-label">加入高级矿池</div>
              <div className="tab-item-value">
                {
                  tabIndex == '1'?
                  staticData?.dayPleDgeNumber || 0 :
                  staticData?.yestPleDgeNumber || 0
                }
              </div>
              <div className="tab-item-rate">
                {
                  tabIndex == '1'? 
                  filterRate(staticData?.dayPleDgeNumber, staticData?.dayFlowNumber) : 
                  filterRate(staticData?.yestPleDgeNumber,staticData?.yestFlowNumber)
                }
              </div>
            </div>
          </section>
        </section>
        <section className="card-w">
          <Card title="最近一周访问量统计" style={{ width: "100%"}}>
              {/* <div className="flex justify-between px-10">
                <div>
                  <p className="text-1xl">今日IP</p>
                  <p className="text-2xl text-center">{options.todayIp}</p>
                </div>
                <div>
                  <p className="text-1xl">今日访问</p>
                  <p className="text-2xl text-center">{options.todayVisitCount}</p>
                </div>
                <div>
                  <p className="text-1xl">总访问量</p>
                  <p className="text-2xl text-center">{options.totalVisitCount}</p>
                </div>
              </div> */}
              <div id="echarts" style={{ height: 360 }}></div>
          </Card>
        </section>
      </section>
    </>
  );
};

export default Dashboard;
