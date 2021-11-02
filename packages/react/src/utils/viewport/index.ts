import { MENU_BREAKPOINT, NAVBAR_NARROW } from '../../constants';

export const isWide = () => window.innerWidth >= MENU_BREAKPOINT;

export const isNarrow = () => window.innerWidth <= NAVBAR_NARROW;
