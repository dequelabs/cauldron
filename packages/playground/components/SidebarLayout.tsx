import { SideBar, SideBarItem } from '@deque/cauldron-react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

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

const SidebarLayout = ({ show }: { show: boolean }) => {
  const router = useRouter();

  return (
    <>
      <SideBar onDismiss={() => console.log('dismiss')} show={show}>
        {componentsList.map(name => {
          const isActive = router.asPath === `/${name.toLowerCase()}`;
          return (
            <SideBarItem
              key={name}
              className={classNames({
                'MenuItem--active': isActive
              })}
            >
              <Link href={`/${name.toLowerCase()}`}>{name}</Link>
            </SideBarItem>
          );
        })}
      </SideBar>
    </>
  );
};

export default SidebarLayout;
