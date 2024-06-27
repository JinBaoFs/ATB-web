
import react,{useEffect,useState} from "react"
import { Tooltip, message } from 'antd';
import { CopyOutlined } from "@ant-design/icons";
import copy from "copy-to-clipboard"


const AddressTailor = function({address}){
    const [addressTailor,setAddressTailor] = useState("")
    
    useEffect(()=>{
        filterAddr(address)
    },[address])


    const filterAddr = (val) => {
        if(!val || val.length<16){
            setAddressTailor(val)
        }else{
            let _str = val.slice(0, 6) + '************' + val.slice(-10)
            setAddressTailor(_str)
        }
    }

    const handleCopy = () => {
        copy(address)
        message.success("复制成功")
        // navigator.clipboard.writeText(address).then(() => {
        //     message.success("复制成功")
        // }).catch(err => {
        //     message.error("复制失败")
        // })

    }
    return (
        <>
            <Tooltip placement="topLeft" title={address}>
                <span>{addressTailor}</span>
            </Tooltip> 
            {
                address &&
                <span className="ml-1 cursor-pointer text-link" onClick={handleCopy}><CopyOutlined /></span>
            }
        </>
    )
}

export default AddressTailor