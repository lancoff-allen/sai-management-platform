import React, { useEffect } from 'react';
import { Button, Input, Row, Col, Pagination, Loading } from 'tdesign-react';
import { SearchIcon } from 'tdesign-icons-react';
import { useNavigate } from 'react-router-dom'; // 新增导入
import { useAppDispatch, useAppSelector } from 'modules/store';
import { getList, switchPageLoading, selectDeviceCategory } from 'modules/device/category';
import CategoryCard from './components/CategoryCard';
import Style from './index.module.less';

const DeviceCategory = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate(); // 新增
  const pageState = useAppSelector(selectDeviceCategory);

  const pageInit = async () => {
    await dispatch(
      getList({
        pageSize: pageState.pageSize,
        current: 1,
      }),
    );
    await dispatch(switchPageLoading(false));
  };

  useEffect(() => {
    pageInit();
  }, []);

  const onChange = (pageInfo: any) => {
    dispatch(
      getList({
        pageSize: pageState.pageSize,
        current: pageInfo.current,
      }),
    );
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(
      getList({
        pageSize: size,
        current: 1,
      }),
    );
  };

  // 新增分类处理函数
  const handleAddCategory = () => {
    navigate('/device/add-category');
  };

  return (
    <div>
      <div className={Style.toolBar}>
        <Button onClick={handleAddCategory}>新建分类</Button>
        <Input className={Style.search} suffixIcon={<SearchIcon />} placeholder='请输入你需要搜索的内容' />
      </div>
      {pageState.pageLoading ? (
        <div className={Style.loading}>
          <Loading text='加载数据中...' loading size='large' />
        </div>
      ) : (
        <>
          <div className={Style.cardList}>
            <Row gutter={[16, 12]}>
              {pageState?.categoryList?.map((category, index) => (
                <Col 
                  key={index} 
                  xs={24}    // 超小屏：1列
                  sm={12}    // 小屏：2列
                  md={8}     // 中屏：3列
                  lg={6}     // 大屏：4列
                  xl={4}     // 超大屏：6列
                >
                  <CategoryCard category={category} />
                </Col>
              ))}
            </Row>
          </div>
          <Pagination
            className={Style.pagination}
            total={pageState.total}
            pageSizeOptions={[12, 24, 36]}
            pageSize={pageState.pageSize}
            onChange={onChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(DeviceCategory);