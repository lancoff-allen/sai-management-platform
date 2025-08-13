import React from 'react';
import { Card, Avatar, Tag, Dropdown, Button } from 'tdesign-react';
import { DesktopIcon, LaptopIcon, ServiceIcon, ShopIcon, CalendarIcon, Icon } from 'tdesign-icons-react';
import { IDeviceCategory } from 'services/device';
import Style from './CategoryCard.module.less';

const { Group: AvatarGroup } = Avatar;
const icons = [DesktopIcon, LaptopIcon, ServiceIcon, ShopIcon, CalendarIcon];

const CardIcon = React.memo(() => {
  const random = Math.floor(Math.random() * icons.length);
  const Icon = icons[random];
  return <Icon />;
});

const CategoryCard = ({ category }: { category: IDeviceCategory }) => {
  const disabled = !category.isActive;
  return (
    <Card
      className={Style.panel}
      bordered={false}
      actions={
        disabled ? (
          <Tag theme='default' disabled={true}>
            已停用
          </Tag>
        ) : (
          <Tag theme='success'>已启用</Tag>
        )
      }
      avatar={
        <Avatar size='56px'>
          <CardIcon />
        </Avatar>
      }
      footer={
        <div className={Style.footer}>
          <AvatarGroup cascading='left-up'>
            <Avatar>{String.fromCharCode(64 + category.type || 0)}</Avatar>
            <Avatar>+</Avatar>
          </AvatarGroup>
          <Dropdown
            trigger={'click'}
            options={[
              {
                content: '管理',
                value: 1,
              },
              {
                content: '删除',
                value: 2,
              },
            ]}
          >
            <Button theme='default' variant='text' disabled={disabled}>
              <Icon name='more' size='16' />
            </Button>
          </Dropdown>
        </div>
      }
    >
      <div className={Style.name}>{category?.name}</div>
      <div className={Style.description}>{category?.description}</div>
    </Card>
  );
};

export default React.memo(CategoryCard);