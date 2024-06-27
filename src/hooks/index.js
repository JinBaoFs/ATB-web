import { useState } from 'react'
import { Form } from 'antd'
import { useMemo } from 'react';
import { usePagination } from 'ahooks'
import { useCallback } from 'react';
const ROW_KEY = "id"

export const useAntdTableWithForm = (requestFunc,form,rowSelected) => {
    const selectPage = useCallback(async (options) => {
        const result = {
            total: 0,
            list: [],
        };
        try {
            const { current, pageSize, ...rest } = options;
            console.log(options,'====options')
            const { code, data } = await requestFunc({
                page: current,
                rows: pageSize,
                ...rest
            });

            if (code === 200) {
                result.total = data?.total ?? 0;
                result.list = data?.data ?? [];

                result.list = data?.data ?? [];
                result.other = data
                if(!data?.data && Array.isArray(data)){
                    result.list = data || []
                }
                
            }
        } catch (error) {
            console.log(error);
        }

        return result;
    }, [requestFunc])


    const [selectedRowKeys, setSelectedRowKeys] = useState(rowSelected || []);
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const resetRowSelected = () => setSelectedRowKeys([])

    const selectCount = useMemo(() => selectedRowKeys.length, [selectedRowKeys])


    const { data, loading, pagination, refresh, run } = usePagination(
        ({ current, pageSize, sortData }) => {
            return selectPage({
                current,
                pageSize,
                ...form.getFieldsValue(),
                ...sortData,
            });
        }
    );

    const mergePagination = useMemo(() => {
        return {
            ...pagination, showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `总共 ${total} 条`
        }
    }, [pagination])


    const handleSearch = (sortData) => {
        console.log(form.getFieldsValue(),"参数")
        run({ current: 1, pageSize: pagination.pageSize, ...form.getFieldsValue(),sortData})
    }

    return { ROW_KEY, selectCount, resetRowSelected, rowSelection, data, loading, pagination: mergePagination, selectedRowKeys, handleSearch }
}

export const useSearchForm = () => {
    const [form] = Form.useForm();

    const resetForm = () => {
        form.resetFields()
    }

    const formValues = useMemo(() => {
        const values = form.getFieldsValue(true)
        return values
    }, [form])

    return [form, formValues, resetForm]
}
