import { SideBar, SideBarItem } from '@deque/cauldron-react';
import classNames from 'classnames';
import Link from 'next/link';

const componentsList = [
  'Button',
  'Pointout',
  'Alert',
  'Modal',
  'TopBarMenu',
  'Toast',
  'Loader',
  'Layout',
  'OptionsMenu',
  'Panel',
  'Select',
  'RadioCardGroup',
  'RadioGroup',
  'Checkbox',
  'ClickOutsideListener',
  'Tooltip',
  'TooltipTabstop',
  'Card',
  'ExpandCollapsePanel',
  'TextField',
  'Link',
  'Icon',
  'IconButton',
  'Code',
  'LoaderOverlay',
  'Line',
  'Tabs',
  'Tag',
  'Table',
  'DescriptionList',
  'TopBar',
  'Stepper',
  'ProgressBar',
  'NavBar',
  'Address',
  'Pagination',
  'IssuePanel',
  'FieldWrap',
  'Breadcrumb',
  'TwoColumnPanel',
  'Accordion'
].sort();

const SidebarLayout = () => {
  const handleClick = (e: MouseEvent<HTMLElement>) => {
    console.log('click was handled');
  };

  return (
    <SideBar
      show={true}
      onDismiss={() => console.log('click was handled inline')}
      className="sidebar"
    >
      {componentsList.map(name => {
        const pathname = `/components/${name}`;
        const isActive = pathname === location.pathname;
        return (
          <SideBarItem
            key={name}
            className={classNames({
              'MenuItem--active': isActive
            })}
          >
            <Link href={pathname}>{name}</Link>
          </SideBarItem>
        );
      })}
    </SideBar>
  );
};

export default SidebarLayout;
