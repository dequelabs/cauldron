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
  return (
    <div>
      <SideBar
        onDismiss={() => console.log('dismiss')}
        show={false}
        navProps={undefined}
      >
        {componentsList.map(name => {
          return (
            <SideBarItem key={name} className={classNames('MenuItem--active')}>
              <Link href={`/${name.toLowerCase()}`}>{name}</Link>
            </SideBarItem>
          );
        })}
      </SideBar>
    </div>
  );
};

export default SidebarLayout;
